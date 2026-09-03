'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_TEMPLES, MOCK_DONATIONS } from '@/lib/mock-data';
import { useLanguage } from '@/lib/language-context';
import {
  Building2,
  QrCode,
  Zap,
  Flame,
  Award,
  TrendingUp,
  Users,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function TempleAdminDashboardPage() {
  const { t } = useLanguage();
  const activeTemple = MOCK_TEMPLES[0];
  const [autoScaleSlots, setAutoScaleSlots] = useState(true);

  const salesData = [
    { day: 'Mon', total: 12000 },
    { day: 'Tue', total: 18500 },
    { day: 'Wed', total: 14200 },
    { day: 'Thu', total: 22000 },
    { day: 'Fri', total: 29000 },
    { day: 'Sat', total: 45000 },
    { day: 'Sun', total: 58000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL TEMPLE ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Building2 className="w-3.5 h-3.5 text-devotional-saffron" /> {t('navAdminDashboard')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('templeName')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            {t('templeLocation')} • Multi-Tenant Protected Devasthanam Portal
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <Link
            href="/admin/temple/qr-display"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-gold"
          >
            <QrCode className="w-4 h-4 text-amber-300" /> Full-Screen Counter QR Mode
          </Link>
        </div>
      </div>

      {/* FESTIVAL HIGH-DEMAND SEVA AUTO-SCALER WIDGET */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-devotional-gold/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-devotional-saffron flex items-center justify-center font-bold text-base shrink-0 border border-amber-300">
            <Zap className="w-6 h-6 animate-bounce text-devotional-saffron" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
              FESTIVAL RUSH AUTO-SCALING ENGINE
            </span>
            <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base mt-0.5">
              Annual Brahmotsavam Seva Queue Auto-Allocation
            </p>
            <p className="text-stone-500">
              Automatically increases Darshan & Suprabhatam slot booking capacity during peak crowd hours.
            </p>
          </div>
        </div>

        <button
          onClick={() => setAutoScaleSlots(!autoScaleSlots)}
          className={`px-5 py-3 font-bold rounded-2xl text-xs transition-all shrink-0 shadow-md ${
            autoScaleSlots
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          {autoScaleSlots ? '✓ AUTO-SCALING ACTIVE' : 'MANUAL SLOTS'}
        </button>
      </div>

      {/* ADMIN 3D STAT CARDS WITH HOVER MOTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron" /> Today's Collections
          </p>
          <p className="text-2xl font-bold font-serif text-devotional-maroon dark:text-amber-400">
            ₹58,400
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% vs yesterday</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> This Month Total
          </p>
          <p className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
            ₹14,25,000
          </p>
          <p className="text-[10px] text-amber-700 font-semibold">1,420 Devotees</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-emerald-500" /> Active QR Counters
          </p>
          <p className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
            4 Counters
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Verified destinations</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-devotional-saffron" /> Active Campaigns
          </p>
          <p className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
            2 Active
          </p>
          <p className="text-[10px] text-stone-500">Annadanam & Gopuram</p>
        </div>
      </div>

      {/* RECHART COLLECTIONS */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-amber-400 transition-all">
        <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-devotional-saffron" /> Daily Seva Collection Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="day" stroke="#A8A29E" fontSize={11} />
              <YAxis stroke="#A8A29E" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collection']}
                contentStyle={{ backgroundColor: '#1C1917', borderColor: '#D4AF37', color: '#FFF', borderRadius: '12px' }}
              />
              <Bar dataKey="total" fill="#E06D29" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
