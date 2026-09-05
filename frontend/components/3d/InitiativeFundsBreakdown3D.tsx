'use client';

import React, { useState } from 'react';
import { InitiativeBreakdownItem, InitiativeExpense } from '@/lib/initiatives-data';
import {
  PieChart,
  ShieldCheck,
  FileText,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Coins,
  Layers,
} from 'lucide-react';

interface InitiativeFundsBreakdown3DProps {
  targetAmount: number;
  currentRaised: number;
  breakdownItems?: InitiativeBreakdownItem[];
  expenses?: InitiativeExpense[];
  excessFundsPolicy?: string;
}

export default function InitiativeFundsBreakdown3D({
  targetAmount = 0,
  currentRaised = 0,
  breakdownItems = [],
  expenses = [],
  excessFundsPolicy,
}: InitiativeFundsBreakdown3DProps) {
  const [selectedRing, setSelectedRing] = useState<'RAISED' | 'SPENT' | 'ESCROW' | null>(null);

  const numTarget = Number(targetAmount || 0);
  const numRaised = Number(currentRaised || 0);

  const approvedExpenses = (expenses || []).filter((e) => e.status === 'APPROVED');
  const totalSpent = approvedExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const remainingFunds = Math.max(numRaised - totalSpent, 0);
  const utilizationRate = numRaised > 0 ? Math.min(Math.round((totalSpent / numRaised) * 100), 100) : 0;
  const fundedPercent = numTarget > 0 ? Math.min(Math.round((numRaised / numTarget) * 100), 100) : 0;

  // Concentric circle SVG math for 3D Gauge
  const radiusTarget = 80;
  const radiusRaised = 64;
  const radiusSpent = 48;
  const circTarget = 2 * Math.PI * radiusTarget;
  const circRaised = 2 * Math.PI * radiusRaised;
  const circSpent = 2 * Math.PI * radiusSpent;

  const strokeRaised = circRaised - (fundedPercent / 100) * circRaised;
  const strokeSpent = circSpent - (utilizationRate / 100) * circSpent;

  return (
    <div className="space-y-8">
      {/* 3D Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Target */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-1 transform hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Sanctioned Goal</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            ₹{numTarget.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-400">Total project target</p>
        </div>

        {/* Amount Raised */}
        <div
          onClick={() => setSelectedRing(selectedRing === 'RAISED' ? null : 'RAISED')}
          className="cursor-pointer bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-md space-y-1 transform hover:-translate-y-1 transition-all duration-300"
        >
          <p className="text-[10px] text-devotional-saffron uppercase font-bold tracking-wider flex items-center justify-between">
            <span>Total Raised</span>
            <Sparkles className="w-3 h-3 text-devotional-gold" />
          </p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-300">
            ₹{numRaised.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            {fundedPercent}% of goal funded
          </p>
        </div>

        {/* Amount Utilized */}
        <div
          onClick={() => setSelectedRing(selectedRing === 'SPENT' ? null : 'SPENT')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-1 transform hover:-translate-y-1 transition-all duration-300"
        >
          <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Total Utilized</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">{utilizationRate}% funds disbursed</p>
        </div>

        {/* Remaining In Trust Escrow */}
        <div
          onClick={() => setSelectedRing(selectedRing === 'ESCROW' ? null : 'ESCROW')}
          className="cursor-pointer bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-1 transform hover:-translate-y-1 transition-all duration-300"
        >
          <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Escrow Balance</p>
          <p className="text-xl sm:text-2xl font-serif font-bold text-stone-800 dark:text-stone-200">
            ₹{remainingFunds.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-stone-400">Reserved for next phase</p>
        </div>
      </div>

      {/* 3D Interactive Funds Concentric Rings Visualizer */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 p-6 sm:p-8 border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: 3D Dial Canvas */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div
              className="relative w-56 h-56 flex items-center justify-center"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 3D Depth Glow Ring */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 to-transparent blur-md transform rotate-x-12"
              />

              <svg className="w-52 h-52 -rotate-90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" viewBox="0 0 200 200">
                {/* Background tracks */}
                <circle cx="100" cy="100" r={radiusTarget} stroke="currentColor" strokeWidth="10" className="text-stone-800/80" fill="transparent" />
                <circle cx="100" cy="100" r={radiusRaised} stroke="currentColor" strokeWidth="10" className="text-stone-800/80" fill="transparent" />
                <circle cx="100" cy="100" r={radiusSpent} stroke="currentColor" strokeWidth="10" className="text-stone-800/80" fill="transparent" />

                {/* Target Ring (100% boundary) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radiusTarget}
                  stroke="#78716c"
                  strokeWidth="8"
                  strokeDasharray={circTarget}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="transparent"
                  className="opacity-40"
                />

                {/* Raised Ring (Golden Dakshina) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radiusRaised}
                  stroke="url(#goldGradient)"
                  strokeWidth="10"
                  strokeDasharray={circRaised}
                  strokeDashoffset={strokeRaised}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Spent / Utilized Ring (Emerald) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radiusSpent}
                  stroke="url(#emeraldGradient)"
                  strokeWidth="10"
                  strokeDasharray={circSpent}
                  strokeDashoffset={strokeSpent}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />

                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E06D29" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#FFF1A8" />
                  </linearGradient>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Center Golden Dakshina Emblem */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none space-y-0.5">
                <Coins className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <span className="font-serif font-bold text-lg text-amber-200">
                  {fundedPercent}%
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Funded
                </span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-devotional-gold" /> Real-Time Agamic Ledger
            </p>
          </div>

          {/* Right: Interactive Legend & Financial Breakdown */}
          <div className="space-y-4 flex-1 w-full text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> 3D Fund Flow Dynamics
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Transparent Capital Flow & Utilization
              </h3>
              <p className="text-stone-400 text-xs">
                Sacred devotee dakshina is segregated into approved capital stages. No funds are disbursed without dual board auditor signatures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Card 1: Goal */}
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Sanctioned Goal</span>
                </div>
                <p className="font-serif font-bold text-sm text-stone-200">
                  ₹{numTarget.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500">100% Target Base</p>
              </div>

              {/* Card 2: Raised */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(212,175,55,1)]" />
                  <span className="text-[10px] font-bold text-amber-300 uppercase">Donations Raised</span>
                </div>
                <p className="font-serif font-bold text-sm text-amber-300">
                  ₹{numRaised.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-amber-400/80">{fundedPercent}% collected</p>
              </div>

              {/* Card 3: Utilized */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">Disbursed</span>
                </div>
                <p className="font-serif font-bold text-sm text-emerald-300">
                  ₹{totalSpent.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-emerald-400/80">{utilizationRate}% utilized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Budget Allocation */}
      <div className="bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-devotional-saffron" /> Itemized Budget Breakdown
            </h4>
            <p className="text-xs text-stone-500">Transparent item-by-item capital allocation approved by Trust Board.</p>
          </div>
        </div>

        <div className="space-y-3">
          {breakdownItems.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4">Itemized breakdown being audited by Trust finance team.</p>
          ) : (
            breakdownItems.map((item, idx) => {
              const itemTarget = Number(item.target_amount || 0);
              const itemPercent = numTarget > 0 ? Math.round((itemTarget / numTarget) * 100) : 0;
              return (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 space-y-2 hover:border-devotional-gold/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {item.category}
                      </span>
                      {item.description && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        ₹{itemTarget.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold ml-2">
                        ({itemPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-devotional-maroon to-devotional-gold rounded-full"
                      style={{ width: `${Math.min(itemPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Verified Expenses Transparency Table */}
      <div className="bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-500" /> Expense & Utilization Ledger ({approvedExpenses.length})
            </h4>
            <p className="text-xs text-stone-500">Every single rupee disbursed is logged with invoice reference and auditor approval.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300/40">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Audited
          </span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            No expenses disbursed yet. Funds are held safely in trust escrow until next phase begins.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Description & Ref</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {expenses.map((exp, i) => {
                  const expAmt = Number(exp.amount || 0);
                  return (
                    <tr key={exp.id || i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="py-3.5 font-medium text-stone-600 dark:text-stone-400">
                        {new Date(exp.expense_date || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 font-bold text-stone-900 dark:text-stone-100">
                        {exp.category}
                      </td>
                      <td className="py-3.5 text-stone-600 dark:text-stone-300">
                        <div>{exp.description}</div>
                        {exp.invoice_ref && (
                          <div className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                            Ref: {exp.invoice_ref}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 font-serif font-bold text-stone-900 dark:text-stone-100 text-right">
                        ₹{expAmt.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {exp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Excess Funds Policy Banner */}
      {excessFundsPolicy && (
        <div className="p-5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-devotional-gold/40 text-xs space-y-1">
          <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-devotional-saffron" /> Surplus / Excess Funds Guarantee
          </p>
          <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
            {excessFundsPolicy}
          </p>
        </div>
      )}
    </div>
  );
}
