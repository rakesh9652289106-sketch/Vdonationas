'use client';

import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

export default function FinanceReportsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <FileSpreadsheet className="w-4 h-4" /> FINANCIAL REPORTING ENGINE
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          Financial Statement Generator
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #47: Generate daily, weekly, monthly, temple-wise, settlement, and reconciliation reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'Daily Collections & Settlement Summary',
          'Monthly Temple-wise Revenue Report',
          'Gateway Commission & Fee Audit',
          'Offline Hundi Cash Audit Log',
          'Refund & Dispute Settlement Ledger',
          'Annual 80G Tax Compliance Statement',
        ].map((title) => (
          <div key={title} className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Exporting ${title} as PDF...`)}
                className="px-3 py-1.5 bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => alert(`Exporting ${title} as Excel...`)}
                className="px-3 py-1.5 bg-stone-900 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel / CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
