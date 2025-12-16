import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const APPROVED_QUERIES = {
  RISK_OVERLAY: `
    SELECT bt.region, bt.age_group, 
           AVG(bt.risk_score) as avg_risk,
           AVG(ic.fraud_indicator) as avg_fraud,
           COUNT(*) as count
    FROM bank_transactions bt
    JOIN insurance_claims ic ON bt.region = ic.region AND bt.age_group = ic.age_group
    GROUP BY bt.region, bt.age_group
    HAVING COUNT(*) >= 10
  `,
  INCLUSION_GAP: `
    SELECT su.region, su.age_group,
           AVG(su.benefit_score) as avg_benefit,
           AVG(bt.risk_score) as avg_risk,
           COUNT(*) as count
    FROM subsidy_usage su
    JOIN bank_transactions bt ON su.region = bt.region AND su.age_group = bt.age_group
    GROUP BY su.region, su.age_group
    HAVING COUNT(*) >= 10
  `,
  FRAUD_SIGNAL: `
    SELECT ic.region, ic.age_group,
           AVG(ic.fraud_indicator) as avg_fraud,
           SUM(ic.claims_count) as total_claims,
           COUNT(*) as count
    FROM insurance_claims ic
    GROUP BY ic.region, ic.age_group
    HAVING COUNT(*) >= 10 AND AVG(ic.fraud_indicator) > 50
  `,
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { template, userEmail = 'system@prism.com' } = await request.json()

  if (!APPROVED_QUERIES[template as keyof typeof APPROVED_QUERIES]) {
    await supabase.from('audit_logs').insert({
      query_type: template,
      query_text: 'UNAUTHORIZED_QUERY',
      user_email: userEmail,
      status: 'REJECTED',
      privacy_check: 'QUERY_NOT_APPROVED',
      result_count: 0,
    })

    return NextResponse.json(
      { error: 'Query template not approved' },
      { status: 403 }
    )
  }

  const sqlQuery = APPROVED_QUERIES[template as keyof typeof APPROVED_QUERIES]

  const { data, error } = await supabase.rpc('execute_clean_room_query', {
    query: sqlQuery,
  }).select()

  if (error) {
    await supabase.from('audit_logs').insert({
      query_type: template,
      query_text: sqlQuery,
      user_email: userEmail,
      status: 'ERROR',
      privacy_check: 'N/A',
      result_count: 0,
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('audit_logs').insert({
    query_type: template,
    query_text: sqlQuery,
    user_email: userEmail,
    status: 'APPROVED',
    privacy_check: 'K-ANONYMITY_PASSED',
    result_count: data?.length || 0,
  })

  await supabase.from('clean_room_results').insert({
    query_template: template,
    parameters: {},
    result_data: data || [],
    row_count: data?.length || 0,
  })

  return NextResponse.json(data || [])
}
