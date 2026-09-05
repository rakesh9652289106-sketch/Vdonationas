'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  FileText,
  Download,
  PieChart,
  BarChart3,
  LayoutDashboard,
  Building2,
  Bookmark,
  Repeat,
  Users,
  Calendar,
  Sparkles,
  ShoppingBag,
  Bell,
  User,
  Shield,
  ShieldCheck,
  Lock,
  LifeBuoy,
  Flame,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t('sidebarDevoteeHome'), href: '/devotee/dashboard', icon: LayoutDashboard },
    { name: t('sidebarMyDonations'), href: '/devotee/donations', icon: Heart },
    { name: 'Devotee Rewards', href: '/devotee/rewards', icon: Sparkles },
    { name: t('sidebarMyReceipts'), href: '/devotee/receipts', icon: FileText },
    { name: t('sidebarDonationAnalytics'), href: '/devotee/analytics', icon: BarChart3, aliases: ['/devotee/annual-statement'] },
    { name: t('sidebarMyTemples'), href: '/devotee/temples', icon: Building2 },
    { name: 'Sacred Initiatives', href: '/initiatives', icon: Sparkles },
    // { name: t('sidebarFavoriteShrines'), href: '/devotee/favorites', icon: Bookmark }, // Hidden for now
    { name: t('sidebarRecurringSeva'), href: '/devotee/recurring', icon: Repeat },
    { name: t('sidebarFamilyOccasions'), href: '/devotee/family', icon: Users },
    { name: t('sidebarUpcomingFestivals'), href: '/devotee/festivals', icon: Calendar },
    { name: t('sidebarPoojaBookings'), href: '/devotee/poojas', icon: Sparkles },
    { name: t('sidebarNotifications'), href: '/devotee/notifications', icon: Bell },
    { name: t('sidebarMyProfile'), href: '/devotee/profile', icon: User },
    { name: t('sidebarSecurityPrivacy'), href: '/devotee/security', icon: ShieldCheck, aliases: ['/devotee/privacy'] },
    { name: t('sidebarDonationSupport'), href: '/devotee/support', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-devotional-cream dark:bg-stone-900 flex flex-col md:flex-row font-sans">
      {/* Devotee 3D Dedicated Sidebar (Desktop Only) */}
      <aside className="hidden md:block w-64 bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 p-6 space-y-6 shrink-0 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-devotional-saffron text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
            <Flame className="w-3 h-3 text-devotional-saffron animate-pulse" /> {t('navDevoteeDashboard')}
          </div>
          <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            Radha Krishna
          </h2>
          <p className="text-[11px] text-stone-500">devotee@gmail.com</p>
        </div>

        <nav className="space-y-1 text-xs font-semibold max-h-[70vh] overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.aliases && item.aliases.includes(pathname));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 transform ${
                  isActive
                    ? 'bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-white font-bold shadow-md border-l-4 border-amber-400 translate-x-1 ring-1 ring-amber-400/40'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800/80 hover:translate-x-1 hover:text-devotional-maroon dark:hover:text-amber-400'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-devotional-saffron'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Devotee Main Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
