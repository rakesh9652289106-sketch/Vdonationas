'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function SuperAdminRolesPage() {
  return (
    <div className="space-y-6 text-stone-100 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" /> PLATFORM ROLE MATRIX
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
          Granular RBAC Roles Matrix
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Requirement #54 & #82: Define role permissions for Super Admin, Temple Admin, Finance Admin, and Devotee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {[
          { name: 'SUPER_ADMIN', desc: 'Full unrestricted platform management, temple verification, global settings.' },
          { name: 'TEMPLE_ADMIN', desc: 'Scope-restricted shrine profile, categories, campaigns, QR codes, and donors.' },
          { name: 'FINANCE_ADMIN', desc: 'Gateway reconciliation, bank settlement matrix, offline cash recording, refunds.' },
          { name: 'CONTENT_ADMIN', desc: 'Gallery uploads, announcements, festival calendar updates.' },
          { name: 'DEVOTEE', desc: 'Public website, personal donation history, 80G tax receipts, recurring subscriptions.' },
        ].map((r) => (
          <div key={r.name} className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px]">
              {r.name}
            </span>
            <h3 className="font-bold text-stone-100 text-sm mt-1">{r.name.replace('_', ' ')}</h3>
            <p className="text-stone-400 text-xs">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
