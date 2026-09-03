'use client';

import React from 'react';
import { ShoppingBag, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteePrasadamPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarPrasadamOrders')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarPrasadamOrders')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Penugonda Sri Vasavi Matha Sacred Mahaprasadam Counter Tokens & Home Delivery
          </p>
        </div>
      </div>

      {/* 3D PRASADAM CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-4 hover:border-amber-400 transition-all hover:-translate-y-1 transform">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase border border-emerald-400/40">
              READY FOR PICKUP AT COUNTER #1
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-2">
              Sri Vasavi Matha Prasadam Box (2 Tokens)
            </h3>
            <p className="text-stone-500 font-mono text-[11px] mt-1">Order Token: PRASAD-2026-991</p>
          </div>
          <span className="font-serif font-bold text-2xl text-devotional-maroon dark:text-amber-400">₹200</span>
        </div>
      </div>
    </div>
  );
}
