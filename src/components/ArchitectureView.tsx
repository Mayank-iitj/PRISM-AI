"use client";

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Database, 
  Landmark, 
  Building2, 
  Building, 
  ArrowRight,
  Eye,
  CheckCircle2,
  Zap
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ArchitectureView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">System Architecture</h2>
          <p className="text-slate-400 mt-1">Privacy-preserving data clean room architecture powered by Snowflake</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400">Live System</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-3">
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 grid-background opacity-50" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white">Data Flow Architecture</h3>
              </div>

              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="col-span-2 space-y-3">
                  <OrgCard
                    icon={<Landmark className="w-5 h-5" />}
                    name="National Bank"
                    table="BANK_TRANSACTION_SUMMARY"
                    color="#29b6f6"
                  />
                  <OrgCard
                    icon={<Building2 className="w-5 h-5" />}
                    name="SecureLife Insurance"
                    table="INSURANCE_CLAIM_SUMMARY"
                    color="#66bb6a"
                  />
                  <OrgCard
                    icon={<Building className="w-5 h-5" />}
                    name="Dept. of Social Welfare"
                    table="SUBSIDY_USAGE_SUMMARY"
                    color="#ffa726"
                  />
                </div>

                <div className="col-span-1 flex flex-col items-center justify-center h-full py-8">
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
                  <div className="my-4 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider">Secure Share</span>
                  </div>
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
                </div>

                <div className="col-span-2">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-500/50">
                      <span className="text-[10px] text-purple-300 uppercase tracking-wider font-medium">Clean Room</span>
                    </div>
                    <div className="flex flex-col items-center text-center mt-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center glow-purple mb-3">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="font-semibold text-white text-sm">Snowflake Data Clean Room</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Privacy-Preserving Join Operations</p>
                      
                      <div className="mt-4 space-y-1.5 w-full">
                        <FeatureTag text="Secure Join on age_group, region_code" />
                        <FeatureTag text="Aggregate-Only Outputs" />
                        <FeatureTag text="K-Anonymity ≥ 10" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-center justify-center h-full py-8">
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
                  <div className="my-4 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Insights</span>
                  </div>
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
                </div>

                <div className="col-span-1">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-emerald-500/30">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h4 className="font-medium text-white text-sm">Safe Output</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Anonymous Aggregates & Trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <ComponentCard
            title="Snowflake Clean Rooms"
            description="Secure multi-party computation without raw data exposure"
            status="Active"
            features={['Template-Only Queries', 'No Ad-Hoc SQL', 'Audit Logging']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Horizon Governance"
            description="Tags, policies, and rules for data classification"
            status="Active"
            features={['SENSITIVE Tags', 'AGGREGATED_ONLY', 'NO_PII Enforced']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Streams & Tasks"
            description="Automated refresh and anomaly detection"
            status="Running"
            features={['Daily Aggregation', 'Threshold Alerts', 'Trend Monitoring']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Cortex AI SQL"
            description="Natural language to safe SQL translation"
            status="Ready"
            features={['Query Validation', 'Template Matching', 'Plain-Language Output']}
          />
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Privacy-by-Design Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'No PII Exchange', desc: 'Zero customer-level data shared' },
            { title: 'Pre-Aggregated', desc: 'Only summary tables exposed' },
            { title: 'K-Anonymity', desc: 'Minimum 10 records per group' },
            { title: 'Template Queries', desc: 'No arbitrary SQL allowed' },
            { title: 'Full Audit Trail', desc: 'Every query logged & reviewed' },
          ].map((p, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">{p.title}</span>
              </div>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrgCard({ icon, name, table, color }: { icon: React.ReactNode; name: string; table: string; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        <p className="text-[10px] text-slate-500 font-mono truncate">{table}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600" />
    </div>
  );
}

function FeatureTag({ text }: { text: string }) {
  return (
    <div className="px-2 py-1 rounded bg-slate-800/50 text-[10px] text-slate-300">
      {text}
    </div>
  );
}

function ComponentCard({ title, description, status, features }: { 
  title: string; 
  description: string; 
  status: string;
  features: string[];
}) {
  return (
    <div className="glass-panel rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{status}</span>
      </div>
      <p className="text-xs text-slate-400 mb-4">{description}</p>
      <div className="space-y-1.5">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
