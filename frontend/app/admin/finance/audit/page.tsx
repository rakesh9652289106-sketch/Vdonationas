'use client';

import React from 'react';
import { MOCK_AUDIT_LOGS } from '@/lib/mock-data';
import { Lock, ShieldCheck } from 'lucide-react';

export default function FinanceAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
          <Lock className="w-4 h-4" /> FINANCIAL CRYPTOGRAPHIC AUDIT
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950 dark:text-amber-400">
          Financial Operation Audit Logs
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Requirement #49: Audit log tracking refund approvals, QR changes, offline entries, and report exports.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">User / Role</th>
                <th className="p-3">Financial Action</th>
                <th className="p-3">Temple Scope</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-900 dark:text-amber-400">{log.id}</td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">{log.userName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">{log.templeName || 'Global'}</td>
                  <td className="p-3 text-stone-500 font-mono text-[11px]">{log.date} {log.time}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300 font-mono text-[11px] truncate max-w-xs">
                    {log.oldValue} ➔ {log.newValue}
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
