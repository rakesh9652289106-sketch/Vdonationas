'use client';

import React from 'react';
import { MOCK_QR_CODES } from '@/lib/mock-data';
import { QrCode, ShieldCheck, Lock } from 'lucide-react';

export default function FinanceQRPaymentDestinationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <QrCode className="w-4 h-4" /> AUTHORIZED BANK SETTLEMENT ACCOUNTS
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          QR Code Payment Destination Approvals
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #42: Financial Admin authorization for changing temple bank settlement UPI IDs.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">QR ID</th>
                <th className="p-3">Temple Shrine</th>
                <th className="p-3">Approved UPI VPA</th>
                <th className="p-3">Counter Display</th>
                <th className="p-3">Financial Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_QR_CODES.map((q) => (
                <tr key={q.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-900 dark:text-amber-400">{q.qrCodeId}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">{q.displayName}</td>
                  <td className="p-3 font-mono text-stone-800 dark:text-stone-200">{q.upiId}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">{q.displayName}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ APPROVED & VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
