'use client';

import React from 'react';
import { X, Printer, Download, ShieldCheck, Award, Building2 } from 'lucide-react';

interface VasaviSevaCertificateModalProps {
  certificateData: {
    devoteeName: string;
    sevaType: string;
    amount: number;
    date: string;
    transactionId: string;
    receiptNo: string;
    templeName: string;
  } | null;
  onClose: () => void;
}

export default function VasaviSevaCertificateModal({
  certificateData,
  onClose,
}: VasaviSevaCertificateModalProps) {
  if (!certificateData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Action Bar */}
        <div className="bg-stone-900 text-white px-6 py-3 flex items-center justify-between print:hidden text-xs">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Sri Vasavi Kanyaka Parameswari Matha — Official Seva Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center gap-1 font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Save / Print Certificate
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DIGITAL SEVA CERTIFICATE */}
        <div className="p-8 sm:p-12 bg-[#FAF7F2] text-stone-900 font-sans print:p-0 print:bg-white relative border-8 border-devotional-maroon m-2 rounded-2xl space-y-6 text-center">
          {/* Inner Gold Filament Border */}
          <div className="absolute inset-2 border-2 border-devotional-gold pointer-events-none rounded-xl" />

          {/* Header Seal */}
          <div className="space-y-2 relative z-10 pt-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-amber-400 text-amber-300 flex items-center justify-center mx-auto text-2xl shadow-xl border-2 border-amber-300">
              🌺
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-devotional-maroon tracking-wide uppercase">
              Sri Vasavi Kanyaka Parameswari Matha
            </h1>
            <p className="text-xs font-serif font-bold text-amber-800 tracking-widest uppercase">
              SEVA & DHARMA CERTIFICATE OF APPRECIATION
            </p>
          </div>

          <p className="text-xs text-stone-600 max-w-md mx-auto italic">
            "This certificate is devoutly presented with divine blessings to honor your sacred contribution."
          </p>

          {/* Devotee Name Highlight */}
          <div className="py-2 border-y border-amber-300/80 max-w-md mx-auto">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
              THIS CERTIFIES THAT DEVOTEE
            </span>
            <p className="font-serif font-bold text-2xl text-devotional-maroon mt-0.5">
              {certificateData.devoteeName}
            </p>
          </div>

          {/* Certificate Body text */}
          <p className="text-xs text-stone-700 leading-relaxed max-w-lg mx-auto">
            Has offered sacred <strong className="text-devotional-maroon">{certificateData.sevaType}</strong> of{' '}
            <strong className="text-amber-800">₹{certificateData.amount.toLocaleString('en-IN')}</strong> to{' '}
            {certificateData.templeName}. May Goddess Sri Vasavi Kanyaka Parameswari bestow health, peace, prosperity, and joy upon your family.
          </p>

          {/* Meta Details Bar */}
          <div className="grid grid-cols-3 gap-2 bg-amber-50 p-4 rounded-xl border border-amber-200 text-left text-xs max-w-lg mx-auto">
            <div>
              <span className="text-[9px] text-stone-500 font-bold uppercase block">Date Offered</span>
              <span className="font-semibold text-stone-900">{certificateData.date}</span>
            </div>
            <div>
              <span className="text-[9px] text-stone-500 font-bold uppercase block">Transaction Ref</span>
              <span className="font-mono text-stone-800 text-[11px]">{certificateData.transactionId}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-stone-500 font-bold uppercase block">Certificate No</span>
              <span className="font-mono font-bold text-devotional-maroon text-[11px]">{certificateData.receiptNo}</span>
            </div>
          </div>

          {/* Signatures & Seal Footprint */}
          <div className="pt-4 flex items-center justify-between text-left text-[10px] text-stone-600 border-t border-amber-300 max-w-lg mx-auto">
            <div>
              <p className="font-serif font-bold text-stone-900 text-xs">Devasthanam Trustee Board</p>
              <p className="text-[9px] text-stone-500">Sri Vasavi Kanyaka Parameswari Trust</p>
            </div>

            <div className="w-16 h-16 bg-white p-1 rounded border border-amber-300 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VASAVI_CERT:${certificateData.receiptNo}`}
                alt="Certificate Verification QR"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
