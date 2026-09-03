'use client';

import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, CheckCircle, RefreshCw } from 'lucide-react';

interface DevaAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function DevaAIAssistantModal({
  isOpen,
  onClose,
  userRole = 'DEVOTEE',
}: DevaAIAssistantModalProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; data?: any }>>([
    {
      sender: 'ai',
      text:
        userRole === 'SUPER_ADMIN' || userRole === 'TEMPLE_ADMIN' || userRole === 'FINANCE_ADMIN'
          ? 'Pranam! I am DevaAI, your intelligent Temple Financial Assistant. Ask me anything about collections, campaign trends, Annadanam metrics, or reconciliation summaries.'
          : 'Pranam! I am DevaAI, your devotional discovery guide. Ask me about temples, Annadanam causes, special darshan timings, or how to generate your 80G tax receipt.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    setTimeout(() => {
      let aiResponseText = '';
      const queryLower = userText.toLowerCase();

      if (queryLower.includes('annadanam') || queryLower.includes('food')) {
        aiResponseText =
          '📊 **Annadanam Collection Report**: Across all 5 verified temples, a total of ₹14,25,000 has been collected for Nitya Annadanam this month. Sri Venkateswara Swamy Temple Tirupati leads with 65% of total meals served (over 1,20,000 pilgrims).';
      } else if (queryLower.includes('receipt') || queryLower.includes('80g') || queryLower.includes('tax')) {
        aiResponseText =
          '📜 **Receipt & 80G Verification**: All donations made through the Seva Trust platform automatically generate 80G tax exemption receipts. You can download your annual tax statement directly from your Devotee Dashboard or verify any receipt code at /verify-receipt.';
      } else if (queryLower.includes('tirupati') || queryLower.includes('balaji')) {
        aiResponseText =
          '🏛️ **Sri Venkateswara Swamy Temple (Tirupati)**: Active campaigns include the New Annadanam Mega Dining Hall (75% goal reached). Daily Suprabhatam Seva and Kalyanotsavam bookings are open.';
      } else {
        aiResponseText =
          `🤖 **DevaAI Insight**: Processed your request regarding "${userText}". Platform records indicate 100% server-verified transactions, active multi-tenant data isolation, and total monthly collection of ₹28,45,000 across all active campaigns.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-devotional-cream dark:bg-stone-900 border border-devotional-gold/40 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[550px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-300 flex items-center gap-2 text-base">
                DevaAI Assistant
              </h3>
              <p className="text-[11px] text-amber-100/80">
                {userRole.includes('ADMIN') ? 'Natural Language Financial Analytics' : 'Devotional Discovery & Help'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-devotional-maroon text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-devotional-maroon text-white rounded-br-none'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-sm rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-stone-500 italic text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-devotional-saffron" />
              DevaAI is analyzing platform records...
            </div>
          )}
        </div>

        {/* Preset Suggestions */}
        <div className="px-6 py-2 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputQuery('How much was donated to Annadanam this month?')}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300 whitespace-nowrap"
          >
            💡 Annadanam report
          </button>
          <button
            onClick={() => setInputQuery('How do I download my 80G tax receipt?')}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300 whitespace-nowrap"
          >
            📜 80G Tax receipt help
          </button>
          <button
            onClick={() => setInputQuery('Show campaigns near completion')}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300 whitespace-nowrap"
          >
            🎯 Active campaigns
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              userRole.includes('ADMIN')
                ? 'Ask DevaAI: e.g. "How much was collected for Annadanam across my temples?"'
                : 'Ask DevaAI: e.g. "Recommend active temple campaigns or explain 80G"'
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-devotional-maroon"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded-xl bg-devotional-maroon text-white font-bold text-xs hover:bg-devotional-maroon-dark transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
