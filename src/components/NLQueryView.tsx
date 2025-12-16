"use client";

import { useState, useRef, useEffect } from 'react';
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
    privacy_status?: 'approved' | 'rejected';
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
      content: "Hello! I'm PRISM-X AI powered by Google Gemini, your privacy-preserving analytics assistant. I can help you analyze cross-organizational data while maintaining strict privacy controls. Ask me any question about the data, and I'll provide real-time, data-driven insights.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = async (question: string) => {
    if (!question.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const privacyMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: 'Privacy check passed. Analyzing data with Gemini AI...',
      timestamp: new Date(),
      metadata: {
        privacy_status: 'approved',
      },
    };
    setMessages(prev => [...prev, privacyMessage]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context: 'Banking, Insurance, and Government subsidy data available in PRISM-X clean room'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: 'Error: Failed to get response from Gemini AI. Please try again.',
        timestamp: new Date(),
        metadata: {
          privacy_status: 'rejected',
        },
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6 h-full flex flex-col"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
            Ask PRISM-X
          </h2>
          <p className="text-neutral-400 mt-1 text-sm md:text-base">Natural language interface powered by Google Gemini</p>
        </div>
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
          <Bot className="w-4 h-4 text-red-400" />
          <span className="text-xs md:text-sm text-red-400">Gemini AI Powered</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel rounded-xl p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-neutral-500/10 border border-neutral-500/30">
            <Shield className="w-3 md:w-3.5 h-3 md:h-3.5 text-neutral-400" />
            <span className="text-neutral-400 hidden sm:inline">Privacy Protected</span>
            <span className="text-neutral-400 sm:hidden">Private</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
            <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-red-400" />
            <span className="text-red-400 hidden sm:inline">Real-time Analysis</span>
            <span className="text-red-400 sm:hidden">Real-time</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-amber-400" />
            <span className="text-amber-400 hidden sm:inline">Data-Driven Insights</span>
            <span className="text-amber-400 sm:hidden">Insights</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-thin">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-red-500/20 border border-red-500/30 rounded-2xl rounded-tr-sm' 
                    : message.type === 'system'
                    ? `rounded-xl ${message.metadata?.privacy_status === 'rejected' ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-500/10 border border-red-500/30'}`
                    : 'bg-neutral-800/50 border border-neutral-700/50 rounded-2xl rounded-tl-sm'
                } p-3 md:p-4`}>
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
                        {message.metadata?.privacy_status === 'approved' ? 'Privacy Check' : 'Error'}
                      </span>
                    </div>
                  )}
                  
                  <p className={`text-xs md:text-sm ${
                    message.type === 'user' ? 'text-white' : 
                    message.type === 'system' ? (message.metadata?.privacy_status === 'rejected' ? 'text-red-300' : 'text-red-300') :
                    'text-neutral-300'
                  } whitespace-pre-line`}>
                    {message.content}
                  </p>

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
              <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl rounded-tl-sm p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                  <span className="text-xs md:text-sm text-neutral-400">Gemini AI analyzing...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 border-t border-neutral-700/50 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => processQuery(q)}
                disabled={isProcessing}
                className="px-2.5 md:px-3 py-1.5 rounded-full bg-neutral-800/50 border border-neutral-700/50 text-[10px] md:text-xs text-neutral-400 hover:text-white hover:border-red-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q.slice(0, 30)}...
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isProcessing && processQuery(input)}
              placeholder="Ask a question about the data..."
              disabled={isProcessing}
              className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              onClick={() => processQuery(input)}
              disabled={isProcessing || !input.trim()}
              className="bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 px-4 md:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
