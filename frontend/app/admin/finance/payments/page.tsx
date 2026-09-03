'use client';

import React from 'react';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import { DollarSign, ShieldCheck } from 'lucide-react';

export default function FinancePaymentsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <DollarSign className="w-4 h-4" /> PAYMENT OPERATIONS
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          All Payment Transactions
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #40: Monitor successful, pending, failed, and suspicious gateway payments.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Temple</th>
                <th className="p-3">Donor</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Transaction Ref</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_DONATIONS.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-900 dark:text-amber-400">{d.donationId}</td>
                  <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">{d.templeName}</td>
                  <td className="p-3 text-stone-700 dark:text-stone-300">{d.donorName}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">₹{d.amount}</td>
                  <td className="p-3 font-semibold text-stone-800 dark:text-stone-200">{d.paymentMethod}</td>
                  <td className="p-3 font-mono text-stone-500 text-[11px]">{d.transactionId}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {d.status}
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
