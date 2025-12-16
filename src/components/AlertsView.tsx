"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Users,
  Target,
  XCircle
} from 'lucide-react';
import { anomalyAlerts } from '@/lib/mock-data';
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

export function AlertsView() {
  const [alerts, setAlerts] = useState(anomalyAlerts);
  
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_threshold': return <TrendingUp className="w-4 h-4" />;
      case 'underserved_segment': return <Users className="w-4 h-4" />;
      case 'fraud_spike': return <Target className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
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
          <h2 className="text-xl md:text-2xl font-semibold text-white">Anomaly Alerts</h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Automated monitoring from Streams & Tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
              <Bell className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{activeAlerts.length} Active Alerts</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Critical" 
          value={alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length.toString()}
          color="red"
        />
        <StatCard 
          label="High" 
          value={alerts.filter(a => a.severity === 'high' && !a.acknowledged).length.toString()}
          color="orange"
        />
        <StatCard 
          label="Medium" 
          value={alerts.filter(a => a.severity === 'medium' && !a.acknowledged).length.toString()}
          color="amber"
        />
        <StatCard 
          label="Acknowledged" 
          value={acknowledgedAlerts.length.toString()}
          color="emerald"
        />
      </motion.div>

      {activeAlerts.length > 0 && (
        <motion.div variants={item} className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-panel rounded-xl p-5 border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  'border-l-amber-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wider border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {format(alert.timestamp, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-white mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Affected segments:</span>
                        {alert.affected_segments.map((seg, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-neutral-700/50 text-xs text-neutral-300">
                            {seg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => acknowledgeAlert(alert.id)}
                    variant="outline"
                    size="sm"
                    className="border-neutral-500/30 text-neutral-400 hover:bg-neutral-500/10"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Acknowledge
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeAlerts.length === 0 && (
        <motion.div variants={item} className="glass-panel rounded-xl p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All Clear</h3>
          <p className="text-neutral-400">No active alerts. All anomaly checks passed.</p>
        </motion.div>
      )}

      {acknowledgedAlerts.length > 0 && (
        <motion.div variants={item} className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-neutral-400" />
            Acknowledged Alerts
          </h3>
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700/50 bg-neutral-800/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/30">
                {acknowledgedAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-neutral-800/30 transition-colors opacity-60">
                    <td className="px-4 py-3">
                      <span className="text-neutral-400 text-xs font-mono">
                        {format(alert.timestamp, 'MMM dd, HH:mm')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-400 text-xs capitalize">
                        {alert.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-neutral-400 text-xs">{alert.description.slice(0, 60)}...</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-neutral-400 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="glass-panel rounded-xl p-4 md:p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-400" />
          Automated Monitoring Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScheduleCard
            task="Aggregate Refresh"
            schedule="Daily at 00:00 UTC"
            lastRun="2 hours ago"
            status="success"
          />
          <ScheduleCard
            task="Anomaly Detection"
            schedule="Every 4 hours"
            lastRun="45 minutes ago"
            status="success"
          />
          <ScheduleCard
            task="Threshold Monitoring"
            schedule="Continuous"
            lastRun="Live"
            status="running"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'red' | 'orange' | 'amber' | 'emerald' }) {
  const colors = {
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    emerald: 'from-neutral-500/20 to-neutral-500/5 border-neutral-500/30 text-neutral-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
      <span className="text-xs text-neutral-400">{label}</span>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function ScheduleCard({ task, schedule, lastRun, status }: { 
  task: string; 
  schedule: string; 
  lastRun: string;
  status: 'success' | 'running' | 'failed';
}) {
  return (
    <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-white text-sm">{task}</span>
        {status === 'success' && <CheckCircle2 className="w-4 h-4 text-neutral-400" />}
        {status === 'running' && (
          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        )}
        {status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
      </div>
      <p className="text-xs text-neutral-400">{schedule}</p>
      <p className="text-xs text-neutral-500 mt-1">Last run: {lastRun}</p>
    </div>
  );
}
