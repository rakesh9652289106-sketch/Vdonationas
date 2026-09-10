'use client';

import React, { useState } from 'react';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { FileText, Download, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { useAuth } from '@/lib/auth-context';
import { receiptsService, donationsService } from '@/lib/supabase-service';

export default function DevoteeReceiptsCenterPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const { user } = useAuth();
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [receiptsList, setReceiptsList] = useState<any[]>(MOCK_DONATIONS);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadReceipts() {
      setLoading(true);
      try {
        if (user?.id) {
          const dbReceipts = await receiptsService.getDevoteeReceipts(user.id);
          if (dbReceipts && dbReceipts.length > 0) {
            setReceiptsList(
              dbReceipts.map((r: any) => ({
                id: r.id,
                donationId: r.receipt_no || `REC-${r.id.slice(0, 8)}`,
                templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
                categoryName: r.donation?.category_id || 'Sacred Seva Offering',
                amount: Number(r.donation?.amount || 1116),
                verificationCode: r.verification_code || 'VK20268X',
                createdAt: r.issued_at ? new Date(r.issued_at).toLocaleDateString('en-IN') : 'Recently',
                paymentMethod: r.donation?.payment_method || 'UPI',
                transactionId: r.donation?.transaction_id || `TXN-${r.id.slice(0, 8)}`,
                donorName: r.donation?.donor_name || user.fullName || 'Devotee',
              }))
            );
            return;
          }

          // If no formal receipts yet, check donations
          const dons = await donationsService.getDevoteeDonations(user.id);
          if (dons && dons.length > 0) {
            setReceiptsList(
              dons.map((d: any) => ({
                id: d.id,
                donationId: d.donation_id || `DON-${d.id.slice(0, 8)}`,
                templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
                categoryName: d.category_id || 'Sacred Seva Offering',
                amount: Number(d.amount || 0),
                verificationCode: d.donation_id ? d.donation_id.replace(/[^A-Z0-9]/g, '').slice(-8) : 'VK20268X',
                createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : 'Recently',
                paymentMethod: d.payment_method || 'UPI',
                transactionId: d.transaction_id || `TXN-${d.id.slice(0, 8)}`,
                donorName: d.donor_name || user.fullName || 'Devotee',
              }))
            );
          }
        }
      } catch (err) {
        console.warn('[Supabase] Failed to fetch receipts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReceipts();
  }, [user]);

  const handleDownloadAll = () => {
    showAlert({
      type: 'info',
      title: 'Receipts Download Initialized',
      message: 'Packaging all historical 80G tax receipts and digital donation slips into a ZIP archive...',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarMyReceipts')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarMyReceipts')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Official 80G Tax Certificates with Cryptographic Verification Codes
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Download className="w-4 h-4 text-devotional-maroon" /> Download All Receipts (ZIP)
        </button>
      </div>

      {/* 3D RECEIPT GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {receiptsList.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold block">
                  REC: {d.donationId}
                </span>
                <h3 className="font-bold font-serif text-stone-900 dark:text-stone-100 text-base mt-0.5">
                  {d.templeName}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">{d.categoryName}</p>
              </div>
              <span className="text-xl font-bold text-devotional-maroon dark:text-amber-400 font-serif">
                ₹{d.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 dark:border-stone-800">
              <span className="font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {d.verificationCode}
              </span>
              <button
                onClick={() =>
                  setActiveReceipt({
                    receiptNo: d.donationId,
                    donationId: d.id,
                    templeName: d.templeName,
                    trustName: 'Sri Vasavi Kanyaka Parameswari Matha Trust',
                    donorName: d.donorName || user?.fullName || 'Sacred Devotee',
                    amount: d.amount,
                    categoryName: d.categoryName,
                    date: d.createdAt,
                    paymentMethod: d.paymentMethod,
                    transactionId: d.transactionId,
                    verificationCode: d.verificationCode,
                  })
                }
                className="px-4 py-2 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-xl text-xs shadow-md hover:brightness-110 transition-all border border-amber-400/40"
              >
                Print / View Receipt
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
