'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ArrowLeft, Bell } from 'lucide-react';
import { IconTempleMatha, IconTempleBell } from '@/components/icons/DevotionalIcons';
import { useLanguage } from '@/lib/language-context';

interface MobileTopBarProps {
  onOpenDrawer: () => void;
  onOpenNotifications?: () => void;
  currentUser?: any;
  hasUnreadNotifications?: boolean;
}

export default function MobileTopBar({
  onOpenDrawer,
  onOpenNotifications,
  hasUnreadNotifications = true,
}: MobileTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const isHome = pathname === '/';

  // Compute clean page title based on pathname
  const getPageTitle = () => {
    if (isHome) return 'Vasavi Matha';
    if (pathname.startsWith('/donate/recurring')) return 'AutoPay';
    if (pathname.startsWith('/donate')) return 'Donate';
    if (pathname.startsWith('/temples')) return 'Mathas';
    if (pathname.startsWith('/devotee/poojas')) return 'Sevas';
    if (pathname.startsWith('/devotee/profile')) return 'Profile';
    if (pathname.startsWith('/devotee/donations')) return 'History';
    if (pathname.startsWith('/devotee/rewards')) return 'Rewards';
    if (pathname.startsWith('/devotee/settings')) return 'Settings';
    if (pathname.startsWith('/devotee/analytics')) return 'Impact';
    if (pathname.startsWith('/devotee/dashboard')) return 'Devotee';
    if (pathname.startsWith('/festivals')) return 'Events';
    if (pathname.startsWith('/darshan')) return 'Live Darshan';
    if (pathname.startsWith('/verify-receipt')) return 'Verify Receipt';
    if (pathname.startsWith('/admin/super')) return 'Super Admin';
    if (pathname.startsWith('/admin/temple')) return 'Matha Admin';
    if (pathname.startsWith('/admin/finance')) return 'Finance Admin';
    return 'Vasavi Matha';
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 md:hidden bg-devotional-cream/98 dark:bg-stone-950/98 backdrop-blur-md border-b border-devotional-gold/30 dark:border-stone-800 transition-colors shadow-xs pt-safe">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Menu on Home, Back Arrow on Sub-pages */}
        <div className="w-10 flex items-center">
          {isHome ? (
            <button
              type="button"
              onClick={onOpenDrawer}
              className="p-2 -ml-2 text-stone-800 dark:text-stone-200 hover:text-devotional-maroon dark:hover:text-amber-400 active-press transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 -ml-2 text-stone-800 dark:text-stone-200 hover:text-devotional-maroon dark:hover:text-amber-400 active-press transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center: Page Title / Matha Title */}
        <div className="flex-1 text-center truncate px-2">
          {isHome ? (
            <div className="inline-flex items-center gap-2">
              <IconTempleMatha size={22} active={true} />
              <span className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400 tracking-tight">
                Sri Vasavi Matha
              </span>
            </div>
          ) : (
            <h1 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400 tracking-tight truncate">
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Right: Notifications Bell Icon */}
        <div className="w-10 flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-stone-800 dark:text-stone-200 hover:text-devotional-maroon dark:hover:text-amber-400 relative active-press transition-all hover:scale-105"
            title="Notifications"
          >
            <IconTempleBell size={26} className="hover:rotate-12 transition-transform drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-devotional-saffron opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-devotional-saffron ring-2 ring-devotional-cream dark:ring-stone-950 shadow-xs" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
