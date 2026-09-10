'use client';

import React from 'react';
import { Calendar, Sparkles, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeFestivalsPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6 text-center font-sans">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-400 flex items-center justify-center mx-auto text-devotional-saffron shadow-[0_0_25px_rgba(212,175,55,0.3)]">
        <Calendar className="w-8 h-8 text-devotional-saffron" />
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 text-xs font-serif font-bold uppercase tracking-wider border border-amber-300">
          ✦ Sacred Temple Calendar ✦
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-amber-300">
          Upcoming Festivals Updating Soon
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          The auspicious temple festival dates, Brahmotsavam schedules, and celestial vahanam procession bookings are currently being refreshed by Penugonda Devasthanam.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/devotee/dashboard"
          className="px-6 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-serif font-bold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Devotee Home
        </Link>
        <Link
          href="/devotee/poojas"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white text-xs font-serif font-bold flex items-center gap-1.5 shadow-gold hover:brightness-110 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Book Daily Poojas & Sevas
        </Link>
      </div>
    </div>
  );
}
