'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconSanctumHome,
  IconTempleMatha,
  IconSacredDonateFAB,
  IconSacredDiya,
  IconDevoteeSacred,
} from '@/components/icons/DevotionalIcons';
import { useLanguage } from '@/lib/language-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isHomeActive = pathname === '/';
  const isMathasActive = pathname.startsWith('/temples');
  const isDonateActive = pathname === '/donate' || pathname.startsWith('/donate/recurring');
  const isSevasActive =
    pathname.startsWith('/devotee/poojas') ||
    pathname.startsWith('/festivals') ||
    pathname.startsWith('/darshan');
  const isProfileActive =
    pathname.startsWith('/devotee/profile') ||
    pathname.startsWith('/devotee/dashboard') ||
    pathname.startsWith('/devotee/settings') ||
    pathname.startsWith('/devotee/donations') ||
    pathname.startsWith('/devotee/rewards');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden mobile-nav-blur border-t border-devotional-gold/40 dark:border-stone-800 shadow-[0_-4px_30px_rgba(107,29,47,0.15)] pb-safe transition-colors">
      <div className="flex items-center justify-around h-16 px-1 relative max-w-md mx-auto">
        {/* 1. Home Tab (Realistic Sanctum Icon) */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active-press ${
            isHomeActive
              ? 'text-devotional-maroon dark:text-amber-300 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <IconSanctumHome size={25} active={isHomeActive} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-devotional-maroon dark:bg-amber-400 shadow-xs" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif font-bold">
            Home
          </span>
        </Link>

        {/* 2. Mathas Tab (Realistic Gopuram Icon) */}
        <Link
          href="/temples"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active-press ${
            isMathasActive
              ? 'text-devotional-maroon dark:text-amber-300 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <IconTempleMatha size={25} active={isMathasActive} />
            {isMathasActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-devotional-maroon dark:bg-amber-400 shadow-xs" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif font-bold">
            Mathas
          </span>
        </Link>

        {/* 3. CENTER ELEVATED DONATE ACTION BUTTON (Realistic Sacred Kalash) */}
        <div className="flex-1 flex justify-center -mt-6">
          <Link
            href="/donate"
            className="group flex flex-col items-center active-press"
          >
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-amber-400 p-1 flex items-center justify-center shadow-[0_6px_20px_rgba(212,175,55,0.45)] border-3 border-devotional-cream dark:border-stone-950 transition-all ${
                isDonateActive ? 'scale-110 ring-4 ring-amber-400/50' : 'hover:scale-105'
              }`}
            >
              <div className="w-full h-full rounded-full bg-devotional-maroon flex items-center justify-center shadow-inner">
                <IconSacredDonateFAB size={30} />
              </div>
            </div>
            <span className="text-[10px] font-bold font-serif text-devotional-maroon dark:text-amber-400 mt-1 uppercase tracking-wider">
              Donate
            </span>
          </Link>
        </div>

        {/* 4. Sevas Tab (Realistic Brass Diya with Flame) */}
        <Link
          href="/devotee/poojas"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active-press relative ${
            isSevasActive
              ? 'text-devotional-maroon dark:text-amber-300 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <IconSacredDiya size={25} active={isSevasActive} />
            {isSevasActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-devotional-maroon dark:bg-amber-400 shadow-xs" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif font-bold">
            Sevas
          </span>
        </Link>

        {/* 5. Profile Tab (Realistic Devotee Tilak Icon) */}
        <Link
          href="/devotee/profile"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active-press ${
            isProfileActive
              ? 'text-devotional-maroon dark:text-amber-300 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div className="relative">
            <IconDevoteeSacred size={25} active={isProfileActive} />
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-devotional-maroon dark:bg-amber-400 shadow-xs" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif font-bold">
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
