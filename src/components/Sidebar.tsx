"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Database,
  LayoutDashboard,
  Lock,
  FileSearch,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  Building2,
  Landmark,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'architecture', label: 'Architecture', icon: <Hexagon className="w-5 h-5" /> },
  { id: 'data-sources', label: 'Data Sources', icon: <Database className="w-5 h-5" /> },
  { id: 'clean-room', label: 'Clean Room', icon: <Lock className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'governance', label: 'Governance', icon: <Shield className="w-5 h-5" /> },
  { id: 'audit', label: 'Audit Logs', icon: <FileSearch className="w-5 h-5" />, badge: 6 },
  { id: 'nlq', label: 'Ask PRISM-X', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-5 h-5" />, badge: 2 },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      className="h-screen bg-[#0a0f1a] border-r border-cyan-500/10 flex flex-col relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="p-4 border-b border-cyan-500/10 relative">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center glow-cyan">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-gradient">PRISM-X</h1>
              <p className="text-[10px] text-slate-500 tracking-wider">PRIVACY INTELLIGENCE</p>
            </div>
          )}
        </motion.div>
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center glow-cyan mx-auto">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-cyan-500/10">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Organisations</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Landmark className="w-3.5 h-3.5 text-[#29b6f6]" />
              <span>National Bank Corp</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-[#66bb6a]" />
              <span>SecureLife Insurance</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building className="w-3.5 h-3.5 text-[#ffa726]" />
              <span>Dept. of Social Welfare</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group",
              activeSection === item.id
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full"
              />
            )}
            {item.icon}
            {!collapsed && (
              <>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-xs px-1.5 py-0.5 rounded-full",
                    item.id === 'alerts' 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-cyan-500/20 text-cyan-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-3 border-t border-cyan-500/10">
        {!collapsed && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-medium">All Systems Secure</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Privacy policies active</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
