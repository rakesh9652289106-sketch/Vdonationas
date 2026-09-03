'use client';

import React from 'react';
import { Users, Heart, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeFamilyDedicationsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarFamilyOccasions')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarFamilyOccasions')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Dedicated Sankalpam Prayers & Blessings for Parents, Birthdays, Anniversaries & Memorials
          </p>
        </div>
      </div>

      {/* 3D FAMILY DEDICATION CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-4 hover:border-amber-400 transition-all hover:-translate-y-1 transform">
        <div className="flex justify-between items-start text-xs">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 text-[10px] font-bold uppercase border border-amber-300">
              BIRTHDAY SANKALPAM DEDICATION
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-2">
              Dedication for My Parents (Sri Krishnamurthy & Smt. Lakshmi)
            </h3>
            <p className="text-stone-600 dark:text-stone-300 italic mt-1 bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
              "Praying for good health, peace, longevity, and divine blessings at Sri Vasavi Matha Shrine, Penugonda."
            </p>
          </div>
          <span className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">₹2,501</span>
        </div>
      </div>
    </div>
  );
}
