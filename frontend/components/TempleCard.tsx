import React from 'react';
import Link from 'next/link';
import { Temple } from '@/lib/types';
import { ShieldCheck, Heart, MapPin, Building2, Sparkles } from 'lucide-react';

interface TempleCardProps {
  temple: Temple;
}

export default function TempleCard({ temple }: TempleCardProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-devotional hover:shadow-2xl transition-all duration-300 flex flex-col group">
      {/* Temple Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          src={temple.bannerUrl}
          alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Verification Status */}
        <div className="absolute top-3 left-3 bg-emerald-900/90 text-emerald-200 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-emerald-500/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          VERIFIED TEMPLE
        </div>

        {/* Code Badge */}
        <div className="absolute top-3 right-3 bg-stone-900/80 text-amber-300 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono">
          {temple.code}
        </div>

        {/* Deity overlay at bottom */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-xs text-amber-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {temple.deity}
          </p>
          <h3 className="font-serif font-bold text-lg leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
            {temple.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs mb-2">
            <MapPin className="w-3.5 h-3.5 text-devotional-saffron" />
            <span>
              {temple.city}, {temple.state}
            </span>
          </div>

          <p className="text-stone-600 dark:text-stone-300 text-xs line-clamp-2 leading-relaxed">
            {temple.description}
          </p>
        </div>

        {/* Trust info & Actions */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center justify-between">
            <span>{temple.trustName}</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">80G Eligible</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/temples/${temple.id}`}
              className="w-full py-2.5 rounded-xl border border-devotional-maroon text-devotional-maroon dark:text-amber-400 font-bold text-xs text-center hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
            >
              View Shrine
            </Link>
            <Link
              href={`/donate?templeId=${temple.id}`}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1 hover:brightness-110 shadow-gold transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
