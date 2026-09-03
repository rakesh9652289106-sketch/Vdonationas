'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Lock,
  Settings,
  PieChart,
  Flame,
  Sun,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t('sidebarSuperDashboard'), href: '/admin/super/dashboard', icon: PieChart },
    { name: 'Seva Quota Approvals', href: '/admin/super/seva-approvals', icon: ShieldCheck },
    { name: t('sidebarManageTemples'), href: '/admin/super/temples', icon: Building2 },
    { name: t('sidebarUserMatrix'), href: '/admin/super/users', icon: Users },
    { name: t('sidebarPanchangamManager'), href: '/admin/super/panchangam', icon: Sun },
    { name: t('sidebarAuditLogs'), href: '/admin/super/audit', icon: Lock },
    { name: t('sidebarSecurityFraud'), href: '/admin/super/security', icon: Activity },
    { name: t('sidebarSaaSSettings'), href: '/admin/super/saas-settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Super Admin 3D Dedicated Sidebar */}
      <aside className="w-full md:w-64 bg-stone-950 border-r border-stone-800 p-6 space-y-6 shrink-0 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
            <Flame className="w-3 h-3 text-devotional-saffron animate-pulse" /> {t('sidebarSuperDashboard')}
          </div>
          <h2 className="text-xl font-serif font-bold text-amber-300">Platform Control</h2>
          <p className="text-[11px] text-stone-400">Full Unrestricted SaaS Access</p>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 transform ${
                  isActive
                    ? 'bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-amber-300 font-bold shadow-md border-l-4 border-amber-400 translate-x-1 ring-1 ring-amber-400/40'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900 hover:translate-x-1'
                }`}
              >
                <Icon className="w-4 h-4 text-devotional-saffron shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 bg-stone-900 overflow-y-auto">{children}</div>
    </div>
  );
}
