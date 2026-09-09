'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import {
  getDevoteeAIResponse,
  DEVOTEE_DEFAULT_SUGGESTIONS,
  DevaAIActionLink,
} from '@/lib/deva-ai-service';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  category?: 'DEVOTEE_KNOWLEDGE' | 'ADMIN_RESTRICTED' | 'DEVOTEE_GUIDANCE';
  actionLinks?: DevaAIActionLink[];
  suggestedQuestions?: string[];
}

interface DevaAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string; // Kept for backwards-compatibility; DevaAI operates strictly for devotee purposes
}

const INITIAL_DEVOTEE_MESSAGE: Message = {
  sender: 'ai',
  text: `🙏 **Namaste Devotee! I am DevaAI**, your personal spiritual guide and seva assistant for **Sri Vasavi Kanyaka Parameswari Matha, Penugonda**.

I am here to assist you exclusively with devotee services:
• **Pooja & Seva Bookings** (Archana, Kumkumarchana, Abhishekam, Navaratri Utsavam)
• **Sankalpam Guidance** (Gotram, Nakshatram, Rashi & family profiles)
• **80G Tax Exemption Receipts** (Instant 10BE compliant receipts & annual statements)
• **Sacred Initiatives** (Nitya Annadanam, Goshala Cow Care, Veda Pathashala)
• **Temple Darshan & Timings** (Sanctum hours, Mangala Harathi, pilgrim accommodation)
• **Devotee Portal Guidance** (UPI Autopay, past donations, digital certificates)

How may I assist your spiritual seva today?`,
  category: 'DEVOTEE_GUIDANCE',
  suggestedQuestions: DEVOTEE_DEFAULT_SUGGESTIONS,
  actionLinks: [
    { label: 'Book a Pooja', href: '/devotee/poojas' },
    { label: 'Explore Initiatives', href: '/initiatives' },
    { label: 'Download 80G Receipts', href: '/devotee/dashboard' },
  ],
};

export default function DevaAIAssistantModal({
  isOpen,
  onClose,
}: DevaAIAssistantModalProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_DEVOTEE_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSendText = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setIsLoading(true);

    setTimeout(() => {
      const response = getDevoteeAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.text,
          category: response.category,
          actionLinks: response.actionLinks,
          suggestedQuestions: response.suggestedQuestions,
        },
      ]);
      setIsLoading(false);
    }, 550);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_DEVOTEE_MESSAGE]);
    setInputQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-devotional-cream dark:bg-stone-900 border border-devotional-gold/40 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-900 text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-300 text-sm sm:text-base">
                  Ask DevaAI
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  Devotee Guide
                </span>
              </div>
              <p className="text-[11px] text-amber-100/75 line-clamp-1">
                Spiritual Seva & Devotee Portal Assistant • Penugonda Kshetram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="Restart Conversation"
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close DevaAI"
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg, idx) => {
            const isRestricted = msg.category === 'ADMIN_RESTRICTED';

            return (
              <div
                key={idx}
                className={`flex gap-2.5 sm:gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                      isRestricted
                        ? 'bg-amber-700 text-amber-200 border border-amber-500/40'
                        : 'bg-devotional-maroon text-amber-300 border border-devotional-gold/30'
                    }`}
                  >
                    {isRestricted ? (
                      <ShieldAlert className="w-4 h-4 text-amber-200" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white rounded-br-none shadow-md'
                      : isRestricted
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 border border-amber-300 dark:border-amber-800 shadow-sm rounded-bl-none'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs sm:text-[13px]">
                    {msg.text}
                  </p>

                  {/* Action Links if available */}
                  {msg.actionLinks && msg.actionLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200/80 dark:border-stone-700/80 flex flex-wrap gap-2">
                      {msg.actionLinks.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          href={link.href}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-devotional-maroon dark:text-amber-300 font-semibold text-[11px] border border-amber-400/30 transition-all hover:scale-105 active-press"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 text-devotional-maroon dark:text-amber-300" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 w-full font-medium">
                        Suggested questions:
                      </span>
                      {msg.suggestedQuestions.slice(0, 3).map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendText(sug)}
                          className="text-[11px] text-left px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-700/60 hover:bg-devotional-gold/20 text-stone-700 dark:text-stone-200 hover:text-devotional-maroon dark:hover:text-amber-300 transition-colors border border-stone-200 dark:border-stone-600"
                        >
                          • {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 italic text-xs py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-devotional-saffron" />
              <span>DevaAI is consulting sacred temple seva records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Quick Suggestion Pills */}
        <div className="px-4 sm:px-6 py-2 bg-stone-100/90 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 shrink-0 self-center tracking-wider mr-1">
            Devotee Quick Seva:
          </span>
          {DEVOTEE_DEFAULT_SUGGESTIONS.map((sug, sIdx) => (
            <button
              key={sIdx}
              onClick={() => handleSendText(sug)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-devotional-saffron hover:bg-amber-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-2.5 h-2.5 text-devotional-saffron" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText(inputQuery)}
            placeholder="Ask DevaAI about poojas, 80G tax receipts, Annadanam, or darshan timings..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-devotional-maroon dark:focus:ring-amber-500"
          />
          <button
            onClick={() => handleSendText(inputQuery)}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-devotional-maroon text-white font-bold text-xs sm:text-sm hover:bg-devotional-maroon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-md active-press"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>

      </div>
    </div>
  );
}
