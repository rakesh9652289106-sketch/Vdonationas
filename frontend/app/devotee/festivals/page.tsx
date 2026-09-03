'use client';

import React from 'react';
import { MOCK_FESTIVALS } from '@/lib/mock-data';
import { Calendar, Sparkles, Flame } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeFestivalsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarUpcomingFestivals')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarUpcomingFestivals')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Penugonda Sri Vasavi Matha Brahmotsavam & Festival Seva Sponsorships
          </p>
        </div>
      </div>

      {/* 3D FESTIVAL CARDS GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FESTIVALS.map((f) => (
          <div
            key={f.id}
            className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 text-[10px] font-bold border border-amber-400/40">
                  {f.startDate} - {f.endDate}
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mt-2">{f.name}</h3>
                <p className="text-xs text-stone-500 font-semibold">Penugonda Matha Devasthanam Festival</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{f.description}</p>
            <div className="pt-2">
              <Link
                href={`/donate?purpose=${encodeURIComponent(f.name)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs rounded-xl shadow-gold hover:brightness-110 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Sponsor Festival Seva
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
