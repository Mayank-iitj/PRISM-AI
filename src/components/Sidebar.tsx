"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  LayoutDashboard,
  Lock,
  FileSearch,
  MessageSquare,
  AlertTriangle,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : 0 }}
        className={cn(
          "h-screen bg-black border-r border-white/10 flex flex-col fixed lg:sticky top-0 left-0 z-40 w-64 transition-transform",
          !mobileOpen && "max-lg:-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">PRISM-X</h1>
              <p className="text-[10px] text-neutral-500 tracking-wider uppercase">Privacy Intelligence</p>
            </div>
          </div>
        </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
            <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Organizations</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                <span className="truncate flex-1">National Bank Corp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 flex-shrink-0" />
                <span className="truncate flex-1">SecureLife Insurance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate flex-1">Dept. of Social Welfare</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded transition-all duration-200 relative group text-xs sm:text-sm",
                  activeSection === item.id
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0",
                    item.id === 'alerts' 
                      ? "bg-red-600 text-white" 
                      : "bg-neutral-800 text-neutral-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 rounded bg-neutral-900 border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-white font-medium">All Systems Secure</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Privacy policies active</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  LayoutDashboard,
  Lock,
  FileSearch,
  MessageSquare,
  AlertTriangle,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : 0 }}
        className={cn(
          "h-screen bg-black border-r border-white/10 flex flex-col fixed lg:sticky top-0 left-0 z-40 w-64 transition-transform",
          !mobileOpen && "max-lg:-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">PRISM-X</h1>
              <p className="text-[10px] text-neutral-500 tracking-wider uppercase">Privacy Intelligence</p>
            </div>
          </div>
        </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
            <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Organizations</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                <span className="truncate flex-1">National Bank Corp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 flex-shrink-0" />
                <span className="truncate flex-1">SecureLife Insurance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate flex-1">Dept. of Social Welfare</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded transition-all duration-200 relative group text-xs sm:text-sm",
                  activeSection === item.id
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0",
                    item.id === 'alerts' 
                      ? "bg-red-600 text-white" 
                      : "bg-neutral-800 text-neutral-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="p-2 sm:p-3 border-t border-white/10">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-neutral-900 border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
                <span className="text-white font-medium truncate">All Systems Secure</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 sm:mt-1 truncate">Privacy policies active</p>
            </div>
          </div>
      </motion.aside>
    </>
  );
}
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  LayoutDashboard,
  Lock,
  FileSearch,
  MessageSquare,
  AlertTriangle,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : 0 }}
        className={cn(
          "h-screen bg-black border-r border-white/10 flex flex-col fixed lg:sticky top-0 left-0 z-40 w-64 transition-transform",
          !mobileOpen && "max-lg:-translate-x-full"
        )}
      >
          <div className="p-3 sm:p-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-red-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-white truncate">PRISM-X</h1>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 tracking-wider uppercase truncate">Privacy Intelligence</p>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
            <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Organizations</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                <span className="truncate flex-1">National Bank Corp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 flex-shrink-0" />
                <span className="truncate flex-1">SecureLife Insurance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate flex-1">Dept. of Social Welfare</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded transition-all duration-200 relative group text-xs sm:text-sm",
                  activeSection === item.id
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0",
                    item.id === 'alerts' 
                      ? "bg-red-600 text-white" 
                      : "bg-neutral-800 text-neutral-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="p-2 sm:p-3 border-t border-white/10">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-neutral-900 border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
                <span className="text-white font-medium truncate">All Systems Secure</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 sm:mt-1 truncate">Privacy policies active</p>
            </div>
          </div>
      </motion.aside>
    </>
  );
}
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  LayoutDashboard,
  Lock,
  FileSearch,
  MessageSquare,
  AlertTriangle,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-40"
          />
        )}
      </AnimatePresence>

        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: mobileOpen ? 0 : 0 }}
          className={cn(
            "h-screen bg-black border-r border-white/10 flex flex-col fixed lg:sticky top-0 left-0 z-40 w-56 sm:w-64 transition-transform",
            !mobileOpen && "max-lg:-translate-x-full"
          )}
        >
          <div className="p-3 sm:p-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-red-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-white truncate">PRISM-X</h1>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 tracking-wider uppercase truncate">Privacy Intelligence</p>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
            <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Organizations</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                <span className="truncate flex-1">National Bank Corp</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 flex-shrink-0" />
                <span className="truncate flex-1">SecureLife Insurance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
                <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate flex-1">Dept. of Social Welfare</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded transition-all duration-200 relative group text-xs sm:text-sm",
                  activeSection === item.id
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0",
                    item.id === 'alerts' 
                      ? "bg-red-600 text-white" 
                      : "bg-neutral-800 text-neutral-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="p-2 sm:p-3 border-t border-white/10">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-neutral-900 border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
                <span className="text-white font-medium truncate">All Systems Secure</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 sm:mt-1 truncate">Privacy policies active</p>
            </div>
          </div>
      </motion.aside>
    </>
  );
}
