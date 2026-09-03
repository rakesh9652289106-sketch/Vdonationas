'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_FESTIVALS } from '@/lib/mock-data';
import { Calendar, Sparkles, Heart } from 'lucide-react';

export default function FestivalsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
          <Calendar className="w-4 h-4 text-devotional-saffron" /> FESTIVAL CALENDAR & SEVAS
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 tracking-tight">
          Upcoming Temple Festivals & Kalyanam Events
        </h1>
        <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
          Book special darshan, sponsor Brahmotsavam vahanam processions, and participate in celestial marriages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FESTIVALS.map((fest) => (
          <div
            key={fest.id}
            className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md p-6 flex flex-col sm:flex-row gap-6"
          >
            <img src={fest.imageUrl} alt={fest.name} className="w-full sm:w-40 h-40 object-cover rounded-2xl" />
            <div className="flex-1 space-y-3 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  LIVE FESTIVAL
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">
                  {fest.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">{fest.description}</p>
                <p className="text-xs text-amber-700 font-bold mt-2">
                  Dates: {fest.startDate} to {fest.endDate}
                </p>
              </div>

              <Link
                href={`/donate?purpose=${encodeURIComponent(fest.name)}`}
                className="w-full py-2.5 bg-devotional-maroon text-white font-bold text-xs rounded-xl text-center hover:bg-devotional-maroon-dark transition-colors"
              >
                Sponsor Festival Seva
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
