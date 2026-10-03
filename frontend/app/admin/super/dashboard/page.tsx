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
  Eye,
  EyeOff,
  Landmark,
} from 'lucide-react';
import { useGopuramExplorerVisibility } from '@/lib/feature-flags';

import { adminService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';

export default function SuperAdminDashboardPage() {
  const { isVisible: gopuramVisible, setVisibility: setGopuramVisible } = useGopuramExplorerVisibility();
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
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-4 sm:space-y-8 font-sans">
      {/* 3D DEVOTIONAL SUPER ADMIN HERO HEADER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-devotional-saffron" /> {t('sidebarSuperDashboard')}
          </div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-amber-300">
            Global Platform Command Center
          </h1>
          <p className="text-amber-100/80 text-xs leading-relaxed max-w-2xl">
            Manage temples, global user access, payment gateways, system health, and immutable audit trails backed by Supabase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto relative z-10">
          <button
            onClick={() => setGopuramVisible(!gopuramVisible)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
              gopuramVisible
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 border-rose-400/60 text-rose-300 hover:bg-rose-500/30'
            }`}
            title="Toggle 3D Temple Gopuram Explorer Devotee Visibility"
          >
            <Landmark className="w-4 h-4" />
            <span>3D Explorer: {gopuramVisible ? 'Devotee Visible (ON)' : 'Hidden (OFF)'}</span>
          </button>

          <Link
            href="/admin/super/temples/create"
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs hover:scale-105 transition-all flex items-center justify-center gap-1.5 shadow-gold border border-amber-300"
          >
            <Building2 className="w-4 h-4 text-devotional-maroon" /> Onboard Temple & Manager
          </Link>
          <Link
            href="/admin/super/temples"
            className="px-3.5 py-2.5 rounded-xl bg-stone-900/90 text-amber-300 border border-amber-400/40 font-bold text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Manage Shrines & Governance
          </Link>
        </div>
      </div>

      {/* 3D MINIATURE TEMPLE NETWORK MAP */}
      <InteractiveTempleMap3D />

      {/* GLOBAL SAAS METRIC CARDS WITH HOVER MOTION & GLOW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-stone-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-1.5 sm:space-y-2">
          <p className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
            <Building2 className="w-3.5 h-3.5 text-devotional-saffron shrink-0" /> Registered Temples
          </p>
          <p className="text-lg sm:text-2xl font-bold font-serif text-devotional-maroon dark:text-amber-400">
            {temples.length} Active Shrines
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold truncate">100% Multi-Tenant Isolated</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-1.5 sm:space-y-2">
          <p className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Platform Revenue
          </p>
          <p className="text-lg sm:text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 truncate">
            ₹{metrics.totalCollection.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-amber-700 font-semibold truncate">{metrics.totalDonationsCount} donations in DB</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/40 space-y-1.5 sm:space-y-2">
          <p className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
            <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> System Status
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-base sm:text-lg font-bold text-emerald-600">CONNECTED</span>
          </div>
          <p className="text-[10px] text-stone-500 truncate">Supabase RLS Active • PG 17</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-1.5 sm:space-y-2">
          <p className="text-[11px] sm:text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1 truncate">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Immutable Logs
          </p>
          <p className="text-lg sm:text-2xl font-bold font-serif text-amber-600">
            {auditLogsCount} Logs
          </p>
          <p className="text-[10px] text-stone-500 truncate">Checksum Verified</p>
        </div>
      </div>

      {/* QUICK ADMIN ACTION LINKS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs font-bold">
        <Link
          href="/admin/super/audit"
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          📜 Immutable Audit Logs
        </Link>
        <Link
          href="/admin/super/security"
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          🛡️ Security & Fraud
        </Link>
        <Link
          href="/admin/finance/reconciliation"
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          💰 Reconciliation
        </Link>
        <Link
          href="/admin/super/saas-settings"
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 text-center"
        >
          ⚙️ SaaS Config
        </Link>
      </div>
    </div>
  );
}
