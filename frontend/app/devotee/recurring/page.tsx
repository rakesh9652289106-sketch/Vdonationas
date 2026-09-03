'use client';

import React, { useState } from 'react';
import { Repeat, Play, Pause, XCircle, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeRecurringDonationsPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarRecurringSeva')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarRecurringSeva')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Automated Monthly Nitya Annadanam & Sacred Seva Subscriptions
          </p>
        </div>
      </div>

      {/* 3D AUTOPAY CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase border border-emerald-400/40">
              {status} SUBSCRIPTION
            </span>
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mt-2">
              Monthly Nitya Annadanam Seva
            </h3>
            <p className="text-xs text-stone-500 font-medium">Sri Vasavi Kanyaka Parameswari Matha, Penugonda</p>
          </div>
          <span className="font-serif font-bold text-2xl text-devotional-maroon dark:text-amber-400">
            ₹1,016 <span className="text-xs font-sans text-stone-500">/ Month</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-amber-400/30">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">INTERVAL</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">MONTHLY</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">NEXT DEDUCTION</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">01 September 2026</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">PAYMENT METHOD</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> UPI AutoPay Verified
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {status === 'ACTIVE' ? (
            <button
              onClick={() => setStatus('PAUSED')}
              className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-colors"
            >
              <Pause className="w-4 h-4" /> Pause Subscription
            </button>
          ) : (
            <button
              onClick={() => setStatus('ACTIVE')}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:bg-emerald-700 transition-colors"
            >
              <Play className="w-4 h-4" /> Resume Subscription
            </button>
          )}
          <button
            onClick={() => alert('Subscription cancelled.')}
            className="px-5 py-2.5 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <XCircle className="w-4 h-4" /> Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
