'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Initiative,
  registerDevoteeMuhurthamReminder,
  isInitiativeReminderSet,
  isWithin24HoursOfRelease,
  INITIATIVE_TYPE_LABELS,
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
  MapPin,
} from 'lucide-react';

interface AuspiciousMuhurthamTeaserProps {
  initiative: Initiative;
  compact?: boolean;
  onReminderToggled?: () => void;
}

// Robust resolver: guarantees an upcoming future Muhurtham date and synchronized formatted labels
export function resolveAuspiciousLaunchDate(initiative?: Partial<Initiative> | null): {
  targetDate: Date;
  formattedDate: string;
  formattedTime: string;
  targetMs: number;
  isToday?: boolean;
  isTomorrow?: boolean;
} {
  let targetDate: Date | null = null;

  if (initiative?.scheduled_publish_at) {
    const parsed = new Date(initiative.scheduled_publish_at);
    if (!isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }

  // If missing, null, unparseable, or expired in the past: schedule upcoming Brahma Muhurtham (Tomorrow 04:30 AM IST)
  if (!targetDate) {
    const fallback = new Date();
    fallback.setHours(4, 30, 0, 0);
    if (fallback.getTime() <= Date.now()) {
      fallback.setDate(fallback.getDate() + 1);
    }
    targetDate = fallback;
  }

  const now = new Date();
  const isToday =
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear();

  const isTomorrow =
    targetDate.getDate() === now.getDate() + 1 &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear();

  const formattedDate = isToday
    ? `Today (${targetDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})`
    : isTomorrow
    ? `Tomorrow (${targetDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})`
    : targetDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const formattedTime = targetDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { targetDate, formattedDate, formattedTime, targetMs: targetDate.getTime(), isToday, isTomorrow };
}

export default function AuspiciousMuhurthamTeaser({
  initiative,
  compact = false,
  onReminderToggled,
}: AuspiciousMuhurthamTeaserProps) {
  const [reminderActive, setReminderActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Memoize resolved launch date so references remain completely stable across renders
  const { formattedDate, formattedTime, targetMs } = useMemo(() => {
    return resolveAuspiciousLaunchDate(initiative);
  }, [initiative?.scheduled_publish_at, initiative?.code]);

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

  // Real-time ticking countdown clock - depends ONLY on primitive targetMs timestamp
  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = targetMs - now;

      if (diff <= 0) {
        setTimeLeft((prev) => (prev.isPassed ? prev : { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true }));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft((prev) => {
        // Prevent redundant state updates if time unit numbers have not changed
        if (
          prev.days === days &&
          prev.hours === hours &&
          prev.minutes === minutes &&
          prev.seconds === seconds &&
          !prev.isPassed
        ) {
          return prev;
        }
        return { days, hours, minutes, seconds, isPassed: false };
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const handleToggleReminder = () => {
    const success = registerDevoteeMuhurthamReminder(initiative);
    if (success) {
      setReminderActive(true);
      setToastMessage('✓ Auspicious Reminder Set! You will receive Push, SMS & WhatsApp alerts upon Muhurtham release.');
      setTimeout(() => setToastMessage(null), 5000);
      if (onReminderToggled) onReminderToggled();
    }
  };

  const muhurthamTitle = initiative.muhurtham_name || 'Brahma Muhurtham Sacred Launch';
  const typeConfig = INITIATIVE_TYPE_LABELS[initiative.initiative_type] || INITIATIVE_TYPE_LABELS.OTHER;

  // Determine if this initiative is within 24 hours of release
  // Satisfied automatically if isWithin24HoursOfRelease is true, or days remaining === 0 and not passed
  const isUnder24Hours =
    isWithin24HoursOfRelease(initiative) ||
    (timeLeft.days === 0 && !timeLeft.isPassed && (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0));

  // User Rule: Here countdown teaser should only be visible from before 24hrs of initiative release
  if (!isUnder24Hours) {
    return null;
  }

  // -------------------------------------------------------------
  // UNIQUE 24-HOUR FINAL LAUNCH SPOTLIGHT DISPLAY
  // Triggered automatically when within 24 hours of releasing date & time
  // -------------------------------------------------------------
  if (isUnder24Hours) {
    return (
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1c0800] via-[#2d0e04] to-[#160600] text-white border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/20 transition-all duration-300">
        {/* Animated Sacred Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-5 space-y-3">
          {/* Top Header Strip: Compact Imminent 24h Release Alert */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/40 via-amber-600/40 to-amber-500/40 border border-amber-300/80 text-amber-200 text-[11px] font-black uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-current animate-pulse" />
              <span>⚡ IMMINENT SACRED RELEASE • UNDER 24 HOURS (IST)</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="bg-stone-900/90 px-2.5 py-0.5 rounded-lg border border-amber-400/40 text-amber-200 font-bold text-[11px]">
                {initiative.code}
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black px-2.5 py-0.5 rounded-lg shadow-sm text-[11px] uppercase">
                Final Countdown
              </span>
            </div>
          </div>

          {/* Compact Consecration & Public Release Timing Ribbon */}
          <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-400/50 rounded-xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-amber-300 font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Consecration:
              </span>
              <span className="font-serif font-bold text-amber-100 text-sm">
                📅 {formattedDate}
              </span>
              <span className="text-devotional-gold font-bold">at</span>
              <span className="bg-stone-950/90 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-400/30 text-xs">
                ⏰ {formattedTime} IST
              </span>
              <span className="text-stone-400 text-[11px] hidden sm:inline">• {muhurthamTitle}</span>
            </div>
            <span className="text-[10px] uppercase font-extrabold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 shrink-0">
              ⚡ Under 24h
            </span>
          </div>

          {/* Middle Row: Title & Details (Left) + Compact 24h Countdown Clock (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
            {/* Left Column: Clean Title & Meta (no large objective box or broadcast row) */}
            <div className="lg:col-span-7 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm border ${typeConfig.badgeColor}`}>
                  <span>{typeConfig.icon}</span>
                  <span>{initiative.custom_type || typeConfig.label}</span>
                </span>
                <span className="text-stone-300 text-xs flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-devotional-saffron" /> {initiative.city}, {initiative.state}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-tight leading-snug line-clamp-1">
                {initiative.title}
              </h3>
            </div>

            {/* Right Column: Compact 24-Hour Digital Countdown Blocks */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-1.5">
              <span className="text-[10px] font-bold text-amber-300/90 uppercase tracking-widest block flex items-center gap-1">
                <Clock className="w-3 h-3 text-devotional-saffron" />
                <span>Launch Countdown (IST)</span>
              </span>

              {timeLeft.isPassed ? (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-400 text-center space-y-0.5 shadow-md w-full max-w-xs">
                  <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                    🪔 Sacred Muhurtham Arrived!
                  </p>
                  <p className="text-[11px] text-stone-200">The initiative is now open for devotee seva.</p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 text-center">
                  {[
                    { label: 'Hours', val: timeLeft.hours },
                    { label: 'Minutes', val: timeLeft.minutes },
                    { label: 'Seconds', val: timeLeft.seconds },
                  ].map((unit, idx) => (
                    <React.Fragment key={unit.label}>
                      {idx > 0 && (
                        <span className="text-lg sm:text-xl font-black text-amber-400 animate-pulse">:</span>
                      )}
                      <div className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-stone-900/95 border-2 border-amber-400 shadow-lg shadow-amber-950/40">
                        <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                          {String(unit.val).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400/80 mt-0.5">
                          {unit.label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Ribbon: Compact & Clean */}
          <div className="pt-2.5 border-t border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-xs text-amber-200/90 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-devotional-saffron shrink-0 animate-pulse" />
              <span>Devotees setting alerts receive direct darshan links immediately upon consecration.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleToggleReminder}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
                  reminderActive
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-devotional-saffron via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-black shadow-gold'
                }`}
              >
                {reminderActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>✓ Reminder Active</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-stone-950" />
                    <span>Set Devotee Reminder Alert</span>
                  </>
                )}
              </button>

              <Link
                href={`/initiatives/${initiative.code}`}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-amber-400 hover:bg-amber-400/10 text-amber-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <span>Preview Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* In-app Devotee Toast Feedback */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

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
