"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Building2, 
  Building,
  Table,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { bankData, insuranceData, subsidyData } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DataSourcesView() {
  const [selectedOrg, setSelectedOrg] = useState<'bank' | 'insurance' | 'government'>('bank');

  const orgs = [
    { id: 'bank', name: 'National Bank Corp', icon: <Landmark className="w-5 h-5" />, color: '#dc2626', table: 'BANK_TRANSACTION_SUMMARY' },
    { id: 'insurance', name: 'SecureLife Insurance', icon: <Building2 className="w-5 h-5" />, color: '#ef4444', table: 'INSURANCE_CLAIM_SUMMARY' },
    { id: 'government', name: 'Dept. of Social Welfare', icon: <Building className="w-5 h-5" />, color: '#f87171', table: 'SUBSIDY_USAGE_SUMMARY' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item}>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Data Sources</h2>
        <p className="text-neutral-400 mt-1 text-sm md:text-base">Pre-aggregated summary tables from participating organisations</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(org.id as 'bank' | 'insurance' | 'government')}
            className={`p-5 rounded-xl border transition-all duration-200 text-left ${
              selectedOrg === org.id
                ? 'bg-neutral-800/80 border-red-500/50 glow-red'
                : 'bg-neutral-800/30 border-neutral-700/50 hover:border-neutral-600/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${org.color}20`, color: org.color }}
              >
                {org.icon}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{org.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">{org.table}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                Privacy Compliant
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-red-400" />
                Secure
              </span>
            </div>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedOrg}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-panel rounded-xl overflow-hidden"
        >
          {selectedOrg === 'bank' && <BankTable />}
          {selectedOrg === 'insurance' && <InsuranceTable />}
          {selectedOrg === 'government' && <GovernmentTable />}
        </motion.div>
      </AnimatePresence>

      <motion.div variants={item} className="glass-panel rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-white">Data Governance Tags Applied</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TagCard
            tag="SENSITIVE = TRUE"
            description="Applied to demographic columns (age_group, region_code, income_band)"
            color="amber"
          />
          <TagCard
            tag="AGGREGATED_ONLY = TRUE"
            description="All tables contain pre-aggregated summaries only"
            color="purple"
          />
          <TagCard
            tag="NO_PII = ENFORCED"
            description="No personally identifiable information in any shared data"
            color="emerald"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function BankTable() {
  const [showMasked, setShowMasked] = useState(false);
  
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#dc2626]/20 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">BANK_TRANSACTION_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{bankData.length} aggregated rows</p>
          </div>
        </div>
        <button
          onClick={() => setShowMasked(!showMasked)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-700/50 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          {showMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showMasked ? 'Show Masked' : 'Show Raw'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Avg Monthly Spend</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Default Flag</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Risk Bucket</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {bankData.map((row, i) => (
              <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.region_code}</td>
                <td className="px-4 py-3 text-neutral-300">${row.avg_monthly_spend.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.default_flag === 1 ? 'bg-red-500/20 text-red-400' : 'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {row.default_flag === 1 ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.risk_score_bucket === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                    row.risk_score_bucket === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {row.risk_score_bucket}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">
                  {row.customer_count >= 10 ? row.customer_count.toLocaleString() : <span className="text-red-400">SUPPRESSED</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-neutral-700/50 flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {bankData.reduce((a, b) => a + b.customer_count, 0).toLocaleString()} total customers</span>
        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${Math.round(bankData.reduce((a, b) => a + b.avg_monthly_spend, 0) / bankData.length).toLocaleString()} avg spend</span>
        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {bankData.filter(r => r.risk_score_bucket === 'HIGH').length} high risk groups</span>
      </div>
    </div>
  );
}

function InsuranceTable() {
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#ef4444]/20 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-[#ef4444]" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">INSURANCE_CLAIM_SUMMARY</h3>
          <p className="text-xs text-neutral-500">{insuranceData.length} aggregated rows</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Claim Frequency</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Avg Claim Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Fraud Indicator</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {insuranceData.map((row, i) => (
              <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region_code}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.claim_frequency_bucket === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                    row.claim_frequency_bucket === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {row.claim_frequency_bucket}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">${row.avg_claim_amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.fraud_indicator === 1 ? 'bg-red-500/20 text-red-400' : 'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {row.fraud_indicator === 1 ? 'Flagged' : 'Clear'}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.customer_count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GovernmentTable() {
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#f87171]/20 flex items-center justify-center">
          <Building className="w-4 h-4 text-[#f87171]" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">SUBSIDY_USAGE_SUMMARY</h3>
          <p className="text-xs text-neutral-500">{subsidyData.length} aggregated rows</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Income Band</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Subsidy Received</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Benefit Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {subsidyData.map((row, i) => (
              <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.income_band === 'LOW' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {row.income_band}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    row.subsidy_received ? 'bg-neutral-500/20 text-neutral-400' : 'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {row.subsidy_received ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          row.benefit_score >= 70 ? 'bg-neutral-500' :
                          row.benefit_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${row.benefit_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400">{row.benefit_score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.customer_count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TagCard({ tag, description, color }: { tag: string; description: string; color: 'amber' | 'purple' | 'emerald' }) {
  const colors = {
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    purple: 'bg-red-500/10 border-red-500/30 text-red-400',
    emerald: 'bg-neutral-500/10 border-neutral-500/30 text-neutral-400',
  };
  
  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <code className="text-xs font-mono font-medium">{tag}</code>
      <p className="text-xs text-neutral-400 mt-2">{description}</p>
    </div>
  );
}
