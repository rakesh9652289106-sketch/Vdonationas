'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, RefreshCw, DollarSign, PieChart } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FinanceAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t('sidebarFinanceDashboard'), href: '/admin/finance/dashboard', icon: PieChart },
    { name: t('sidebarReconciliation'), href: '/admin/finance/reconciliation', icon: TrendingUp },
    { name: t('sidebarRefundApprovals'), href: '/admin/finance/refunds', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex flex-col md:flex-row font-sans">
      {/* Finance Admin 3D Dedicated Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-950 text-emerald-100 p-6 space-y-6 shrink-0 border-r border-emerald-900 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-emerald-300 text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            <DollarSign className="w-3 h-3 text-emerald-300" /> {t('sidebarFinanceDashboard')}
          </div>
          <h2 className="text-xl font-serif font-bold text-amber-300">{t('sidebarFinanceDashboard')}</h2>
          <p className="text-[11px] text-emerald-300/80">Reconciliation & Settlements Only</p>
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
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md border-l-4 border-emerald-950 translate-x-1 ring-1 ring-amber-300/40'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/80 hover:translate-x-1'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-300'}`} />
                <span className="truncate">{item.name}</span>
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
