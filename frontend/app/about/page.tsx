'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Building2, Flame, Sparkles, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4A101D] via-[#380B15] to-[#20050C] text-white p-6 sm:p-8 shadow-lg border border-amber-500/30 space-y-3">
        <Link
          href="/devotee/settings"
          className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-medium active-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
          <Building2 className="w-3.5 h-3.5" /> Sacred Heritage &amp; Trust
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Sri Vasavi Kanyaka Parameswari Matha, Penugonda
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Official Digital Seva, Annadanam, and Temple Heritage Platform for devotees worldwide.
        </p>
      </div>

      {/* Mission & Heritage */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
          <Flame className="w-4 h-4 text-devotional-saffron" />
          Sacred Mission &amp; Purpose
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          The Sri Vasavi Kanyaka Parameswari Matha platform is dedicated to connecting devotees globally to the sacred Janmabhoomi of Goddess Vasavi Matha at Penugonda, West Godavari District, Andhra Pradesh. Our mission is to facilitate authentic Vedic worship, daily Nitya Annadanam, temple renovation, cultural preservation, and educational scholarships with 100% transparency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">100% 80G Compliant</h3>
            <p className="text-[11px] text-stone-500">Every donation generates an authentic digital 80G tax exemption receipt instantly.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">Nitya Annadanam</h3>
            <p className="text-[11px] text-stone-500">Sponsoring thousands of free, wholesome meals for visiting pilgrims daily.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">Live Virtual Darshan</h3>
            <p className="text-[11px] text-stone-500">3D Sanctum view, sacred aarti thali, and direct e-Hundi offerings from anywhere in the world.</p>
          </div>
        </div>
      </div>

      {/* Governance & Compliance */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
          Trust &amp; Administration
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Managed by the official Sri Vasavi Kanyaka Parameswari Temple Trust. All financial collections, recurring UPI mandates, and seva schedules are recorded immutably with digital verification codes.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/devotee/support"
            className="px-4 py-2 rounded-xl bg-devotional-maroon text-white text-xs font-bold active-press shadow-xs"
          >
            Contact Helpdesk
          </Link>
          <Link
            href="/verify-receipt"
            className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold active-press"
          >
            Verify Official Receipt
          </Link>
        </div>
      </div>
    </div>
  );
}
