'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  QrCode,
  Users,
  Utensils,
  Flame,
  Sparkles,
  FileText,
  PieChart,
  Tv,
  Bell,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { getTempleAdminNotifications } from '@/lib/quota-store';

export default function TempleAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);

  const checkUnread = () => {
    const notifs = getTempleAdminNotifications();
    const count = notifs.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    checkUnread();
    window.addEventListener('temple_admin_notifs_updated', checkUnread);
    return () => {
      window.removeEventListener('temple_admin_notifs_updated', checkUnread);
    };
  }, []);

  const navItems = [
    { name: t('sidebarTempleDashboard'), href: '/admin/temple/dashboard', icon: PieChart },
    { name: t('sidebarNotifications'), href: '/admin/temple/notifications', icon: Bell, isNotification: true },
    { name: t('sidebarEditShrineProfile'), href: '/admin/temple/profile', icon: Building2 },
    { name: t('sidebarDonationCategories'), href: '/admin/temple/categories', icon: Utensils },
    { name: t('sidebarCampaigns'), href: '/admin/temple/campaigns', icon: Flame },
    { name: t('sidebarPoojaCatalog'), href: '/admin/temple/poojas', icon: Sparkles },
    { name: t('sidebarQRManagement'), href: '/admin/temple/qr-management', icon: QrCode },
    { name: t('sidebarCounterTVMode'), href: '/admin/temple/qr-display', icon: Tv },
    { name: t('sidebarPrivateDonorCRM'), href: '/admin/temple/donors', icon: Users },
    { name: t('sidebarDonationsAudit'), href: '/admin/temple/donations', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-devotional-cream dark:bg-stone-900 flex flex-col md:flex-row font-sans">
      {/* Temple Admin 3D Dedicated Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 p-6 space-y-6 shrink-0 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-devotional-maroon dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
            <Flame className="w-3 h-3 text-devotional-saffron animate-pulse" /> {t('navAdminDashboard')}
          </div>
          <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            {t('templeName')}
          </h2>
          <p className="text-[11px] text-stone-500">{t('templeLocation')}</p>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 transform ${
                  isActive
                    ? 'bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-white font-bold shadow-md border-l-4 border-amber-400 translate-x-1 ring-1 ring-amber-400/40'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800/80 hover:translate-x-1 hover:text-devotional-maroon dark:hover:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-devotional-saffron'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.isNotification && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
