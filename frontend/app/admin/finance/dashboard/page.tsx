'use client';

import React from 'react';
import { MOCK_STATS, MOCK_RECONCILIATION } from '@/lib/mock-data';
import AdminFinancialFlow3D from '@/components/3d/AdminFinancialFlow3D';
import { TrendingUp, RefreshCw, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FinanceAdminDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 font-sans">
      {/* 3D DEVOTIONAL FINANCIAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-emerald-500/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-400/40">
            <DollarSign className="w-4 h-4" /> {t('sidebarFinanceDashboard')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Financial Collections & Settlement Matrix
          </h1>
          <p className="text-emerald-100/80 text-xs">
            Monitor daily collections, bank settlements, refund approvals, and 3-way gateway reconciliation.
          </p>
        </div>
      </div>

      {/* 3D FINTECH FLOW MATRIX */}
      <AdminFinancialFlow3D />

      {/* 3D METRIC CARDS WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-emerald-500/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/40 space-y-1">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> TODAY'S COLLECTION
          </span>
          <span className="font-serif font-bold text-2xl text-emerald-900 dark:text-amber-400">₹{MOCK_STATS.todayCollection.toLocaleString('en-IN')}</span>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% vs yesterday</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-emerald-500/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/40 space-y-1">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> MONTHLY COLLECTION
          </span>
          <span className="font-serif font-bold text-2xl text-emerald-900 dark:text-amber-400">₹{MOCK_STATS.monthlyCollection.toLocaleString('en-IN')}</span>
          <p className="text-[10px] text-amber-700 font-semibold">1,420 Devotees</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-emerald-500/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-1">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> PENDING SETTLEMENTS
          </span>
          <span className="font-bold text-2xl text-amber-600">₹1,24,500</span>
          <p className="text-[10px] text-stone-500">T+1 Bank Transfer</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-emerald-500/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/40 space-y-1">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RECONCILIATION MATCH
          </span>
          <span className="font-bold text-2xl text-emerald-600">99.8%</span>
          <p className="text-[10px] text-emerald-600 font-semibold">Audited Checksum</p>
        </div>
      </div>

      {/* RECONCILIATION MATRIX TABLE */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-emerald-400 transition-all">
        <h3 className="font-serif font-bold text-lg text-emerald-950 dark:text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Bank Settlement Reconciliation Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">Donation ID</th>
                <th className="p-3">Temple Scope</th>
                <th className="p-3">Gateway Recorded</th>
                <th className="p-3">Bank Settlement</th>
                <th className="p-3">Difference</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_RECONCILIATION.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-900 dark:text-amber-400">{r.donationId}</td>
                  <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">{r.templeName}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">₹{r.gatewayAmount}</td>
                  <td className="p-3 font-bold text-emerald-700">₹{r.actualSettlement}</td>
                  <td className="p-3 font-mono text-stone-500">₹{r.difference}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
