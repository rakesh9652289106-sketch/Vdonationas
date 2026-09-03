'use client';

import React from 'react';
import { MedalTier } from '@/lib/medals';
import { X, ShieldCheck, CheckCircle2, Heart, Building2, Calendar, FileText } from 'lucide-react';

interface MedalDetailModalProps {
  tier: MedalTier;
  isUnlocked: boolean;
  userTotalDonated: number;
  donationCount: number;
  templesCount: number;
  onClose: () => void;
}

export default function MedalDetailModal({
  tier,
  isUnlocked,
  userTotalDonated,
  donationCount,
  templesCount,
  onClose,
}: MedalDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      {/* 3D Elevated Glass Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-devotional-gold/60 shadow-[0_30px_90px_rgba(212,175,55,0.4)] p-6 sm:p-8 space-y-6 text-center overflow-hidden">
        {/* Background Glowing Halo */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: tier.color }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large 3D Medal Image Display */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-tr ${tier.gradient} p-2 shadow-2xl flex items-center justify-center border-4 ${tier.metallicBorder}`}
          >
            <div className="w-28 h-28 rounded-full bg-stone-900 flex flex-col items-center justify-center p-2 shadow-inner border border-amber-300/40">
              <span className="text-5xl select-none">{tier.badge}</span>
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-amber-200 mt-1">
                {tier.engravedText}
              </span>
            </div>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
              {tier.name}
            </span>
            {isUnlocked && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
            {tier.description}
          </p>
        </div>

        {/* Detail Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs text-left">
          <div className="bg-amber-50/80 dark:bg-stone-900 p-3.5 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <Heart className="w-3 h-3 text-devotional-saffron" /> Minimum Required
            </span>
            <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              ₹{tier.minAmount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-stone-900 p-3.5 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Current Lifetime Seva
            </span>
            <p className="font-serif font-bold text-base text-emerald-700 dark:text-amber-400">
              ₹{userTotalDonated.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-stone-900 p-3.5 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <FileText className="w-3 h-3 text-amber-600" /> Successful Offerings
            </span>
            <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              {donationCount} Transactions
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-stone-900 p-3.5 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-stone-500 text-[10px] uppercase font-bold flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-500" /> Shrines Supported
            </span>
            <p className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              {templesCount} Temples
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-devotional-maroon text-amber-300 font-bold text-xs hover:bg-devotional-maroon-dark transition-colors shadow-md"
          >
            CLOSE ACHIEVEMENT DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}
