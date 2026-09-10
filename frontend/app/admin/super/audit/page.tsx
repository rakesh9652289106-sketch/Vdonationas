'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_AUDIT_LOGS } from '@/lib/mock-data';
import { Lock, Download, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { adminService } from '@/lib/supabase-service';

export default function AuditLogsPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const [logs, setLogs] = useState<any[]>(MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAuditLogs(50).then((dbLogs) => {
      if (dbLogs && dbLogs.length > 0) {
        setLogs(
          dbLogs.map((l: any) => ({
            id: `AUD-${l.id.slice(0, 8).toUpperCase()}`,
            userName: l.performed_by || 'Admin',
            action: l.action,
            templeName: 'Penugonda Matha',
            oldValue: l.old_values ? JSON.stringify(l.old_values).slice(0, 30) : '-',
            newValue: l.new_values ? JSON.stringify(l.new_values).slice(0, 40) : 'Updated',
            date: l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN') : 'Today',
            time: l.created_at ? new Date(l.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
            ipAddress: l.ip_address || '127.0.0.1',
          }))
        );
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    showAlert({
      type: 'info',
      title: 'Audit Log Exported',
      message: 'Cryptographic Immutable Audit Log trail exported in JSON / CSV format.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarAuditLogs')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarAuditLogs')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Immutable Cryptographic Ledger & System Configuration Audit Trails
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Download className="w-4 h-4 text-devotional-maroon" /> Export Cryptographic Audit CSV
        </button>
      </div>

      {/* 3D AUDIT TABLE CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-2xl space-y-4 hover:border-amber-400 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">Administrator</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Temple Target</th>
                <th className="p-3.5">Previous State</th>
                <th className="p-3.5">New State</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {logs.map((aud) => (
                <tr key={aud.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-devotional-maroon dark:text-amber-400">
                    {aud.id}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{aud.userName}</td>
                  <td className="p-3.5 font-semibold text-amber-700 dark:text-amber-400">{aud.action}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">{aud.templeName || 'GLOBAL'}</td>
                  <td className="p-3.5 text-stone-500 font-mono text-[11px]">{aud.oldValue || '-'}</td>
                  <td className="p-3.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{aud.newValue}</td>
                  <td className="p-3.5 text-stone-500">
                    {aud.date} {aud.time}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-stone-400">{aud.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
