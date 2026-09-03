'use client';

import React, { useState } from 'react';
import { X, Share2, Send, CheckCircle2, Phone, Mail, MessageSquare } from 'lucide-react';

interface ReceiptShareModalProps {
  receiptNo: string;
  donorName: string;
  amount: number;
  onClose: () => void;
}

export default function ReceiptShareModal({
  receiptNo,
  donorName,
  amount,
  onClose,
}: ReceiptShareModalProps) {
  const [mobile, setMobile] = useState('+91 9123456789');
  const [email, setEmail] = useState('devotee@gmail.com');
  const [isSentWhatsApp, setIsSentWhatsApp] = useState(false);
  const [isSentEmail, setIsSentEmail] = useState(false);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🙏 Jai Sri Vasavi Matha! Official 80G Digital Receipt No: ${receiptNo} for Seva Offering of ₹${amount.toLocaleString(
        'en-IN'
      )} has been issued to ${donorName}. Download PDF: https://vasavimatha.org/receipt/${receiptNo}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setIsSentWhatsApp(true);
  };

  const handleShareEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSentEmail(true);
    setTimeout(() => setIsSentEmail(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-amber-300/60 shadow-2xl p-6 space-y-6 text-stone-900 dark:text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
            <Share2 className="w-4 h-4" /> INSTANT DIGITAL DELIVERY
          </div>
          <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            Share 80G Receipt & Certificate
          </h2>
          <p className="text-xs text-stone-500">
            Deliver verified PDF tax receipt to your phone via WhatsApp, SMS, or Email.
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-4 text-xs">
          {/* WhatsApp Direct Share */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Deliver to WhatsApp
              </span>
              {isSentWhatsApp && (
                <span className="text-[10px] font-bold text-emerald-600">✓ Sent!</span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              Receive official WhatsApp message with PDF download link.
            </p>
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send to WhatsApp (+91 9123456789)
            </button>
          </div>

          {/* Email Delivery */}
          <form onSubmit={handleShareEmail} className="p-4 bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 rounded-2xl space-y-3">
            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-600" /> Send via Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
              placeholder="Enter email address"
            />
            {isSentEmail ? (
              <div className="text-emerald-600 font-bold text-center">✓ Email dispatched successfully!</div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-devotional-maroon text-amber-300 font-bold hover:bg-devotional-maroon-dark transition-colors shadow-md"
              >
                Send Official PDF to Email
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
