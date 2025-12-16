"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Play, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Code,
  Sparkles,
  Clock,
  FileText
} from 'lucide-react';
import { queryTemplates, generateInsight } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function CleanRoomView() {
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<{ success: boolean; insight: string } | null>(null);

  const executeQuery = async (queryId: string) => {
    const template = queryTemplates.find(q => q.id === queryId);
    if (!template) return;

    setIsExecuting(true);
    setQueryResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!template.approved) {
      setQueryResult({
        success: false,
        insight: 'QUERY REJECTED: This query template is not approved for execution. Only pre-approved analytical questions can be run in the Clean Room.'
      });
    } else {
      setQueryResult({
        success: true,
        insight: generateInsight(queryId)
      });
    }

    setIsExecuting(false);
  };

  const approvedTemplates = queryTemplates.filter(q => q.approved);
  const selected = queryTemplates.find(q => q.id === selectedQuery);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Snowflake Data Clean Room</h2>
          <p className="text-slate-400 mt-1">Execute pre-approved analytical queries across organisations</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
          <Lock className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">Secure Environment</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">K-Anonymity ≥ 10 Enforced</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400">Template-Only Queries</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">Full Audit Trail</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Approved Question Templates
          </h3>
          <div className="space-y-3">
            {queryTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedQuery(template.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                  selectedQuery === template.id
                    ? 'bg-slate-800/80 border-cyan-500/50 glow-cyan'
                    : template.approved
                    ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                    : 'bg-red-500/5 border-red-500/20 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      template.category === 'risk' ? 'bg-red-500/20 text-red-400' :
                      template.category === 'inclusion' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {template.category}
                    </span>
                    <span className="font-medium text-white text-sm">{template.name}</span>
                  </div>
                  {template.approved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 italic">&ldquo;{template.question}&rdquo;</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-400" />
            Query Execution
          </h3>
          
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{selected.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      selected.approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selected.approved ? 'Approved' : 'Not Approved'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{selected.description}</p>
                </div>

                <div className="p-4 bg-slate-900/50">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">SQL Template (Read Only)</p>
                  <pre className="text-xs text-cyan-300 font-mono overflow-x-auto p-3 rounded bg-slate-950/50 border border-slate-700/50">
                    {selected.sql_template}
                  </pre>
                </div>

                <div className="p-4 border-t border-slate-700/50">
                  <Button
                    onClick={() => executeQuery(selected.id)}
                    disabled={isExecuting}
                    className={`w-full ${
                      selected.approved 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    }`}
                  >
                    {isExecuting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        />
                        Executing Query...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {selected.approved ? 'Execute Safe Query' : 'Attempt Query'}
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {queryResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-700/50"
                    >
                      <div className={`p-4 ${queryResult.success ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          {queryResult.success ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span className="font-medium text-emerald-400">Query Executed Successfully</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-400" />
                              <span className="font-medium text-red-400">Query Rejected</span>
                            </>
                          )}
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${
                          queryResult.success 
                            ? 'bg-slate-800/50 border-emerald-500/20' 
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                            {queryResult.success ? 'AI-Generated Insight' : 'Error Message'}
                          </p>
                          <p className={`text-sm ${queryResult.success ? 'text-slate-300' : 'text-red-400'}`}>
                            {queryResult.insight}
                          </p>
                        </div>

                        {queryResult.success && (
                          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Executed in 1.2s
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Privacy checks passed
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> K-anonymity verified
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-xl p-12 text-center"
              >
                <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Select a query template to view details and execute</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div variants={item} className="glass-panel rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Clean Room Restrictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <p className="text-sm font-medium text-white mb-2">No Ad-Hoc SQL</p>
            <p className="text-xs text-slate-400">Only pre-approved query templates can be executed. Custom queries are blocked.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <p className="text-sm font-medium text-white mb-2">No Raw Row Access</p>
            <p className="text-xs text-slate-400">Results are always aggregated. Individual record access is impossible.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <p className="text-sm font-medium text-white mb-2">Minimum Group Size</p>
            <p className="text-xs text-slate-400">Results with fewer than 10 records are suppressed to prevent re-identification.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
