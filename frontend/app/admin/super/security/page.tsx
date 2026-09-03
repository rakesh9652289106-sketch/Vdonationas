'use client';

import React from 'react';
import { MOCK_SECURITY_ALERTS } from '@/lib/mock-data';
import { ShieldCheck, Activity, Database, Server, Mail, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SecurityCenterPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarSecurityFraud')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarSecurityFraud')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Real-Time Anomaly Detection, Infrastructure Health Monitors & Cryptographic Fraud Prevention
          </p>
        </div>
      </div>

      {/* 3D SYSTEM HEALTH CARDS WITH HOVER MOTION */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-bold uppercase">
            <span>Database Status</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-emerald-600 text-base">HEALTHY</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">PostgreSQL Engine Active</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-bold uppercase">
            <span>Payment Gateway APIs</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-emerald-600 text-base">HEALTHY</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">Gateway Latency: 38ms</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-bold uppercase">
            <span>Webhook Queue</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-emerald-600 text-base">HEALTHY</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">Idempotency Protected</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-bold uppercase">
            <span>Email & SMS Gateway</span>
            <Mail className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-emerald-600 text-base">HEALTHY</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">80G Notifications Operational</p>
        </div>
      </div>

      {/* SECURITY LOGS & FRAUD DETECTION TABLE CARD */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-2xl space-y-4 hover:border-amber-400 transition-all">
        <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
          Security Events & Automated Risk Alerts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Event Type</th>
                <th className="p-3.5">Severity Level</th>
                <th className="p-3.5">Security Log Description</th>
                <th className="p-3.5">Logged Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_SECURITY_ALERTS.map((sec) => (
                <tr key={sec.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-700 dark:text-amber-400">{sec.eventType}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        sec.severity === 'HIGH'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400/40'
                          : sec.severity === 'MEDIUM'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-400/40'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-400/40'
                      }`}
                    >
                      {sec.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-semibold">{sec.details}</td>
                  <td className="p-3.5 text-stone-500 font-mono">{sec.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
