'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function FinanceGatewaysPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <Lock className="w-4 h-4" /> SECURE GATEWAY ENGINE
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          Payment Provider Gateway Status
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #41: Server-side API gateway configurations (Razorpay, PhonePe, Paytm, Cashfree).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {[
          { name: 'Razorpay Payment Gateway', status: 'ACTIVE (LIVE MODE)', mid: 'MID_RZP_998123' },
          { name: 'PhonePe PG & UPI Intent', status: 'ACTIVE (LIVE MODE)', mid: 'MID_PPE_440192' },
          { name: 'Paytm Dynamic QR Engine', status: 'ACTIVE (LIVE MODE)', mid: 'MID_PTM_110992' },
          { name: 'Cashfree PG & NetBanking', status: 'ACTIVE (LIVE MODE)', mid: 'MID_CF_559981' },
        ].map((g) => (
          <div key={g.name} className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {g.status}
            </span>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{g.name}</h3>
            <p className="font-mono text-stone-500 text-[11px]">Merchant ID: {g.mid}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
