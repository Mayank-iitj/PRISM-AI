import type { 
  BankTransactionSummary, 
  InsuranceClaimSummary, 
  SubsidyUsageSummary,
  QueryTemplate,
  QueryAuditLog,
  PrivacyPolicy,
  Organization,
  AnalyticsResult,
  AnomalyAlert
} from './types';

export const organizations: Organization[] = [
  { id: 'org-bank', name: 'National Bank Corp', type: 'bank', tables: ['BANK_TRANSACTION_SUMMARY'], color: '#29b6f6' },
  { id: 'org-insurance', name: 'SecureLife Insurance', type: 'insurance', tables: ['INSURANCE_CLAIM_SUMMARY'], color: '#66bb6a' },
  { id: 'org-gov', name: 'Dept. of Social Welfare', type: 'government', tables: ['SUBSIDY_USAGE_SUMMARY'], color: '#ffa726' },
];

export const bankData: BankTransactionSummary[] = [
  { age_group: '18-25', region_code: 'NORTH', avg_monthly_spend: 1250, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 15420 },
  { age_group: '18-25', region_code: 'SOUTH', avg_monthly_spend: 980, default_flag: 1, risk_score_bucket: 'MEDIUM', customer_count: 12380 },
  { age_group: '26-35', region_code: 'NORTH', avg_monthly_spend: 2450, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 28540 },
  { age_group: '26-35', region_code: 'SOUTH', avg_monthly_spend: 2180, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 24120 },
  { age_group: '36-45', region_code: 'NORTH', avg_monthly_spend: 3200, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 31250 },
  { age_group: '36-45', region_code: 'SOUTH', avg_monthly_spend: 2890, default_flag: 1, risk_score_bucket: 'MEDIUM', customer_count: 27890 },
  { age_group: '46-60', region_code: 'NORTH', avg_monthly_spend: 3800, default_flag: 1, risk_score_bucket: 'HIGH', customer_count: 22340 },
  { age_group: '46-60', region_code: 'SOUTH', avg_monthly_spend: 3450, default_flag: 1, risk_score_bucket: 'HIGH', customer_count: 19870 },
  { age_group: '60+', region_code: 'NORTH', avg_monthly_spend: 2100, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 16780 },
  { age_group: '60+', region_code: 'SOUTH', avg_monthly_spend: 1890, default_flag: 0, risk_score_bucket: 'LOW', customer_count: 14560 },
];

export const insuranceData: InsuranceClaimSummary[] = [
  { age_group: '18-25', region_code: 'NORTH', claim_frequency_bucket: 'LOW', avg_claim_amount: 2500, fraud_indicator: 0, customer_count: 8920 },
  { age_group: '18-25', region_code: 'SOUTH', claim_frequency_bucket: 'MEDIUM', avg_claim_amount: 3200, fraud_indicator: 1, customer_count: 7650 },
  { age_group: '26-35', region_code: 'NORTH', claim_frequency_bucket: 'LOW', avg_claim_amount: 4500, fraud_indicator: 0, customer_count: 18420 },
  { age_group: '26-35', region_code: 'SOUTH', claim_frequency_bucket: 'LOW', avg_claim_amount: 4100, fraud_indicator: 0, customer_count: 16890 },
  { age_group: '36-45', region_code: 'NORTH', claim_frequency_bucket: 'MEDIUM', avg_claim_amount: 6200, fraud_indicator: 0, customer_count: 21340 },
  { age_group: '36-45', region_code: 'SOUTH', claim_frequency_bucket: 'HIGH', avg_claim_amount: 7800, fraud_indicator: 1, customer_count: 19280 },
  { age_group: '46-60', region_code: 'NORTH', claim_frequency_bucket: 'HIGH', avg_claim_amount: 12500, fraud_indicator: 1, customer_count: 15670 },
  { age_group: '46-60', region_code: 'SOUTH', claim_frequency_bucket: 'HIGH', avg_claim_amount: 14200, fraud_indicator: 1, customer_count: 13890 },
  { age_group: '60+', region_code: 'NORTH', claim_frequency_bucket: 'MEDIUM', avg_claim_amount: 8900, fraud_indicator: 0, customer_count: 12450 },
  { age_group: '60+', region_code: 'SOUTH', claim_frequency_bucket: 'MEDIUM', avg_claim_amount: 8200, fraud_indicator: 0, customer_count: 10890 },
];

