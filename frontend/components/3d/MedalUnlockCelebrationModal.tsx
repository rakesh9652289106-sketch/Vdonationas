'use client';

import React from 'react';
import { MedalTier } from '@/lib/medals';
import { Sparkles, Trophy, CheckCircle2, X } from 'lucide-react';

interface MedalUnlockCelebrationModalProps {
  unlockedTier: MedalTier;
  onClose: () => void;
}

export default function MedalUnlockCelebrationModal({
  unlockedTier,
  onClose,
}: MedalUnlockCelebrationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-devotional-gold/60 shadow-[0_30px_90px_rgba(212,175,55,0.5)] p-6 sm:p-8 space-y-6 text-center overflow-hidden">
        {/* Background Glowing Rays */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-tr from-amber-400/25 via-devotional-saffron/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider shadow-sm">
          <Trophy className="w-4 h-4 text-devotional-saffron animate-bounce" /> ACHIEVEMENT UNLOCKED!
        </div>

        {/* 3D Medal Coin Display */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
          <div
            className={`relative w-28 h-28 rounded-full bg-gradient-to-tr ${unlockedTier.gradient} p-2 shadow-2xl flex items-center justify-center border-4 ${unlockedTier.metallicBorder}`}
          >
            <div className="w-24 h-24 rounded-full bg-stone-900 flex flex-col items-center justify-center p-2 shadow-inner border border-amber-300/40">
              <span className="text-4xl select-none">{unlockedTier.badge}</span>
              <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-amber-200 mt-1">
                {unlockedTier.engravedText}
              </span>
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            {unlockedTier.name}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            Your cumulative Seva offerings have reached ₹
            {unlockedTier.minAmount.toLocaleString('en-IN')}. Thank you for your devotional service!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> VIEW MY SEVA ACHIEVEMENTS
          </button>
        </div>
      </div>
    </div>
  );
}
