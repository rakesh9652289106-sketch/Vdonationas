'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, ArrowLeft, Heart } from 'lucide-react';

export default function FestivalsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-400 flex items-center justify-center mx-auto text-devotional-saffron shadow-[0_0_25px_rgba(212,175,55,0.3)]">
        <Calendar className="w-8 h-8 text-devotional-saffron" />
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 text-xs font-serif font-bold uppercase tracking-wider border border-amber-300">
          ✦ Temple Calendar Notice ✦
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-amber-300">
          Festival Calendar Updating Soon
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
          The auspicious temple festival dates, celestial Kalyanam schedules, and Brahmotsavam seva rosters are currently being updated by the Penugonda Devasthanam administration.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-serif font-bold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
        </Link>
        <Link
          href="/donate"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white text-xs font-serif font-bold flex items-center gap-1.5 shadow-gold hover:brightness-110 transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-current" /> Explore Digital Sevas
        </Link>
      </div>
    </div>
  );
}
