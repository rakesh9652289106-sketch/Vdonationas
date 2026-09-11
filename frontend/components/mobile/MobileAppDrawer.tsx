'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, LogOut, Shield, Building2, Coins, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  IconSanctumHome,
  IconSacredDonateFAB,
  IconDevoteeMedal,
  IconPalmleafScroll,
  IconDonationAnalytics,
  IconTempleMatha,
  IconAnnadanamPot,
  IconFamilySacred,
  IconFestivalDeepam,
  IconPoojaAarti,
  IconTempleBell,
  IconDevoteeSacred,
  IconSacredKavach,
  IconSevaSupport,
} from '@/components/icons/DevotionalIcons';
import { MOCK_USERS, MOCK_DONATIONS } from '@/lib/mock-data';
import { calculateDevoteeMedals } from '@/lib/medals';
import { UserRoleType } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import { isSuperAdminUser, isTempleAdminUser, isFinanceAdminUser } from '@/lib/rbac';

interface MobileAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: (typeof MOCK_USERS)[0];
  onSwitchUser?: (role: UserRoleType) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function MobileAppDrawer({
  isOpen,
  onClose,
  currentUser,
}: MobileAppDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeRole, switchActiveRole, logout } = useAuth();
  const { t } = useLanguage();
  const medalProgress = calculateDevoteeMedals(MOCK_DONATIONS);

  const isSuperAdmin = isSuperAdminUser(user?.mobile, user?.email);
  const isTempleAdmin = isTempleAdminUser(user?.role, user?.mobile, user?.email);
  const isFinanceAdmin = isFinanceAdminUser(user?.role, user?.mobile, user?.email);

  if (!isOpen) return null;

  const handleSelectPortal = (role: UserRoleType, path: string) => {
    switchActiveRole(role);
    onClose();
    router.push(path);
  };

  const handleSignOut = async () => {
    onClose();
    await logout();
    window.location.href = '/login';
  };

  // The complete 14 existing sidebar items with bespoke realistic devotional icons
  const sidebarItems = [
    { name: 'Devotee Home', href: '/devotee/dashboard', icon: IconSanctumHome },
    { name: 'My Donations', href: '/devotee/donations', icon: IconSacredDonateFAB },
    { name: 'Devotee Rewards', href: '/devotee/rewards', icon: IconDevoteeMedal },
    { name: 'My Receipts', href: '/devotee/receipts', icon: IconPalmleafScroll },
    {
      name: 'Donation Analytics',
      href: '/devotee/analytics',
      icon: IconDonationAnalytics,
      aliases: ['/devotee/annual-statement'],
    },
    { name: 'My Temples', href: '/devotee/temples', icon: IconTempleMatha },
    { name: 'Recurring Seva', href: '/devotee/recurring', icon: IconAnnadanamPot },
    { name: 'Family & Occasions', href: '/devotee/family', icon: IconFamilySacred },
    // { name: 'Upcoming Festivals', href: '/devotee/festivals', icon: IconFestivalDeepam }, // Hidden for now
    { name: 'Pooja Bookings', href: '/devotee/poojas', icon: IconPoojaAarti },
    { name: 'Notifications', href: '/devotee/notifications', icon: IconTempleBell },
    { name: 'My Profile', href: '/devotee/profile', icon: IconDevoteeSacred },
    {
      name: 'Security & Privacy',
      href: '/devotee/security',
      icon: IconSacredKavach,
      aliases: ['/devotee/privacy'],
    },
    { name: 'Donation Support', href: '/devotee/support', icon: IconSevaSupport },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-[85%] max-w-sm h-full bg-devotional-cream dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header (Matches Image 2) */}
        <div className="p-4 bg-devotional-maroon text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-devotional-gold to-amber-300 text-stone-900 flex items-center justify-center shadow-sm shrink-0 p-1">
              <IconTempleMatha size={24} active={true} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm leading-tight text-amber-200">
                Sri Vasavi Kanyaka Parameswari Matha
              </h3>
              <p className="text-[11px] text-amber-300/80 font-medium">Digital Seva App</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active-press shrink-0 ml-2"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 text-stone-900 dark:text-stone-100">
          {/* Devotee Profile Card (Matches Image 2) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200 flex items-center justify-center font-bold text-lg border-2 border-amber-400/80 shadow-sm shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="truncate flex-1">
                <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                  {currentUser.fullName}
                  {currentUser.role !== 'DEVOTEE' && (
                    <span className="text-[11px] font-sans font-semibold text-stone-500 ml-1">
                      ({currentUser.role.replace('_', ' ')})
                    </span>
                  )}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate font-sans">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-stone-400 font-medium">Devotee Honor:</span>
              <span className="px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-300/80 inline-flex items-center gap-1.5 shadow-xs">
                <IconDevoteeMedal size={16} />
                <span>{medalProgress.currentMedal?.name || 'Dharma Bhakta'}</span>
              </span>
            </div>
          </div>

          {/* Sacred Initiatives & Fundraising Access Banner */}
          <Link
            href="/initiatives"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-devotional-maroon via-red-900 to-amber-950 text-white shadow-md border border-amber-400/40 hover:brightness-110 active-press transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40 text-sm">
                ✨
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-amber-200">Sacred Initiatives</p>
                <p className="text-[10px] text-amber-300/80">Fundraising & Dharma Projects</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Explore
            </span>
          </Link>

          {/* All 14 Existing Sidebar Items with Realistic Devotional Icons */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.aliases && item.aliases.includes(pathname));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-200 active-press ${
                    isActive
                      ? 'bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-white font-bold shadow-md border-l-4 border-amber-400 translate-x-1 ring-1 ring-amber-400/40'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800/80 hover:translate-x-1 hover:text-devotional-maroon dark:hover:text-amber-400'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                      isActive
                        ? 'scale-110 bg-white/20 ring-1 ring-amber-300/60 shadow-xs'
                        : 'bg-amber-500/10 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 shadow-2xs'
                    }`}
                  >
                    <Icon size={22} active={isActive} />
                  </div>
                  <span className="truncate text-xs">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Portal Access Switcher (Visible only to authorized Administrators) */}
          {(isSuperAdmin || isTempleAdmin || isFinanceAdmin) && (
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider px-1">
                Select Portal Access:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPortal('DEVOTEE', '/devotee/dashboard')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                    activeRole === 'DEVOTEE'
                      ? 'bg-amber-100 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-devotional-saffron" />
                  <span className="text-[11px]">🙏 Devotee</span>
                </button>

                {isTempleAdmin && (
                  <button
                    type="button"
                    onClick={() => handleSelectPortal('TEMPLE_ADMIN', '/admin/temple/dashboard')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                      activeRole === 'TEMPLE_ADMIN'
                        ? 'bg-amber-100 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-devotional-maroon dark:text-amber-400" />
                    <span className="text-[11px]">🛕 Temple</span>
                  </button>
                )}

                {isFinanceAdmin && (
                  <button
                    type="button"
                    onClick={() => handleSelectPortal('FINANCE_ADMIN', '/admin/finance/dashboard')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                      activeRole === 'FINANCE_ADMIN'
                        ? 'bg-amber-100 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">💰 Finance</span>
                  </button>
                )}

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => handleSelectPortal('SUPER_ADMIN', '/admin/super/dashboard')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all ${
                      activeRole === 'SUPER_ADMIN'
                        ? 'bg-amber-100 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px]">👑 Super Admin</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sign Out Section */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800">

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full mt-2 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out / Switch Devotee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
