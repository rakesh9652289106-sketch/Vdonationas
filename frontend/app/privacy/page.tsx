import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-stone-800 dark:text-stone-200">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h1 className="text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
          Devotee Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-stone-500 mt-1">Requirement #57 & #58 Compliance</p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed">
        <p>
          VD is committed to protecting devotee privacy. Financial transactions processed through our multi-temple digital platform enforce strict zero-logging policies for CVVs, UPI PINs, and bank passwords.
        </p>
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">1. Information Collection</h3>
        <p>
          We collect devotee name, mobile number, email, address, and optional PAN number for 80G tax exemption receipt issuance. Devotees may choose to donate anonymously to hide their names from public campaign walls.
        </p>
        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">2. Data Retention & Isolation</h3>
        <p>
          Financial records are retained as required under Indian Income Tax and accounting laws. Data is isolated per temple shrine so temple administrators cannot access records belonging to other shrines.
        </p>
      </div>
    </div>
  );
}
