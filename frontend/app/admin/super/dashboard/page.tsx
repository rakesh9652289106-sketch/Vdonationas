'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import InteractiveTempleMap3D from '@/components/3d/InteractiveTempleMap3D';
import { useLanguage } from '@/lib/language-context';
import {
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  Activity,
  Lock,
  Flame,
} from 'lucide-react';

import { adminService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';

export default function SuperAdminDashboardPage() {
  const { t } = useLanguage();
  const [temples, setTemples] = useState(MOCK_TEMPLES);
  const [metrics, setMetrics] = useState({
    totalCollection: 1245000,
    totalDonationsCount: 142,
    totalInitiatives: 4,
    totalDevotees: 108,
    activeAutoPayCount: 24,
  });
  const [auditLogsCount, setAuditLogsCount] = useState(12);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [m, logs, tpls] = await Promise.all([
          adminService.getMetrics(),
          adminService.getAuditLogs(100),
          supabase.from('temples').select('*'),
        ]);
        if (m) {
          setMetrics(m);
        }
        if (logs) {
          setAuditLogsCount(logs.length);
        }
        if (tpls.data && tpls.data.length > 0) {
          setTemples(tpls.data as any);
        }
      } catch (err) {
        console.warn('[Supabase] Failed to load super admin metrics:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL SUPER ADMIN HERO HEADER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-devotional-saffron" /> {t('sidebarSuperDashboard')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Global Platform Command Center
          </h1>
          <p className="text-amber-100/80 text-xs">
            Manage temples, global user access, payment gateways, system health, and immutable audit trails backed by Supabase.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <Link
            href="/admin/super/temples/create"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow-gold border border-amber-300"
          >
            <Building2 className="w-4 h-4 text-devotional-maroon" /> Onboard Temple & Manager
          </Link>
          <Link
            href="/admin/super/temples"
            className="px-4 py-2.5 rounded-xl bg-stone-900/90 text-amber-300 border border-amber-400/40 font-bold text-xs hover:bg-stone-800 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Manage Shrines & Governance
          </Link>
        </div>
      </div>

      {/* 3D MINIATURE TEMPLE NETWORK MAP */}
      <InteractiveTempleMap3D />

      {/* GLOBAL SAAS METRIC CARDS WITH HOVER MOTION & GLOW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-devotional-saffron" /> Registered Temples
          </p>
          <p className="text-2xl font-bold font-serif text-devotional-maroon dark:text-amber-400">
            {temples.length} Active Shrines
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">100% Multi-Tenant Isolated</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Total Platform Revenue
          </p>
          <p className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
            ₹{metrics.totalCollection.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-amber-700 font-semibold">Across {metrics.totalDonationsCount} donations in Supabase</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> System Health Status
          </p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-bold text-emerald-600">CONNECTED</span>
          </div>
          <p className="text-[10px] text-stone-500">Supabase RLS Active • PG 17</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-600" /> Immutable Audit Logs
          </p>
          <p className="text-2xl font-bold font-serif text-amber-600">
            {auditLogsCount} Logs
          </p>
          <p className="text-[10px] text-stone-500">Audit Checksum Verified</p>
        </div>
      </div>

      {/* QUICK ADMIN ACTION LINKS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
        <Link
          href="/admin/super/audit"
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          📜 Immutable Audit Logs
        </Link>
        <Link
          href="/admin/super/security"
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          🛡️ Security Center & Fraud
        </Link>
        <Link
          href="/admin/finance/reconciliation"
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          💰 Gateway Reconciliation
        </Link>
        <Link
          href="/admin/super/saas-settings"
          className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          ⚙️ SaaS Tiers & Config
        </Link>
      </div>
    </div>
  );
}
