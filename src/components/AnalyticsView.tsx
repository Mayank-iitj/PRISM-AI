"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Shield,
  Target,
  Scale
} from 'lucide-react';
import { analyticsResults } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? (entry.value * 100).toFixed(1) : entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsView() {
  const [activeTab, setActiveTab] = useState('risk');

  const ageGroupData = ['18-25', '26-35', '36-45', '46-60', '60+'].map(age => {
    const northData = analyticsResults.find(r => r.age_group === age && r.region_code === 'NORTH');
    const southData = analyticsResults.find(r => r.age_group === age && r.region_code === 'SOUTH');
    return {
      age_group: age,
      default_rate_north: northData?.default_rate || 0,
      default_rate_south: southData?.default_rate || 0,
      claim_frequency_north: northData?.claim_frequency || 0,
      claim_frequency_south: southData?.claim_frequency || 0,
      fraud_rate_north: northData?.fraud_rate || 0,
      fraud_rate_south: southData?.fraud_rate || 0,
      risk_score_north: northData?.risk_score || 0,
      risk_score_south: southData?.risk_score || 0,
      subsidy_coverage_north: northData?.subsidy_coverage || 0,
      subsidy_coverage_south: southData?.subsidy_coverage || 0,
    };
  });

  const inclusionData = analyticsResults.map(r => ({
    name: `${r.age_group} ${r.region_code}`,
    risk: r.risk_score,
    subsidy: r.subsidy_coverage || 0,
    customers: r.customer_count,
  }));

  const fraudTrend = [
    { month: 'Aug', north: 0.02, south: 0.05 },
    { month: 'Sep', north: 0.03, south: 0.07 },
    { month: 'Oct', north: 0.02, south: 0.09 },
    { month: 'Nov', north: 0.04, south: 0.12 },
    { month: 'Dec', north: 0.03, south: 0.15 },
    { month: 'Jan', north: 0.05, south: 0.18 },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Cross-Organisation Analytics</h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Privacy-preserving insights from aggregated data</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="High Risk Segments"
          value="3"
          change="+1 from last month"
          changeType="negative"
          color="red"
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Underserved Groups"
          value="2"
          change="Critical attention needed"
          changeType="negative"
          color="amber"
        />
        <MetricCard
          icon={<Shield className="w-5 h-5" />}
          label="Fraud Correlation"
          value="34%"
          change="Higher in SOUTH region"
          changeType="negative"
          color="purple"
        />
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          label="Coverage Gap"
          value="78%"
          change="46-60 LOW income"
          changeType="negative"
          color="cyan"
        />
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-800/50 border border-neutral-700/50">
            <TabsTrigger value="risk" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="inclusion" className="data-[state=active]:bg-neutral-500/20 data-[state=active]:text-neutral-400">
              <Scale className="w-4 h-4 mr-2" />
              Inclusion Gaps
            </TabsTrigger>
            <TabsTrigger value="fraud" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Target className="w-4 h-4 mr-2" />
              Fraud Convergence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-red-400" />
                  Default Rate by Age Group & Region
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroupData} barGap={0} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="age_group" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="default_rate_north" name="NORTH" fill="#dc2626" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="default_rate_south" name="SOUTH" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  Combined Risk Score Distribution
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="age_group" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="risk_score_north" name="NORTH Risk" fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" />
                      <Area type="monotone" dataKey="risk_score_south" name="SOUTH Risk" fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" />
                      <Line type="monotone" dataKey="claim_frequency_north" name="NORTH Claims" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
                      <Line type="monotone" dataKey="claim_frequency_south" name="SOUTH Claims" stroke="#a3a3a3" strokeWidth={2} dot={{ fill: '#a3a3a3' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-white mb-4">Key Insight</h3>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-neutral-300">
                  <span className="text-red-400 font-semibold">Age group 46-60</span> shows the highest combined default risk (0.38) and insurance claim frequency (0.64) in the SOUTH region. 
                  This demographic represents 20% of the combined customer base but accounts for 35% of high-risk indicators.
                  <span className="block mt-2 text-neutral-400 text-xs">
                    Recommendation: Implement targeted risk-mitigation products rather than blanket credit denial.
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>

            <TabsContent value="inclusion" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:p-6">
              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-neutral-400" />
                  Risk vs Subsidy Coverage Quadrant
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        type="number" 
                        dataKey="risk" 
                        name="Risk Score" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        domain={[0, 1]}
                        label={{ value: 'Risk Score', position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="subsidy" 
                        name="Subsidy Coverage" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        domain={[0, 1]}
                        label={{ value: 'Subsidy Coverage', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-xl">
                                <p className="text-white font-medium">{data.name}</p>
                                <p className="text-xs text-red-400">Risk: {(data.risk * 100).toFixed(1)}%</p>
                                <p className="text-xs text-neutral-400">Subsidy: {(data.subsidy * 100).toFixed(1)}%</p>
                                <p className="text-xs text-neutral-400">Customers: {data.customers.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter data={inclusionData} fill="#8884d8">
                        {inclusionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.risk > 0.5 && entry.subsidy < 0.5 ? '#ef4444' : entry.risk < 0.3 ? '#525252' : '#a3a3a3'} 
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> High Risk, Low Coverage</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-neutral-500" /> Low Risk</span>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  Subsidy Coverage by Age Group
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroupData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="category" dataKey="age_group" tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="subsidy_coverage_north" name="NORTH Coverage" fill="#525252" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="subsidy_coverage_south" name="SOUTH Coverage" fill="#dc2626" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-white mb-4">Inclusion Gap Alert</h3>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-neutral-300">
                  <span className="text-amber-400 font-semibold">Critical Finding:</span> The 46-60 age group in the LOW income band shows a 78% gap in subsidy coverage 
                  despite having the highest risk indicators (0.85 risk score). Only 22% of this segment receives any subsidy support.
                  <span className="block mt-2 text-neutral-400 text-xs">
                    Recommendation: Prioritize outreach programs and policy adjustments for this underserved demographic.
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fraud" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  Fraud Signal Trend by Region
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fraudTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="north" name="NORTH" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="south" name="SOUTH" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Fraud Rate by Age Group
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="age_group" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="fraud_rate_north" name="NORTH Fraud" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fraud_rate_south" name="SOUTH Fraud" fill="#a3a3a3" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-white mb-4">Fraud Convergence Analysis</h3>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-neutral-300">
                  <span className="text-red-400 font-semibold">Pattern Detected:</span> The SOUTH region exhibits a 34% higher correlation between fraud indicators 
                  and transaction anomalies compared to NORTH. Analysis suggests coordinated claim-transaction fraud concentrated in the 36-45 and 46-60 age groups.
                  <span className="block mt-2 text-neutral-400 text-xs">
                    Recommendation: Enhanced cross-validation between banking and insurance claims for flagged segments.
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, change, changeType, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  change: string; 
  changeType: 'positive' | 'negative';
  color: 'red' | 'amber' | 'purple' | 'cyan';
}) {
  const colors = {
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    purple: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    cyan: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm text-neutral-300">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className={`text-xs ${changeType === 'negative' ? 'text-red-400' : 'text-neutral-400'}`}>{change}</p>
    </div>
  );
}
