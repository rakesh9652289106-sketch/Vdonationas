'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sun,
  Moon,
  Search,
  ShieldCheck,
  User,
  Heart,
  ChevronDown,
  Building2,
  Menu,
  X,
  Flame,
  Coins,
  Shield,
  Sparkles,
} from 'lucide-react';
import { MOCK_USERS, MOCK_DONATIONS } from '@/lib/mock-data';
import { calculateDevoteeMedals } from '@/lib/medals';
import { UserRoleType } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const medalProgress = calculateDevoteeMedals(MOCK_DONATIONS);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleSwitchUser = (role: UserRoleType) => {
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
    setIsRoleDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/temples?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/temples');
    }
  };

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-devotional-cream/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-devotional-gold/40 dark:border-stone-800 transition-colors shadow-sm font-sans">
      {/* Top Banner Notice */}
      <div className="bg-devotional-maroon text-amber-100 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" />
        <span className="truncate">
          <strong>{t('heroTitle')}:</strong> 100% Traceable Digital Seva & Immediate 80G Receipts
        </span>
        <Link
          href="/donate/recurring"
          className="underline hover:text-white font-medium items-center gap-1 text-[11px] hidden sm:flex shrink-0"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          {t('navAutopay')}
        </Link>
        <Link
          href="/verify-receipt"
          className="underline hover:text-white font-medium items-center gap-1 text-[11px] hidden md:flex shrink-0"
        >
          <ShieldCheck className="w-3 h-3" />
          {t('navVerifyReceipt')}
        </Link>
      </div>

      {/* Main Navbar Header Bar - Perfectly balanced so DONATE CTA is always prominent */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          {/* Left: Temple Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-devotional-gold flex items-center justify-center text-white shadow-gold group-hover:scale-105 transition-transform text-lg sm:text-xl border border-amber-300/40 shrink-0">
              🛕
            </div>
            <div className="leading-tight">
              <span className="text-sm sm:text-base font-serif font-bold text-devotional-maroon dark:text-amber-400 tracking-tight block whitespace-nowrap">
                {t('templeName')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-600 dark:text-stone-400 font-sans tracking-wider uppercase block font-medium whitespace-nowrap">
                {t('templeLocation')}
              </span>
            </div>
          </Link>

          {/* Center-Left: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-bold text-stone-700 dark:text-stone-300 shrink-0">
            <Link
              href="/"
              className={`hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors whitespace-nowrap ${
                pathname === '/' ? 'text-devotional-maroon dark:text-amber-400 font-extrabold border-b-2 border-devotional-maroon pb-0.5' : ''
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              href="/donate"
              className={`hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors whitespace-nowrap ${
                pathname === '/donate' ? 'text-devotional-maroon dark:text-amber-400 font-extrabold border-b-2 border-devotional-maroon pb-0.5' : ''
              }`}
            >
              {t('navDonate')}
            </Link>
            <Link
              href="/donate/recurring"
              className={`hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors whitespace-nowrap ${
                pathname.startsWith('/donate/recurring')
                  ? 'text-devotional-maroon dark:text-amber-400 font-extrabold border-b-2 border-devotional-maroon pb-0.5'
                  : ''
              }`}
            >
              {t('navAutopay')}
            </Link>
            <Link
              href="/festivals"
              className={`hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors whitespace-nowrap ${
                pathname.startsWith('/festivals')
                  ? 'text-devotional-maroon dark:text-amber-400 font-extrabold border-b-2 border-devotional-maroon pb-0.5'
                  : ''
              }`}
            >
              {t('navFestivals')}
            </Link>
            <Link
              href="/initiatives"
              className={`hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors whitespace-nowrap ${
                pathname.startsWith('/initiatives')
                  ? 'text-devotional-maroon dark:text-amber-400 font-extrabold border-b-2 border-devotional-maroon pb-0.5'
                  : ''
              }`}
            >
              Initiatives
            </Link>
          </nav>

          {/* Center Search Input (Shown on 2XL widescreen) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden 2xl:flex items-center w-40 2xl:w-48 shrink-0 relative"
          >
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Seva..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            />
          </form>

          {/* Right: Actions Group (Theme, Language, Account Dropdown, ALWAYS-VISIBLE Donate CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-devotional-maroon dark:hover:text-amber-400 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors shrink-0"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* BILINGUAL LANGUAGE SELECTOR TOGGLE (ENGLISH / TELUGU) */}
            <div className="flex items-center rounded-full bg-amber-100 dark:bg-stone-800 p-0.5 border border-amber-300 dark:border-amber-600/50 shadow-sm shrink-0">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-devotional-maroon text-amber-300 shadow-sm scale-105'
                    : 'text-stone-700 dark:text-stone-300 hover:text-devotional-maroon'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'te'
                    ? 'bg-devotional-maroon text-amber-300 shadow-sm scale-105'
                    : 'text-stone-700 dark:text-stone-300 hover:text-devotional-maroon'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* ACCOUNT / PORTALS DROPDOWN */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 dark:from-stone-800 dark:to-stone-900 border border-amber-300 dark:border-amber-600/50 text-devotional-maroon dark:text-amber-300 font-bold text-xs shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                  <User className="w-3 h-3" />
                </div>
                <span className="hidden xl:inline font-serif font-bold whitespace-nowrap">
                  Account / Portals
                </span>
                {medalProgress.currentMedal && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 text-amber-950 font-bold text-[10px] inline-flex items-center gap-1 whitespace-nowrap shrink-0 border border-amber-400/80 shadow-sm leading-none">
                    <span>{medalProgress.currentMedal.badge}</span>
                    <span>{medalProgress.currentMedal.name}</span>
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-stone-500 shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-700 py-3 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {currentUser.fullName}
                      </p>
                      {medalProgress.currentMedal && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 text-amber-950 font-bold text-[10px] border border-amber-400/80 shadow-sm inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-none">
                          <span>{medalProgress.currentMedal.badge}</span>
                          <span>{medalProgress.currentMedal.name}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">{currentUser.email}</p>
                  </div>

                  <div className="py-2 px-1 space-y-1">
                    <p className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Select Portal Access:
                    </p>

                    <Link
                      href="/devotee/dashboard"
                      onClick={() => handleSwitchUser('DEVOTEE')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        currentUser.role === 'DEVOTEE'
                          ? 'bg-amber-50 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-devotional-saffron" />
                        <span>🙏 Devotee Portal</span>
                      </div>
                    </Link>

                    <Link
                      href="/admin/temple/dashboard"
                      onClick={() => handleSwitchUser('TEMPLE_ADMIN')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        currentUser.role === 'TEMPLE_ADMIN'
                          ? 'bg-amber-50 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-devotional-maroon dark:text-amber-400" />
                        <span>🛕 {t('navAdminDashboard')}</span>
                      </div>
                    </Link>

                    <Link
                      href="/admin/finance/dashboard"
                      onClick={() => handleSwitchUser('FINANCE_ADMIN')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        currentUser.role === 'FINANCE_ADMIN'
                          ? 'bg-amber-50 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>💰 {t('sidebarFinanceDashboard')}</span>
                      </div>
                    </Link>

                    <Link
                      href="/admin/super/dashboard"
                      onClick={() => handleSwitchUser('SUPER_ADMIN')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        currentUser.role === 'SUPER_ADMIN'
                          ? 'bg-amber-50 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>👑 {t('sidebarSuperDashboard')}</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ALWAYS-VISIBLE PROMINENT DONATE CTA BUTTON */}
            <Link
              href="/donate"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-devotional-saffron via-amber-500 to-amber-600 text-white text-xs font-bold hover:brightness-110 transition-all shadow-gold shrink-0 border border-amber-300/40 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
              <span>{t('navDonate')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-700 dark:text-stone-300 shrink-0"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-bold text-stone-800 dark:text-stone-200"
          >
            {t('navHome')}
          </Link>
          <Link
            href="/donate"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-bold text-stone-800 dark:text-stone-200"
          >
            {t('navDonate')}
          </Link>
          <Link
            href="/donate/recurring"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-bold text-stone-800 dark:text-stone-200"
          >
            {t('navAutopay')}
          </Link>
          <Link
            href="/festivals"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-bold text-stone-800 dark:text-stone-200"
          >
            {t('navFestivals')}
          </Link>
        </div>
      )}
    </header>
  );
}
