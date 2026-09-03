'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { Bell, Flame, Calendar, Sparkles, CheckCircle2, Megaphone, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

export default function DevoteeNotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vasavi_devotee_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        const combined = [...parsed, ...MOCK_NOTIFICATIONS.filter((m) => !parsed.some((p: any) => p.id === m.id))];
        setNotifications(combined);
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarNotifications')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarNotifications')} & Sacred Broadcasts
          </h1>
          <p className="text-amber-100/80 text-xs">
            1-Day Prior Seva Ticket Release Broadcasts, 80G Receipts & Festival Announcements
          </p>
        </div>
      </div>

      {/* 3D NOTIFICATIONS LIST WITH HOVER MOTION */}
      <div className="space-y-4">
        {notifications.map((n: any) => {
          const isBroadcast = n.isBroadcastRelease;
          const isPoojaReminder = n.isPoojaReminder || n.title?.toLowerCase().includes('pooja') || n.title?.toLowerCase().includes('reminder');

          return (
            <div
              key={n.id}
              className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 transform flex items-start gap-4 ${
                isBroadcast
                  ? 'border-amber-400 dark:border-amber-400 bg-gradient-to-r from-amber-100/50 via-white to-amber-50 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/40 ring-2 ring-amber-300/40'
                  : isPoojaReminder
                  ? 'border-amber-300/80 bg-stone-50/50 dark:bg-stone-900'
                  : 'border-devotional-gold/40 hover:border-amber-400'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isBroadcast
                    ? 'bg-gradient-to-br from-devotional-saffron to-amber-600 text-white border-amber-400 shadow-gold animate-pulse'
                    : isPoojaReminder
                    ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-devotional-maroon border-amber-400 shadow-md'
                    : 'bg-amber-100 dark:bg-amber-950 text-devotional-saffron border-amber-300'
                }`}
              >
                {isBroadcast ? (
                  <Megaphone className="w-6 h-6 text-white" />
                ) : isPoojaReminder ? (
                  <Sparkles className="w-6 h-6 text-devotional-maroon animate-pulse" />
                ) : (
                  <Bell className="w-5 h-5 text-devotional-saffron" />
                )}
              </div>

              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {n.title}
                  </h4>
                  {isBroadcast && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold border border-amber-500 shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 1-Day Prior Release Alert
                    </span>
                  )}
                  {isPoojaReminder && !isBroadcast && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Scheduled
                    </span>
                  )}
                </div>

                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{n.message}</p>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono block">
                    {n.createdAt}
                  </span>

                  {(isBroadcast || isPoojaReminder) && (
                    <Link
                      href="/devotee/poojas"
                      className="px-3 py-1 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-serif font-bold text-[11px] rounded-xl hover:brightness-110 shadow-sm border border-amber-400/30"
                    >
                      {isBroadcast ? 'Go to Pooja Calendar →' : 'View Pooja Pass →'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
