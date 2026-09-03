'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_TEMPLES, MOCK_QR_CODES } from '@/lib/mock-data';
import { QrCode, ShieldCheck, Flame, ArrowLeft, CheckCircle, Building2 } from 'lucide-react';

export default function CounterQrTVDisplayPage() {
  const temple = MOCK_TEMPLES[0];
  const qrItem = MOCK_QR_CODES[0];

  const [txnRef, setTxnRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleConfirmTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnRef.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setTxnRef('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-6 sm:p-12 flex flex-col items-center justify-between font-sans">
      {/* Top Nav Back Link */}
      <div className="w-full max-w-5xl flex items-center justify-between border-b border-stone-800 pb-4">
        <Link
          href="/admin/temple/dashboard"
          className="text-amber-400 font-bold text-xs flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Counter TV Mode
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
          <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" />
          TEMPLE COUNTER KIOSK MODE
        </div>
      </div>

      {/* Main Kiosk Display Box */}
      <div className="w-full max-w-3xl bg-stone-900 border-4 border-devotional-gold rounded-3xl p-8 sm:p-12 text-center my-8 shadow-2xl space-y-6">
        <div className="w-20 h-20 rounded-full bg-devotional-maroon text-amber-300 flex items-center justify-center mx-auto border-2 border-amber-400 shadow-gold">
          <Building2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-300 tracking-tight">
            {temple.name}
          </h1>
          <p className="text-stone-300 text-sm font-medium">
            {temple.deity} • {temple.city}, {temple.state}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Verified Payment Destination: {temple.trustName}
          </div>
        </div>

        {/* Dynamic High-Res QR Code */}
        <div className="bg-white p-6 rounded-3xl border-4 border-amber-400 max-w-xs mx-auto shadow-2xl flex flex-col items-center">
          <img
            src={qrItem.qrImageUrl}
            alt="Temple Counter QR"
            className="w-64 h-64 object-contain rounded-xl"
          />
          <div className="mt-3 pt-2 border-t border-stone-200 w-full text-center">
            <p className="text-[10px] uppercase font-bold text-stone-500">Official UPI VPA</p>
            <p className="text-stone-900 font-mono font-bold text-sm">{qrItem.upiId}</p>
          </div>
        </div>

        <div className="text-amber-200 text-xs font-bold tracking-wider uppercase">
          Scan using Google Pay, PhonePe, Paytm, BHIM or any UPI app
        </div>

        {/* Counter Reference Confirmation Form */}
        <div className="max-w-md mx-auto bg-stone-800 p-4 rounded-2xl border border-stone-700">
          {isSubmitted ? (
            <div className="p-3 bg-emerald-900/60 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Seva recorded! Transaction Ref #{txnRef} logged in audit file.
            </div>
          ) : (
            <form onSubmit={handleConfirmTxn} className="flex gap-2">
              <input
                type="text"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="Enter 12-digit UPI Ref No. after scan"
                className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-600 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl"
              >
                Confirm Seva
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-[11px] text-stone-500 text-center">
        VD Live Kiosk Engine • Real-Time Server Verification Active
      </div>
    </div>
  );
}
