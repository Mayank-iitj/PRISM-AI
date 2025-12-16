"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queryTemplates, generateInsight } from '@/lib/mock-data';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    matched_template?: string;
    privacy_status?: 'approved' | 'rejected';
    sql?: string;
  };
}

const suggestedQuestions = [
  "Which age groups show the highest combined default risk and insurance claim frequency?",
  "Which income or age segments are not benefiting from subsidies despite high risk indicators?",
  "Which regions show correlated spikes in claims and transaction anomalies?",
  "How does risk vary across regions for different age groups?",
];

export function NLQueryView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm PRISM-X AI, your privacy-preserving analytics assistant. I can help you analyze cross-organizational data while maintaining strict privacy controls. Ask me any approved analytical question, and I'll translate it to a safe SQL query and provide plain-language insights.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processQuery = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const matchedTemplate = queryTemplates.find(t => 
      t.approved && (
        question.toLowerCase().includes(t.category) ||
        t.question.toLowerCase().includes(question.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
        question.toLowerCase().includes('risk') && t.category === 'risk' ||
        question.toLowerCase().includes('subsid') && t.category === 'inclusion' ||
        question.toLowerCase().includes('fraud') && t.category === 'fraud' ||
        question.toLowerCase().includes('region') && t.id === 'qt-003' ||
        question.toLowerCase().includes('age') && t.id === 'qt-001'
      )
    );

    if (matchedTemplate) {
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Query matched to approved template: "${matchedTemplate.name}"`,
        timestamp: new Date(),
        metadata: {
          matched_template: matchedTemplate.name,
          privacy_status: 'approved',
          sql: matchedTemplate.sql_template,
        },
      };
      setMessages(prev => [...prev, systemMessage]);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: generateInsight(matchedTemplate.id),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      const rejectionMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Query could not be matched to an approved template. For privacy protection, only pre-approved analytical questions can be executed.',
        timestamp: new Date(),
        metadata: {
          privacy_status: 'rejected',
        },
      };
      setMessages(prev => [...prev, rejectionMessage]);

      const helpMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I couldn't match your question to an approved query template. Here are some questions I can answer:\n\n• Which age groups show the highest combined default risk?\n• Which segments are not benefiting from subsidies?\n• Which regions show fraud signal convergence?\n\nPlease try rephrasing or select from the suggested questions below.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, helpMessage]);
    }

    setIsProcessing(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 h-full flex flex-col"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-400" />
            Ask PRISM-X
          </h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Natural language interface for privacy-preserving analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
          <Bot className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Cortex AI Powered</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl p-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-500/10 border border-neutral-500/30">
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Query Validation Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400">Template Matching</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">Plain-Language Output</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-red-500/20 border border-red-500/30 rounded-2xl rounded-tr-sm' 
                    : message.type === 'system'
                    ? `rounded-xl ${message.metadata?.privacy_status === 'rejected' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-500/10 border border-red-500/30'}`
                    : 'bg-neutral-800/50 border border-neutral-700/50 rounded-2xl rounded-tl-sm'
                } p-4`}>
                  {message.type === 'system' && (
                    <div className="flex items-center gap-2 mb-2">
                      {message.metadata?.privacy_status === 'approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        message.metadata?.privacy_status === 'approved' ? 'text-neutral-400' : 'text-red-400'
                      }`}>
                        {message.metadata?.privacy_status === 'approved' ? 'Privacy Check Passed' : 'Query Rejected'}
                      </span>
                    </div>
                  )}
                  
                  <p className={`text-sm ${
                    message.type === 'user' ? 'text-white' : 
                    message.type === 'system' ? (message.metadata?.privacy_status === 'rejected' ? 'text-red-300' : 'text-red-300') :
                    'text-neutral-300'
                  } whitespace-pre-line`}>
                    {message.content}
                  </p>

                  {message.metadata?.sql && (
                    <div className="mt-3 p-2 rounded bg-neutral-900/50 border border-neutral-700/50">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Translated SQL</p>
                      <pre className="text-[10px] text-red-300 font-mono overflow-x-auto">
                        {message.metadata.sql.slice(0, 100)}...
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                  <span className="text-sm text-neutral-400">Processing query...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-700/50 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => processQuery(q)}
                className="px-3 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700/50 text-xs text-neutral-400 hover:text-white hover:border-red-500/50 transition-colors"
              >
                {q.slice(0, 40)}...
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processQuery(input)}
              placeholder="Ask a question about the data..."
              className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition-colors"
            />
            <Button
              onClick={() => processQuery(input)}
              disabled={isProcessing || !input.trim()}
              className="bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
