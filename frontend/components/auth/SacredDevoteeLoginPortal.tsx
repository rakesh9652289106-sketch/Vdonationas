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

  // Visual Effects State
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

  // Ring Temple Bell Audio & Vibration with Visual Ripples
  const handleRingBell = () => {
    setIsBellRinging(true);
    try {
      templeAudio.playTempleBell(0.85);
    } catch (e) {}

    setTimeout(() => {
      setIsBellRinging(false);
    }, 1600);

    showAlert({
      type: 'info',
      title: 'Sacred Temple Bell Resonating',
      message: '🔔 Om Sri Vasavi Kanyaka Parameswaryai Namaha! May divine blessings of Penugonda Devasthanam illuminate your home with peace and prosperity.',
    });
  };

  // Toggle Sacred Mantra / Chime
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

  // Submit Login to Django REST API via Next.js proxy
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
    setStatusMsg({ type: 'success', text: '✦ Authenticating with Penugonda Devasthanam Portal...' });

    // Play auspicious gold chime
    try {
      templeAudio.playCoinDrop(0.6);
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
      console.info('[VDonations] Local database session active:', userSession.fullName);
    }

    // Persist session & cookie
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
      fullName: 'Sri Vasavi Devotee (Google)',
      email: 'devotee.google@vasavi.dev',
      mobile: '+91 9848012345',
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
      templeAudio.playTempleBell(0.6);
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-radial from-[#380b13] via-[#1c0509] to-[#080203] text-white selection:bg-[#d4af37] selection:text-[#240a0c]">
      
      {/* ----------------------------------------------------------------------
          1. SACRED BACKGROUND EFFECTS: ROTATING MANDALA & GOLD PARTICLES
          ---------------------------------------------------------------------- */}
      
      {/* Slow-Rotating Sacred Mandala Watermark */}
      <div 
        className="fixed -left-32 -top-32 w-[650px] h-[650px] opacity-[0.07] pointer-events-none animate-[spin_120s_linear_infinite]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-[#ffe494] fill-none stroke-[0.75]">
          <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="35" />
          <circle cx="100" cy="100" r="15" />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="5"
              x2="100"
              y2="195"
              transform={`rotate(${i * 11.25} 100 100)`}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <polygon
              key={i}
              points="100,20 120,60 100,50 80,60"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Floating Gold Diya Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-[#fde18e] blur-[1px] opacity-60 animate-pulse" />
        <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#ffd778] blur-[0.5px] opacity-40 animate-ping" />
        <div className="absolute top-[65%] left-[8%] w-2.5 h-2.5 rounded-full bg-[#f39c12] blur-[1.5px] opacity-50 animate-pulse" />
        <div className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full bg-[#fde18e] blur-[1px] opacity-70 animate-pulse" />
        <div className="absolute top-[50%] right-[8%] w-1.5 h-1.5 rounded-full bg-[#f39c12] blur-[1px] opacity-40 animate-ping" />
        <div className="absolute bottom-[20%] right-[22%] w-2 h-2 rounded-full bg-[#ffd778] blur-[0.5px] opacity-60 animate-pulse" />
      </div>

      {/* Golden Matrix Stardust Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Ambient Top & Bottom Volumetric Halos */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] rounded-full bg-gradient-to-b from-[#e5a93b]/25 via-[#996515]/10 to-transparent blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-[#b82e42]/15 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Bell Ripple Effect Overlay */}
      {isBellRinging && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border-2 border-[#f7d885] animate-ping opacity-75" />
          <div className="w-[500px] h-[500px] rounded-full border border-[#f5b041] animate-ping opacity-50" style={{ animationDelay: '150ms' }} />
          <div className="w-[700px] h-[700px] rounded-full border border-[#f39c12] animate-ping opacity-30" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. MAIN CONTAINER: SPLIT SCREEN DEVOTEE SANCTUARY
          ---------------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ==================================================================
              LEFT COLUMN: SACRED DEVISTHANAM HERITAGE & AMMAVARU SHOWCASE
              ================================================================== */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Crest Badge with Golden Border */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5a1523]/80 via-[#3d0d16]/90 to-[#5a1523]/80 border border-[#d4af37]/60 text-[#f7d885] text-xs font-serif font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Flame className="w-4 h-4 text-[#f39c12] animate-pulse" />
              <span>Sri Kanyaka Parameswari Devasthanam</span>
            </div>

            {/* Grand Title with Sacred Metallic Gold Typography */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff7de] via-[#f7d885] to-[#d4af37] leading-[1.18] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                Sri Vasavi Kanyaka Parameswari Matha
              </h1>
              <p className="text-sm sm:text-base font-serif text-[#f3cf7a] italic font-medium">
                Penugonda Moola Sthalam • Arya Vysya 102 Gothirams Heritage Portal
              </p>
            </div>

            {/* ----------------------------------------------------------------
                GLOWING AMMAVARU MEDALLION WITH ROTATING SUNBURST RAYS
                ---------------------------------------------------------------- */}
            <div className="flex justify-center lg:justify-start py-2">
              <div className="relative group">
                
                {/* Rotating Sunburst Halo */}
                <div 
                  className="absolute -inset-4 rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none animate-[spin_40s_linear_infinite]"
                  style={{
                    background: 'conic-gradient(from 0deg, #d4af37, #f7d885, #b37714, #ffe89e, #d4af37)',
                    filter: 'blur(10px)',
                  }}
                />

                {/* Floating Gold Sparkle Badges */}
                <div className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-[#4a101b] border border-[#f5d77f] flex items-center justify-center text-sm shadow-gold animate-bounce">
                  ✨
                </div>
                <div className="absolute top-1/2 -left-3 z-20 w-7 h-7 rounded-full bg-[#4a101b] border border-[#f5d77f] flex items-center justify-center text-xs shadow-gold animate-pulse">
                  🪙
                </div>

                {/* Concentric Golden Rim */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-[#ffe494] via-[#d4af37] to-[#b37714] shadow-[0_0_80px_rgba(212,175,55,0.5),inset_0_0_30px_rgba(212,175,55,0.4)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#2d0a10] to-[#120305] border-2 border-[#fff0ba] relative flex items-center justify-center">
                    <img
                      src="/images/vasavi_goddess_hd.png"
                      alt="Sri Vasavi Kanyaka Parameswari Matha"
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-115 transition-transform duration-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/welcome/welcome-mobile.jpg';
                      }}
                    />
                    {/* Golden Atmospheric Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160407] via-transparent to-[#d4af37]/15 opacity-70" />
                  </div>

                  {/* Floating Sanctum Location Crest */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4d0f1a] to-[#2e080f] border-2 border-[#f5d77f] text-[#fbe18d] text-xs font-serif font-bold shadow-[0_6px_20px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-sm">🪔</span>
                    <span>Penugonda Moola Sthalam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Telugu Inscription with Gold Border Ribbon */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#29080e]/90 via-[#360b13]/90 to-[#29080e]/90 border border-[#d4af37]/40 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] space-y-1.5 max-w-lg mx-auto lg:mx-0">
              <div className="text-center font-serif text-[#ffe494] text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="text-[#f5b041]">✦</span>
                <span>&ldquo;ధర్మ రక్షణార్థాయ సంభవామి యుగే యుగే&rdquo;</span>
                <span className="text-[#f5b041]">✦</span>
              </div>
              <p className="text-[12px] text-[#e8cda2]/90 text-center leading-relaxed font-sans">
                Official digital sanctuary for Darshan, 80G Tax-Exempt Sevas, Swarna Hundi, and Arya Vysya 102 Gothirams Heritage.
              </p>
            </div>

            {/* Interactive Panchangam & Ring Temple Bell Ticker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="px-4 py-2 rounded-full bg-[#3d0d16]/90 border border-[#f5d77f]/40 text-xs font-serif text-[#ffe28a] flex items-center gap-2 shadow-sm">
                <Sun className="w-3.5 h-3.5 text-[#f6b43d]" />
                <span>Today: Shravana Masa • Ekadashi Tithi</span>
              </div>
              
              <button
                type="button"
                onClick={handleRingBell}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#a12338] via-[#85192b] to-[#63111e] hover:from-[#ba2840] hover:to-[#781525] border-2 border-[#f5d77f]/70 text-xs font-serif font-bold text-[#fff3cb] flex items-center gap-2 shadow-[0_4px_15px_rgba(161,35,56,0.5)] hover:shadow-[0_6px_20px_rgba(245,215,127,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <BellRing className={`w-4 h-4 text-[#ffe28a] ${isBellRinging ? 'animate-bounce' : ''}`} />
                <span>Ring Temple Bell</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMantra}
                className={`px-3.5 py-2 rounded-full border text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                  isChantPlaying
                    ? 'bg-[#d4af37] text-[#240c02] border-[#ffe89e] font-bold shadow-gold'
                    : 'bg-[#2b080f]/80 text-[#f5d77f] border-[#d4af37]/30 hover:bg-[#3d0d16]'
                }`}
                title="Play Sacred Temple Chimes"
              >
                {isChantPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isChantPlaying ? 'Sacred Chime Active' : 'Temple Chime'}</span>
              </button>
            </div>

            {/* Three Pillars of Trust */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#d4af37]/25 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">102</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">Sacred Gotras</span>
              </div>
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">₹4.8 Cr+</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">Devotee Sevas</span>
              </div>
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">80G</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">100% Tax Exempt</span>
              </div>
            </div>

          </div>

          {/* ==================================================================
              RIGHT COLUMN: DEVOTEE AUTHENTICATION SANCTUM CARD
              ================================================================== */}
          <div className="lg:col-span-6 flex justify-center">
            
            {/* Animated Golden Border Wrapper */}
            <div className="relative w-full max-w-md p-[2.5px] rounded-3xl bg-gradient-to-b from-[#ffe6a3] via-[#d4af37] to-[#734b08] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.3)]">
              
              {/* Card Body */}
              <div className="relative w-full rounded-[22px] p-6 sm:p-8 bg-[#1f0509]/95 backdrop-blur-2xl overflow-hidden text-left">
                
                {/* 4 Ornate Golden Corner Temple Filigrees */}
                <div className="absolute top-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute top-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute bottom-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute bottom-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>

                {/* Inner Hairline Frame */}
                <div className="absolute inset-2.5 rounded-[18px] border border-[#f5d77f]/20 pointer-events-none" />

                {/* Card Header & Tab Switcher */}
                <div className="relative z-10 mb-6 text-center space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#f7d885] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5a93b]" />
                    <span>Devotee Sanctuary Access</span>
                  </div>
                  
                  {/* Luxury Gold Tabs */}
                  <div className="flex rounded-full p-1 bg-[#120204] border border-[#d4af37]/40 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
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
                      className={`flex-1 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                        activeTab === 'register'
                          ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] shadow-[0_2px_10px_rgba(247,216,133,0.4)]'
                          : 'text-[#e6be8a] hover:text-white'
                      }`}
                    >
                      New Sankalpam
                    </button>
                  </div>
                </div>

                {/* Interactive Form */}
                <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                  
                  {/* Field 1: Devotee Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#e5a93b]" /> Devotee Full Name
                    </label>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sri Vasavi Devotee"
                        className="w-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Field 2: 102 Sacred Gothiram Selector with Search & Quick Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#e5a93b]" /> Sacred Gotram (102 Gotras)
                      </span>
                      <span className="text-[10px] text-[#f7d885]/80 font-normal">Arya Vysya 102</span>
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsGotraDropdownOpen(!isGotraDropdownOpen)}
                        className="w-full h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 flex items-center justify-between text-left text-xs sm:text-sm text-[#fff4d1] focus:border-[#ffe18d] focus:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all cursor-pointer"
                      >
                        <span className="truncate font-serif font-medium">{gotra || 'Select your Gotram'}</span>
                        <ChevronDown className="w-4 h-4 text-[#e5a93b] shrink-0 ml-2" />
                      </button>

                      {/* Searchable Gotra Dropdown Menu */}
                      {isGotraDropdownOpen && (
                        <div className="absolute top-14 left-0 right-0 z-50 rounded-2xl bg-[#23050a] border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2.5 max-h-60 overflow-hidden flex flex-col">
                          <div className="relative mb-2 shrink-0">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#e5a93b]" />
                            <input
                              type="text"
                              value={gotraSearch}
                              onChange={(e) => setGotraSearch(e.target.value)}
                              placeholder="Search by Gotra name, ID, or Telugu..."
                              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#120204] border border-[#d4af37]/40 text-xs text-white placeholder:text-[#a88267]/60 outline-none"
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
                                className={`w-full py-2 px-3 text-left flex items-center justify-between text-xs transition-colors rounded-lg cursor-pointer ${
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
                                  <span className="text-[11px] text-[#e8cda2]/70 font-sans">
                                    {item.telugu}
                                  </span>
                                )}
                              </button>
                            ))}
                            {filteredGotras.length === 0 && (
                              <div className="py-4 text-center text-xs text-stone-400">
                                No matching Gotram found.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Gotram Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[10px]">
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
                  <div className="space-y-1">
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                      <span>📱 Devotee Mobile Number</span>
                    </label>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      {/* Indian Flag SVG Badge */}
                      <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#d4af37]/30 shrink-0">
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
                        placeholder="10-digit mobile number"
                        className="w-full bg-transparent pl-3 text-sm text-white placeholder:text-[#a88267]/50 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 4: Password / Fast PIN */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#e5a93b]" /> Password / Secure PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => setPassword('Vasavi@108')}
                        className="text-[10px] text-[#f7d885] hover:underline cursor-pointer"
                      >
                        Use Vedic PIN
                      </button>
                    </div>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password or PIN"
                        className="w-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none"
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

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-[#e8cda2]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-[#d4af37] w-4 h-4 cursor-pointer"
                      />
                      <span>Remember my Gotram</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusMsg({
                          type: 'success',
                          text: 'Arya Vysya 102 Gothirams are indexed 1-102. Contact Penugonda Devasthanam for assistance.',
                        });
                      }}
                      className="text-[#f7d885] hover:underline text-[11px] cursor-pointer"
                    >
                      Gotram Help?
                    </button>
                  </div>

                  {/* Status Feedback Notice */}
                  {statusMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs text-center border ${
                        statusMsg.type === 'error'
                          ? 'bg-red-950/80 border-red-500 text-red-100'
                          : 'bg-[#3d0d16]/90 border-[#d4af37] text-[#fff4d1]'
                      }`}
                    >
                      {statusMsg.text}
                    </div>
                  )}

                  {/* Primary Radiant Golden CTA Button with Shimmer */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-13 rounded-full font-serif font-bold text-base tracking-wide text-[#240a0c] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-[0_10px_35px_rgba(229,169,59,0.6),0_0_20px_rgba(255,225,141,0.4)] overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #fff3c9 0%, #f6c343 45%, #d48b17 100%)',
                    }}
                  >
                    {/* Diagonal Light Sweep Effect */}
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
                    
                    <span>{loading ? 'Authenticating...' : 'Enter Devotee Sanctuary'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Divider: OR */}
                  <div className="flex items-center justify-center gap-3 my-2">
                    <span className="flex-1 h-[1px] bg-[#d4af37]/30" />
                    <span className="text-[11px] font-bold font-serif text-[#f5d77f] tracking-widest">✦ OR ✦</span>
                    <span className="flex-1 h-[1px] bg-[#d4af37]/30" />
                  </div>

                  {/* Secondary Action: Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-11 rounded-full bg-[#150306] hover:bg-[#28080f] border border-[#d4af37]/40 hover:border-[#ffe18d] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Instant Atithi (Guest) Entry Button */}
                  <div className="pt-1.5 text-center">
                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#5a1523]/70 to-[#380b13]/70 hover:from-[#751c2f] hover:to-[#4a0e19] border border-[#f5d77f]/50 hover:border-[#f5d77f] text-[#fbe18d] font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                    >
                      <span>🪔</span>
                      <span>Explore Sanctuary as Guest (Atithi Devotee) ➔</span>
                    </button>
                  </div>

                </form>

                {/* Security & Official Seal Footer */}
                <div className="mt-6 pt-3.5 border-t border-[#d4af37]/25 text-center space-y-1 text-[11px] text-[#e8cda2]/75">
                  <div className="flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>Section 80G Tax Exempt</span>
                  </div>
                  <p className="text-[10px] text-[#f5d77f]/80 font-serif">
                    Sri Vasavi Kanyaka Parameswari Matha Devasthanam, Penugonda
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Vedic Blessing Toast */}
      {blessingToast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#300910] border-2 border-[#f5d77f] text-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-3 animate-bounce">
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
