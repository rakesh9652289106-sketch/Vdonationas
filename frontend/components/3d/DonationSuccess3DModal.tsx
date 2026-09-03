'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, FileText, Heart, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface DonationSuccess3DModalProps {
  donationData: {
    donationId: string;
    receiptNo: string;
    templeName: string;
    amount: number;
    categoryName: string;
    paymentMethod: string;
    date: string;
  };
  onClose: () => void;
}

export default function DonationSuccess3DModal({
  donationData,
  onClose,
}: DonationSuccess3DModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      {/* 3D Elevated Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-devotional-gold/60 shadow-[0_30px_90px_rgba(224,109,41,0.35)] p-6 sm:p-8 space-y-6 text-center overflow-hidden">
        {/* Ambient Light Rays Background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-tr from-amber-400/20 via-devotional-saffron/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Glowing Temple Diya / Lamp Animation */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-amber-400 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(224,109,41,0.8)] border-2 border-amber-300">
            🪔
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" /> OFFERING CONFIRMED
          </div>
          <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            Your offering has been received.
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            May Lord's divine blessings be upon you and your family.
          </p>
        </div>

        {/* Donation Details Card */}
        <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-2xl border border-amber-200 dark:border-stone-700 text-xs space-y-2 text-left">
          <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-2">
            <span className="text-stone-500 font-medium">Offering Amount</span>
            <span className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
              ₹{donationData.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Temple Shrine</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{donationData.templeName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Seva Purpose</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{donationData.categoryName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Donation ID</span>
            <span className="font-mono text-stone-700 dark:text-stone-300">{donationData.donationId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Receipt No</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{donationData.receiptNo}</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2 text-xs font-bold pt-1">
          <Link
            href="/devotee/receipts"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-devotional-maroon text-amber-300 hover:bg-devotional-maroon-dark transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <FileText className="w-4 h-4" /> VIEW OFFICIAL 80G RECEIPT
          </Link>

          <div className="flex gap-2">
            <Link
              href="/devotee/donations"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
            >
              VIEW MY DONATIONS
            </Link>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-devotional-saffron text-white hover:brightness-110 transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> DONATE AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
