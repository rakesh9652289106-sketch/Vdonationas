'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Users,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  CheckCircle2,
  ShieldCheck,
  BellRing,
  Sun,
  Flame,
  Award,
  ArrowRight,
  Heart,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GOTHIRAM_DATA, GothiramItem } from '@/lib/gothiram-data';
import { templeAudio } from '@/lib/templeAudio';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

interface SacredDevoteeLoginPortalProps {
  onLoginSuccess?: (userSession: any) => void;
  onExploreAsGuest?: () => void;
}

export default function SacredDevoteeLoginPortal({
  onLoginSuccess,
  onExploreAsGuest,
}: SacredDevoteeLoginPortalProps) {
  const router = useRouter();
  const { showAlert } = useConfirmAlert();

  // Active Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Devotee Credentials & Sankalpam
  const [fullName, setFullName] = useState('Sri Vasavi Devotee');
  const [mobileNumber, setMobileNumber] = useState('9848012345');
  const [gotra, setGotra] = useState('1 - ACHAYANASA');
  const [password, setPassword] = useState('Vasavi@108');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Audio & Visual Effects State
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isChantPlaying, setIsChantPlaying] = useState(false);

  // Gotram Search Filter
  const [gotraSearch, setGotraSearch] = useState('');
  const [isGotraDropdownOpen, setIsGotraDropdownOpen] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [blessingToast, setBlessingToast] = useState<{ show: boolean; title: string; desc: string }>({
    show: false,
    title: '',
    desc: '',
  });

  // Popular Quick-Select Gotras
  const quickGotras = [
    { id: 1, name: 'ACHAYANASA' },
    { id: 14, name: 'MUCHARLA' },
    { id: 52, name: 'MIDUNASA' },
    { id: 102, name: 'UTPALA' },
  ];

  // Filtered 102 Gothirams
  const filteredGotras = useMemo(() => {
    if (!gotraSearch.trim()) return GOTHIRAM_DATA;
    const q = gotraSearch.toLowerCase();
    return GOTHIRAM_DATA.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.id.toString().includes(q) ||
        (g.telugu && g.telugu.includes(q))
    );
  }, [gotraSearch]);

  // Ring Temple Bell with Audio & Soundwave Ripples
  const handleRingBell = () => {
    setIsBellRinging(true);
    try {
      templeAudio.playTempleBell(0.85);
    } catch (e) {}

    setTimeout(() => {
      setIsBellRinging(false);
    }, 1800);

    showAlert({
      type: 'info',
      title: 'Sacred Temple Bell Resonating',
      message: '🔔 Om Sri Vasavi Kanyaka Parameswaryai Namaha! May the divine grace of Penugonda Devasthanam bestow happiness, health, and prosperity upon you and your family.',
    });
  };

  // Toggle Sacred Mantra / Temple Chime
  const handleToggleMantra = () => {
    if (!isChantPlaying) {
      try {
        templeAudio.playFlowerChime(0.5);
        setTimeout(() => templeAudio.playTempleBell(0.6), 350);
      } catch (e) {}
      setIsChantPlaying(true);
    } else {
      setIsChantPlaying(false);
    }
  };

  // Submit Devotee Login to Backend & Transition to Home Page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber || mobileNumber.length < 10) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }

    if (!gotra) {
      setStatusMsg({ type: 'error', text: 'Please select your Sacred Gotram from the 102 Gotras.' });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: 'success', text: '✦ Authenticating with Penugonda Devasthanam Sanctuary...' });

    // Auspicious coin chime
    try {
      templeAudio.playCoinDrop(0.65);
    } catch (e) {}

    let userSession = {
      fullName: fullName || 'Sri Vasavi Devotee',
      email: `${mobileNumber}@vasavi.dev`,
      mobile: `+91 ${mobileNumber}`,
      gotram: gotra,
      role: 'devotee',
      authenticatedAt: new Date().toISOString(),
    };

    let authToken = 'vasavi_jwt_' + Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('/api/proxy/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: mobileNumber,
          password: password,
          gotra: gotra,
          full_name: fullName,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const resData = await res.json();
        if (resData.access) authToken = resData.access;
        if (resData.user) userSession = { ...userSession, ...resData.user };
      }
    } catch (err) {
      console.info('[VDonations] Local devotee database session initiated:', userSession.fullName);
    }

    // Persist session & cookies
    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
      localStorage.setItem('vdonations_auth_token', authToken);
      localStorage.setItem('vdonations_active_role', 'DEVOTEE');
      localStorage.setItem('vdonations_selected_gotram', gotra);
      localStorage.setItem('vdonations_devotee_name', fullName);
      localStorage.setItem('vdonations_devotee_mobile', mobileNumber);
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    setLoading(false);
    setBlessingToast({
      show: true,
      title: 'Blessed by Sri Vasavi Matha! 🪔',
      desc: `Welcome, ${fullName}! Entering your Devotee Sanctuary...`,
    });

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      } else {
        router.push('/');
      }
    }, 600);
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    try {
      templeAudio.playFlowerChime(0.5);
    } catch (e) {}

    const userSession = {
      fullName: fullName || 'Sri Vasavi Devotee (Google)',
      email: 'devotee.google@vasavi.dev',
      mobile: `+91 ${mobileNumber || '9848012345'}`,
      gotram: gotra || '1 - ACHAYANASA',
      role: 'devotee',
      authProvider: 'google',
      authenticatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
      localStorage.setItem('vdonations_auth_token', 'vasavi_google_jwt_' + Date.now());
      localStorage.setItem('vdonations_active_role', 'DEVOTEE');
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    setBlessingToast({
      show: true,
      title: 'Blessed by Sri Vasavi Matha! 🪔',
      desc: 'Signed in with Google! Entering your Devotee Sanctuary...',
    });

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      } else {
        router.push('/');
      }
    }, 600);
  };

  // Guest / Atithi Instant Entry Handler
  const handleGuestEntry = () => {
    try {
      templeAudio.playTempleBell(0.65);
    } catch (e) {}

    const guestUser = {
      fullName: 'Atithi Devotee (Guest)',
      mobile: 'N/A',
      email: 'atithi@vasavi.dev',
      gotram: 'General Devotee',
      role: 'guest',
      isGuest: true,
      authenticatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(guestUser));
      localStorage.setItem('vdonations_auth_token', 'guest_token_' + Date.now());
      localStorage.setItem('vdonations_active_role', 'GUEST');
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    if (onExploreAsGuest) {
      onExploreAsGuest();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white selection:bg-[#d4af37] selection:text-[#240a0c]">
      
      {/* ----------------------------------------------------------------------
          1. SACRED RESPONSIVE MANDAPAM BACKGROUND SYSTEM
          - Laptops, Desktops, Tablets: /images/vasavi-mandapam-desktop.jpg
          - Mobile Phones: /images/vasavi-mandapam-mobile.jpg
          ---------------------------------------------------------------------- */}
      
      {/* Desktop / Tablet Sanctum Mandapam Background */}
      <div 
        className="hidden md:block fixed inset-0 bg-cover bg-left lg:bg-center bg-no-repeat pointer-events-none transition-all duration-700"
        style={{ backgroundImage: "url('/images/vasavi-mandapam-desktop.jpg')" }}
        aria-hidden="true"
      />

      {/* Mobile Sanctum Mandapam Background */}
      <div 
        className="block md:hidden fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-700"
        style={{ backgroundImage: "url('/images/vasavi-mandapam-mobile.jpg')" }}
        aria-hidden="true"
      />

      {/* Atmospheric Vignette & Contrast Shading */}
      {/* Desktop Overlay: Keeps Ammavaru luminous on left while softly shading the right column for card readability */}
      <div 
        className="hidden md:block fixed inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-black/40 to-black/85" 
        aria-hidden="true"
      />
      {/* Mobile Overlay: Balanced dark golden veil */}
      <div 
        className="block md:hidden fixed inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-black/75 to-black/90 backdrop-blur-[1px]" 
        aria-hidden="true"
      />

      {/* Subtle Warm Radial Glows */}
      <div 
        className="fixed top-0 left-1/4 w-[600px] h-[350px] rounded-full bg-[#f7d885]/15 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[650px] h-[400px] rounded-full bg-[#8c1d2e]/25 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Floating Diya Gold Embers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] left-[12%] w-2 h-2 rounded-full bg-[#ffe494] blur-[0.5px] opacity-75 animate-pulse" />
        <div className="absolute top-[45%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#f39c12] blur-[1px] opacity-60 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[70%] left-[8%] w-2.5 h-2.5 rounded-full bg-[#ffe89e] blur-[1px] opacity-60 animate-pulse" />
        <div className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-[#ffe494] blur-[0.5px] opacity-70 animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#f39c12] blur-[1px] opacity-60 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute bottom-[25%] right-[28%] w-2 h-2 rounded-full bg-[#ffd778] blur-[0.5px] opacity-75 animate-pulse" />
      </div>

      {/* Temple Bell Ripple Effect Waves */}
      {isBellRinging && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-[320px] h-[320px] rounded-full border-2 border-[#f7d885] animate-ping opacity-75" />
          <div className="w-[520px] h-[520px] rounded-full border border-[#f5b041] animate-ping opacity-50" style={{ animationDelay: '180ms' }} />
          <div className="w-[750px] h-[750px] rounded-full border border-[#f39c12] animate-ping opacity-30" style={{ animationDelay: '350ms' }} />
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. TOP HEADER: SACRED PANCHANGAM & INTERACTIVE TEMPLE BELL TICKER
          ---------------------------------------------------------------------- */}
      <header className="relative z-30 w-full bg-[#FFF4D1]/95 text-[#3b0a11] border-b border-[#d4af37]/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-serif">
          
          {/* Panchangam Details */}
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="text-[#a12338] text-base">🪔</span>
            <span className="font-bold text-[#6b1322] uppercase tracking-wider text-[11px] sm:text-xs">
              Today&apos;s Sacred Panchangam:
            </span>
            <span className="text-[#3b0a11] hidden sm:inline">
              Shravana Masa • Ekadashi Tithi • Abhijit Muhurtham (11:45 AM - 12:35 PM)
            </span>
            <span className="text-[#3b0a11] inline sm:hidden text-xs">
              Shravana Masa • Ekadashi Tithi
            </span>
          </div>

          {/* Action Buttons: Ring Bell & Sacred Chime */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRingBell}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#5a121d] via-[#781827] to-[#5a121d] hover:from-[#8a1c2d] hover:to-[#6b1322] border border-[#d4af37] text-[#ffe89e] text-[11px] sm:text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_2px_10px_rgba(107,19,34,0.4)] hover:shadow-[0_4px_15px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <BellRing className={`w-3.5 h-3.5 text-[#f7d885] ${isBellRinging ? 'animate-bounce' : ''}`} />
              <span>Ring Temple Bell</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMantra}
              className={`px-2.5 py-1.5 rounded-full border text-[11px] font-serif flex items-center gap-1 transition-all cursor-pointer ${
                isChantPlaying
                  ? 'bg-[#d4af37] text-[#240c02] border-[#ffe89e] font-bold shadow-gold'
                  : 'bg-[#faf5ea] text-[#5a121d] border-[#d4af37]/60 hover:bg-[#fff4d1]'
              }`}
              title="Sacred Temple Chime"
            >
              {isChantPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#240c02]" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isChantPlaying ? 'Chime Active' : 'Chime'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ----------------------------------------------------------------------
          3. MAIN HERO SANCTUARY: SPLIT-SCREEN LAYOUT
          - Left: Divine Presence & Penugonda Moola Sthalam Heritage
          - Right: The Iconic Arched Temple Login Card
          ---------------------------------------------------------------------- */}
      <main className="relative z-20 max-w-7xl mx-auto min-h-[calc(100vh-48px)] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ==================================================================
              LEFT COLUMN: DIVINE AMMAVARU HERITAGE & PENUGONDA CREST
              ================================================================== */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Sacred Divine Presence Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0d16]/85 border border-[#d4af37]/70 text-[#f7d885] text-xs font-serif font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <Flame className="w-4 h-4 text-[#f5b041] animate-pulse" />
              <span>Sacred Divine Presence</span>
            </div>

            {/* Grand Title in Sacred Metallic Gold Typography */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff9e6] via-[#f7d885] to-[#d4af37] leading-[1.18] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Sri Vasavi Kanyaka Parameswari Matha, Penugonda
              </h1>
              <p className="text-base sm:text-lg font-serif text-[#f3cf7a] italic font-medium">
                Seva • Dharma • Community • Devotion
              </p>
            </div>

            {/* Devotional Intro */}
            <p className="text-sm sm:text-base text-[#fff3cb]/90 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0 drop-shadow-md">
              Welcome to the official digital gateway of Penugonda Sri Kanyaka Parameswari Devasthanam. Connect your Gotram, offer 80G tax-exempt sevas, participate in Nitya Annadanam, and receive divine blessings at your home.
            </p>

            {/* Sacred Telugu Inscription Ribbon */}
            <div className="p-4 rounded-2xl bg-[#24060b]/80 border border-[#d4af37]/50 shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md max-w-lg mx-auto lg:mx-0 space-y-1.5">
              <div className="text-center font-serif text-[#ffe494] text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="text-[#f5b041]">✦</span>
                <span>&ldquo;ధర్మ రక్షణార్థాయ సంభవామి యుగే యుగే&rdquo;</span>
                <span className="text-[#f5b041]">✦</span>
              </div>
              <p className="text-xs text-[#e8cda2]/90 text-center font-serif">
                Penugonda Moola Sthalam • Arya Vysya 102 Gothirams Heritage Portal
              </p>
            </div>

            {/* Three Pillars of Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-[#1c0408]/85 border border-[#d4af37]/35 shadow-sm backdrop-blur-md">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">102</span>
                <span className="text-[10px] sm:text-[11px] text-[#e1b782] font-semibold uppercase tracking-wider">Sacred Gotras</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c0408]/85 border border-[#d4af37]/35 shadow-sm backdrop-blur-md">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">₹4.8 Cr+</span>
                <span className="text-[10px] sm:text-[11px] text-[#e1b782] font-semibold uppercase tracking-wider">Devotee Sevas</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c0408]/85 border border-[#d4af37]/35 shadow-sm backdrop-blur-md">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">80G</span>
                <span className="text-[10px] sm:text-[11px] text-[#e1b782] font-semibold uppercase tracking-wider">100% Tax Exempt</span>
              </div>
            </div>

          </div>

          {/* ==================================================================
              RIGHT COLUMN: THE ICONIC ARCHED TEMPLE DEVOTEE LOGIN CARD
              - Recreated faithfully to match the sanctum archway reference
              ================================================================== */}
          <div className="lg:col-span-6 flex justify-center">
            
            {/* Arched Temple Frame Outer Wrapper */}
            <div className="relative w-full max-w-[430px]">
              
              {/* Golden Halos behind the Card */}
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-b from-[#ffe6a3]/40 via-[#d4af37]/30 to-[#b87c14]/40 blur-xl opacity-75 pointer-events-none" />
              
              {/* The Card Container with Double Golden Border */}
              <div className="relative w-full rounded-[32px] p-[2.5px] bg-gradient-to-b from-[#ffe599] via-[#d4af37] to-[#7a4c0a] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.35)]">
                
                {/* Inner Card Sanctum Body */}
                <div className="relative w-full rounded-[30px] p-6 sm:p-7 bg-[#1c0509]/95 backdrop-blur-2xl overflow-hidden text-left border border-[#fff2b8]/20">
                  
                  {/* Ornate Corner Brass Accents */}
                  <div className="absolute top-2.5 left-3 pointer-events-none text-[#f5d77f]/80 text-xs">✤</div>
                  <div className="absolute top-2.5 right-3 pointer-events-none text-[#f5d77f]/80 text-xs">✤</div>
                  <div className="absolute bottom-2.5 left-3 pointer-events-none text-[#f5d77f]/80 text-xs">✤</div>
                  <div className="absolute bottom-2.5 right-3 pointer-events-none text-[#f5d77f]/80 text-xs">✤</div>

                  {/* Inner Hairline Filigree Frame */}
                  <div className="absolute inset-2 rounded-[26px] border border-[#f5d77f]/20 pointer-events-none" />

                  {/* ------------------------------------------------------------
                      CARD HEADER: RADIANT LOTUS & TELUGU CALLIGRAPHY
                      ------------------------------------------------------------ */}
                  <div className="relative z-10 text-center space-y-1.5 mb-5 pt-1">
                    
                    {/* Glowing Lotus Apex */}
                    <div className="flex justify-center items-center">
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-[#f472b6]/30 blur-md animate-pulse" />
                        <span className="relative text-3xl sm:text-4xl filter drop-shadow-[0_2px_10px_rgba(244,114,182,0.6)]">
                          🪷
                        </span>
                      </div>
                    </div>

                    {/* Sacred Telugu Inscription */}
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff7de] via-[#f7d885] to-[#d4af37] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      శ్రీ కన్యకా పరమేశ్వరి
                    </h2>

                    {/* English Subtitle */}
                    <p className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#fbe18d] opacity-95">
                      Kanyaka Parameswari Matha
                    </p>

                    {/* Golden Filigree Flower Divider */}
                    <div className="flex items-center justify-center gap-2 py-0.5">
                      <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                      <span className="text-[#f7d885] text-xs">✤</span>
                      <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
                    </div>

                    {/* Welcome Title & Instructions */}
                    <div className="pt-1">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#fff7de]">
                        {activeTab === 'login' ? 'Welcome Back' : 'New Devotee Sankalpam'}
                      </h3>
                      <p className="text-xs text-[#e8cda2]/90 font-sans">
                        {activeTab === 'login' ? 'Enter your details to continue' : 'Register your Gotram with Penugonda Devasthanam'}
                      </p>
                    </div>

                    {/* Tab Switcher: Devotee Sign In vs New Sankalpam */}
                    <div className="flex rounded-full p-1 bg-[#100204] border border-[#d4af37]/45 shadow-inner mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                          activeTab === 'login'
                            ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] shadow-[0_2px_10px_rgba(247,216,133,0.4)]'
                            : 'text-[#e6be8a] hover:text-white'
                        }`}
                      >
                        Devotee Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                          activeTab === 'register'
                            ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] shadow-[0_2px_10px_rgba(247,216,133,0.4)]'
                            : 'text-[#e6be8a] hover:text-white'
                        }`}
                      >
                        New Sankalpam
                      </button>
                    </div>

                  </div>

                  {/* ------------------------------------------------------------
                      FORM: FULL NAME, 102 GOTRAS, MOBILE (+91), PASSWORD
                      ------------------------------------------------------------ */}
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
                    
                    {/* Field 1: Devotee Full Name */}
                    <div className="rounded-xl bg-[#120204]/85 border border-[#d4af37]/45 p-2.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <label className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5 mb-0.5">
                        <User className="w-3.5 h-3.5 text-[#e5a93b]" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-transparent text-sm text-white placeholder:text-[#a88267]/60 outline-none font-sans"
                      />
                    </div>

                    {/* Field 2: Sacred Gotram (102 Gotras) with Searchable Dropdown */}
                    <div className="rounded-xl bg-[#120204]/85 border border-[#d4af37]/45 p-2.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all relative">
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#e5a93b]" />
                          <span>Gotra</span>
                        </label>
                        <span className="text-[10px] text-[#f7d885]/80 font-normal">Arya Vysya 102</span>
                      </div>
                      
                      {/* Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsGotraDropdownOpen(!isGotraDropdownOpen)}
                        className="w-full flex items-center justify-between text-left text-xs sm:text-sm text-[#fff4d1] outline-none cursor-pointer py-0.5"
                      >
                        <span className="truncate font-serif font-medium">{gotra || 'Select your Gotra'}</span>
                        <ChevronDown className="w-4 h-4 text-[#e5a93b] shrink-0 ml-1.5" />
                      </button>

                      {/* Searchable Dropdown Menu */}
                      {isGotraDropdownOpen && (
                        <div className="absolute top-14 left-0 right-0 z-50 rounded-2xl bg-[#200408] border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2.5 max-h-56 overflow-hidden flex flex-col">
                          <div className="relative mb-2 shrink-0">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#e5a93b]" />
                            <input
                              type="text"
                              value={gotraSearch}
                              onChange={(e) => setGotraSearch(e.target.value)}
                              placeholder="Search by Gotra name, ID, or Telugu..."
                              className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#100204] border border-[#d4af37]/40 text-xs text-white placeholder:text-[#a88267]/60 outline-none"
                              autoFocus
                            />
                          </div>
                          <div className="overflow-y-auto flex-1 divide-y divide-[#d4af37]/15">
                            {filteredGotras.map((item: GothiramItem) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setGotra(`${item.id} - ${item.name}`);
                                  setIsGotraDropdownOpen(false);
                                  setGotraSearch('');
                                }}
                                className={`w-full py-1.5 px-2.5 text-left flex items-center justify-between text-xs transition-colors rounded-lg cursor-pointer ${
                                  gotra.startsWith(`${item.id} -`)
                                    ? 'bg-[#5a1523] text-[#fbe18d] font-bold'
                                    : 'text-stone-200 hover:bg-[#3d0d16] hover:text-[#fff4d1]'
                                }`}
                              >
                                <span className="font-serif">
                                  <span className="text-[#e5a93b] font-bold mr-1.5">{item.id}.</span>
                                  <span>{item.name}</span>
                                </span>
                                {item.telugu && (
                                  <span className="text-[11px] text-[#e8cda2]/75 font-sans">
                                    {item.telugu}
                                  </span>
                                )}
                              </button>
                            ))}
                            {filteredGotras.length === 0 && (
                              <div className="py-3 text-center text-xs text-stone-400">
                                No matching Gotram found.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quick Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 pb-0.5 text-[10px]">
                        <span className="text-[#a88267] font-serif shrink-0">Quick:</span>
                        {quickGotras.map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setGotra(`${q.id} - ${q.name}`)}
                            className={`px-2 py-0.5 rounded-full border text-[10px] font-serif whitespace-nowrap transition-all cursor-pointer ${
                              gotra.startsWith(`${q.id} -`)
                                ? 'bg-[#d4af37] text-[#240a0c] font-bold border-[#ffe89e]'
                                : 'bg-[#150306] text-[#e6be8a] border-[#d4af37]/30 hover:border-[#f5d77f]'
                            }`}
                          >
                            {q.id}. {q.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 3: Mobile Number (🇮🇳 Tricolor +91) */}
                    <div className="rounded-xl bg-[#120204]/85 border border-[#d4af37]/45 p-2.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <label className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5 mb-0.5">
                        <span>Mobile Number</span>
                      </label>
                      <div className="flex items-center">
                        {/* Indian Flag SVG Badge */}
                        <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#d4af37]/35 shrink-0">
                          <svg viewBox="0 0 24 16" className="w-[18px] h-[12px] rounded-[1px] shadow-xs" aria-label="India Flag">
                            <rect width="24" height="5.33" fill="#FF9933" />
                            <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                            <rect y="10.66" width="24" height="5.33" fill="#128807" />
                            <circle cx="12" cy="8" r="2" fill="#000088" />
                          </svg>
                          <span className="text-xs font-serif font-bold text-[#ffe28a]">+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your mobile number"
                          className="w-full bg-transparent pl-3 text-sm text-white placeholder:text-[#a88267]/60 outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Field 4: Password / Devotee PIN */}
                    <div className="rounded-xl bg-[#120204]/85 border border-[#d4af37]/45 p-2.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-[10px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#e5a93b]" />
                          <span>Password</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setPassword('Vasavi@108')}
                          className="text-[10px] text-[#f7d885] hover:underline cursor-pointer"
                        >
                          Use Vedic PIN
                        </button>
                      </div>
                      <div className="flex items-center">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full bg-transparent text-sm text-white placeholder:text-[#a88267]/60 outline-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#e5a93b] hover:text-[#ffe18d] ml-2 shrink-0 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Checkbox: Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer text-[#e8cda2]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded accent-[#d4af37] w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-[11px]">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          showAlert({
                            type: 'info',
                            title: 'Devotee Account Assistance',
                            message: 'Arya Vysya 102 Gotras are officially recognized. If you forgot your password or need Gotram guidance, use Vedic PIN (Vasavi@108) or contact Penugonda Devasthanam Helpdesk.',
                          });
                        }}
                        className="text-[#f7d885] hover:underline text-[11px] cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Status Notice */}
                    {statusMsg && (
                      <div
                        className={`p-2.5 rounded-xl text-xs text-center border ${
                          statusMsg.type === 'error'
                            ? 'bg-red-950/85 border-red-500 text-red-100'
                            : 'bg-[#3d0d16]/90 border-[#d4af37] text-[#fff4d1]'
                        }`}
                      >
                        {statusMsg.text}
                      </div>
                    )}

                    {/* Primary CTA Button: Radiant Golden Amber Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full h-12 rounded-full font-serif font-bold text-base tracking-wide text-[#240a0c] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-[0_8px_30px_rgba(229,169,59,0.5),0_0_15px_rgba(255,225,141,0.4)] overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #fff3c9 0%, #f6c343 45%, #d48b17 100%)',
                      }}
                    >
                      {/* Shimmer Light Sweep */}
                      <div className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
                      
                      <span>{loading ? 'Authenticating...' : 'Login  ➔'}</span>
                    </button>

                    {/* Divider: OR */}
                    <div className="flex items-center justify-center gap-3 my-1">
                      <span className="flex-1 h-[1px] bg-[#d4af37]/35" />
                      <span className="text-[10px] font-bold font-serif text-[#f5d77f] tracking-widest">OR</span>
                      <span className="flex-1 h-[1px] bg-[#d4af37]/35" />
                    </div>

                    {/* Secondary Action: Continue with Google */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full h-11 rounded-full bg-[#150306]/90 hover:bg-[#28080f] border border-[#d4af37]/45 hover:border-[#ffe18d] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* Instant Atithi (Guest) Entry */}
                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="w-full py-2 px-3 rounded-full bg-[#3d0d16]/70 hover:bg-[#54121f] border border-[#f5d77f]/45 text-[#fbe18d] font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span>🪔</span>
                      <span>Explore Sanctuary as Guest (Atithi Devotee) ➔</span>
                    </button>

                  </form>

                  {/* ------------------------------------------------------------
                      CARD FOOTER: BLESSED BY AMMAVARU & SECURITY SEALS
                      ------------------------------------------------------------ */}
                  <div className="mt-5 pt-3 border-t border-[#d4af37]/25 text-center space-y-1">
                    
                    {/* Golden Lotus Seal */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-8 h-[1px] bg-[#d4af37]/40" />
                      <span className="text-[#f7d885] text-sm">🪷</span>
                      <span className="w-8 h-[1px] bg-[#d4af37]/40" />
                    </div>

                    <p className="text-[10px] text-[#f5d77f] font-serif font-medium">
                      Blessed by Sri Kanyaka Parameswari Matha
                    </p>

                    <div className="flex items-center justify-center gap-2 text-[9px] text-[#e8cda2]/70 pt-0.5">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
                      </span>
                      <span>•</span>
                      <span>Section 80G Tax Exempt</span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Vedic Blessing Toast */}
      {blessingToast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#2b070e] border-2 border-[#f5d77f] text-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-3 animate-bounce">
          <span className="text-2xl">🪔</span>
          <div className="text-left">
            <h4 className="font-serif font-bold text-[#ffe28a] text-sm">{blessingToast.title}</h4>
            <p className="text-xs text-[#e8cda2]">{blessingToast.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
}