export const subsidyData: SubsidyUsageSummary[] = [
  { age_group: '18-25', income_band: 'LOW', subsidy_received: true, benefit_score: 78, customer_count: 12450 },
  { age_group: '18-25', income_band: 'MEDIUM', subsidy_received: false, benefit_score: 45, customer_count: 15680 },
  { age_group: '26-35', income_band: 'LOW', subsidy_received: true, benefit_score: 82, customer_count: 18920 },
  { age_group: '26-35', income_band: 'MEDIUM', subsidy_received: true, benefit_score: 65, customer_count: 24560 },
  { age_group: '36-45', income_band: 'LOW', subsidy_received: true, benefit_score: 71, customer_count: 14780 },
  { age_group: '36-45', income_band: 'MEDIUM', subsidy_received: false, benefit_score: 38, customer_count: 28340 },
  { age_group: '46-60', income_band: 'LOW', subsidy_received: false, benefit_score: 22, customer_count: 11230 },
  { age_group: '46-60', income_band: 'MEDIUM', subsidy_received: false, benefit_score: 35, customer_count: 19870 },
  { age_group: '60+', income_band: 'LOW', subsidy_received: true, benefit_score: 88, customer_count: 16780 },
  { age_group: '60+', income_band: 'MEDIUM', subsidy_received: true, benefit_score: 72, customer_count: 12340 },
];

export const queryTemplates: QueryTemplate[] = [
  {
    id: 'qt-001',
    name: 'Risk Overlay Analysis',
    description: 'Identifies age groups with highest combined default risk and insurance claim frequency',
    category: 'risk',
    question: 'Which age groups show the highest combined default risk and insurance claim frequency?',
    sql_template: `SELECT 
  b.age_group,
  AVG(CASE WHEN b.default_flag = 1 THEN 1.0 ELSE 0.0 END) as default_rate,
  AVG(CASE WHEN i.claim_frequency_bucket = 'HIGH' THEN 1.0 ELSE 0.0 END) as high_claim_rate,
  SUM(b.customer_count) as total_customers
FROM BANK_TRANSACTION_SUMMARY b
JOIN INSURANCE_CLAIM_SUMMARY i ON b.age_group = i.age_group AND b.region_code = i.region_code
GROUP BY b.age_group
HAVING SUM(b.customer_count) >= 10`,
    approved: true,
  },
  {
    id: 'qt-002',
    name: 'Inclusion Gap Detection',
    description: 'Finds segments not benefiting from subsidies despite high risk indicators',
    category: 'inclusion',
    question: 'Which income or age segments are not benefiting from subsidies despite high risk indicators?',
    sql_template: `SELECT 
  s.age_group,
  s.income_band,
  SUM(CASE WHEN s.subsidy_received THEN 0 ELSE 1 END) as no_subsidy_count,
  AVG(b.risk_score_bucket) as avg_risk,
  SUM(s.customer_count) as total_customers
FROM SUBSIDY_USAGE_SUMMARY s
JOIN BANK_TRANSACTION_SUMMARY b ON s.age_group = b.age_group
WHERE b.risk_score_bucket IN ('HIGH', 'MEDIUM')
GROUP BY s.age_group, s.income_band
HAVING SUM(s.customer_count) >= 10`,
    approved: true,
  },
  {
    id: 'qt-003',
    name: 'Fraud Signal Convergence',
    description: 'Detects regions with correlated spikes in claims and transaction anomalies',
    category: 'fraud',
    question: 'Which regions show correlated spikes in claims and transaction anomalies?',
    sql_template: `SELECT 
  b.region_code,
  COUNT(CASE WHEN i.fraud_indicator = 1 THEN 1 END) as fraud_claims,
  COUNT(CASE WHEN b.risk_score_bucket = 'HIGH' THEN 1 END) as high_risk_transactions,
  SUM(b.customer_count + i.customer_count) / 2 as avg_customers
FROM BANK_TRANSACTION_SUMMARY b
JOIN INSURANCE_CLAIM_SUMMARY i ON b.region_code = i.region_code AND b.age_group = i.age_group
GROUP BY b.region_code
HAVING SUM(b.customer_count) >= 10`,
    approved: true,
  },
  {
    id: 'qt-004',
    name: 'Regional Risk Distribution',
    description: 'Analyzes risk distribution across regions by age group',
    category: 'risk',
    question: 'How does risk vary across regions for different age groups?',
    sql_template: `SELECT region_code, age_group, risk_score_bucket, SUM(customer_count) as customers
FROM BANK_TRANSACTION_SUMMARY
GROUP BY region_code, age_group, risk_score_bucket
HAVING SUM(customer_count) >= 10`,
    approved: true,
  },
  {
    id: 'qt-005',
    name: 'Unapproved Query',
    description: 'Attempts to access raw customer data',
    category: 'risk',
    question: 'Show me all customer transaction details',
    sql_template: `SELECT * FROM RAW_TRANSACTIONS WHERE customer_id IS NOT NULL`,
    approved: false,
  },
];

