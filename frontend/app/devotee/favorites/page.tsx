'use client';

import React from 'react';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import TempleCard3D from '@/components/3d/TempleCard3D';
import { Bookmark, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeFavoriteTemplesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarFavoriteShrines')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarFavoriteShrines')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Bookmarked Sacred Shrines with Instant Festival & Seva Campaign Reminders
          </p>
        </div>
      </div>

      {/* 3D TEMPLE CARDS GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TEMPLES.slice(0, 1).map((t) => (
          <TempleCard3D key={t.id} temple={t} />
        ))}
      </div>
    </div>
  );
}
