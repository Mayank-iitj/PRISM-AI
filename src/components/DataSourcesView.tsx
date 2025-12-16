"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Building2, 
  Building,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  DollarSign,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const [bankData, setBankData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [subsidyData, setSubsidyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAllData();
    
    const bankChannel = supabase
      .channel('bank-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_transactions' }, () => {
        fetchBankData();
      })
      .subscribe();

    const insuranceChannel = supabase
      .channel('insurance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'insurance_claims' }, () => {
        fetchInsuranceData();
      })
      .subscribe();

    const subsidyChannel = supabase
      .channel('subsidy-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidy_usage' }, () => {
        fetchSubsidyData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bankChannel);
      supabase.removeChannel(insuranceChannel);
      supabase.removeChannel(subsidyChannel);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBankData(), fetchInsuranceData(), fetchSubsidyData()]);
    setLoading(false);
  };

  const fetchBankData = async () => {
    const res = await fetch('/api/bank-transactions');
    const data = await res.json();
    setBankData(data || []);
  };

  const fetchInsuranceData = async () => {
    const res = await fetch('/api/insurance-claims');
    const data = await res.json();
    setInsuranceData(data || []);
  };

  const fetchSubsidyData = async () => {
    const res = await fetch('/api/subsidy-usage');
    const data = await res.json();
    setSubsidyData(data || []);
  };

  const orgs = [
    { id: 'bank', name: 'National Bank Corp', icon: <Landmark className="w-5 h-5" />, color: '#dc2626', table: 'BANK_TRANSACTION_SUMMARY', count: bankData.length },
    { id: 'insurance', name: 'SecureLife Insurance', icon: <Building2 className="w-5 h-5" />, color: '#ef4444', table: 'INSURANCE_CLAIM_SUMMARY', count: insuranceData.length },
    { id: 'government', name: 'Dept. of Social Welfare', icon: <Building className="w-5 h-5" />, color: '#f87171', table: 'SUBSIDY_USAGE_SUMMARY', count: subsidyData.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading data sources...</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item}>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Data Sources</h2>
        <p className="text-neutral-400 mt-1 text-sm md:text-base">Real-time data from participating organizations</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(org.id as 'bank' | 'insurance' | 'government')}
            className={`p-5 rounded border transition-all duration-200 text-left ${
              selectedOrg === org.id
                ? 'bg-neutral-800/80 border-red-500/50 glow-red'
                : 'bg-neutral-800/30 border-neutral-700/50 hover:border-neutral-600/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: `${org.color}20`, color: org.color }}
              >
                {org.icon}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{org.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">{org.table}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                Privacy Compliant
              </span>
              <span className="text-red-400 font-mono">{org.count} rows</span>
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
          className="glass-panel rounded overflow-hidden"
        >
          {selectedOrg === 'bank' && <BankTable data={bankData} onRefresh={fetchBankData} />}
          {selectedOrg === 'insurance' && <InsuranceTable data={insuranceData} onRefresh={fetchInsuranceData} />}
          {selectedOrg === 'government' && <GovernmentTable data={subsidyData} onRefresh={fetchSubsidyData} />}
        </motion.div>
      </AnimatePresence>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-white">Data Governance Tags Applied</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

function BankTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [showMasked, setShowMasked] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/bank-transactions?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/bank-transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };
  
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#dc2626]/20 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">BANK_TRANSACTION_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-700/50 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            {showMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showMasked ? 'Masked' : 'Raw'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Customer ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Risk Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Defaults</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Loan Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.customer_id}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.risk_score) > 80 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.risk_score) > 50 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.risk_score).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.defaults}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.loan_balance).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['customer_id', 'age_group', 'region', 'risk_score', 'defaults', 'loan_balance']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}
      
      {showAddModal && (
        <AddModal
          fields={[
            { name: 'customer_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'risk_score', type: 'number', required: true },
            { name: 'defaults', type: 'number', required: true },
            { name: 'loan_balance', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function InsuranceTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/insurance-claims?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/insurance-claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/insurance-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#ef4444]/20 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">INSURANCE_CLAIM_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Policy ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Fraud Indicator</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Claims</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Payout Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.policy_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.fraud_indicator) > 70 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.fraud_indicator) > 40 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.fraud_indicator).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.claims_count}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.payout_total).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['policy_id', 'age_group', 'region', 'fraud_indicator', 'claims_count', 'payout_total']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'policy_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'fraud_indicator', type: 'number', required: true },
            { name: 'claims_count', type: 'number', required: true },
            { name: 'payout_total', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function GovernmentTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/subsidy-usage?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#f87171]/20 flex items-center justify-center">
            <Building className="w-4 h-4 text-[#f87171]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">SUBSIDY_USAGE_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Beneficiary ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Benefit Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Coverage %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Monthly Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.beneficiary_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseFloat(row.benefit_score) >= 70 ? 'bg-neutral-500' :
                          parseFloat(row.benefit_score) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${row.benefit_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400">{parseFloat(row.benefit_score).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-300">{parseFloat(row.coverage_percent).toFixed(0)}%</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.monthly_amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['beneficiary_id', 'age_group', 'region', 'benefit_score', 'coverage_percent', 'monthly_amount']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'beneficiary_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'benefit_score', type: 'number', required: true },
            { name: 'coverage_percent', type: 'number', required: true },
            { name: 'monthly_amount', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function EditModal({ row, fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState(row);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Edit Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: string) => (
            <div key={field}>
              <label className="text-xs text-neutral-400 block mb-1">{field.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.includes('score') || field.includes('count') || field.includes('balance') || field.includes('total') || field.includes('amount') || field.includes('percent') ? 'number' : 'text'}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm sm:text-base">Add New Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: any) => (
            <div key={field.name}>
              <label className="text-xs text-neutral-400 block mb-1">{field.name.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Add Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
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
    <div className={`p-4 rounded border ${colors[color]}`}>
      <code className="text-xs font-mono font-medium">{tag}</code>
      <p className="text-xs text-neutral-400 mt-2">{description}</p>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Building2, 
  Building,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  DollarSign,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const [bankData, setBankData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [subsidyData, setSubsidyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAllData();
    
    const bankChannel = supabase
      .channel('bank-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_transactions' }, () => {
        fetchBankData();
      })
      .subscribe();

    const insuranceChannel = supabase
      .channel('insurance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'insurance_claims' }, () => {
        fetchInsuranceData();
      })
      .subscribe();

    const subsidyChannel = supabase
      .channel('subsidy-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidy_usage' }, () => {
        fetchSubsidyData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bankChannel);
      supabase.removeChannel(insuranceChannel);
      supabase.removeChannel(subsidyChannel);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBankData(), fetchInsuranceData(), fetchSubsidyData()]);
    setLoading(false);
  };

  const fetchBankData = async () => {
    const res = await fetch('/api/bank-transactions');
    const data = await res.json();
    setBankData(data || []);
  };

  const fetchInsuranceData = async () => {
    const res = await fetch('/api/insurance-claims');
    const data = await res.json();
    setInsuranceData(data || []);
  };

  const fetchSubsidyData = async () => {
    const res = await fetch('/api/subsidy-usage');
    const data = await res.json();
    setSubsidyData(data || []);
  };

  const orgs = [
    { id: 'bank', name: 'National Bank Corp', icon: <Landmark className="w-5 h-5" />, color: '#dc2626', table: 'BANK_TRANSACTION_SUMMARY', count: bankData.length },
    { id: 'insurance', name: 'SecureLife Insurance', icon: <Building2 className="w-5 h-5" />, color: '#ef4444', table: 'INSURANCE_CLAIM_SUMMARY', count: insuranceData.length },
    { id: 'government', name: 'Dept. of Social Welfare', icon: <Building className="w-5 h-5" />, color: '#f87171', table: 'SUBSIDY_USAGE_SUMMARY', count: subsidyData.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading data sources...</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item}>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Data Sources</h2>
        <p className="text-neutral-400 mt-1 text-sm md:text-base">Real-time data from participating organizations</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(org.id as 'bank' | 'insurance' | 'government')}
            className={`p-5 rounded border transition-all duration-200 text-left ${
              selectedOrg === org.id
                ? 'bg-neutral-800/80 border-red-500/50 glow-red'
                : 'bg-neutral-800/30 border-neutral-700/50 hover:border-neutral-600/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: `${org.color}20`, color: org.color }}
              >
                {org.icon}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{org.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">{org.table}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                Privacy Compliant
              </span>
              <span className="text-red-400 font-mono">{org.count} rows</span>
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
          className="glass-panel rounded overflow-hidden"
        >
          {selectedOrg === 'bank' && <BankTable data={bankData} onRefresh={fetchBankData} />}
          {selectedOrg === 'insurance' && <InsuranceTable data={insuranceData} onRefresh={fetchInsuranceData} />}
          {selectedOrg === 'government' && <GovernmentTable data={subsidyData} onRefresh={fetchSubsidyData} />}
        </motion.div>
      </AnimatePresence>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-white">Data Governance Tags Applied</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

function BankTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [showMasked, setShowMasked] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/bank-transactions?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/bank-transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };
  
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#dc2626]/20 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">BANK_TRANSACTION_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-700/50 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            {showMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showMasked ? 'Masked' : 'Raw'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Customer ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Risk Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Defaults</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Loan Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.customer_id}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.risk_score) > 80 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.risk_score) > 50 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.risk_score).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.defaults}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.loan_balance).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['customer_id', 'age_group', 'region', 'risk_score', 'defaults', 'loan_balance']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}
      
      {showAddModal && (
        <AddModal
          fields={[
            { name: 'customer_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'risk_score', type: 'number', required: true },
            { name: 'defaults', type: 'number', required: true },
            { name: 'loan_balance', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function InsuranceTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/insurance-claims?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/insurance-claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/insurance-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#ef4444]/20 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">INSURANCE_CLAIM_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Policy ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Fraud Indicator</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Claims</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Payout Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.policy_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.fraud_indicator) > 70 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.fraud_indicator) > 40 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.fraud_indicator).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.claims_count}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.payout_total).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['policy_id', 'age_group', 'region', 'fraud_indicator', 'claims_count', 'payout_total']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'policy_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'fraud_indicator', type: 'number', required: true },
            { name: 'claims_count', type: 'number', required: true },
            { name: 'payout_total', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function GovernmentTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/subsidy-usage?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#f87171]/20 flex items-center justify-center">
            <Building className="w-4 h-4 text-[#f87171]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">SUBSIDY_USAGE_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Beneficiary ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Benefit Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Coverage %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Monthly Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.beneficiary_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseFloat(row.benefit_score) >= 70 ? 'bg-neutral-500' :
                          parseFloat(row.benefit_score) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${row.benefit_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400">{parseFloat(row.benefit_score).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-300">{parseFloat(row.coverage_percent).toFixed(0)}%</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.monthly_amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['beneficiary_id', 'age_group', 'region', 'benefit_score', 'coverage_percent', 'monthly_amount']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'beneficiary_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'benefit_score', type: 'number', required: true },
            { name: 'coverage_percent', type: 'number', required: true },
            { name: 'monthly_amount', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function EditModal({ row, fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState(row);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Edit Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: string) => (
            <div key={field}>
              <label className="text-xs text-neutral-400 block mb-1">{field.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.includes('score') || field.includes('count') || field.includes('balance') || field.includes('total') || field.includes('amount') || field.includes('percent') ? 'number' : 'text'}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm sm:text-base">Add New Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: any) => (
            <div key={field.name}>
              <label className="text-xs text-neutral-400 block mb-1">{field.name.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Add Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
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
    <div className={`p-4 rounded border ${colors[color]}`}>
      <code className="text-xs font-mono font-medium">{tag}</code>
      <p className="text-xs text-neutral-400 mt-2">{description}</p>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Building2, 
  Building,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  DollarSign,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const [bankData, setBankData] = useState<any[]>([]);
  const [insuranceData, setInsuranceData] = useState<any[]>([]);
  const [subsidyData, setSubsidyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAllData();
    
    const bankChannel = supabase
      .channel('bank-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bank_transactions' }, () => {
        fetchBankData();
      })
      .subscribe();

    const insuranceChannel = supabase
      .channel('insurance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'insurance_claims' }, () => {
        fetchInsuranceData();
      })
      .subscribe();

    const subsidyChannel = supabase
      .channel('subsidy-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidy_usage' }, () => {
        fetchSubsidyData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bankChannel);
      supabase.removeChannel(insuranceChannel);
      supabase.removeChannel(subsidyChannel);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBankData(), fetchInsuranceData(), fetchSubsidyData()]);
    setLoading(false);
  };

  const fetchBankData = async () => {
    const res = await fetch('/api/bank-transactions');
    const data = await res.json();
    setBankData(data || []);
  };

  const fetchInsuranceData = async () => {
    const res = await fetch('/api/insurance-claims');
    const data = await res.json();
    setInsuranceData(data || []);
  };

  const fetchSubsidyData = async () => {
    const res = await fetch('/api/subsidy-usage');
    const data = await res.json();
    setSubsidyData(data || []);
  };

  const orgs = [
    { id: 'bank', name: 'National Bank Corp', icon: <Landmark className="w-5 h-5" />, color: '#dc2626', table: 'BANK_TRANSACTION_SUMMARY', count: bankData.length },
    { id: 'insurance', name: 'SecureLife Insurance', icon: <Building2 className="w-5 h-5" />, color: '#ef4444', table: 'INSURANCE_CLAIM_SUMMARY', count: insuranceData.length },
    { id: 'government', name: 'Dept. of Social Welfare', icon: <Building className="w-5 h-5" />, color: '#f87171', table: 'SUBSIDY_USAGE_SUMMARY', count: subsidyData.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading data sources...</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={item}>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Data Sources</h2>
        <p className="text-neutral-400 mt-1 text-sm md:text-base">Real-time data from participating organizations</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((org) => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(org.id as 'bank' | 'insurance' | 'government')}
            className={`p-5 rounded border transition-all duration-200 text-left ${
              selectedOrg === org.id
                ? 'bg-neutral-800/80 border-red-500/50 glow-red'
                : 'bg-neutral-800/30 border-neutral-700/50 hover:border-neutral-600/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: `${org.color}20`, color: org.color }}
              >
                {org.icon}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{org.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">{org.table}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                Privacy Compliant
              </span>
              <span className="text-red-400 font-mono">{org.count} rows</span>
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
          className="glass-panel rounded overflow-hidden"
        >
          {selectedOrg === 'bank' && <BankTable data={bankData} onRefresh={fetchBankData} />}
          {selectedOrg === 'insurance' && <InsuranceTable data={insuranceData} onRefresh={fetchInsuranceData} />}
          {selectedOrg === 'government' && <GovernmentTable data={subsidyData} onRefresh={fetchSubsidyData} />}
        </motion.div>
      </AnimatePresence>

      <motion.div variants={item} className="glass-panel rounded p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-white">Data Governance Tags Applied</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

function BankTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [showMasked, setShowMasked] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/bank-transactions?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/bank-transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };
  
  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#dc2626]/20 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-[#dc2626]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">BANK_TRANSACTION_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-700/50 text-xs text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            {showMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showMasked ? 'Masked' : 'Raw'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Customer ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Risk Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Defaults</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Loan Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.customer_id}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{showMasked ? '***' : row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.risk_score) > 80 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.risk_score) > 50 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.risk_score).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.defaults}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.loan_balance).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['customer_id', 'age_group', 'region', 'risk_score', 'defaults', 'loan_balance']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}
      
      {showAddModal && (
        <AddModal
          fields={[
            { name: 'customer_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'risk_score', type: 'number', required: true },
            { name: 'defaults', type: 'number', required: true },
            { name: 'loan_balance', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function InsuranceTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/insurance-claims?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/insurance-claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/insurance-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#ef4444]/20 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">INSURANCE_CLAIM_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Policy ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Fraud Indicator</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Claims</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Payout Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.policy_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    parseFloat(row.fraud_indicator) > 70 ? 'bg-red-500/20 text-red-400' :
                    parseFloat(row.fraud_indicator) > 40 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-neutral-500/20 text-neutral-400'
                  }`}>
                    {parseFloat(row.fraud_indicator).toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-300">{row.claims_count}</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.payout_total).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['policy_id', 'age_group', 'region', 'fraud_indicator', 'claims_count', 'payout_total']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'policy_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'fraud_indicator', type: 'number', required: true },
            { name: 'claims_count', type: 'number', required: true },
            { name: 'payout_total', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function GovernmentTable({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/subsidy-usage?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleUpdate = async (row: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    setEditingRow(null);
    onRefresh();
  };

  const handleAdd = async (newData: any) => {
    await fetch('/api/subsidy-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div>
      <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#f87171]/20 flex items-center justify-center">
            <Building className="w-4 h-4 text-[#f87171]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">SUBSIDY_USAGE_SUMMARY</h3>
            <p className="text-xs text-neutral-500">{data.length} records • Real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-xs text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Beneficiary ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Benefit Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Coverage %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Monthly Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/30">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{row.beneficiary_id}</td>
                <td className="px-4 py-3 text-neutral-300">{row.age_group}</td>
                <td className="px-4 py-3 text-neutral-300">{row.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseFloat(row.benefit_score) >= 70 ? 'bg-neutral-500' :
                          parseFloat(row.benefit_score) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${row.benefit_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400">{parseFloat(row.benefit_score).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-300">{parseFloat(row.coverage_percent).toFixed(0)}%</td>
                <td className="px-4 py-3 text-neutral-300">${parseFloat(row.monthly_amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRow(row)} className="text-neutral-400 hover:text-white">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <EditModal
          row={editingRow}
          fields={['beneficiary_id', 'age_group', 'region', 'benefit_score', 'coverage_percent', 'monthly_amount']}
          onSave={handleUpdate}
          onClose={() => setEditingRow(null)}
        />
      )}

      {showAddModal && (
        <AddModal
          fields={[
            { name: 'beneficiary_id', type: 'text', required: true },
            { name: 'age_group', type: 'text', required: true },
            { name: 'region', type: 'text', required: true },
            { name: 'benefit_score', type: 'number', required: true },
            { name: 'coverage_percent', type: 'number', required: true },
            { name: 'monthly_amount', type: 'number', required: true }
          ]}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function EditModal({ row, fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState(row);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Edit Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: string) => (
            <div key={field}>
              <label className="text-xs text-neutral-400 block mb-1">{field.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.includes('score') || field.includes('count') || field.includes('balance') || field.includes('total') || field.includes('amount') || field.includes('percent') ? 'number' : 'text'}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ fields, onSave, onClose }: any) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm sm:text-base">Add New Record</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field: any) => (
            <div key={field.name}>
              <label className="text-xs text-neutral-400 block mb-1">{field.name.replace('_', ' ').toUpperCase()}</label>
              <input
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
          >
            Add Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-sm hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
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
    <div className={`p-4 rounded border ${colors[color]}`}>
      <code className="text-xs font-mono font-medium">{tag}</code>
      <p className="text-xs text-neutral-400 mt-2">{description}</p>
    </div>
  );
}
