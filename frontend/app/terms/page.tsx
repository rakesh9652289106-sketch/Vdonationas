import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-stone-800 dark:text-stone-200">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h1 className="text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-stone-500 mt-1">Requirement #84 Compliance</p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed">
        <p>
          By accessing the VD multi-temple digital donation platform, you agree to these terms. All digital offerings made to participating temple devasthanams are final and subject to server verification.
        </p>
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">1. Verification & Receipts</h3>
        <p>
          Receipts are issued automatically upon server-side payment confirmation. Tax exemption benefits under Section 80G apply to eligible participating temple trusts.
        </p>
      </div>
    </div>
  );
}
