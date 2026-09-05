'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Initiative,
  INITIATIVE_TYPE_LABELS,
  registerDevoteeMuhurthamReminder,
  isInitiativeReminderSet,
} from '@/lib/initiatives-data';
import {
  MapPin,
  Flame,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Bell,
} from 'lucide-react';

interface InitiativeCard3DProps {
  initiative: Initiative;
}

export default function InitiativeCard3D({ initiative }: InitiativeCard3DProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isReminded, setIsReminded] = useState(false);

  useEffect(() => {
    if (initiative?.code) {
      setIsReminded(isInitiativeReminderSet(initiative.code));
    }
  }, [initiative?.code]);

  const handleRemindClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    registerDevoteeMuhurthamReminder(initiative);
    setIsReminded(true);
  };

  const typeConfig = INITIATIVE_TYPE_LABELS[initiative.initiative_type] || INITIATIVE_TYPE_LABELS.OTHER;
  const percent = initiative.target_amount > 0
    ? Math.min(Math.round((initiative.current_raised / initiative.target_amount) * 100), 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // subtle 3D tilt
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="relative flex flex-col bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden group transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* 3D Specular Golden Glare Sweep Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(212, 175, 55, ${glarePosition.opacity}), transparent 60%)`,
        }}
      />

      {/* Golden Edge Halo */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-20 ${
          isHovered
            ? 'opacity-100 ring-2 ring-devotional-gold/70 shadow-[0_15px_40px_rgba(212,175,55,0.22)]'
            : 'opacity-0'
        }`}
      />

      {/* Top Cover Media Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-950 shrink-0">
        <img
          src={initiative.cover_image || 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80'}
          alt={initiative.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        {/* Top Floating Chips */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {/* Category Chip */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-md border ${typeConfig.badgeColor}`}>
            <span>{typeConfig.icon}</span>
            <span>{initiative.custom_type || typeConfig.label}</span>
          </span>

          {/* Urgent / Priority / Scheduled Chip */}
          {initiative.status === 'SCHEDULED' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-400 shadow-lg animate-pulse">
              <Clock className="w-3 h-3 text-amber-400" /> Sacred Launch
            </span>
          ) : initiative.is_urgent ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-lg animate-pulse">
              <Flame className="w-3 h-3 fill-current" /> Urgent
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900/80 text-amber-300 backdrop-blur-sm border border-amber-400/40">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
            </span>
          )}
        </div>

        {/* Unique Code Tag and Stage at Bottom of Image */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-amber-200/90 font-mono z-10">
          <span className="bg-stone-950/70 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-amber-400/30">
            {initiative.code}
          </span>
          <span className="bg-devotional-maroon/90 text-amber-200 font-sans font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-amber-400/40">
            {initiative.status === 'SCHEDULED' ? 'UPCOMING' : initiative.current_stage}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link href={`/initiatives/${initiative.code}`}>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-devotional-maroon dark:group-hover:text-amber-400 transition-colors line-clamp-2">
              {initiative.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-devotional-saffron shrink-0" />
            <span className="truncate">{initiative.city}, {initiative.state}</span>
          </div>

          {/* Brief Objective / Description */}
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
            {initiative.objective || initiative.description}
          </p>
        </div>

        {/* 3D Progress or Scheduled Countdown Section */}
        {initiative.status === 'SCHEDULED' ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-400/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-devotional-saffron" /> Auspicious Release
              </span>
              <span className="font-mono text-[10px] text-stone-300">
                {initiative.scheduled_publish_at
                  ? new Date(initiative.scheduled_publish_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                  : 'Dawn'}
              </span>
            </div>
            <p className="text-xs text-amber-200 font-serif font-semibold">
              {initiative.muhurtham_name || 'Brahma Muhurtham Sacred Launch'}
            </p>
            {initiative.scheduled_publish_at && (
              <p className="text-[10px] text-stone-400 font-mono">
                📅 {new Date(initiative.scheduled_publish_at).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Raised</span>
                <span className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400">
                  ₹{initiative.current_raised.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Target</span>
                <span className="font-semibold text-xs text-stone-600 dark:text-stone-300">
                  ₹{initiative.target_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 3D Embossed Metallic Progress Bar */}
            <div className="relative w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner border border-stone-300/40 dark:border-stone-700">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{
                  width: `${percent}%`,
                  background: 'linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #F5D77F 100%)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.5)',
                }}
              >
                {/* Shimmer line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {percent}% Achieved
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-stone-400" /> {initiative.donor_count} Devotees
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons (Strictly Single-Word) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link
            href={`/initiatives/${initiative.code}`}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-devotional-gold dark:hover:border-devotional-gold text-stone-800 dark:text-stone-200 font-bold text-xs text-center transition-all duration-200 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 active:scale-95"
          >
            {initiative.status === 'SCHEDULED' ? 'Preview' : 'View'}
          </Link>
          {initiative.status === 'SCHEDULED' ? (
            <button
              type="button"
              onClick={handleRemindClick}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs text-center transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center gap-1 border border-amber-300/30 ${
                isReminded
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-600 via-devotional-saffron to-amber-600 hover:brightness-110 text-white'
              }`}
            >
              {isReminded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Remind</span>
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/donate?initiativeId=${encodeURIComponent(initiative.code)}&title=${encodeURIComponent(initiative.title)}`}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-devotional-maroon via-red-800 to-devotional-maroon hover:brightness-110 text-white font-bold text-xs text-center transition-all duration-200 shadow-md shadow-red-950/30 active:scale-95 flex items-center justify-center gap-1 border border-amber-300/30"
            >
              Donate
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
