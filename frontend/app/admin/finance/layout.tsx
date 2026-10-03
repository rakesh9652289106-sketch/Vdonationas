'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  TrendingUp,
  RefreshCw,
  DollarSign,
  PieChart,
  ArrowLeft,
  Send,
  BarChart3,
  ShieldCheck,
  Lock,
  Building2,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { templeService } from '@/lib/supabase-service';
import { Temple } from '@/lib/types';
import { isSuperAdminUser, isFinanceAdminUser } from '@/lib/rbac';

export default function FinanceAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [templeInfo, setTempleInfo] = useState<{ id?: string; name: string; code: string; officerName?: string }>({
    name: 'Sri Vasavi Kanyaka Parameswari Matha',
    code: 'TPL-VASAVI-001',
    id: 'tpl-vasavi-01',
  });

  // Load Temples for multi-temple switcher
  useEffect(() => {
    async function loadTemples() {
      try {
        const allTemples = await templeService.getAllTemples();
        if (allTemples && allTemples.length > 0) {
          setTemples(allTemples);
        }
      } catch (err) {
        console.warn('[FinanceLayout] Error fetching temples:', err);
      }
    }
    loadTemples();
  }, []);

  const syncActiveTemple = () => {
    if (typeof window === 'undefined') return;
    const sessionRaw = localStorage.getItem('vdonations_user_session');
    let session: any = {};
    if (sessionRaw) {
      try {
        session = JSON.parse(sessionRaw);
      } catch {}
    }

    const storedId = localStorage.getItem('vdonations_temple_id') || session.templeId;
    const storedName = localStorage.getItem('vdonations_temple_name') || session.templeName;
    const storedCode = localStorage.getItem('vdonations_temple_code') || session.templeCode;
    const storedOfficer = localStorage.getItem('vdonations_devotee_name') || session.fullName || 'Finance Officer';

    if (storedName || storedCode || storedId) {
      setTempleInfo({
        id: storedId || 'tpl-vasavi-01',
        name: storedName || 'Sri Vasavi Kanyaka Parameswari Matha',
        code: storedCode || 'TPL-VASAVI-001',
        officerName: storedOfficer,
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionRaw = localStorage.getItem('vdonations_user_session');
      const role = localStorage.getItem('vdonations_active_role');

      if (!sessionRaw) {
        router.replace('/login');
        return;
      }

      try {
        const session = JSON.parse(sessionRaw);
        const isSuper = isSuperAdminUser(session?.mobile, session?.email);
        const canAccessFinance = isFinanceAdminUser(session?.role, session?.mobile, session?.email);

        if (isSuper) {
          setIsSuperAdmin(true);
        } else if (!canAccessFinance) {
          // General Devotees cannot access Finance Admin portal!
          console.warn('[RBAC] Unauthorized access blocked from /admin/finance:', session?.mobile || session?.email);
          localStorage.setItem('vdonations_active_role', 'DEVOTEE');
          router.replace('/devotee/dashboard');
          return;
        }
      } catch {
        router.replace('/login');
        return;
      }

      syncActiveTemple();

      const handleTempleChange = (e: any) => {
        if (e.detail) {
          setTempleInfo({
            id: e.detail.id,
            name: e.detail.name,
            code: e.detail.code,
            officerName: e.detail.financeAdminName || templeInfo.officerName,
          });
        } else {
          syncActiveTemple();
        }
      };

      window.addEventListener('vdonations_finance_temple_changed', handleTempleChange);
      return () => {
        window.removeEventListener('vdonations_finance_temple_changed', handleTempleChange);
      };
    }
  }, [router]);

  const handleSelectTemple = (temple: Temple) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vdonations_temple_id', temple.id);
      localStorage.setItem('vdonations_temple_name', temple.name);
      localStorage.setItem('vdonations_temple_code', temple.code);
      if (temple.financeAdminName) {
        localStorage.setItem('vdonations_devotee_name', temple.financeAdminName);
      }
      setTempleInfo({
        id: temple.id,
        name: temple.name,
        code: temple.code,
        officerName: temple.financeAdminName || templeInfo.officerName,
      });
      window.dispatchEvent(new CustomEvent('vdonations_finance_temple_changed', { detail: temple }));
    }
  };

  const navItems = [
    { name: 'Financial Dashboard', href: '/admin/finance/dashboard', icon: PieChart },
    { name: 'Submit Request to Super Admin', href: '/admin/finance/requests', icon: Send },
    { name: 'Temple Admin Coordination & Charts', href: '/admin/finance/coordination', icon: BarChart3 },
    { name: 'Reconciliation Matrix', href: '/admin/finance/reconciliation', icon: TrendingUp },
    { name: 'Refund Approvals', href: '/admin/finance/refunds', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-900 px-4 py-3 flex items-center justify-between shadow-lg text-emerald-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-amber-500 flex items-center justify-center text-stone-950 shadow shrink-0 font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold bg-emerald-900 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700">
                {templeInfo.code}
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-300">
                FINANCE DESK
              </span>
            </div>
            <h1 className="text-sm font-serif font-bold text-white truncate">
              {templeInfo.name}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-emerald-950 border-t border-emerald-800 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl text-emerald-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-900 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700">
                  {templeInfo.code}
                </span>
                <p className="font-serif font-bold text-amber-300 text-sm truncate max-w-[240px]">
                  {templeInfo.name}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl bg-emerald-900 text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Temple Switcher */}
            {temples.length > 1 && (
              <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-1">
                <label className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Switch Active Shrine:
                </label>
                <select
                  value={templeInfo.id || ''}
                  onChange={(e) => {
                    const found = temples.find((t) => t.id === e.target.value);
                    if (found) handleSelectTemple(found);
                  }}
                  className="w-full text-xs font-semibold bg-emerald-950 text-amber-300 border border-emerald-700 rounded-xl px-2.5 py-2 cursor-pointer"
                >
                  {temples.map((t) => (
                    <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isSuperAdmin && (
              <Link
                href="/admin/super/temples"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40"
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
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md border-l-4 border-emerald-950 ring-1 ring-amber-300/40'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-900/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-300'}`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Finance Admin Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 min-h-screen bg-emerald-950 text-emerald-100 p-5 sm:p-6 space-y-6 border-r border-emerald-900 shadow-2xl">
        {isSuperAdmin && (
          <Link
            href="/admin/super/temples"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/40 hover:bg-amber-400/30 transition-all mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Super Admin
          </Link>
        )}

        {/* Header Desk Info */}
        <div className="space-y-2 pb-4 border-b border-emerald-900/80">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1 text-emerald-300 text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <DollarSign className="w-3 h-3 text-amber-400" /> FINANCE DESK
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
              {templeInfo.code}
            </span>
          </div>

          {/* Temple Switcher for Super Admin / Multi-Temple Finance */}
          {temples.length > 1 ? (
            <div className="pt-1">
              <label className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                Active Temple Shrine:
              </label>
              <div className="relative">
                <select
                  value={templeInfo.id || ''}
                  onChange={(e) => {
                    const found = temples.find((t) => t.id === e.target.value);
                    if (found) handleSelectTemple(found);
                  }}
                  className="w-full text-xs font-semibold bg-emerald-900/90 text-amber-300 border border-emerald-700/80 rounded-xl px-2.5 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer pr-7 truncate"
                >
                  {temples.map((t) => (
                    <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          ) : (
            <h2 className="text-sm font-serif font-bold text-amber-300 line-clamp-2">
              {templeInfo.name}
            </h2>
          )}

          {templeInfo.officerName && (
            <p className="text-[11px] text-emerald-300/90 font-medium pt-0.5">
              Officer: <span className="text-white font-semibold">{templeInfo.officerName}</span>
            </p>
          )}

          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
              <Lock className="w-2.5 h-2.5 text-amber-400" /> Read-Only Financial Audit
            </span>
          </div>
        </div>

        {/* Navigation links */}
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
      <main className="flex-1 p-3 sm:p-6 lg:p-10 overflow-y-auto min-w-0 bg-stone-50 dark:bg-stone-950">
        {children}
      </main>
    </div>
  );
}
