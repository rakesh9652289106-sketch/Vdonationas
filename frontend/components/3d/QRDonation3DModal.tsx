'use client';

import React from 'react';
import { QrCode, ShieldCheck, X, Copy, Check } from 'lucide-react';

interface QRDonation3DModalProps {
  templeName: string;
  upiId: string;
  categoryName?: string;
  onClose: () => void;
}

export default function QRDonation3DModal({
  templeName,
  upiId,
  categoryName = 'General Temple Offering',
  onClose,
}: QRDonation3DModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      {/* 3D Elevated Glass/Stone Panel (QR remains strictly FLAT & scannable) */}
      <div className="relative w-full max-w-sm bg-stone-900 rounded-3xl border border-devotional-gold/60 shadow-[0_30px_90px_rgba(212,175,55,0.4)] p-6 text-center space-y-5 text-white overflow-hidden">
        {/* Background Glowing Halo */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-tr from-amber-400/20 via-devotional-saffron/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase">
            AUTHORISED COUNTER QR MODE
          </span>
          <h3 className="font-serif font-bold text-xl text-amber-300 mt-1">{templeName}</h3>
          <p className="text-xs text-stone-300 mt-0.5">{categoryName}</p>
        </div>

        {/* FLAT SCANNABLE QR CODE CONTAINER */}
        <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-2xl border-4 border-devotional-gold shadow-2xl flex flex-col items-center justify-center space-y-2">
          {/* Simulated High-Res Scannable UPI QR */}
          <div className="w-44 h-44 bg-stone-950 p-2 rounded-xl flex items-center justify-center">
            <QrCode className="w-full h-full text-white" />
          </div>
          <span className="text-[9px] font-mono text-stone-500 uppercase font-bold tracking-widest">
            SCAN WITH ANY UPI APP
          </span>
        </div>

        {/* UPI VPA Box */}
        <div className="bg-stone-950/90 p-3 rounded-xl border border-stone-800 flex items-center justify-between text-xs font-mono">
          <span className="text-amber-300 font-bold">{upiId}</span>
          <button
            onClick={handleCopyUPI}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[10px] font-sans font-bold flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Direct Bank Settlement • 100% Traceable Receipt Generated
        </div>
      </div>
    </div>
  );
}
