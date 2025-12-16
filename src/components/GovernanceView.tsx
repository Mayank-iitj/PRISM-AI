"use client";

import { motion } from 'framer-motion';
import { 
  Shield, 
  Tag, 
  Lock, 
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Fingerprint,
  FileCheck,
  Database
} from 'lucide-react';
import { privacyPolicies } from '@/lib/mock-data';
import { Switch } from '@/components/ui/switch';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function GovernanceView() {
  const tags = privacyPolicies.filter(p => p.type === 'tag');
  const rowPolicies = privacyPolicies.filter(p => p.type === 'row_access');
  const columnPolicies = privacyPolicies.filter(p => p.type === 'column_mask');

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Governance & Privacy Controls</h2>
          <p className="text-slate-400 mt-1">Snowflake Horizon policies and data classification</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">All Policies Active</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Tag className="w-5 h-5" />}
          label="Horizon Tags"
          value="3"
          status="Active"
          color="cyan"
        />
        <StatCard
          icon={<Lock className="w-5 h-5" />}
          label="Row Access Policies"
          value="1"
          status="Enforced"
          color="purple"
        />
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Column Masking"
          value="1"
          status="Applied"
          color="amber"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="glass-panel rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-cyan-400" />
            Snowflake Horizon Tags
          </h3>
          <div className="space-y-4">
            {tags.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Row Access Policies
            </h3>
            <div className="space-y-4">
              {rowPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              Column Masking Policies
            </h3>
            <div className="space-y-4">
              {columnPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-emerald-400" />
          K-Anonymity Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Minimum Group Size (K)</span>
                <span className="text-2xl font-bold text-emerald-400">10</span>
              </div>
              <p className="text-xs text-slate-400">
                Results with fewer than 10 records are automatically suppressed to prevent re-identification attacks.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Quasi-Identifiers</span>
                <span className="text-sm text-amber-400">3 columns</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <code className="px-2 py-1 rounded bg-slate-700 text-xs text-cyan-300">age_group</code>
                <code className="px-2 py-1 rounded bg-slate-700 text-xs text-cyan-300">region_code</code>
                <code className="px-2 py-1 rounded bg-slate-700 text-xs text-cyan-300">income_band</code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Privacy Guarantee</span>
              </div>
              <p className="text-xs text-slate-300">
                With K=10 and 3 quasi-identifiers, the probability of re-identifying any individual is less than 10% 
                even with auxiliary information.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Suppression Mode</span>
                <Switch defaultChecked />
              </div>
              <p className="text-xs text-slate-400">
                Records not meeting K-anonymity are hidden from results rather than generalized.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          Clean Room Access Controls
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Control</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Setting</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white">Ad-Hoc SQL</td>
                <td className="px-4 py-3"><code className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">BLOCKED</code></td>
                <td className="px-4 py-3"><StatusBadge status="enforced" /></td>
                <td className="px-4 py-3 text-slate-400">Only pre-approved query templates allowed</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white">Raw Data Export</td>
                <td className="px-4 py-3"><code className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">BLOCKED</code></td>
                <td className="px-4 py-3"><StatusBadge status="enforced" /></td>
                <td className="px-4 py-3 text-slate-400">No extraction of individual records</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white">Cross-Org Joins</td>
                <td className="px-4 py-3"><code className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">ALLOWED</code></td>
                <td className="px-4 py-3"><StatusBadge status="active" /></td>
                <td className="px-4 py-3 text-slate-400">Only on approved dimensions (age_group, region_code)</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white">Aggregate Functions</td>
                <td className="px-4 py-3"><code className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">ALLOWED</code></td>
                <td className="px-4 py-3"><StatusBadge status="active" /></td>
                <td className="px-4 py-3 text-slate-400">SUM, AVG, COUNT with K-anonymity check</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white">Query Audit</td>
                <td className="px-4 py-3"><code className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs">ENABLED</code></td>
                <td className="px-4 py-3"><StatusBadge status="active" /></td>
                <td className="px-4 py-3 text-slate-400">All queries logged with executor identity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-purple-400" />
          Compliance Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ComplianceCard name="GDPR" status="compliant" region="EU" />
          <ComplianceCard name="DPDP Act" status="compliant" region="India" />
          <ComplianceCard name="HIPAA-like" status="compliant" region="Healthcare" />
          <ComplianceCard name="ISO 27001" status="certified" region="Global" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, status, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  status: string;
  color: 'cyan' | 'purple' | 'amber';
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{status}</span>
      </div>
    </div>
  );
}

function PolicyCard({ policy }: { policy: { id: string; name: string; type: string; description: string; status: string; applies_to: string[] } }) {
  const typeColors = {
    tag: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    row_access: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    column_mask: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${typeColors[policy.type as keyof typeof typeColors]}`}>
            {policy.type.replace('_', ' ')}
          </span>
          <span className="font-medium text-white text-sm">{policy.name}</span>
        </div>
        <Switch defaultChecked={policy.status === 'active'} />
      </div>
      <p className="text-xs text-slate-400 mb-3">{policy.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {policy.applies_to.map((target, i) => (
          <code key={i} className="px-2 py-0.5 rounded bg-slate-700/50 text-[10px] text-slate-300">
            {target}
          </code>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'enforced' | 'disabled' }) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400',
    enforced: 'bg-purple-500/20 text-purple-400',
    disabled: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ComplianceCard({ name, status, region }: { name: string; status: 'compliant' | 'certified'; region: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-emerald-500/30">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold text-white">{name}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{region}</span>
        <span className="text-emerald-400 capitalize">{status}</span>
      </div>
    </div>
  );
}
