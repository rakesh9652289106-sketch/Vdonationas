'use client';

import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle, RefreshCw, Flame, Building2 } from 'lucide-react';
import { QRCodeItem, Temple } from '@/lib/types';

interface QRDisplayKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  temple: Temple;
  qrItem?: QRCodeItem;
}

export default function QRDisplayKioskModal({
  isOpen,
  onClose,
  temple,
  qrItem,
}: QRDisplayKioskModalProps) {
  const [txnRef, setTxnRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const upiId = qrItem?.upiId || `${temple.code.toLowerCase()}annadanam@upi`;
  const qrImage =
    qrItem?.qrImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      temple.name
    )}&cu=INR`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 text-white p-4 sm:p-8 overflow-y-auto">
      {/* Kiosk Mode Container */}
      <div className="w-full max-w-4xl bg-stone-900 border-2 border-devotional-gold rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          title="Exit Full Screen QR Display"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Flame className="w-4 h-4 animate-pulse text-devotional-saffron" />
          OFFICIAL TEMPLE COUNTER DONATION DISPLAY
        </div>

        {/* Temple Name & Deity */}
        <div className="mb-6 max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-devotional-maroon text-amber-300 flex items-center justify-center mx-auto mb-3 border-2 border-amber-400 shadow-gold">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 tracking-tight">
            {temple.name}
          </h1>
          <p className="text-stone-300 font-medium text-base mt-1">
            {temple.deity} • {temple.city}, {temple.state}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
            <ShieldCheck className="w-4 h-4" /> Verified Payment Destination: {temple.trustName}
          </div>
        </div>

        {/* QR CODE BOX */}
        <div className="bg-white p-6 rounded-3xl border-4 border-devotional-gold shadow-2xl my-4 max-w-xs w-full flex flex-col items-center">
          <img src={qrImage} alt="Temple QR Code" className="w-64 h-64 object-contain rounded-xl" />
          <div className="mt-4 pt-3 border-t border-stone-200 w-full text-center">
            <p className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
              UPI ID / VPA
            </p>
            <p className="text-stone-900 font-mono font-bold text-sm tracking-wide">{upiId}</p>
          </div>
        </div>

        {/* Payment Apps Bar */}
        <div className="my-4 text-xs text-stone-400 flex flex-wrap items-center justify-center gap-3">
          <span>Accepts All UPI Apps:</span>
          <span className="px-2.5 py-1 rounded bg-stone-800 font-semibold text-white">Google Pay</span>
          <span className="px-2.5 py-1 rounded bg-stone-800 font-semibold text-white">PhonePe</span>
          <span className="px-2.5 py-1 rounded bg-stone-800 font-semibold text-white">Paytm</span>
          <span className="px-2.5 py-1 rounded bg-stone-800 font-semibold text-white">BHIM UPI</span>
        </div>

        {/* Counter Donor Transaction Reference Confirmation */}
        <div className="w-full max-w-md mt-4 bg-stone-800/80 p-4 rounded-2xl border border-stone-700">
          {isSubmitted ? (
            <div className="p-3 bg-emerald-900/50 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Reference {txnRef} recorded! Your official digital receipt will be issued.
            </div>
          ) : (
            <form onSubmit={handleConfirmTxn} className="flex gap-2">
              <input
                type="text"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="Enter UPI Ref No. after scanning"
                className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-600 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors"
              >
                Confirm Seva
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
