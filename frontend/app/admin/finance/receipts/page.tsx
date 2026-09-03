'use client';

import React, { useState } from 'react';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import { FileText, Search } from 'lucide-react';

export default function FinanceReceiptsPage() {
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <FileText className="w-4 h-4" /> AUDITED DIGITAL RECEIPT LOG
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          Financial Receipt Management
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #46: Generate, view, re-issue, and audit historical 80G receipts.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Donation ID</th>
                <th className="p-3">Donor Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Issued Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_DONATIONS.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-900 dark:text-amber-400">{d.receiptNo}</td>
                  <td className="p-3 font-mono text-stone-700 dark:text-stone-300">{d.donationId}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">{d.donorName}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">₹{d.amount}</td>
                  <td className="p-3 text-stone-500">{d.createdAt}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() =>
                        setActiveReceipt({
                          receiptNo: d.receiptNo,
                          donationId: d.donationId,
                          templeName: d.templeName,
                          trustName: 'Sri Venkateswara Devasthanam Trust',
                          donorName: d.donorName,
                          amount: d.amount,
                          categoryName: d.categoryName || 'Annadanam',
                          date: d.createdAt,
                          paymentMethod: d.paymentMethod,
                          transactionId: d.transactionId,
                          verificationCode: d.verificationCode,
                        })
                      }
                      className="px-3 py-1 bg-emerald-800 text-white font-bold rounded-lg"
                    >
                      Audit PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
