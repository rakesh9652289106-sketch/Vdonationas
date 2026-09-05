'use client';

import React, { useState } from 'react';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { FileText, Search, Download, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function TempleDonationsAdminPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [search, setSearch] = useState('');

  const handleExport = () => {
    showAlert({
      type: 'info',
      title: 'Donations Exported',
      message: 'Temple donation records exported as CSV / Excel format.',
    });
  };

  const filtered = MOCK_DONATIONS.filter(
    (d) =>
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.donationId.toLowerCase().includes(search.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarDonationsAudit')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarDonationsAudit')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            View, search, and audit all server-verified offerings received by Sri Vasavi Matha.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Download className="w-4 h-4 text-devotional-maroon" /> Export CSV / Excel
        </button>
      </div>

      {/* 3D DEVOTIONAL TABLE CONTAINER */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-4 hover:border-amber-400 transition-all">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Donor Name, Donation ID, or Transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Donation ID</th>
                <th className="p-3.5">Devotee Donor</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-devotional-maroon dark:text-amber-400">
                    {d.donationId}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{d.donorName}</td>
                  <td className="p-3.5 font-semibold text-stone-700 dark:text-stone-300">{d.categoryName}</td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{d.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800 dark:text-stone-200">{d.paymentMethod}</td>
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
                          donorName: d.donorName,
                          amount: d.amount,
                          categoryName: d.categoryName || 'Annadanam',
                          date: d.createdAt,
                          paymentMethod: d.paymentMethod,
                          transactionId: d.transactionId,
                          verificationCode: d.verificationCode,
                        })
                      }
                      className="px-3.5 py-1.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-xl text-xs shadow-md hover:brightness-110 transition-all border border-amber-400/40"
                    >
                      PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
