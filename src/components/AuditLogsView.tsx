"use client";

import { motion } from 'framer-motion';
import { 
  FileSearch, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Building,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { auditLogs, queryTemplates } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AuditLogsView() {
  const getTemplateInfo = (id: string) => queryTemplates.find(q => q.id === id);

  const stats = {
    total: auditLogs.length,
    approved: auditLogs.filter(l => l.privacy_checks_passed).length,
    rejected: auditLogs.filter(l => !l.privacy_checks_passed).length,
    orgs: [...new Set(auditLogs.map(l => l.executor_org))].length,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Query Audit Logs</h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Complete audit trail of all Clean Room queries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Queries" value={stats.total.toString()} color="cyan" />
        <StatCard label="Approved" value={stats.approved.toString()} color="emerald" />
        <StatCard label="Rejected" value={stats.rejected.toString()} color="red" />
        <StatCard label="Organizations" value={stats.orgs.toString()} color="purple" />
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-white">Recent Query Executions</span>
          </div>
          <span className="text-xs text-neutral-500">{auditLogs.length} total records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700/50 bg-neutral-800/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Query Template</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Executor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Result Summary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Privacy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">K-Anon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Rows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/30">
              {auditLogs.map((log) => {
                const template = getTemplateInfo(log.query_template_id);
                return (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-neutral-800/30 transition-colors ${
                      !log.privacy_checks_passed ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span className="text-neutral-300 text-xs font-mono">
                          {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${
                          template?.category === 'risk' ? 'bg-red-500/20 text-red-400' :
                          template?.category === 'inclusion' ? 'bg-neutral-500/20 text-neutral-400' :
                          template?.category === 'fraud' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-neutral-500/20 text-neutral-400'
                        }`}>
                          {template?.category || 'N/A'}
                        </span>
                        <span className="text-white text-sm">{template?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-3 h-3 text-neutral-500" />
                        <span className="text-neutral-300 text-xs">{log.executor_org}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${log.privacy_checks_passed ? 'text-neutral-300' : 'text-red-400'}`}>
                        {log.result_summary}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.privacy_checks_passed ? (
                        <span className="flex items-center gap-1 text-neutral-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs">Passed</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.k_anonymity_met ? (
                        <span className="px-2 py-0.5 rounded bg-neutral-500/20 text-neutral-400 text-xs">≥10</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-300 font-mono text-xs">{log.rows_returned}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
        <div className="glass-panel rounded-xl p-4 md:p-6">
          <h3 className="font-semibold text-white mb-4">Privacy Check Breakdown</h3>
          <div className="space-y-3">
            <ProgressBar 
              label="Template Validation" 
              value={5} 
              max={6} 
              color="cyan"
              detail="5/6 queries used approved templates"
            />
            <ProgressBar 
              label="K-Anonymity Check" 
              value={5} 
              max={6} 
              color="emerald"
              detail="5/6 queries met K≥10 requirement"
            />
            <ProgressBar 
              label="Aggregate-Only Output" 
              value={6} 
              max={6} 
              color="purple"
              detail="All queries produced aggregated results"
            />
            <ProgressBar 
              label="No PII Exposure" 
              value={6} 
              max={6} 
              color="amber"
              detail="Zero PII detected in any output"
            />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 md:p-6">
          <h3 className="font-semibold text-white mb-4">Query Rejection Log</h3>
          <div className="space-y-3">
            {auditLogs.filter(l => !l.privacy_checks_passed).map((log) => (
              <div key={log.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-red-400 font-mono">{format(log.timestamp, 'MMM dd, HH:mm:ss')}</span>
                  <span className="text-xs text-neutral-500">{log.executor_org}</span>
                </div>
                <p className="text-sm text-white">{log.result_summary}</p>
                <p className="text-xs text-neutral-400 mt-1 text-sm md:text-base">Reason: Attempted unapproved query template</p>
              </div>
            ))}
            {auditLogs.filter(l => !l.privacy_checks_passed).length === 0 && (
              <div className="p-4 rounded-lg bg-neutral-500/10 border border-neutral-500/30 text-center">
                <CheckCircle2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No rejected queries</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'cyan' | 'emerald' | 'red' | 'purple' }) {
  const colors = {
    cyan: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    emerald: 'from-neutral-500/20 to-neutral-500/5 border-neutral-500/30 text-neutral-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    purple: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
      <span className="text-xs text-neutral-400">{label}</span>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, max, color, detail }: { 
  label: string; 
  value: number; 
  max: number; 
  color: 'cyan' | 'emerald' | 'purple' | 'amber';
  detail: string;
}) {
  const percentage = (value / max) * 100;
  const colors = {
    cyan: 'bg-red-500',
    emerald: 'bg-neutral-500',
    purple: 'bg-red-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-300">{label}</span>
        <span className={`text-${color}-400`}>{value}/{max}</span>
      </div>
      <div className="h-2 bg-neutral-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[10px] text-neutral-500">{detail}</span>
    </div>
  );
}
