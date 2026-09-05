'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Initiative,
  registerDevoteeMuhurthamReminder,
  isInitiativeReminderSet,
} from '@/lib/initiatives-data';
import {
  Clock,
  Sparkles,
  Bell,
  CheckCircle2,
  Calendar,
  Flame,
  ExternalLink,
  Sun,
  ShieldCheck,
  Send,
  MessageSquare,
  Smartphone,
} from 'lucide-react';

interface AuspiciousMuhurthamTeaserProps {
  initiative: Initiative;
  compact?: boolean;
  onReminderToggled?: () => void;
}

export default function AuspiciousMuhurthamTeaser({
  initiative,
  compact = false,
  onReminderToggled,
}: AuspiciousMuhurthamTeaserProps) {
  const [reminderActive, setReminderActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time remaining state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  // Sync reminder active state on mount
  useEffect(() => {
    if (initiative?.code) {
      setReminderActive(isInitiativeReminderSet(initiative.code));
    }
  }, [initiative?.code]);

  // Real-time ticking countdown clock
  useEffect(() => {
    if (!initiative?.scheduled_publish_at) return;

    const targetTime = new Date(initiative.scheduled_publish_at).getTime();

    const calculateTime = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [initiative?.scheduled_publish_at]);

  const handleToggleReminder = () => {
    const success = registerDevoteeMuhurthamReminder(initiative);
    if (success) {
      setReminderActive(true);
      setToastMessage('✓ Auspicious Reminder Set! You will receive Push, SMS & WhatsApp alerts upon Muhurtham release.');
      setTimeout(() => setToastMessage(null), 5000);
      if (onReminderToggled) onReminderToggled();
    }
  };

  const formattedDate = initiative.scheduled_publish_at
    ? new Date(initiative.scheduled_publish_at).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Tomorrow';

  const formattedTime = initiative.scheduled_publish_at
    ? new Date(initiative.scheduled_publish_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '04:30 AM';

  const muhurthamTitle = initiative.muhurtham_name || 'Brahma Muhurtham Sacred Launch';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-devotional-maroon-dark to-stone-950 text-white border-2 border-devotional-gold/60 shadow-2xl transition-all duration-300 hover:border-amber-400">
      {/* Sacred Ambient Background Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Vedic Watermark Icon */}
      <div className="absolute right-6 top-6 text-amber-400/5 text-9xl font-serif select-none pointer-events-none">
        🛕
      </div>

      <div className="relative z-10 p-5 sm:p-7 space-y-5">
        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-devotional-saffron/20 border border-amber-400/50 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            <Sun className="w-3.5 h-3.5 text-devotional-gold animate-pulse" />
            <span>Auspicious Muhurtham Launch Teaser (IST)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-amber-200/90">
            <span className="bg-stone-900/90 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
              {initiative.code}
            </span>
            <span className="bg-devotional-maroon text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 uppercase">
              Pre-Launch
            </span>
          </div>
        </div>

        {/* Center Grid: Details & 3D Countdown Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left info column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-devotional-saffron font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {muhurthamTitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-200 tracking-tight leading-tight">
                {initiative.title}
              </h3>
            </div>

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed max-w-xl">
              {initiative.objective || initiative.description}
            </p>

            {/* Sacred Launch Metadata Ribbon */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-stone-300 font-mono bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-800">
                <Calendar className="w-3.5 h-3.5 text-devotional-saffron" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold bg-stone-900/80 px-3 py-1.5 rounded-xl border border-amber-400/40">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formattedTime} IST</span>
              </div>
              <div className="text-stone-400 text-xs flex items-center gap-1">
                📍 {initiative.city}, {initiative.state}
              </div>
            </div>

            {/* Automated Broadcast Ready Channels */}
            {initiative.broadcast_on_publish && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] text-stone-300">
                <span className="text-stone-400 uppercase font-bold">Automated Broadcast:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  <Smartphone className="w-2.5 h-2.5" /> SMS Dispatched
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  <MessageSquare className="w-2.5 h-2.5" /> WhatsApp Broadcast
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800">
                  <Bell className="w-2.5 h-2.5" /> Push Notification
                </span>
              </div>
            )}
          </div>

          {/* Right column: 3D Countdown Clock (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Sacred Release Countdown
            </span>

            {timeLeft.isPassed ? (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-center space-y-1">
                <p className="text-xs font-bold text-emerald-300">🪔 Sacred Muhurtham Arrived!</p>
                <p className="text-[11px] text-stone-200">The initiative is now open for devotee seva and donations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Mins', val: timeLeft.minutes },
                  { label: 'Secs', val: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="flex flex-col items-center justify-center w-14 sm:w-16 h-16 sm:h-20 rounded-2xl bg-stone-900/95 border-2 border-devotional-gold/40 shadow-inner shadow-black"
                  >
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-amber-400 tracking-tight">
                      {String(unit.val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Devotional Action Bar */}
        <div className="pt-4 border-t border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-amber-200/90 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron shrink-0 animate-pulse" />
            <span>Devotees will receive instant darshan and donation links at release.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleReminder}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
                reminderActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white shadow-gold'
              }`}
            >
              {reminderActive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Reminder Active</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Set Devotee Reminder Alert</span>
                </>
              )}
            </button>

            <Link
              href={`/initiatives/${initiative.code}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-amber-400/50 hover:bg-amber-400/10 text-amber-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>Preview Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* In-app Devotee Toast */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
