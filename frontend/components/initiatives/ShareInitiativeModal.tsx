'use client';

import React, { useState } from 'react';
import { Initiative } from '@/lib/initiatives-data';
import { X, Share2, Copy, Check, MessageSquare, Mail, Send } from 'lucide-react';

interface ShareInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: Initiative;
}

export default function ShareInitiativeModal({
  isOpen,
  onClose,
  initiative,
}: ShareInitiativeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/initiatives/${initiative.code}`
    : `https://vasavimatha.org/initiatives/${initiative.code}`;

  const shareTitle = `Support ${initiative.title}`;
  const shareMessage = `🙏 Jai Vasavi Matha! Please support this sacred cause: "${initiative.title}" (${initiative.code}) by Sri Vasavi Kanyaka Parameswari Matha Trust. Target: ₹${initiative.target_amount.toLocaleString('en-IN')}. Every contribution is 100% tax-exempt under Section 80G. Donate here: ${currentUrl}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    const url = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = url;
  };

  const handleEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareMessage)}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-devotional-gold/40 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-devotional-gold text-white flex items-center justify-center mx-auto shadow-gold">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-300">
            Share Sacred Initiative
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Spread the divine word and invite fellow devotees to earn punya.
          </p>
        </div>

        {/* Initiative Brief Card */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-devotional-gold/30 text-xs">
          <span className="font-mono text-[10px] text-devotional-saffron font-bold block">{initiative.code}</span>
          <p className="font-bold text-stone-900 dark:text-stone-100 line-clamp-1">{initiative.title}</p>
          <p className="text-[11px] text-stone-500 mt-0.5">{initiative.city}, {initiative.state}</p>
        </div>

        {/* Share Channel Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" /> WhatsApp
          </button>

          {/* SMS */}
          <button
            type="button"
            onClick={handleSMS}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4" /> SMS
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <Mail className="w-4 h-4" /> Email
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-devotional-gold to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-600 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
