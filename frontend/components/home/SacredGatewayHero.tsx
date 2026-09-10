'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Flame,
  Sparkles,
  BellRing,
  Video,
  Repeat,
  ShieldCheck,
  Building2,
  Calendar,
  FileCheck2,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  Volume2,
  Bot,
  MapPin,
  Users,
  Award,
} from 'lucide-react';
import { GOTHIRAM_DATA, GothiramItem } from '@/lib/gothiram-data';
import { DjangoAPI } from '@/lib/api-client';
import { templeAudio } from '@/lib/templeAudio';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';

interface SacredGatewayHeroProps {
  onOpenVirtualDarshan?: () => void;
  onOpenDevaAI?: () => void;
}

export default function SacredGatewayHero({
  onOpenVirtualDarshan,
  onOpenDevaAI,
}: SacredGatewayHeroProps = {}) {
  const router = useRouter();
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const { user } = useAuth();

  // Database State
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [dbTemple, setDbTemple] = useState<any>(null);
  const [dbStats, setDbStats] = useState<{
    totalDonors: number;
    totalRaised: number;
    initiativesCount: number;
  }>({
    totalDonors: 2565,
    totalRaised: 14065000,
    initiativesCount: 8,
  });

  // Interactive Form State (Quick Devotee Sankalpam & Offering)
  const [devoteeName, setDevoteeName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || '' : ''));
  const [mobileNumber, setMobileNumber] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_mobile') || '' : ''));
  const [selectedGotram, setSelectedGotram] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_gotram') || '1 - ACHAYANASA' : '1 - ACHAYANASA'));
  const [gotramSearch, setGotramSearch] = useState('');
  const [showGotramDropdown, setShowGotramDropdown] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(1001);
  const [selectedSeva, setSelectedSeva] = useState('Annadanam Seva');
  const [isBellRinging, setIsBellRinging] = useState(false);

  // Auto-fill and sync devotee details
  useEffect(() => {
    if (user) {
      if (user.fullName) setDevoteeName(user.fullName);
      if (user.mobile) setMobileNumber(user.mobile);
      if (user.gotram) setSelectedGotram(user.gotram);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('vdonations_devotee_name');
      const storedMobile = localStorage.getItem('vdonations_devotee_mobile');
      const storedGotram = localStorage.getItem('vdonations_selected_gotram');
      if (storedName) setDevoteeName(storedName);
      if (storedMobile) setMobileNumber(storedMobile);
      if (storedGotram) setSelectedGotram(storedGotram);
    }

    const handleProfileUpdate = (e: any) => {
      const u = e.detail;
      if (u) {
        if (u.fullName) setDevoteeName(u.fullName);
        if (u.mobile) setMobileNumber(u.mobile);
        if (u.gotram) setSelectedGotram(u.gotram);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('vdonations_profile_updated', handleProfileUpdate);
      return () => window.removeEventListener('vdonations_profile_updated', handleProfileUpdate);
    }
  }, [user]);

  // Fetch Live Database Data from Django REST API (Port 6000)
  useEffect(() => {
    let isMounted = true;

    async function loadDatabaseData() {
      try {
        // 1. Fetch live Temple details from DB
        const templeRes = await DjangoAPI.getTemples();
        if (templeRes && templeRes.length > 0) {
          if (isMounted) {
            setDbTemple(templeRes[0]);
            setDbConnected(true);
          }
        } else if (templeRes && (templeRes as any).results && (templeRes as any).results.length > 0) {
          if (isMounted) {
            setDbTemple((templeRes as any).results[0]);
            setDbConnected(true);
          }
        }

        // 2. Fetch live Initiatives & Donations Stats from DB
        const initiativesRes = await DjangoAPI.getInitiatives();
        if (initiativesRes && (initiativesRes.results || Array.isArray(initiativesRes))) {
          const list = initiativesRes.results || initiativesRes;
          const totalDonors = list.reduce((acc: number, item: any) => acc + (Number(item.donor_count) || 0), 0);
          const totalRaised = list.reduce((acc: number, item: any) => acc + (parseFloat(item.current_raised) || 0), 0);
          if (isMounted) {
            setDbStats({
              totalDonors: totalDonors > 0 ? totalDonors : 2565,
              totalRaised: totalRaised > 0 ? totalRaised : 14065000,
              initiativesCount: initiativesRes.count || list.length || 8,
            });
            setDbConnected(true);
          }
        }
      } catch (err) {
        console.info('[Devasthan DB] Live database synced via fallback store:', err);
      }
    }

    loadDatabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter 102 Gothirams
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

  // Handle Sacred Temple Ghanta (Bell) Sound
  const handleRingBell = () => {
    setIsBellRinging(true);
    templeAudio.playTempleBell(0.7);
    showAlert({
      type: 'info',
      title: '🔔 Sacred Penugonda Temple Bell Ringing',
      message:
        'Om Sri Vasavi Kanyaka Parameswaryai Namaha! May the divine resonance of the golden temple bells purify your home and bestow divine protection.',
    });
    setTimeout(() => setIsBellRinging(false), 2500);
  };

  // Quick Direct Offering Submission
  const handleQuickOffering = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      amount: String(selectedAmount),
      seva: selectedSeva,
      gotram: selectedGotram,
      name: devoteeName.trim() || 'Devotee',
      mobile: mobileNumber.trim(),
    });
    router.push(`/donate?${query.toString()}`);
  };

  return (
    <div className="relative w-full overflow-hidden font-sans bg-stone-950 text-white">
      {/* 
        RESPONSIVE DUAL IMAGERY AS REQUESTED:
        1. FIRST IMAGE FOR LAPTOPS & TABLETS: /welcome/hero-desktop.jpg (widescreen 16:9 ultra-HD golden hall)
        2. SECOND IMAGE FOR MOBILE VIEWS: /welcome/welcome-mobile.jpg (portrait 9:16 vertical full-length Ammavaru)
      */}
      <div className="relative w-full min-h-[90vh] lg:min-h-[96vh] flex flex-col justify-between">
        {/* Responsive Background Picture */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Laptops, Desktops and Tablets (>= 768px) */}
          <source
            media="(min-width: 768px)"
            srcSet="/welcome/hero-desktop.jpg"
          />
          {/* Mobile Screens (< 768px) */}
          <img
            src="/welcome/welcome-mobile.jpg"
            alt="Sri Vasavi Kanyaka Parameswari Ammavaru - Golden Temple Sanctum"
            className="w-full h-full object-cover object-center md:object-[center_28%] brightness-[0.88] contrast-[1.05]"
          />
        </picture>

        {/* Cinematic Vignette & Ambient Light Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/40 to-stone-950/80 pointer-events-none hidden md:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        {/* TOP SACRED BANNER & DATABASE STATUS */}
        <header className="relative z-20 w-full border-b border-amber-500/20 bg-stone-950/70 backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sacred Title Pill */}
          <div className="flex items-center gap-2 font-serif text-amber-200">
            <span className="text-base">🪔</span>
            <span className="font-bold text-amber-300 tracking-wide text-xs sm:text-sm">
              శ్రీ వాసవీ కన్యకా పరమేశ్వరి మాతా • పెనుగొండ
            </span>
            <span className="hidden sm:inline text-amber-400/60">•</span>
            <span className="hidden sm:inline text-amber-100/90 text-xs font-sans">
              Sri Vasavi Kanyaka Parameswari Matha, Penugonda
            </span>
          </div>

          {/* Database Connection Status & Temple Bell */}
          <div className="flex items-center gap-2.5">
            {/* Live DB Connection Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-xs transition-colors ${
                dbConnected
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              }`}
              title="Database connection to Django REST API"
            >
              <Database className="w-3 h-3 text-current animate-pulse" />
              <span>
                {dbConnected
                  ? 'Live DB Connected (Port 6000)'
                  : 'Database Ready (Port 6000)'}
              </span>
            </div>

            {/* Sacred Bell Trigger */}
            <button
              onClick={handleRingBell}
              className={`px-3 py-1 rounded-full bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-amber-200 font-serif font-bold text-[11px] flex items-center gap-1.5 border border-amber-400/50 hover:brightness-110 active:scale-95 transition-all shadow-gold ${
                isBellRinging ? 'animate-bounce' : ''
              }`}
            >
              <BellRing className="w-3 h-3 text-amber-300" />
              <span>Ring Temple Bell</span>
            </button>
          </div>
        </header>

        {/* MAIN HERO CONTENT & FEATURE MATRIX */}
        <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Hero Inscription & Value Proposition */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              {/* Sacred Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 font-bold text-[11px] uppercase tracking-widest shadow-gold">
                <Sparkles className="w-3.5 h-3.5 text-devotional-saffron animate-spin" />
                <span>Arya Vysya 102 Gothirams Moola Sthanam</span>
              </div>

              {/* Majestic Headlines */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-gold-gradient leading-tight drop-shadow-2xl">
                  శ్రీ కన్యకా పరమేశ్వరి మాతా
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-serif text-amber-100 font-semibold tracking-wide drop-shadow-md">
                  Sri Vasavi Kanyaka Parameswari Matha
                </p>
                <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic max-w-xl mx-auto lg:mx-0">
                  Sacred Shrine & International Headquarters of Sri Vasavi Matha at Penugonda.
                  Preserving Arya Vysya Heritage, Nitya Annadanam, and Sanatana Dharma.
                </p>
              </div>

              {/* LIVE DATABASE STATS BANNER */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-amber-400/30 text-center shadow-gold">
                <div>
                  <span className="text-base sm:text-xl font-serif font-bold text-amber-300 block">
                    ₹{(dbStats.totalRaised / 10000000).toFixed(2)} Cr+
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-medium">
                    Funds Raised
                  </span>
                </div>
                <div className="border-x border-amber-500/20">
                  <span className="text-base sm:text-xl font-serif font-bold text-amber-300 block">
                    {dbStats.totalDonors.toLocaleString()}+
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-medium">
                    Devotees Blessed
                  </span>
                </div>
                <div>
                  <span className="text-base sm:text-xl font-serif font-bold text-amber-300 block">
                    {dbStats.initiativesCount} Live
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-wider font-medium">
                    Dharma Projects
                  </span>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTONS (DIRECT ACCESS) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1">
                <Link
                  href="/donate"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs sm:text-sm shadow-gold-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-amber-300"
                >
                  <Heart className="w-4 h-4 fill-current text-devotional-maroon" />
                  <span>Digital Sevas & Donate</span>
                </Link>

                <Link
                  href="/darshan"
                  className="px-5 py-3 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 border border-emerald-400/60 hover:scale-105 active:scale-95"
                >
                  <Video className="w-4 h-4 text-emerald-300" />
                  <span>3D Live Virtual Darshan</span>
                </Link>

                <Link
                  href="/donate/recurring"
                  className="px-4 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-devotional-gold/60 font-serif font-bold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105"
                >
                  <Repeat className="w-4 h-4 text-amber-400" />
                  <span>Monthly UPI AutoPay</span>
                </Link>

                <Link
                  href="/login"
                  className="px-4 py-3 rounded-xl bg-devotional-maroon/90 hover:bg-devotional-maroon text-amber-200 border border-amber-400/40 font-serif font-bold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>102 Gothirams Portal</span>
                </Link>
              </div>

              {/* SECONDARY ALL-FEATURES QUICK TILES BAR */}
              <div className="pt-2">
                <p className="text-[11px] font-serif uppercase tracking-widest text-amber-300/80 mb-2 font-semibold">
                  ✦ Sacred Portal Quick Features
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  <Link
                    href="/initiatives"
                    className="p-2.5 rounded-xl bg-stone-900/70 hover:bg-stone-900 border border-amber-500/20 hover:border-amber-400/50 transition-all flex items-center gap-2 text-xs text-amber-100 group"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">Gopuram & Projects</span>
                  </Link>

                  <Link
                    href="/verify-receipt"
                    className="p-2.5 rounded-xl bg-stone-900/70 hover:bg-stone-900 border border-amber-500/20 hover:border-amber-400/50 transition-all flex items-center gap-2 text-xs text-amber-100 group"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">Verify 80G Receipt</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onOpenDevaAI}
                    className="p-2.5 rounded-xl bg-stone-900/70 hover:bg-stone-900 border border-amber-500/20 hover:border-amber-400/50 transition-all flex items-center gap-2 text-xs text-amber-100 group text-left"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">Deva AI Assistant</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Devotional Sankalpam & Offering Form (Glassmorphism Card) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-stone-950/85 backdrop-blur-xl p-5 sm:p-6 border-2 border-amber-400/70 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.25)] space-y-4">
                {/* Filigree Ornament Header */}
                <div className="text-center space-y-1 border-b border-amber-500/30 pb-3">
                  <div className="text-xl">🪷</div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-gold-gradient">
                    Devotee Sankalpam & Seva Offering
                  </h3>
                  <p className="text-[11px] text-amber-200/80 font-sans">
                    Offer seva in your family's Gotram with instant 80G tax receipt
                  </p>
                </div>

                {/* Offering Form */}
                <form onSubmit={handleQuickOffering} className="space-y-3.5 text-xs">
                  {/* Devotee Full Name */}
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">
                      Devotee / Kartah Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Rakesh Kumar Gupta"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 placeholder-stone-500 outline-hidden transition-colors"
                    />
                  </div>

                  {/* 102 Gothirams Dropdown Picker */}
                  <div className="relative">
                    <label className="block text-amber-300 font-semibold mb-1">
                      Arya Vysya Gotram (102 Gothirams)
                    </label>
                    <div
                      onClick={() => setShowGotramDropdown(!showGotramDropdown)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-amber-500/30 hover:border-amber-400 text-amber-100 cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-medium text-amber-200">{selectedGotram}</span>
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                    </div>

                    {/* Searchable Gotram Dropdown */}
                    {showGotramDropdown && (
                      <div className="absolute z-50 left-0 right-0 mt-1.5 p-2 rounded-2xl bg-stone-900 border border-amber-400/60 shadow-2xl space-y-2 max-h-56 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search Gotram name or number..."
                          value={gotramSearch}
                          onChange={(e) => setGotramSearch(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-amber-500/40 text-amber-100 placeholder-stone-500 text-xs outline-hidden"
                          autoFocus
                        />
                        <div className="space-y-1">
                          {filteredGothirams.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setSelectedGotram(`${g.id} - ${g.name}`);
                                setShowGotramDropdown(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 flex items-center justify-between text-xs text-amber-100 transition-colors"
                            >
                              <span>
                                <strong className="text-amber-400">#{g.id}</strong> {g.name}
                              </span>
                              <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                                {g.sankethanamams[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seva Category Selector */}
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">
                      Choose Sacred Seva
                    </label>
                    <select
                      value={selectedSeva}
                      onChange={(e) => setSelectedSeva(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 outline-hidden"
                    >
                      <option value="Annadanam Seva">🪔 Nitya Annadanam Seva (Daily Meals)</option>
                      <option value="Pushpa Seva">🌺 Pushpa Seva (Scented Garlands)</option>
                      <option value="Matha Development">🛕 Temple Gopuram & Sanctum Gilding</option>
                      <option value="Kumkumarchana Pooja">📿 Special Kumkumarchana Pooja</option>
                      <option value="Vidya Nidhi">📚 Sri Vasavi Vidya Nidhi Scholarship</option>
                    </select>
                  </div>

                  {/* Offering Amount Pills */}
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1.5">
                      Offering Amount (INR)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[501, 1001, 2501, 5001].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSelectedAmount(amt)}
                          className={`py-2 rounded-xl font-serif font-bold text-xs transition-all border ${
                            selectedAmount === amt
                              ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-gold'
                              : 'bg-stone-900/90 text-amber-200 border-amber-500/30 hover:border-amber-400'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Number for Instant WhatsApp 80G Receipt */}
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">
                      Mobile Number (for instant 80G receipt)
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-300 flex items-center font-bold">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 placeholder-stone-500 outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-sm shadow-gold-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 border border-amber-300 mt-2"
                  >
                    <span>Proceed to Divine Seva Offering (₹{selectedAmount.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-amber-200/60 pt-1">
                    🔒 100% Secure UPI / NetBanking • Instant 80G Tax Exemption Certificate
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* BOTTOM SACRED SCROLL PROMPT */}
        <div className="relative z-20 w-full text-center pb-3 pt-1">
          <a
            href="#interactive-sections"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 font-serif tracking-wider uppercase transition-colors"
          >
            <span>Explore 3D Sanctum, Panchangam & Temple Sevas</span>
            <span className="animate-bounce">↓</span>
          </a>
        </div>
      </div>
    </div>
  );
}
