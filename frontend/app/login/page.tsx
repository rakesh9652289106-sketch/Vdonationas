'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Coins,
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  Lock,
  Mail,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { GOTHIRAM_DATA, GothiramItem } from '@/lib/gothiram-data';
import { UserRoleType } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRoleType>('DEVOTEE');
  const [selectedGotram, setSelectedGotram] = useState<string>('1 - ACHAYANASA');
  const [gotramSearch, setGotramSearch] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('devotee@gmail.com');
  const [password, setPassword] = useState<string>('Vasavi@108');
  const [isOtpMode, setIsOtpMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Filter 102 Gothirams by search query
  const filteredGothirams = useMemo(() => {
    if (!gotramSearch.trim()) return GOTHIRAM_DATA.slice(0, 8);
    const q = gotramSearch.toLowerCase().trim();
    return GOTHIRAM_DATA.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        String(g.id).includes(q) ||
        g.sankethanamams.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [gotramSearch]);

  const roleDetails = {
    DEVOTEE: {
      title: 'Devotee Portal',
      route: '/devotee/dashboard',
      icon: User,
      color: 'text-devotional-saffron',
      desc: 'Access your digital seva records, UPI autopay, 80G tax receipts, and family gothiram blessings.',
      demoEmail: 'devotee@gmail.com',
    },
    TEMPLE_ADMIN: {
      title: 'Penugonda Temple Admin',
      route: '/admin/temple/dashboard',
      icon: Building2,
      color: 'text-amber-400',
      desc: 'Manage daily poojas, Penugonda Devasthanam campaigns, donor rosters, and seva timings.',
      demoEmail: 'admin.penugonda@vasavimatha.org',
    },
    FINANCE_ADMIN: {
      title: 'Finance Controller',
      route: '/admin/finance/dashboard',
      icon: Coins,
      color: 'text-emerald-400',
      desc: 'Monitor real-time donations, gateway reconciliations, instant 80G filings, and audit trails.',
      demoEmail: 'finance@vasavimatha.org',
    },
    SUPER_ADMIN: {
      title: 'Super Admin',
      route: '/admin/super/dashboard',
      icon: Shield,
      color: 'text-devotional-gold',
      desc: 'Full SaaS administration, temple onboarding, security governance, and multi-matha policies.',
      demoEmail: 'admin@vasavimatha.org',
    },
  };

  const handleRoleSwitch = (role: UserRoleType) => {
    setSelectedRole(role);
    const mock = MOCK_USERS.find((u) => u.role === role);
    if (mock) {
      setIdentifier(mock.email);
      setPassword(role === 'DEVOTEE' ? 'Vasavi@108' : 'Admin@Vasavi108');
    }
  };

  const handleDemoFill = (role: UserRoleType) => {
    handleRoleSwitch(role);
    setStatusMsg(`✦ Loaded demo credentials for ${roleDetails[role].title}`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg('');

    const targetUser = MOCK_USERS.find((u) => u.role === selectedRole) || {
      id: 'usr-custom',
      email: identifier,
      fullName: selectedRole === 'DEVOTEE' ? 'Devotee' : 'Temple Administrator',
      role: selectedRole,
    };

    try {
      await fetch('http://localhost:8000/api/v1/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      }).catch(() => null);

      if (typeof window !== 'undefined') {
        localStorage.setItem('vdonations_user_session', JSON.stringify(targetUser));
        localStorage.setItem('vdonations_active_role', selectedRole);
        localStorage.setItem('vdonations_selected_gotram', selectedGotram);
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(roleDetails[selectedRole].route);
      }, 1400);
    } catch {
      setIsSuccess(true);
      setTimeout(() => {
        router.push(roleDetails[selectedRole].route);
      }, 1400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-devotional-cream to-amber-100/60 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Top Devasthanam Emblem Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-stone-800 border border-amber-300 dark:border-amber-600/50 shadow-sm mb-3">
            <Flame className="w-4 h-4 text-devotional-maroon dark:text-amber-400 animate-pulse" />
            <span className="text-xs font-serif font-bold text-devotional-maroon dark:text-amber-300 uppercase tracking-wider">
              Sri Vasavi Kanyaka Parameswari Devasthanam, Penugonda
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Devotee &amp; Temple Login Portal
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-sans">
            Direct access to 100% traceable digital donations, 80G tax receipts, e-hundi sevas, and sacred 102 Gothirams heritage.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 102 Gothirams Sacred Darshan Hub */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-600/50 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  🔱
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider font-serif">
                    Arya Vysya Sacred Heritage
                  </span>
                  <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    102 Gothirams &amp; Sankethanamams
                  </h2>
                </div>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                Sri Vasavi Kanyaka Parameswari Matha entered the sacred sacrificial fire with 102 noble gotra couples at Penugonda to establish universal peace, ahimsa, and righteousness. Discover your ancestral gotram and sankethanamam.
              </p>

              {/* UHD 4K Visual App Launch Banner */}
              <div className="bg-gradient-to-r from-devotional-maroon via-[#7c1a24] to-[#4a070e] text-amber-100 rounded-2xl p-5 mb-6 border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-stone-950 text-[10px] font-bold tracking-wider uppercase mb-1.5">
                      4K UHD Experience
                    </span>
                    <h3 className="text-base font-serif font-bold text-white">
                      Full-Screen 4K Devotional Canvas
                    </h3>
                    <p className="text-xs text-amber-200/90 mt-0.5">
                      Dual-scroll manuscript with 56 UHD frames &amp; fluid subframe cross-dissolve.
                    </p>
                  </div>
                  <a
                    href="http://localhost:8080/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-stone-950 font-serif font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Launch 4K Gothirams</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Quick Gotram Finder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-devotional-maroon dark:text-amber-400" />
                    <span>Search Your Gotram &amp; Sankethanamam:</span>
                  </label>
                  <span className="text-[11px] text-stone-500">102 Verified Gotras</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={gotramSearch}
                    onChange={(e) => setGotramSearch(e.target.value)}
                    placeholder="Type gotram name (e.g. Bharadhvaja, Achayanasa)..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>

                {/* Filtered Gotram Result Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                  {filteredGothirams.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGotram(`${g.id} - ${g.name}`)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-0.5 ${
                        selectedGotram.startsWith(String(g.id) + ' -')
                          ? 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-400'
                          : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-devotional-maroon dark:text-amber-300">
                          #{g.id} {g.name}
                        </span>
                        {selectedGotram.startsWith(String(g.id) + ' -') && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                        {g.sankethanamams.join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Login Form */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-600/50 shadow-2xl relative">
              {/* Role Selection Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-serif font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2.5">
                  Select Portal Access:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
                  {(Object.keys(roleDetails) as UserRoleType[]).map((role) => {
                    const RoleIcon = roleDetails[role].icon;
                    const isActive = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSwitch(role)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-serif font-bold transition-all ${
                          isActive
                            ? 'bg-devotional-maroon text-amber-300 shadow-md scale-102'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
                        }`}
                      >
                        <RoleIcon className="w-4 h-4" />
                        <span className="text-[11px] truncate">{role === 'TEMPLE_ADMIN' ? 'Temple Admin' : role === 'FINANCE_ADMIN' ? 'Finance' : role === 'SUPER_ADMIN' ? 'Super Admin' : 'Devotee'}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-stone-500 mt-2 italic">
                  {roleDetails[selectedRole].desc}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Gotram Selector for Devotees */}
                {selectedRole === 'DEVOTEE' && (
                  <div>
                    <label className="block text-xs font-serif font-bold text-stone-800 dark:text-stone-200 mb-1">
                      Sacred Gotram (102 Gothirams):
                    </label>
                    <div className="relative">
                      <select
                        value={selectedGotram}
                        onChange={(e) => setSelectedGotram(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 appearance-none font-serif"
                      >
                        {GOTHIRAM_DATA.map((g) => (
                          <option key={g.id} value={`${g.id} - ${g.name}`}>
                            #{g.id} {g.name}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3.5 top-3 pointer-events-none text-xs text-stone-400">
                        ▼
                      </span>
                    </div>
                  </div>
                )}

                {/* Email or Mobile */}
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Registered Email or Mobile:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. devotee@gmail.com"
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-sans"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Password / OTP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-serif font-bold text-stone-800 dark:text-stone-200">
                      {isOtpMode ? '6-Digit OTP:' : 'Password:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsOtpMode(!isOtpMode)}
                      className="text-[11px] font-bold text-devotional-maroon dark:text-amber-400 hover:underline"
                    >
                      {isOtpMode ? 'Use Password' : 'Use OTP Login'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={isOtpMode ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isOtpMode ? 'Enter 6-digit OTP (e.g. 108108)' : 'Enter password'}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-sans"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Quick 1-Click Demo Fill Selector */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-amber-700/50 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-serif block">
                    1-Click Demo Credentials:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(roleDetails) as UserRoleType[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleDemoFill(role)}
                        className="text-left px-2 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-400 text-[10px] font-bold text-stone-700 dark:text-stone-300 transition-all flex items-center justify-between"
                      >
                        <span className="truncate">{role === 'DEVOTEE' ? 'Devotee Demo' : role === 'TEMPLE_ADMIN' ? 'Temple Admin' : role === 'FINANCE_ADMIN' ? 'Finance Admin' : 'Super Admin'}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {statusMsg && (
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-stone-800 text-devotional-maroon dark:text-amber-300 text-xs font-serif font-bold text-center border border-amber-300">
                    {statusMsg}
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-serif font-bold text-sm shadow-xl hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2 border border-amber-300"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                      <span>Blessed by Sri Vasavi Matha! Redirecting...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Authenticating with VDonations...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter {roleDetails[selectedRole].title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-stone-500">
                    Target Route: <strong className="text-devotional-maroon dark:text-amber-400">{roleDetails[selectedRole].route}</strong>
                  </span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
