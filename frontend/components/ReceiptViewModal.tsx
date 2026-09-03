'use client';

import React from 'react';
import { X, Printer, Download, Share2, ShieldCheck, CheckCircle2, Building2, Award } from 'lucide-react';

interface ReceiptViewModalProps {
  receiptData: {
    receiptNo: string;
    donationId: string;
    templeName: string;
    trustName: string;
    donorName: string;
    amount: number;
    categoryName: string;
    campaignTitle?: string;
    date: string;
    paymentMethod: string;
    transactionId: string;
    taxInfo?: string;
    verificationCode: string;
    achievementBadge?: string;
  } | null;
  onClose: () => void;
}

export default function ReceiptViewModal({ receiptData, onClose }: ReceiptViewModalProps) {
  if (!receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-amber-300/40 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Action Header (Hidden during print) */}
        <div className="bg-stone-900 text-white px-6 py-3 flex items-center justify-between print:hidden text-xs">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Official Verified Digital Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center gap-1 font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div className="p-8 bg-[#FAF7F2] text-stone-900 font-sans print:p-0 print:bg-white">
          {/* Receipt Watermark Header */}
          <div className="border-b-2 border-devotional-maroon pb-6 text-center relative">
            <div className="absolute top-0 right-0 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              VERIFIED 80G
            </div>

            <div className="w-12 h-12 rounded-full bg-devotional-maroon text-amber-300 flex items-center justify-center mx-auto mb-2 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>

            <h2 className="font-serif font-bold text-2xl text-devotional-maroon tracking-tight">
              {receiptData.templeName}
            </h2>
            <p className="text-xs text-stone-600 font-medium">{receiptData.trustName}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {receiptData.taxInfo || '80G Tax Exempted under Section 80G(5)(vi) of IT Act 1961'}
            </p>
          </div>

          {/* Receipt Meta Bar */}
          <div className="my-6 grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-stone-200 text-xs">
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                Receipt Number
              </p>
              <p className="font-mono font-bold text-devotional-maroon text-sm">
                {receiptData.receiptNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                Date & Time
              </p>
              <p className="font-medium text-stone-800">{receiptData.date}</p>
            </div>
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                Donation ID
              </p>
              <p className="font-mono text-stone-800">{receiptData.donationId}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                Verification Code
              </p>
              <p className="font-mono font-bold text-amber-700">{receiptData.verificationCode}</p>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="space-y-3 text-xs border-b border-stone-300 pb-6">
            <div className="flex justify-between py-1.5 border-b border-stone-200">
              <span className="text-stone-600 font-medium">Donor Name:</span>
              <span className="font-bold text-stone-900">{receiptData.donorName}</span>
            </div>

            {receiptData.achievementBadge && (
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600 font-medium">Devotee Achievement:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  {receiptData.achievementBadge}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-stone-200">
              <span className="text-stone-600 font-medium">Donation Purpose / Category:</span>
              <span className="font-semibold text-stone-800">{receiptData.categoryName}</span>
            </div>
            {receiptData.campaignTitle && (
              <div className="flex justify-between py-1.5 border-b border-stone-200">
                <span className="text-stone-600 font-medium">Campaign Supported:</span>
                <span className="font-semibold text-stone-800">{receiptData.campaignTitle}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-stone-200">
              <span className="text-stone-600 font-medium">Payment Mode:</span>
              <span className="font-semibold text-stone-800">{receiptData.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-200">
              <span className="text-stone-600 font-medium">Transaction Reference:</span>
              <span className="font-mono text-stone-700">{receiptData.transactionId}</span>
            </div>
          </div>

          {/* Big Highlight Amount */}
          <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-800">Total Offering Amount</p>
              <p className="text-2xl font-bold font-serif text-devotional-maroon">
                ₹{receiptData.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-devotional-maroon text-white font-bold rounded-lg text-xs">
                PAID & VERIFIED
              </span>
            </div>
          </div>

          {/* Verification Footprint & Digital Signature */}
          <div className="pt-4 flex items-center justify-between text-[10px] text-stone-500 border-t border-dashed border-stone-300">
            <div>
              <p className="font-semibold text-stone-700">Digital Seal & Authorized Signature</p>
              <p>Issued by VD Platform Engine</p>
              <p className="mt-1 font-mono text-[9px]">Verify online: /verify-receipt</p>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded border border-stone-300 flex items-center justify-center">
              {/* QR representation for verification */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VERIFY:${receiptData.receiptNo}:${receiptData.verificationCode}`}
                alt="Receipt Verification QR"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
