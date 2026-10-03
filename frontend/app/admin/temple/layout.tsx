'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { getTempleAdminNotifications } from '@/lib/quota-store';
import { templeService } from '@/lib/supabase-service';
import { Temple } from '@/lib/types';
import { isSuperAdminUser, isTempleAdminUser } from '@/lib/rbac';

export default function TempleAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [templeInfo, setTempleInfo] = useState<{ name: string; code: string; city: string; managerName?: string }>({
    name: 'Sri Vasavi Kanyaka Parameswari Matha',
    code: 'TPL-VASAVI-001',
    city: 'Penugonda',
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('vdonations_active_role');
      const sessionRaw = localStorage.getItem('vdonations_user_session');

      if (!sessionRaw) {
        router.replace('/login');
        return;
      }

      try {
        const session = JSON.parse(sessionRaw);
        const isSuper = isSuperAdminUser(session?.mobile, session?.email);
        const canAccessTemple = isTempleAdminUser(session?.role, session?.mobile, session?.email);

        if (isSuper) {
          setIsSuperAdmin(true);
        } else if (!canAccessTemple) {
          // General Devotees cannot access Temple Admin portal!
          console.warn('[RBAC] Unauthorized access blocked from /admin/temple:', session?.mobile || session?.email);
          localStorage.setItem('vdonations_active_role', 'DEVOTEE');
          router.replace('/devotee/dashboard');
          return;
        }
      } catch {
        router.replace('/login');
        return;
      }

      const storedName = localStorage.getItem('vdonations_temple_name');
      const storedCode = localStorage.getItem('vdonations_temple_code');
      const storedTempleId = localStorage.getItem('vdonations_temple_id');
      const storedManagerName = localStorage.getItem('vdonations_devotee_name');

      if (storedName || storedCode) {
        setTempleInfo({
          name: storedName || 'Sri Vasavi Shrine',
          code: storedCode || 'TPL-001',
          city: 'Devasthanam',
          managerName: storedManagerName || undefined,
        });
      }

      if (storedTempleId) {
        templeService.getTempleById(storedTempleId).then((temple) => {
          if (temple) {
            setTempleInfo({
              name: temple.name,
              code: temple.code,
              city: `${temple.city}, ${temple.state}`,
              managerName: temple.managerName || storedManagerName || undefined,
            });
          }
        });
      }
    }
  }, [router]);

  const navItems = [
    { name: t('sidebarTempleDashboard'), href: '/admin/temple/dashboard', icon: PieChart },
    { name: 'Super Admin Desk & Requests', href: '/admin/temple/communications', icon: MessageSquare },
    { name: 'Finance Coordination Desk', href: '/admin/temple/finance-desk', icon: DollarSign },
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
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-devotional-maroon to-devotional-saffron flex items-center justify-center text-amber-300 shadow shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded">
                {templeInfo.code}
              </span>
              <span className="text-[10px] uppercase font-bold text-devotional-saffron">
                TEMPLE ADMIN
              </span>
            </div>
            <h1 className="text-sm font-serif font-bold text-stone-900 dark:text-white truncate">
              {templeInfo.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {unreadCount > 0 && (
            <Link
              href="/admin/temple/notifications"
              className="p-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-amber-300 hover:text-devotional-maroon transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded">
                  {templeInfo.code}
                </span>
                <p className="font-serif font-bold text-stone-900 dark:text-amber-300 text-sm truncate max-w-[240px]">
                  {templeInfo.name}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSuperAdmin && (
              <Link
                href="/admin/super/temples"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-400/40"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Super Admin
              </Link>
            )}

            <nav className="space-y-1.5 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-white font-bold border-l-4 border-amber-400 ring-1 ring-amber-400/40'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-devotional-saffron'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.isNotification && unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Temple Admin Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 p-6 space-y-6 shrink-0 shadow-lg min-h-screen">
        {isSuperAdmin && (
          <Link
            href="/admin/super/temples"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-400/40 hover:bg-amber-400/30 transition-all mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Super Admin
          </Link>
        )}

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
      <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto min-w-0">{children}</div>
    </div>
  );
}
