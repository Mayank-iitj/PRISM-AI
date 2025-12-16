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
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function ArchitectureView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">System Architecture</h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Privacy-preserving data clean room powered by Snowflake</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900 border border-white/10 w-fit">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-sm text-white">Live System</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-30" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-8 h-8 rounded bg-red-600/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-semibold text-white text-sm md:text-base">Data Flow Architecture</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-start lg:items-center">
            <div className="w-full lg:w-auto lg:flex-1 space-y-3">
              <OrgCard
                icon={<Landmark className="w-4 h-4 md:w-5 md:h-5" />}
                name="National Bank"
                table="BANK_TRANSACTION_SUMMARY"
                color="#dc2626"
              />
              <OrgCard
                icon={<Building2 className="w-4 h-4 md:w-5 md:h-5" />}
                name="SecureLife Insurance"
                table="INSURANCE_CLAIM_SUMMARY"
                color="#ef4444"
              />
              <OrgCard
                icon={<Building className="w-4 h-4 md:w-5 md:h-5" />}
                name="Dept. of Social Welfare"
                table="SUBSIDY_USAGE_SUMMARY"
                color="#f87171"
              />
            </div>

              <div className="hidden xl:flex flex-col items-center justify-center h-full py-8 flex-shrink-0">
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <div className="my-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] text-red-600 uppercase tracking-wider">Secure Share</span>
                </div>
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              </div>

              <div className="w-full xl:flex-1">
              <div className="p-4 md:p-6 rounded bg-gradient-to-br from-red-600/20 to-red-600/10 border border-red-600/30 relative">
                <div className="absolute -top-3 left-1/2 -tranneutral-x-1/2 px-3 py-1 rounded-full bg-red-600 border border-red-700">
                  <span className="text-[10px] text-white uppercase tracking-wider font-medium">Clean Room</span>
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-red-600 flex items-center justify-center glow-red mb-3">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">Snowflake Data Clean Room</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Privacy-Preserving Join Operations</p>
                  
                  <div className="mt-4 space-y-1.5 w-full">
                    <FeatureTag text="Secure Join on age_group, region_code" />
                    <FeatureTag text="Aggregate-Only Outputs" />
                    <FeatureTag text="K-Anonymity ≥ 10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center h-full py-8 flex-shrink-0">
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-600/50 to-transparent" />
              <div className="my-4 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-neutral-400" />
                </div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Insights</span>
              </div>
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-600/50 to-transparent" />
            </div>

            <div className="w-full lg:w-auto">
              <div className="p-4 rounded bg-neutral-900 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-white text-sm">Safe Output</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Anonymous Aggregates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <ComponentCard
            title="Snowflake Clean Rooms"
            description="Secure multi-party computation"
            status="Active"
            features={['Template-Only Queries', 'No Ad-Hoc SQL', 'Audit Logging']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Horizon Governance"
            description="Tags, policies, and rules"
            status="Active"
            features={['SENSITIVE Tags', 'AGGREGATED_ONLY', 'NO_PII Enforced']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Streams & Tasks"
            description="Automated refresh and alerts"
            status="Running"
            features={['Daily Aggregation', 'Threshold Alerts', 'Trend Monitoring']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Cortex AI SQL"
            description="Natural language to SQL"
            status="Ready"
            features={['Query Validation', 'Template Matching', 'Plain-Language Output']}
          />
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm md:text-base">
          <Shield className="w-5 h-5 text-red-600" />
          Privacy-by-Design Principles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            { title: 'No PII Exchange', desc: 'Zero customer-level data shared' },
            { title: 'Pre-Aggregated', desc: 'Only summary tables exposed' },
            { title: 'K-Anonymity', desc: 'Minimum 10 records per group' },
            { title: 'Template Queries', desc: 'No arbitrary SQL allowed' },
            { title: 'Full Audit Trail', desc: 'Every query logged & reviewed' },
          ].map((p, i) => (
            <div key={i} className="p-3 md:p-4 rounded bg-neutral-900 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium text-white">{p.title}</span>
              </div>
              <p className="text-xs text-neutral-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrgCard({ icon, name, table, color }: { icon: React.ReactNode; name: string; table: string; color: string }) {
  return (
    <div className="p-3 md:p-4 rounded bg-neutral-900 border border-white/10 flex items-center gap-3">
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-medium text-white truncate">{name}</p>
        <p className="text-[10px] text-neutral-500 font-mono truncate">{table}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-600 flex-shrink-0" />
    </div>
  );
}

function FeatureTag({ text }: { text: string }) {
  return (
    <div className="px-2 py-1 rounded bg-black/50 text-[10px] text-neutral-300">
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
    <div className="glass-panel rounded p-4 md:p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">{status}</span>
      </div>
      <p className="text-xs text-neutral-400 mb-4">{description}</p>
      <div className="space-y-1.5">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
            <span className="w-1 h-1 rounded-full bg-red-600 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
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
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function ArchitectureView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">System Architecture</h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Privacy-preserving data clean room powered by Snowflake</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900 border border-white/10 w-fit">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-sm text-white">Live System</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-30" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-8 h-8 rounded bg-red-600/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-semibold text-white text-sm md:text-base">Data Flow Architecture</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-start lg:items-center">
            <div className="w-full lg:w-auto lg:flex-1 space-y-3">
              <OrgCard
                icon={<Landmark className="w-4 h-4 md:w-5 md:h-5" />}
                name="National Bank"
                table="BANK_TRANSACTION_SUMMARY"
                color="#dc2626"
              />
              <OrgCard
                icon={<Building2 className="w-4 h-4 md:w-5 md:h-5" />}
                name="SecureLife Insurance"
                table="INSURANCE_CLAIM_SUMMARY"
                color="#ef4444"
              />
              <OrgCard
                icon={<Building className="w-4 h-4 md:w-5 md:h-5" />}
                name="Dept. of Social Welfare"
                table="SUBSIDY_USAGE_SUMMARY"
                color="#f87171"
              />
            </div>

              <div className="hidden xl:flex flex-col items-center justify-center h-full py-8 flex-shrink-0">
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <div className="my-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-[10px] text-red-600 uppercase tracking-wider">Secure Share</span>
                </div>
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              </div>

              <div className="w-full xl:flex-1">
              <div className="p-4 md:p-6 rounded bg-gradient-to-br from-red-600/20 to-red-600/10 border border-red-600/30 relative">
                <div className="absolute -top-3 left-1/2 -tranneutral-x-1/2 px-3 py-1 rounded-full bg-red-600 border border-red-700">
                  <span className="text-[10px] text-white uppercase tracking-wider font-medium">Clean Room</span>
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-red-600 flex items-center justify-center glow-red mb-3">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">Snowflake Data Clean Room</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Privacy-Preserving Join Operations</p>
                  
                  <div className="mt-4 space-y-1.5 w-full">
                    <FeatureTag text="Secure Join on age_group, region_code" />
                    <FeatureTag text="Aggregate-Only Outputs" />
                    <FeatureTag text="K-Anonymity ≥ 10" />
                  </div>
                </div>
              </div>
            </div>

              <div className="hidden xl:flex flex-col items-center justify-center h-full py-8 flex-shrink-0">
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-600/50 to-transparent" />
                <div className="my-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Insights</span>
                </div>
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-neutral-600/50 to-transparent" />
              </div>

              <div className="w-full xl:w-auto">
              <div className="p-4 rounded bg-neutral-900 border border-white/10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-white text-sm">Safe Output</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Anonymous Aggregates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <ComponentCard
            title="Snowflake Clean Rooms"
            description="Secure multi-party computation"
            status="Active"
            features={['Template-Only Queries', 'No Ad-Hoc SQL', 'Audit Logging']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Horizon Governance"
            description="Tags, policies, and rules"
            status="Active"
            features={['SENSITIVE Tags', 'AGGREGATED_ONLY', 'NO_PII Enforced']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Streams & Tasks"
            description="Automated refresh and alerts"
            status="Running"
            features={['Daily Aggregation', 'Threshold Alerts', 'Trend Monitoring']}
          />
        </motion.div>
        <motion.div variants={item}>
          <ComponentCard
            title="Cortex AI SQL"
            description="Natural language to SQL"
            status="Ready"
            features={['Query Validation', 'Template Matching', 'Plain-Language Output']}
          />
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm md:text-base">
          <Shield className="w-5 h-5 text-red-600" />
          Privacy-by-Design Principles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            { title: 'No PII Exchange', desc: 'Zero customer-level data shared' },
            { title: 'Pre-Aggregated', desc: 'Only summary tables exposed' },
            { title: 'K-Anonymity', desc: 'Minimum 10 records per group' },
            { title: 'Template Queries', desc: 'No arbitrary SQL allowed' },
            { title: 'Full Audit Trail', desc: 'Every query logged & reviewed' },
          ].map((p, i) => (
            <div key={i} className="p-3 md:p-4 rounded bg-neutral-900 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm font-medium text-white">{p.title}</span>
              </div>
              <p className="text-xs text-neutral-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrgCard({ icon, name, table, color }: { icon: React.ReactNode; name: string; table: string; color: string }) {
  return (
    <div className="p-3 md:p-4 rounded bg-neutral-900 border border-white/10 flex items-center gap-3">
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-medium text-white truncate">{name}</p>
        <p className="text-[10px] text-neutral-500 font-mono truncate">{table}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-600 flex-shrink-0" />
    </div>
  );
}

function FeatureTag({ text }: { text: string }) {
  return (
    <div className="px-2 py-1 rounded bg-black/50 text-[10px] text-neutral-300">
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
    <div className="glass-panel rounded p-4 md:p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">{status}</span>
      </div>
      <p className="text-xs text-neutral-400 mb-4">{description}</p>
      <div className="space-y-1.5">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
            <span className="w-1 h-1 rounded-full bg-red-600 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
