'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { Bell, Flame, Calendar, Sparkles, CheckCircle2, Megaphone, Clock } from 'lucide-react';
import { IconTempleBell } from '@/components/icons/DevotionalIcons';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { notificationsService } from '@/lib/supabase-service';

export default function DevoteeNotificationsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    async function loadNotifs() {
      let dbList: any[] = [];
      if (user?.id) {
        try {
          const dbData = await notificationsService.getDevoteeNotifications(user.id);
          if (dbData && dbData.length > 0) {
            dbList = dbData.map((n: any) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              createdAt: n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN') : 'Recently',
              isRead: n.is_read,
              isBroadcastRelease: n.type === 'BROADCAST',
              isInitiativeBroadcast: n.type === 'INITIATIVE',
            }));
          }
        } catch (err) {
          console.warn('[Supabase] Failed to fetch notifications:', err);
        }
      }

      try {
        const saved = localStorage.getItem('vasavi_devotee_notifications');
        const parsed = saved ? JSON.parse(saved) : [];
        const combined = [...dbList, ...parsed, ...MOCK_NOTIFICATIONS.filter((m) => !dbList.some((d: any) => d.id === m.id) && !parsed.some((p: any) => p.id === m.id))];
        setNotifications(combined);
      } catch {
        if (dbList.length > 0) setNotifications(dbList);
      }
    }
    loadNotifs();
  }, [user]);

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
            Auspicious Muhurtham Broadcasts, 1-Day Prior Seva Ticket Release Alerts, 80G Receipts & Sacred Initiatives
          </p>
        </div>
      </div>

      {/* 3D NOTIFICATIONS LIST WITH HOVER MOTION */}
      <div className="space-y-4">
        {notifications.map((n: any) => {
          const isBroadcast = n.isBroadcastRelease;
          const isInitiative = n.isInitiativeBroadcast;
          const isInitiativeReminder = n.isInitiativeReminder;
          const isPoojaReminder = n.isPoojaReminder || n.title?.toLowerCase().includes('pooja') || (n.title?.toLowerCase().includes('reminder') && !isInitiativeReminder);

          return (
            <div
              key={n.id}
              className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 transform flex items-start gap-4 ${
                isInitiative
                  ? 'border-amber-400 dark:border-amber-400 bg-gradient-to-r from-amber-50/70 via-white to-amber-100/50 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/50 ring-2 ring-amber-400/40'
                  : isBroadcast
                  ? 'border-amber-400 dark:border-amber-400 bg-gradient-to-r from-amber-100/50 via-white to-amber-50 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/40 ring-2 ring-amber-300/40'
                  : isInitiativeReminder || isPoojaReminder
                  ? 'border-amber-300/80 bg-stone-50/50 dark:bg-stone-900'
                  : 'border-devotional-gold/40 hover:border-amber-400'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isInitiative
                    ? 'bg-gradient-to-br from-devotional-maroon to-devotional-saffron text-amber-300 border-amber-400 shadow-gold animate-pulse'
                    : isBroadcast
                    ? 'bg-gradient-to-br from-devotional-saffron to-amber-600 text-white border-amber-400 shadow-gold animate-pulse'
                    : isInitiativeReminder || isPoojaReminder
                    ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-devotional-maroon border-amber-400 shadow-md'
                    : 'bg-amber-100 dark:bg-amber-950 text-devotional-saffron border-amber-300'
                }`}
              >
                {isInitiative ? (
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                ) : isBroadcast ? (
                  <Megaphone className="w-6 h-6 text-white" />
                ) : isInitiativeReminder || isPoojaReminder ? (
                  <Clock className="w-6 h-6 text-devotional-maroon animate-pulse" />
                ) : (
                  <IconTempleBell size={24} />
                )}
              </div>

              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {n.title}
                  </h4>
                  {isInitiative && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-devotional-saffron to-amber-500 text-white text-[10px] font-bold border border-amber-300 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Sacred Initiative Broadcast
                    </span>
                  )}
                  {isBroadcast && !isInitiative && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold border border-amber-500 shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 1-Day Prior Release Alert
                    </span>
                  )}
                  {isInitiativeReminder && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Scheduled • Muhurtham Alert
                    </span>
                  )}
                  {isPoojaReminder && !isBroadcast && !isInitiativeReminder && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Scheduled
                    </span>
                  )}
                </div>

                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{n.message}</p>

                {/* Delivery Channels */}
                {n.broadcastChannels && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-stone-400">
                    <span className="font-bold text-stone-500">Channels Delivered:</span>
                    {n.broadcastChannels.map((ch: string) => (
                      <span key={ch} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-mono">
                        {ch}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono block">
                    {n.createdAt}
                  </span>

                  {isInitiative ? (
                    <Link
                      href={n.initiativeCode ? `/initiatives/${n.initiativeCode}` : '/initiatives'}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-amber-200 font-serif font-bold text-[11px] rounded-xl hover:brightness-110 shadow-sm border border-amber-400/40"
                    >
                      Explore Initiative & Donate →
                    </Link>
                  ) : isInitiativeReminder ? (
                    <Link
                      href={n.initiativeCode ? `/initiatives/${n.initiativeCode}` : '/initiatives'}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold text-[11px] rounded-xl hover:brightness-110 shadow-sm border border-amber-300/40"
                    >
                      View Pre-Launch Teaser →
                    </Link>
                  ) : (isBroadcast || isPoojaReminder) ? (
                    <Link
                      href="/devotee/poojas"
                      className="px-3 py-1 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-serif font-bold text-[11px] rounded-xl hover:brightness-110 shadow-sm border border-amber-400/30"
                    >
                      {isBroadcast ? 'Go to Pooja Calendar →' : 'View Pooja Pass →'}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
