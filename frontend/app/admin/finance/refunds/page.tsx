'use client';

import React, { useState } from 'react';
import { MOCK_REFUNDS } from '@/lib/mock-data';
import { RefreshCw, DollarSign, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FinanceRefundsAdminPage() {
  const { t } = useLanguage();
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-emerald-500/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-400/40">
            <RefreshCw className="w-4 h-4 text-emerald-400" /> {t('sidebarRefundApprovals')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarRefundApprovals')}
          </h1>
          <p className="text-emerald-100/80 text-xs">
            Authorized Financial Refund Processing & Ledger Audit Trails
          </p>
        </div>
      </div>

      {/* 3D REFUNDS TABLE CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-4 hover:border-emerald-400 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Donation ID</th>
                <th className="p-3.5">Temple Shrine</th>
                <th className="p-3.5">Refund Amount</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Requested By</th>
                <th className="p-3.5">Approved By</th>
                <th className="p-3.5">Refund Reference</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {refunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-emerald-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-900 dark:text-amber-400">
                    {ref.donationId}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{ref.templeName}</td>
                  <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400 text-base">₹{ref.amount}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300 font-medium">{ref.reason}</td>
                  <td className="p-3.5 text-stone-500">{ref.requestedBy}</td>
                  <td className="p-3.5 text-stone-500">{ref.approvedBy || '-'}</td>
                  <td className="p-3.5 font-mono text-[11px] text-amber-700 dark:text-amber-400 font-bold">{ref.refundRef}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                      {ref.status}
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
