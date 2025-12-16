export interface BankTransactionSummary {
  age_group: string;
  region_code: string;
  avg_monthly_spend: number;
  default_flag: 0 | 1;
  risk_score_bucket: string;
  customer_count: number;
}

export interface InsuranceClaimSummary {
  age_group: string;
  region_code: string;
  claim_frequency_bucket: string;
  avg_claim_amount: number;
  fraud_indicator: 0 | 1;
  customer_count: number;
}

export interface SubsidyUsageSummary {
  age_group: string;
  income_band: string;
  subsidy_received: boolean;
  benefit_score: number;
  customer_count: number;
}

export interface QueryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'risk' | 'inclusion' | 'fraud';
  question: string;
  sql_template: string;
  approved: boolean;
}

export interface QueryAuditLog {
  id: string;
  timestamp: Date;
  query_template_id: string;
  executor_org: string;
  result_summary: string;
  privacy_checks_passed: boolean;
  k_anonymity_met: boolean;
  rows_returned: number;
}

export interface PrivacyPolicy {
  id: string;
  name: string;
  type: 'tag' | 'row_access' | 'column_mask';
  description: string;
  status: 'active' | 'inactive';
  applies_to: string[];
}

export interface Organization {
  id: string;
  name: string;
  type: 'bank' | 'insurance' | 'government' | 'retail';
  tables: string[];
  color: string;
}

export interface AnalyticsResult {
  age_group: string;
  region_code?: string;
  income_band?: string;
  default_rate: number;
  claim_frequency: number;
  fraud_rate: number;
  subsidy_coverage?: number;
  risk_score: number;
  customer_count: number;
}

export interface AnomalyAlert {
  id: string;
  timestamp: Date;
  type: 'risk_threshold' | 'underserved_segment' | 'fraud_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affected_segments: string[];
  acknowledged: boolean;
}
