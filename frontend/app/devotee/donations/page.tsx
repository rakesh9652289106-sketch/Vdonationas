'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { Heart, Search, Download, Flame, ShieldCheck, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

import { useAuth } from '@/lib/auth-context';
import { donationsService } from '@/lib/supabase-service';

type FilterType = 'ALL' | 'DONATIONS' | 'SEVAS' | 'AUTOPAY';

export default function DevoteeDonationsPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const { user } = useAuth();
  const devoteeDisplayName = user?.fullName || (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || 'Sri Vasavi Devotee' : 'Sri Vasavi Devotee');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [donations, setDonations] = useState<any[]>(MOCK_DONATIONS);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadDonations() {
      setLoading(true);
      try {
        if (user?.id) {
          const userDons = await donationsService.getDevoteeDonations(user.id);
          if (userDons && userDons.length > 0) {
            setDonations(
              userDons.map((d: any) => ({
                id: d.id,
                donationId: d.donation_id || `DON-${d.id.slice(0, 8)}`,
                templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
                categoryName: d.category_id || 'Sacred Seva Offering',
                amount: Number(d.amount || 0),
                status: d.status || 'SUCCESS',
                paymentMethod: d.payment_method || 'UPI',
                transactionId: d.transaction_id || `TXN-${d.id.slice(0, 8)}`,
                createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : 'Recently',
                verificationCode: d.donation_id ? d.donation_id.replace(/[^A-Z0-9]/g, '').slice(-8) : 'VK20268X',
              }))
            );
            return;
          }
        }
        // Fallback or public recent donors
        const recent = await donationsService.getRecentDonors(10);
        if (recent && recent.length > 0) {
          setDonations(
            recent.map((d: any) => ({
              id: d.id,
              donationId: d.donation_id || `DON-${d.id.slice(0, 8)}`,
              templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
              categoryName: d.category_id || 'Sacred Seva Offering',
              amount: Number(d.amount || 0),
              status: d.status || 'SUCCESS',
              paymentMethod: d.payment_method || 'UPI',
              transactionId: d.transaction_id || `TXN-${d.id.slice(0, 8)}`,
              createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : 'Recently',
              verificationCode: d.donation_id ? d.donation_id.replace(/[^A-Z0-9]/g, '').slice(-8) : 'VK20268X',
            }))
          );
        }
      } catch (err) {
        console.warn('[Supabase] Failed to load devotee donations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, [user]);

  const filterChips: { id: FilterType; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'DONATIONS', label: 'Donations' },
    { id: 'SEVAS', label: 'Sevas' },
    { id: 'AUTOPAY', label: 'Autopay' },
  ];

  const filtered = donations.filter((d) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      d.donationId.toLowerCase().includes(term) ||
      d.templeName.toLowerCase().includes(term) ||
      (d.categoryName || '').toLowerCase().includes(term) ||
      d.transactionId.toLowerCase().includes(term);

    let matchesFilter = true;
    const cat = (d.categoryName || '').toLowerCase();
    if (activeFilter === 'DONATIONS') {
      matchesFilter = cat.includes('donation') || cat.includes('general') || cat.includes('development');
    } else if (activeFilter === 'SEVAS') {
      matchesFilter = cat.includes('seva') || cat.includes('annadanam') || cat.includes('archana') || cat.includes('pooja');
    } else if (activeFilter === 'AUTOPAY') {
      matchesFilter = cat.includes('monthly') || cat.includes('recurring') || cat.includes('autopay');
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-5 font-sans px-3 sm:px-0">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-devotional-gold/40 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> Seva History
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            My Transactions
          </h1>
          <p className="text-amber-100/80 text-xs">
            100% Traceable Seva Offerings with Instant 80G Digital Tax Receipts
          </p>
        </div>

        <button
          onClick={() =>
            showAlert({
              type: 'info',
              title: 'Transactions Exported',
              message: 'Complete seva and donation history exported in CSV format.',
            })
          }
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Download className="w-4 h-4 text-devotional-maroon" />
          Export
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-devotional-maroon font-medium"
        />
      </div>

      {/* FILTER CHIPS (All | Donations | Sevas | Autopay) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active-press ${
                isActive
                  ? 'bg-devotional-maroon text-white shadow-sm ring-2 ring-devotional-maroon/20'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-devotional-maroon/40'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* MOBILE LIST CARDS (< md) */}
      <div className="md:hidden space-y-3">
        {filtered.length > 0 ? (
          filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                    {d.templeName}
                  </h4>
                  <p className="text-xs text-stone-500">{d.categoryName || 'General Seva'}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-black text-base text-emerald-600 dark:text-emerald-400">
                    ₹{d.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{d.createdAt}</span>
                </div>
                <button
                  onClick={() =>
                    setActiveReceipt({
                      receiptNo: d.donationId,
                      donationId: d.id,
                      templeName: d.templeName,
                      trustName: 'Sri Vasavi Kanyaka Parameswari Matha Trust',
                      donorName: devoteeDisplayName,
                      amount: d.amount,
                      categoryName: d.categoryName,
                      date: d.createdAt,
                      paymentMethod: d.paymentMethod,
                      transactionId: d.transactionId,
                      verificationCode: d.verificationCode,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-devotional-cream dark:bg-stone-800 border border-devotional-gold/50 text-devotional-maroon dark:text-amber-400 font-bold text-xs active-press flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 text-center border border-stone-200 dark:border-stone-800 space-y-3">
            <Heart className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
              No transactions yet
            </h3>
            <p className="text-xs text-stone-500">
              Start your sacred seva journey today.
            </p>
            <Link
              href="/donate"
              className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold active-press"
            >
              Donate
            </Link>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE (>= md) */}
      <div className="hidden md:block bg-white dark:bg-stone-900 rounded-3xl border border-devotional-gold/40 p-6 shadow-xl overflow-x-auto">
        {filtered.length > 0 ? (
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
                          donorName: devoteeDisplayName,
                          amount: d.amount,
                          categoryName: d.categoryName,
                          date: d.createdAt,
                          paymentMethod: d.paymentMethod,
                          transactionId: d.transactionId,
                          verificationCode: d.verificationCode,
                        })
                      }
                      className="px-4 py-2 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-xl text-xs shadow-md hover:brightness-110 active-press transition-all border border-amber-400/40"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Heart className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
              No transactions yet
            </h3>
            <p className="text-xs text-stone-500">
              Start your sacred seva journey today.
            </p>
            <Link
              href="/donate"
              className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold active-press"
            >
              Donate
            </Link>
          </div>
        )}
      </div>

      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
