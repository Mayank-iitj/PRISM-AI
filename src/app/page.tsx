"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ArchitectureView } from '@/components/ArchitectureView';
import { DataSourcesView } from '@/components/DataSourcesView';
import { CleanRoomView } from '@/components/CleanRoomView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { GovernanceView } from '@/components/GovernanceView';
import { AuditLogsView } from '@/components/AuditLogsView';
import { NLQueryView } from '@/components/NLQueryView';
import { AlertsView } from '@/components/AlertsView';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [activeSection, setActiveSection] = useState('architecture');

  const renderContent = () => {
    switch (activeSection) {
      case 'architecture':
        return <ArchitectureView />;
      case 'data-sources':
        return <DataSourcesView />;
      case 'clean-room':
        return <CleanRoomView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'governance':
        return <GovernanceView />;
      case 'audit':
        return <AuditLogsView />;
      case 'nlq':
        return <NLQueryView />;
      case 'alerts':
        return <AlertsView />;
      default:
        return <ArchitectureView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-6 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
