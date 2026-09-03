'use client';

import React, { useState } from 'react';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { Heart, Search, Download, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeDonationsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const filtered = MOCK_DONATIONS.filter((d) => {
    const matchesSearch =
      d.donationId.toLowerCase().includes(search.toLowerCase()) ||
      d.templeName.toLowerCase().includes(search.toLowerCase()) ||
      (d.categoryName || '').toLowerCase().includes(search.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarMyDonations')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarMyDonations')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            100% Traceable Seva Offerings • Instant 80G Digital Tax Receipts & Certificates
          </p>
        </div>

        <button
          onClick={() => alert('Downloading complete donation history as CSV...')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Download className="w-4 h-4 text-devotional-maroon" /> Export History (CSV)
        </button>
      </div>

      {/* FILTER & SEARCH BAR WITH 3D AMBIENT GLOW */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl flex flex-col sm:flex-row gap-4 hover:border-amber-400 transition-all">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Donation ID, Temple Name, Seva Category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:ring-2 focus:ring-amber-400"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="SUCCESS">SUCCESSFUL</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {/* 3D DEVOTIONAL DONATIONS TABLE CARD */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-2xl overflow-x-auto hover:border-amber-400 transition-all">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
            <tr>
              <th className="p-3.5">Donation ID</th>
              <th className="p-3.5">Temple Shrine</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Payment Mode</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                <td className="p-3.5 font-mono font-bold text-devotional-maroon dark:text-amber-400">
                  {d.donationId}
                </td>
                <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{d.templeName}</td>
                <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{d.categoryName}</td>
                <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                  ₹{d.amount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-stone-500">{d.createdAt}</td>
                <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{d.paymentMethod}</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                    {d.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() =>
                      setActiveReceipt({
                        receiptNo: d.donationId,
                        donationId: d.id,
                        templeName: d.templeName,
                        trustName: 'Sri Vasavi Kanyaka Parameswari Matha Trust',
                        donorName: 'Radha Krishna',
                        amount: d.amount,
                        categoryName: d.categoryName,
                        date: d.createdAt,
                        paymentMethod: d.paymentMethod,
                        transactionId: d.transactionId,
                        verificationCode: d.verificationCode,
                      })
                    }
                    className="px-3.5 py-1.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-xl text-xs shadow-md hover:brightness-110 transition-all border border-amber-400/40"
                  >
                    View PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
