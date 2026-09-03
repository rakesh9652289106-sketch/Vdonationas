'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function FinanceAlertsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <AlertTriangle className="w-4 h-4" /> ANOMALY & MISMATCH ALERTS
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          Financial Anomaly & Risk Alerts
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #48: Automated alerts for payment mismatches, failed webhooks, or large transactions.
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-4 bg-amber-50 dark:bg-stone-900 rounded-2xl border border-amber-300 dark:border-amber-700 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-400">Settlement Delay Alert</h4>
            <p className="text-stone-700 dark:text-stone-300 mt-0.5">
              Razorpay settlement #SETTL-8812 delayed by 4 hours for Tirupati Shrine.
            </p>
            <span className="text-[10px] text-stone-400 block pt-1">Logged today at 14:20 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
