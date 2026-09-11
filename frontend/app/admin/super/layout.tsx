'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { isSuperAdminUser, isTempleAdminUser, isFinanceAdminUser } from '@/lib/rbac';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionRaw = localStorage.getItem('vdonations_user_session');

      if (!sessionRaw) {
        router.replace('/login');
        return;
      }

      try {
        const session = JSON.parse(sessionRaw);
        // Strict RBAC: ONLY mobile 9652289106 can access the Super Admin panel!
        const isAuthorizedSuperAdmin = isSuperAdminUser(session?.mobile, session?.email);

        if (!isAuthorizedSuperAdmin) {
          console.warn('[RBAC] Non-superadmin blocked from /admin/super:', session?.mobile || session?.email);
          localStorage.setItem('vdonations_active_role', 'DEVOTEE');

          if (isTempleAdminUser(session?.role, session?.mobile, session?.email)) {
            router.replace('/admin/temple/dashboard');
          } else if (isFinanceAdminUser(session?.role, session?.mobile, session?.email)) {
            router.replace('/admin/finance/dashboard');
          } else {
            router.replace('/devotee/dashboard');
          }
          return;
        }

        // Authenticated Super Admin (9652289106)
        localStorage.setItem('vdonations_active_role', 'SUPER_ADMIN');
        setIsAuthorized(true);
      } catch {
        router.replace('/login');
      }
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-300 font-serif">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-devotional-saffron animate-pulse" />
          <span>Verifying Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: t('sidebarSuperDashboard'), href: '/admin/super/dashboard', icon: PieChart },
    { name: 'Initiatives & Fundraising', href: '/admin/super/initiatives', icon: Sparkles },
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
