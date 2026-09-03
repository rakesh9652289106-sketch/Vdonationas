'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, DollarSign, Building2, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminFinancialFlow3D() {
  return (
    <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
            <DollarSign className="w-3.5 h-3.5" /> 3D FINTECH SETTLEMENT FLOW MATRIX
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-emerald-300 mt-1">
            Automated Gateway to Temple Bank Settlement Flow
          </h3>
        </div>
        <span className="text-xs text-emerald-200/80 font-mono font-bold bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
          99.8% RECONCILIATION MATCH
        </span>
      </div>

      {/* 3D Flow Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
        {/* Node 1 */}
        <div className="bg-stone-900/80 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2 relative group hover:border-amber-400 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
            🙏
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">STAGE 1</p>
          <h4 className="font-serif font-bold text-sm text-white">Devotee Offering</h4>
          <p className="text-emerald-400 font-mono font-bold text-sm">₹45,501 Today</p>
          <span className="text-[10px] text-stone-400">Encrypted UPI / Card</span>
        </div>

        {/* Node 2 */}
        <div className="bg-stone-900/80 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2 relative group hover:border-amber-400 transition-all">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
            💳
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">STAGE 2</p>
          <h4 className="font-serif font-bold text-sm text-white">Payment Gateway</h4>
          <p className="text-indigo-300 font-mono font-bold text-sm">Razorpay / PhonePe</p>
          <span className="text-[10px] text-emerald-400">Webhook Signed</span>
        </div>

        {/* Node 3 */}
        <div className="bg-stone-900/80 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2 relative group hover:border-amber-400 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
            ⚡
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">STAGE 3</p>
          <h4 className="font-serif font-bold text-sm text-white">Automated Reconciliation</h4>
          <p className="text-amber-300 font-mono font-bold text-sm">3-Way Match</p>
          <span className="text-[10px] text-stone-400">Auto-Audited</span>
        </div>

        {/* Node 4 */}
        <div className="bg-stone-900/80 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2 relative group hover:border-amber-400 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
            🏦
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">STAGE 4</p>
          <h4 className="font-serif font-bold text-sm text-white">Temple Bank Settlement</h4>
          <p className="text-emerald-400 font-mono font-bold text-sm">Direct UTR Transfer</p>
          <span className="text-[10px] text-emerald-300 font-bold">T+1 Verified</span>
        </div>
      </div>
    </div>
  );
}
