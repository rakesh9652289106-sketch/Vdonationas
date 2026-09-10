'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, Building2 } from 'lucide-react';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { receiptsService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';

export default function ReceiptVerificationPage() {
  const [receiptInput, setReceiptInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<any | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptInput.trim()) return;

    setHasSearched(true);
    setLoading(true);

    try {
      const clean = receiptInput.trim();
      const res = await receiptsService.verifyReceipt(clean);

      if (res.receipt || res.donation) {
        const r = res.receipt;
        const d = res.donation;
        setVerificationResult({
          receiptNo: r?.receipt_no || d?.donation_id || clean,
          donationId: d?.donation_id || r?.receipt_no || clean,
          templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
          trustName: 'Sri Vasavi Kanyaka Parameswari Matha Devasthanam Trust',
          donorName: d?.donor_name || 'Sacred Devotee',
          amount: Number(d?.amount || 1116),
          categoryName: d?.category_id || 'Sacred Seva Offering',
          campaignTitle: 'Sri Vasavi Matha Temple & Annadanam Devasthanam',
          date: r?.issued_at ? new Date(r.issued_at).toLocaleString('en-IN') : (d?.created_at ? new Date(d.created_at).toLocaleString('en-IN') : 'Verified'),
          paymentMethod: d?.payment_method || 'UPI',
          transactionId: d?.transaction_id || `TXN-${clean}`,
          taxInfo: '80G Tax Exempted under Section 80G(5)(vi) of IT Act 1961',
          verificationCode: r?.verification_code || clean.slice(-8).toUpperCase(),
        });
        return;
      }

      // Check donations table directly
      const { data: donData } = await supabase
        .from('donations')
        .select('*')
        .or(`donation_id.ilike.%${clean}%,transaction_id.ilike.%${clean}%`)
        .limit(1)
        .maybeSingle();

      if (donData) {
        setVerificationResult({
          receiptNo: donData.donation_id || clean,
          donationId: donData.donation_id || clean,
          templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
          trustName: 'Sri Vasavi Kanyaka Parameswari Matha Devasthanam Trust',
          donorName: donData.donor_name || 'Sacred Devotee',
          amount: Number(donData.amount || 0),
          categoryName: donData.category_id || 'Sacred Seva Offering',
          campaignTitle: 'Sri Vasavi Matha Temple & Annadanam Devasthanam',
          date: donData.created_at ? new Date(donData.created_at).toLocaleString('en-IN') : 'Verified',
          paymentMethod: donData.payment_method || 'UPI',
          transactionId: donData.transaction_id || `TXN-${clean}`,
          taxInfo: '80G Tax Exempted under Section 80G(5)(vi) of IT Act 1961',
          verificationCode: donData.donation_id ? donData.donation_id.replace(/[^A-Z0-9]/g, '').slice(-8) : 'VK20268X',
        });
        return;
      }

      setVerificationResult(null);
    } catch (err) {
      console.warn('[Supabase] Receipt verification error:', err);
      setVerificationResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
          Official Digital Receipt Verification
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-xs max-w-md mx-auto">
          Enter any Receipt Number, Donation ID, or 8-character Verification Code to validate financial authenticity.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <form onSubmit={handleVerify} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={receiptInput}
              onChange={(e) => setReceiptInput(e.target.value)}
              placeholder="e.g. REC-2026-89102 or VK89102X"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-devotional-maroon"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-devotional-maroon text-white font-bold text-xs hover:bg-devotional-maroon-dark transition-colors shadow-md"
          >
            VERIFY NOW
          </button>
        </form>

        <div className="text-[11px] text-stone-500 text-center">
          Sample test codes: <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">REC-2026-89102</code> or <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">VK89102X</code>
        </div>
      </div>

      {/* VERIFICATION RESULT */}
      {hasSearched && (
        <div>
          {verificationResult ? (
            <div className="bg-emerald-50 dark:bg-stone-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-emerald-200 dark:border-stone-700 pb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg uppercase tracking-wider">
                    VALID RECEIPT CONFIRMED
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-stone-300">
                    Official financial transaction verified in platform audit logs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-stone-500">Temple Name:</p>
                  <p className="font-bold text-stone-900 dark:text-stone-100">{verificationResult.templeName}</p>
                </div>
                <div>
                  <p className="text-stone-500">Donation Amount:</p>
                  <p className="font-bold text-devotional-maroon dark:text-amber-400 text-base">
                    ₹{verificationResult.amount}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Category / Purpose:</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">{verificationResult.categoryName}</p>
                </div>
                <div>
                  <p className="text-stone-500">Date Issued:</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">{verificationResult.date}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200 dark:border-stone-700 flex justify-end">
                <button
                  onClick={() => setActiveReceiptModal(verificationResult)}
                  className="px-6 py-2.5 bg-devotional-maroon text-white font-bold text-xs rounded-xl hover:bg-devotional-maroon-dark transition-colors"
                >
                  View Printable PDF Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 dark:bg-stone-900 border-2 border-rose-400 rounded-3xl p-8 text-center space-y-3">
              <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="font-bold text-rose-900 dark:text-rose-300 text-base">
                Invalid or Unverified Receipt Code
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                No matching transaction was found for "{receiptInput}". Please double-check your receipt code.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {activeReceiptModal && (
        <ReceiptViewModal
          receiptData={activeReceiptModal}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}
    </div>
  );
}
