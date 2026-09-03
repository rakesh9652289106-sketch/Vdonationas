'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, FileText, Heart, RefreshCw, X, ShieldCheck, Award } from 'lucide-react';
import VasaviSevaCertificateModal from '../VasaviSevaCertificateModal';

interface VasaviDonationSuccessModalProps {
  donationData: {
    donationId: string;
    receiptNo: string;
    templeName: string;
    amount: number;
    categoryName: string;
    paymentMethod: string;
    date: string;
  };
  onClose: () => void;
}

export default function VasaviDonationSuccessModal({
  donationData,
  onClose,
}: VasaviDonationSuccessModalProps) {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      {/* 3D Elevated Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/80 shadow-[0_30px_90px_rgba(212,175,55,0.4)] p-6 sm:p-8 space-y-6 text-center overflow-hidden">
        {/* Background Aura Rays */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-tr from-amber-400/30 via-devotional-saffron/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Spiritual Diya & Lotus Aura Animation */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-amber-400 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(212,175,55,0.8)] border-2 border-amber-300">
            🌺
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-[10px] uppercase border border-amber-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SEVA SUCCESSFULLY OFFERED 🙏
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-1">
            May Sri Vasavi Kanyaka Parameswari bless you and your family.
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            Your sacred Seva has been recorded with official devasthanam registration.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-amber-50/80 dark:bg-stone-900 p-4 rounded-2xl border border-amber-200 dark:border-stone-700 text-xs space-y-2 text-left">
          <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-2">
            <span className="text-stone-500 font-medium">Seva Contribution</span>
            <span className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
              ₹{donationData.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Shrine Location</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{donationData.templeName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Seva Category</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{donationData.categoryName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Transaction ID</span>
            <span className="font-mono text-stone-700 dark:text-stone-300">{donationData.donationId}</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2 text-xs font-bold pt-1">
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full py-3 rounded-xl bg-devotional-maroon text-amber-300 hover:bg-devotional-maroon-dark transition-colors flex items-center justify-center gap-2 shadow-md border border-devotional-gold/40"
          >
            <Award className="w-4 h-4 text-amber-400" /> VIEW DIGITAL SEVA CERTIFICATE
          </button>

          <div className="flex gap-2">
            <Link
              href="/devotee/donations"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
            >
              VIEW SEVA HISTORY
            </Link>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-devotional-saffron text-white hover:brightness-110 transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> OFFER AGAIN
            </button>
          </div>
        </div>
      </div>

      {/* Digital Seva Certificate Modal */}
      {showCertificate && (
        <VasaviSevaCertificateModal
          certificateData={{
            devoteeName: 'Radha Krishna',
            sevaType: donationData.categoryName,
            amount: donationData.amount,
            date: donationData.date,
            transactionId: donationData.donationId,
            receiptNo: donationData.receiptNo,
            templeName: donationData.templeName,
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
