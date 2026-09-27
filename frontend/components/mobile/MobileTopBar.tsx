'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { IconTempleMatha, IconTempleBell } from '@/components/icons/DevotionalIcons';

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
  return (
    <header className="sticky top-0 z-40 md:hidden bg-white dark:bg-stone-950/85 backdrop-blur-none dark:backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/80 transition-colors shadow-xs pt-safe">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Navigation Drawer Menu Button */}
        <div className="w-10 flex items-center">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-2 -ml-2 text-stone-800 dark:text-stone-200 hover:text-devotional-maroon dark:hover:text-amber-400 active-press transition-colors"
            title="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Persistent Sacred Brand (Sri Vasavi Matha) */}
        <div className="flex-1 text-center truncate px-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 active-press"
            title="Sri Vasavi Matha - Home"
          >
            <IconTempleMatha size={22} active={true} />
            <span className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400 tracking-tight">
              Sri Vasavi Matha
            </span>
          </Link>
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
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-devotional-saffron ring-2 ring-white dark:ring-stone-950 shadow-xs" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