export const auditLogs: QueryAuditLog[] = [
  { id: 'log-001', timestamp: new Date('2024-01-15T09:23:45'), query_template_id: 'qt-001', executor_org: 'National Bank Corp', result_summary: 'Age 46-60 shows highest combined risk (0.73)', privacy_checks_passed: true, k_anonymity_met: true, rows_returned: 5 },
  { id: 'log-002', timestamp: new Date('2024-01-15T10:45:12'), query_template_id: 'qt-002', executor_org: 'SecureLife Insurance', result_summary: '46-60 LOW income band underserved', privacy_checks_passed: true, k_anonymity_met: true, rows_returned: 8 },
  { id: 'log-003', timestamp: new Date('2024-01-15T11:12:33'), query_template_id: 'qt-003', executor_org: 'Dept. of Social Welfare', result_summary: 'SOUTH region shows 34% higher fraud correlation', privacy_checks_passed: true, k_anonymity_met: true, rows_returned: 2 },
  { id: 'log-004', timestamp: new Date('2024-01-15T14:56:21'), query_template_id: 'qt-005', executor_org: 'Unknown', result_summary: 'QUERY REJECTED - Unapproved template', privacy_checks_passed: false, k_anonymity_met: false, rows_returned: 0 },
  { id: 'log-005', timestamp: new Date('2024-01-16T08:34:11'), query_template_id: 'qt-001', executor_org: 'National Bank Corp', result_summary: 'Age 46-60 risk elevated by 2.3%', privacy_checks_passed: true, k_anonymity_met: true, rows_returned: 5 },
  { id: 'log-006', timestamp: new Date('2024-01-16T09:22:45'), query_template_id: 'qt-004', executor_org: 'SecureLife Insurance', result_summary: 'Regional analysis complete', privacy_checks_passed: true, k_anonymity_met: true, rows_returned: 10 },
];

export const privacyPolicies: PrivacyPolicy[] = [
  { id: 'pp-001', name: 'SENSITIVE Tag', type: 'tag', description: 'Marks columns containing sensitive demographic data', status: 'active', applies_to: ['age_group', 'income_band', 'region_code'] },
  { id: 'pp-002', name: 'AGGREGATED_ONLY Tag', type: 'tag', description: 'Ensures data is pre-aggregated before sharing', status: 'active', applies_to: ['*_SUMMARY tables'] },
  { id: 'pp-003', name: 'NO_PII Enforced', type: 'tag', description: 'Prevents any PII from being included in outputs', status: 'active', applies_to: ['All tables'] },
  { id: 'pp-004', name: 'K-Anonymity Policy', type: 'row_access', description: 'Blocks results with customer_count < 10', status: 'active', applies_to: ['All queries'] },
  { id: 'pp-005', name: 'Quasi-Identifier Masking', type: 'column_mask', description: 'Masks specific identifier combinations', status: 'active', applies_to: ['age_group + region_code + income_band'] },
];

