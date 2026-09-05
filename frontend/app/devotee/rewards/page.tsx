'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Heart,
  Share2,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
  Star,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export default function DevoteeRewardsPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Devotee Reward Metrics
  const currentTier = 'Gold Seva Patron';
  const totalDonated = 35000;
  const nextTier = 'Diamond Seva Patron';
  const nextTierTarget = 50000;
  const progressPercent = Math.min(100, Math.round((totalDonated / nextTierTarget) * 100));
  const remaining = nextTierTarget - totalDonated;

  const badges: Badge[] = [
    {
      id: 'first_seva',
      title: 'First Seva',
      description: 'Offered your very first digital seva at Sri Vasavi Matha',
      icon: '🌟',
      unlocked: true,
      date: '12 Jan 2026',
    },
    {
      id: 'annadanam_108',
      title: '108 Annadanam',
      description: 'Sponsored over 108 sacred Annadanam meals for devotees',
      icon: '🪔',
      unlocked: true,
      date: '04 Mar 2026',
    },
    {
      id: 'autopay_sustainer',
      title: 'AutoPay Sustainer',
      description: 'Maintained continuous monthly Nitya Seva AutoPay for 6+ months',
      icon: '🔄',
      unlocked: true,
      date: '15 Aug 2026',
    },
    {
      id: 'matha_pilgrim',
      title: 'Matha Pilgrim',
      description: 'Supported and visited 5 or more registered Vasavi Matha shrines',
      icon: '🛕',
      unlocked: false,
    },
    {
      id: 'mahadana_patron',
      title: 'Mahadana Patron',
      description: 'Conferred for contributing over ₹1,00,000 to temple sanctum',
      icon: '👑',
      unlocked: false,
    },
  ];

  const handleShare = () => {
    const shareText = `Proud to be recognized as a ${currentTier} at Sri Vasavi Kanyaka Parameswari Matha, Penugonda! Blessed to offer continuous seva 🙏`;
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: 'Sri Vasavi Matha Seva Patron',
          text: shareText,
          url: window.location.origin,
        }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans px-3 sm:px-0">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-devotional-gold/40 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> Sacred Recognition
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Devotee Rewards & Honors
          </h1>
          <p className="text-amber-100/80 text-xs">
            Celebrating your blessed devotion, continuous seva, and sacred contributions
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Share2 className="w-4 h-4 text-devotional-maroon" />
          {copied ? 'Copied' : 'Share'}
        </button>
      </div>

      {/* DEVOTEE STATUS CARD WITH 3D MEDAL */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-100/30 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/20 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/50 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* 3D Medal Representation */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-1 shadow-2xl shrink-0 flex items-center justify-center border-2 border-amber-200">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex flex-col items-center justify-center text-white shadow-inner">
              <span className="text-3xl filter drop-shadow">🥇</span>
              <span className="text-[9px] font-serif font-black tracking-widest uppercase text-stone-900 mt-0.5">
                GOLD
              </span>
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-devotional-maroon dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-300/60">
              <Sparkles className="w-3 h-3 text-amber-500" /> Devotee Rank
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Radha Krishna
            </h2>
            <p className="text-sm font-serif font-bold text-devotional-maroon dark:text-amber-400">
              {currentTier}
            </p>
            <p className="text-xs text-stone-500">
              Total Seva Contribution:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-serif text-sm">
                ₹{totalDonated.toLocaleString('en-IN')}
              </strong>
            </p>
          </div>

          <Link
            href="/donate"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all shrink-0"
          >
            Donate
          </Link>
        </div>

        {/* TIER PROGRESSION BAR */}
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-stone-600 dark:text-stone-400">
              Next Tier: <strong className="text-devotional-maroon dark:text-amber-400">{nextTier}</strong>
            </span>
            <span className="text-stone-500">
              ₹{remaining.toLocaleString('en-IN')} more to reach {nextTier}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>₹{totalDonated.toLocaleString('en-IN')} (Current)</span>
            <span>₹{nextTierTarget.toLocaleString('en-IN')} (Target)</span>
          </div>
        </div>
      </div>

      {/* 3D BADGES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
            Earned Devotional Badges
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-white dark:bg-stone-900 border-devotional-gold/40 shadow-sm hover:border-amber-400'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                    badge.unlocked
                      ? 'bg-amber-100 dark:bg-amber-950/80 border border-amber-300'
                      : 'bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {badge.title}
                    </h4>
                    {badge.unlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                  {badge.unlocked && badge.date && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-medium pt-1">
                      Conferred {badge.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