export const analyticsResults: AnalyticsResult[] = [
  { age_group: '18-25', region_code: 'NORTH', default_rate: 0.08, claim_frequency: 0.12, fraud_rate: 0.02, subsidy_coverage: 0.78, risk_score: 0.22, customer_count: 15420 },
  { age_group: '18-25', region_code: 'SOUTH', default_rate: 0.15, claim_frequency: 0.24, fraud_rate: 0.08, subsidy_coverage: 0.65, risk_score: 0.41, customer_count: 12380 },
  { age_group: '26-35', region_code: 'NORTH', default_rate: 0.06, claim_frequency: 0.09, fraud_rate: 0.01, subsidy_coverage: 0.82, risk_score: 0.15, customer_count: 28540 },
  { age_group: '26-35', region_code: 'SOUTH', default_rate: 0.09, claim_frequency: 0.11, fraud_rate: 0.02, subsidy_coverage: 0.75, risk_score: 0.21, customer_count: 24120 },
  { age_group: '36-45', region_code: 'NORTH', default_rate: 0.12, claim_frequency: 0.28, fraud_rate: 0.04, subsidy_coverage: 0.58, risk_score: 0.38, customer_count: 31250 },
  { age_group: '36-45', region_code: 'SOUTH', default_rate: 0.22, claim_frequency: 0.45, fraud_rate: 0.12, subsidy_coverage: 0.42, risk_score: 0.62, customer_count: 27890 },
  { age_group: '46-60', region_code: 'NORTH', default_rate: 0.31, claim_frequency: 0.58, fraud_rate: 0.18, subsidy_coverage: 0.22, risk_score: 0.78, customer_count: 22340 },
  { age_group: '46-60', region_code: 'SOUTH', default_rate: 0.38, claim_frequency: 0.64, fraud_rate: 0.24, subsidy_coverage: 0.18, risk_score: 0.85, customer_count: 19870 },
  { age_group: '60+', region_code: 'NORTH', default_rate: 0.11, claim_frequency: 0.32, fraud_rate: 0.03, subsidy_coverage: 0.88, risk_score: 0.28, customer_count: 16780 },
  { age_group: '60+', region_code: 'SOUTH', default_rate: 0.14, claim_frequency: 0.35, fraud_rate: 0.04, subsidy_coverage: 0.82, risk_score: 0.32, customer_count: 14560 },
];

export const anomalyAlerts: AnomalyAlert[] = [
  { id: 'alert-001', timestamp: new Date('2024-01-16T08:00:00'), type: 'risk_threshold', severity: 'high', description: 'Age group 46-60 in SOUTH region exceeds risk threshold (0.85 > 0.70)', affected_segments: ['46-60', 'SOUTH'], acknowledged: false },
  { id: 'alert-002', timestamp: new Date('2024-01-16T08:00:00'), type: 'underserved_segment', severity: 'critical', description: 'Age 46-60 LOW income band shows 78% gap in subsidy coverage despite high risk', affected_segments: ['46-60', 'LOW'], acknowledged: false },
  { id: 'alert-003', timestamp: new Date('2024-01-15T20:00:00'), type: 'fraud_spike', severity: 'medium', description: 'Fraud indicator correlation increased 12% in SOUTH region', affected_segments: ['SOUTH'], acknowledged: true },
];

export const generateInsight = (queryId: string): string => {
  const insights: Record<string, string> = {
    'qt-001': 'Customers aged 46–60 show elevated insurance claims and higher default rates, suggesting a need for targeted risk-mitigation products rather than credit denial. This age group represents 20% of the combined customer base but accounts for 35% of high-risk indicators.',
    'qt-002': 'The 46-60 age group in the LOW income band shows a critical inclusion gap: despite having the highest risk indicators (0.85), only 22% receive subsidy support. Recommended action: prioritize outreach programs for this demographic.',
    'qt-003': 'The SOUTH region exhibits a 34% higher correlation between fraud indicators and transaction anomalies compared to NORTH. Pattern analysis suggests coordinated claim-transaction fraud in the 36-45 and 46-60 age groups.',
    'qt-004': 'Regional risk distribution shows SOUTH consistently 15-25% higher across all age groups. NORTH region demonstrates more effective risk management for 26-35 demographic.',
  };
  return insights[queryId] || 'Analysis complete. Results meet all privacy requirements.';
};
