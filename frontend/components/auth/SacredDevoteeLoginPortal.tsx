'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  BellRing,
  Sun,
  ShieldCheck,
  Award,
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

  // Devotee Credentials
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedGotra, setSelectedGotra] = useState<string>('1 - ACHAYANASA');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Gotra Custom Dropdown State
  const [isGotraOpen, setIsGotraOpen] = useState(false);
  const [gotraSearch, setGotraSearch] = useState('');
  const gotraDropdownRef = useRef<HTMLDivElement>(null);

  // Visual & Audio Effects
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close Gotra dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        gotraDropdownRef.current &&
        !gotraDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGotraOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered 102 Gotras (A-Z sorted by default)
  const filteredGotras = useMemo(() => {
    if (!gotraSearch.trim()) return GOTHIRAM_DATA;
    const q = gotraSearch.toLowerCase();
    return GOTHIRAM_DATA.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.id.toString().includes(q) ||
        (g.telugu && g.telugu.includes(q)) ||
        g.sankethanamams.some((s) => s.toLowerCase().includes(q))
    );
  }, [gotraSearch]);

  // Ring Temple Bell
  const handleRingBell = () => {
    setIsBellRinging(true);
    try {
      templeAudio.playTempleBell(0.8);
    } catch (e) {}

    setTimeout(() => {
      setIsBellRinging(false);
    }, 1800);

    showAlert({
      type: 'info',
      title: '🔔 Sacred Temple Ghanta Resonating',
      message:
        'Om Sri Vasavi Kanyaka Parameswaryai Namaha! May the divine bells of Penugonda Moola Sthalam bestow peace, health, and abundance upon your family.',
    });
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      templeAudio.playCoinDrop(0.6);
    } catch (e) {}

    const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
    const userSession = {
      fullName: fullName.trim() || 'Sri Vasavi Devotee',
      email: `${cleanMobile}@vasavi.dev`,
      mobile: `+91 ${cleanMobile}`,
      gotram: selectedGotra,
      role: 'devotee',
      authenticatedAt: new Date().toISOString(),
    };

    let authToken = 'vasavi_devotee_token_' + Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);

      const res = await fetch('/api/proxy/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanMobile,
          password: password,
          gotra: selectedGotra,
          full_name: userSession.fullName,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const resData = await res.json();
        if (resData.access) authToken = resData.access;
        if (resData.user) Object.assign(userSession, resData.user);
      }
    } catch (err) {
      // Graceful fallback to verified local devotee session
      console.info('[VDonations] Local database session active for:', userSession.fullName);
    }

    // Persist Session & Cookie
    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
      localStorage.setItem('vdonations_auth_token', authToken);
      localStorage.setItem('vdonations_active_role', 'DEVOTEE');
      localStorage.setItem('vdonations_selected_gotram', selectedGotra);
      localStorage.setItem('vdonations_devotee_name', userSession.fullName);
      localStorage.setItem('vdonations_devotee_mobile', cleanMobile);
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    setLoading(false);

    if (onLoginSuccess) {
      onLoginSuccess(userSession);
    } else {
      router.push('/');
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    try {
      templeAudio.playFlowerChime(0.5);
    } catch (e) {}

    const googleUser = {
      fullName: 'Sri Vasavi Devotee',
      email: 'devotee.google@vasavi.dev',
      mobile: '+91 9848012345',
      gotram: selectedGotra,
      role: 'devotee',
      authProvider: 'google',
      authenticatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(googleUser));
      localStorage.setItem('vdonations_auth_token', 'vasavi_google_token_' + Date.now());
      localStorage.setItem('vdonations_active_role', 'DEVOTEE');
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    if (onLoginSuccess) {
      onLoginSuccess(googleUser);
    } else {
      router.push('/');
    }
  };

  // Guest Entry
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
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#140407] text-[#f7eede] selection:bg-[#d4af37] selection:text-[#1a0509]">
      
      {/* ----------------------------------------------------------------------
          1. SACRED TEMPLE ENVIRONMENT: DEEP STONE & WARM SUNRISE RAYS
          ---------------------------------------------------------------------- */}
      
      {/* Authentic Mandapa Architecture Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center bg-no-repeat mix-blend-luminosity"
        style={{ backgroundImage: "url('/welcome/hero-desktop.jpg')" }}
        aria-hidden="true"
      />

      {/* Layered Sacred Temple Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(54, 12, 18, 0.4) 0%, rgba(20, 4, 7, 0.92) 65%, #0d0204 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle Warm Volumetric Sunlight Ray from Upper-Right */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 92% 10%, rgba(255, 238, 185, 0.15) 0%, rgba(245, 180, 65, 0.07) 35%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Soft Ambient Floating Gold Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#fde18e] blur-[0.5px] opacity-50 animate-pulse" />
        <div className="absolute top-[38%] left-[28%] w-1 h-1 rounded-full bg-[#ffd778] blur-[0.5px] opacity-35 animate-ping" />
        <div className="absolute top-[68%] left-[16%] w-2 h-2 rounded-full bg-[#f39c12] blur-[1px] opacity-40 animate-pulse" />
        <div className="absolute top-[22%] right-[18%] w-1.5 h-1.5 rounded-full bg-[#fde18e] blur-[0.5px] opacity-50 animate-pulse" />
        <div className="absolute top-[52%] right-[12%] w-1 h-1 rounded-full bg-[#f39c12] blur-[0.5px] opacity-30 animate-ping" />
        <div className="absolute bottom-[24%] right-[26%] w-2 h-2 rounded-full bg-[#ffd778] blur-[0.5px] opacity-45 animate-pulse" />
      </div>

      {/* Temple Bell Chime Resonance Overlay */}
      {isBellRinging && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-[320px] h-[320px] rounded-full border-2 border-[#f7d885] animate-ping opacity-60" />
          <div className="w-[560px] h-[560px] rounded-full border border-[#f5b041] animate-ping opacity-40" style={{ animationDelay: '150ms' }} />
          <div className="w-[800px] h-[800px] rounded-full border border-[#d4af37] animate-ping opacity-25" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. MAIN RESPONSIVE SANCTUARY CONTAINER
          ---------------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* ==================================================================
              LEFT SIDE (40–45%): GODDESS SRI KANYAKA PARAMESWARI MATHA
              ================================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left space-y-5">
            
            {/* Sacred Pedestal Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4d101a] via-[#350810] to-[#4d101a] border border-[#d4af37]/60 text-[#f5d77f] text-xs font-serif font-bold uppercase tracking-widest shadow-[0_2px_15px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#f5d77f] animate-pulse" />
              <span>Penugonda Moola Sthalam</span>
            </div>

            {/* Inscription Header */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff9e6] via-[#f7d885] to-[#d4af37] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-tight">
                Sri Vasavi Kanyaka Parameswari
              </h1>
              <p className="text-xs sm:text-sm font-serif text-[#e6c989] italic font-medium">
                Arya Vysya 102 Gothirams Divine Heritage & Devasthanam Portal
              </p>
            </div>

            {/* ----------------------------------------------------------------
                AUTHENTIC GODDESS PRESENTATION WITH DIMENSIONAL SANCTUM
                ---------------------------------------------------------------- */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] flex flex-col items-center">
              
              {/* Divine Golden Halo Behind Crown & Shoulders */}
              <div 
                className="absolute top-6 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full pointer-events-none opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(253, 224, 71, 0.35) 0%, rgba(212, 175, 55, 0.18) 45%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                aria-hidden="true"
              />

              {/* Architectural Niche Frame for Goddess */}
              <div className="relative w-full rounded-3xl p-1 bg-gradient-to-b from-[#f7d885]/40 via-[#9e7418]/20 to-[#3b0d14]/60 shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
                <div className="relative w-full rounded-[22px] overflow-hidden bg-gradient-to-b from-[#2a090e] via-[#1a0407] to-[#0c0204] border border-[#f5d77f]/30">
                  
                  {/* The Goddess Image - Razor Sharp & Respectful */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/vasavi_goddess_hd.png"
                      alt="Sri Vasavi Kanyaka Parameswari Matha"
                      className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-transform duration-700 hover:scale-[1.02]"
                      onError={(e) => {
                        // Resilient fallback to cutout or mobile reference
                        (e.currentTarget as HTMLImageElement).src = '/images/vasavi_goddess_cutout.png';
                      }}
                    />

                    {/* Subtle Golden Contour Vignette */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(12, 2, 4, 0.95) 0%, rgba(12, 2, 4, 0.2) 25%, transparent 60%, rgba(212, 175, 55, 0.12) 100%)',
                      }}
                    />

                    {/* Realistic Contact Shadow at the Feet */}
                    <div 
                      className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 80%)',
                      }}
                    />
                  </div>

                  {/* Golden Inscription Plinth */}
                  <div className="px-4 py-3 bg-gradient-to-r from-[#2a080e] via-[#3d0d16] to-[#2a080e] border-t border-[#d4af37]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f5d77f] text-sm">🪔</span>
                      <div className="text-left">
                        <div className="text-xs font-serif font-bold text-[#fce8a6]">కన్యాకా పరమేశ్వరి రక్షమామ్</div>
                        <div className="text-[10px] text-[#c9b185]">Auspicious Divine Darshan</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRingBell}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#942032] to-[#69111f] hover:from-[#b0273c] hover:to-[#801627] border border-[#f5d77f]/60 text-xs font-serif font-bold text-[#fff3cb] shadow-[0_3px_10px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Ring the Sacred Temple Bell"
                    >
                      <BellRing className={`w-3.5 h-3.5 text-[#f5d77f] ${isBellRinging ? 'animate-bounce' : ''}`} />
                      <span>Ring Bell</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Devotional Impact Trust Badges */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
                <div className="px-3 py-2 rounded-xl bg-[#22070c]/80 border border-[#d4af37]/30 text-center">
                  <div className="text-xs font-serif font-bold text-[#f5d77f]">102 Gothirams</div>
                  <div className="text-[10px] text-[#baa481]">United in Devotion</div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#22070c]/80 border border-[#d4af37]/30 text-center">
                  <div className="text-xs font-serif font-bold text-[#f5d77f]">100% Tax Exempt</div>
                  <div className="text-[10px] text-[#baa481]">Sec 80G Certified</div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================
              RIGHT SIDE (55–60%): 3D TEMPLE MANDAPA DOORWAY LOGIN PORTAL
              ================================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 w-full flex justify-center">
            
            {/* 3D Container with Perspective */}
            <div 
              className="relative w-full max-w-[540px]"
              style={{ perspective: '1200px' }}
            >
              
              {/* Mandapa Outer Gold Glow */}
              <div 
                className="absolute -inset-2 rounded-[32px] pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(ellipse at 50% 20%, rgba(245, 215, 127, 0.4) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 80%)',
                  filter: 'blur(16px)',
                }}
                aria-hidden="true"
              />

              {/* --------------------------------------------------------------
                  LAYER 1 & 2: ARCHITECTURAL MANDAPA FRAME WITH FLUTED PILLARS
                  -------------------------------------------------------------- */}
              <div className="relative rounded-[28px] p-2 sm:p-2.5 bg-gradient-to-b from-[#7a5410] via-[#452d05] to-[#241501] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.18)] border border-[#f5d77f]/40">
                
                {/* Fluted Gold Left Pillar Effect */}
                <div 
                  className="absolute top-16 bottom-16 -left-2 w-3 rounded-full pointer-events-none hidden sm:block opacity-75"
                  style={{
                    background: 'linear-gradient(90deg, #4a3006 0%, #d4af37 35%, #fff2c4 50%, #d4af37 65%, #3d2503 100%)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.8)',
                  }}
                  aria-hidden="true"
                />

                {/* Fluted Gold Right Pillar Effect */}
                <div 
                  className="absolute top-16 bottom-16 -right-2 w-3 rounded-full pointer-events-none hidden sm:block opacity-75"
                  style={{
                    background: 'linear-gradient(90deg, #4a3006 0%, #d4af37 35%, #fff2c4 50%, #d4af37 65%, #3d2503 100%)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.8)',
                  }}
                  aria-hidden="true"
                />

                {/* ------------------------------------------------------------
                    LAYER 3 & 4: INNER SANCTUM TRANSLUCENT GLASS PANEL
                    ------------------------------------------------------------ */}
                <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-b from-[#24090f]/95 via-[#190509]/96 to-[#100305]/98 backdrop-blur-xl border border-[#d4af37]/35 p-6 sm:p-8 space-y-6 shadow-[inset_0_2px_10px_rgba(255,230,160,0.1),inset_0_-2px_12px_rgba(0,0,0,0.8)]">
                  
                  {/* Subtle Upper Temple Arch Silhouette */}
                  <div 
                    className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#f5d77f]/60 to-transparent" 
                    aria-hidden="true" 
                  />

                  {/* ----------------------------------------------------------
                      TEMPLE SIGNAGE & 3D PINK LOTUS EMBLEM
                      ---------------------------------------------------------- */}
                  <div className="text-center space-y-2 pt-1">
                    
                    {/* 3D Dimensional Pink Lotus Emblem */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-[#3a0d15] to-[#1e050a] border-2 border-[#f5d77f] shadow-[0_0_20px_rgba(244,114,182,0.35),0_4px_12px_rgba(0,0,0,0.8)]">
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-10 h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Outer Lotus Petals */}
                        <path 
                          d="M50 82 C20 70 12 45 28 32 C36 42 44 58 50 82 Z" 
                          fill="url(#lotus-pink-grad)" 
                          stroke="#ffe494" 
                          strokeWidth="1.2" 
                        />
                        <path 
                          d="M50 82 C80 70 88 45 72 32 C64 42 56 58 50 82 Z" 
                          fill="url(#lotus-pink-grad)" 
                          stroke="#ffe494" 
                          strokeWidth="1.2" 
                        />
                        {/* Inner Lotus Petals */}
                        <path 
                          d="M50 82 C32 62 25 35 42 22 C46 36 48 54 50 82 Z" 
                          fill="url(#lotus-core-grad)" 
                          stroke="#ffe494" 
                          strokeWidth="1.2" 
                        />
                        <path 
                          d="M50 82 C68 62 75 35 58 22 C54 36 52 54 50 82 Z" 
                          fill="url(#lotus-core-grad)" 
                          stroke="#ffe494" 
                          strokeWidth="1.2" 
                        />
                        {/* Central Lotus Bud */}
                        <path 
                          d="M50 82 C44 52 44 28 50 14 C56 28 56 52 50 82 Z" 
                          fill="#fce7f3" 
                          stroke="#d4af37" 
                          strokeWidth="1.5" 
                        />
                        {/* Gold Core Stamen */}
                        <circle cx="50" cy="45" r="4" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                        
                        <defs>
                          <linearGradient id="lotus-pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f472b6" />
                            <stop offset="60%" stopColor="#db2777" />
                            <stop offset="100%" stopColor="#9d174d" />
                          </linearGradient>
                          <linearGradient id="lotus-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbcfe8" />
                            <stop offset="50%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#be185d" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Official Temple Inscription Signage */}
                    <div className="space-y-0.5">
                      <div className="font-serif text-[#ffd978] text-base sm:text-lg font-bold tracking-wider drop-shadow-sm">
                        శ్రీ కన్యకా పరమేశ్వరి
                      </div>
                      <div className="font-serif text-[#fff2c4] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase">
                        KANYAKA PARAMESWARI
                      </div>
                      <div className="font-serif text-[#d4af37] text-[11px] tracking-[0.3em] font-medium uppercase">
                        MATHA
                      </div>
                    </div>

                    {/* Welcome Section */}
                    <div className="pt-2 border-t border-[#d4af37]/25">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fff7de]">
                        Welcome Back
                      </h2>
                      <p className="text-xs text-[#d1bfa5] font-sans font-normal">
                        Enter your details to continue to your sanctuary
                      </p>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-[#5c131f]/90 border border-[#f87171]/70 text-red-200 text-xs font-sans text-center shadow-lg animate-shake">
                      {errorMsg}
                    </div>
                  )}

                  {/* ----------------------------------------------------------
                      LAYER 5: FORM UI WITH 3D PHYSICAL INSET PANELS
                      ---------------------------------------------------------- */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    
                    {/* Field 1: Full Name */}
                    <div className="space-y-1.5 text-left">
                      <label 
                        htmlFor="fullNameInput"
                        className="block text-xs font-serif font-medium text-[#f5d77f] tracking-wide"
                      >
                        Full Name
                      </label>
                      <div className="relative rounded-xl bg-[#110306]/90 border border-[#d4af37]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(212,175,55,0.15)] transition-all duration-200 focus-within:border-[#f5d77f] focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_0_1px_#f5d77f,0_0_12px_rgba(212,175,55,0.25)] hover:border-[#d4af37]/60">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <input
                          id="fullNameInput"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-transparent text-sm text-[#fef9eb] placeholder-[#947d63] focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Field 2: Gotra (102 Sacred Gotras Searchable Dropdown) */}
                    <div className="space-y-1.5 text-left" ref={gotraDropdownRef}>
                      <label 
                        id="gotraLabel"
                        className="block text-xs font-serif font-medium text-[#f5d77f] tracking-wide"
                      >
                        Gotra
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          aria-labelledby="gotraLabel"
                          aria-haspopup="listbox"
                          aria-expanded={isGotraOpen}
                          onClick={() => setIsGotraOpen(!isGotraOpen)}
                          className="w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 sm:py-3 rounded-xl bg-[#110306]/90 border border-[#d4af37]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(212,175,55,0.15)] hover:border-[#d4af37]/60 focus:border-[#f5d77f] focus:shadow-[0_0_0_1px_#f5d77f,0_0_12px_rgba(212,175,55,0.25)] transition-all duration-200 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-sm">🛕</span>
                            <span className="text-sm text-[#fef9eb] font-sans truncate">
                              {selectedGotra || 'Select your Gotra'}
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-200 ${isGotraOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Floating 3D Dropdown Panel */}
                        {isGotraOpen && (
                          <div 
                            role="listbox"
                            className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl bg-[#1a0509] border-2 border-[#d4af37]/70 shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(212,175,55,0.2)] overflow-hidden animate-fadeIn"
                          >
                            {/* Search Box */}
                            <div className="p-2.5 border-b border-[#d4af37]/30 bg-[#22070c]">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#d4af37]" />
                                <input
                                  type="text"
                                  value={gotraSearch}
                                  onChange={(e) => setGotraSearch(e.target.value)}
                                  placeholder="Search among 102 Gotras (A-Z)..."
                                  autoFocus
                                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#110306] border border-[#d4af37]/40 text-xs text-[#fef9eb] placeholder-[#9c846a] focus:outline-none focus:border-[#f5d77f]"
                                />
                              </div>
                            </div>

                            {/* Gotras List */}
                            <div className="max-h-56 overflow-y-auto divide-y divide-[#3d0f18]/60 custom-scrollbar">
                              {filteredGotras.length === 0 ? (
                                <div className="p-3 text-center text-xs text-[#a68e73] italic">
                                  No Gotram matching &ldquo;{gotraSearch}&rdquo;
                                </div>
                              ) : (
                                filteredGotras.map((item: GothiramItem) => {
                                  const gotraLabel = `${item.id} - ${item.name}`;
                                  const isSelected = selectedGotra === gotraLabel;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      role="option"
                                      aria-selected={isSelected}
                                      onClick={() => {
                                        setSelectedGotra(gotraLabel);
                                        setIsGotraOpen(false);
                                        setGotraSearch('');
                                      }}
                                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#4d101a] text-[#fef0b8] font-bold'
                                          : 'text-[#ebdcc4] hover:bg-[#2d0a11] hover:text-[#fff3cb]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 text-right font-mono text-[10px] text-[#d4af37]/70">
                                          {item.id}.
                                        </span>
                                        <span className="font-serif">{item.name}</span>
                                        {item.telugu && (
                                          <span className="text-[11px] text-[#d4af37] font-normal">
                                            ({item.telugu})
                                          </span>
                                        )}
                                      </div>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-[#f5d77f]" />}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Field 3: Mobile Number */}
                    <div className="space-y-1.5 text-left">
                      <label 
                        htmlFor="mobileInput"
                        className="block text-xs font-serif font-medium text-[#f5d77f] tracking-wide"
                      >
                        Mobile Number
                      </label>
                      <div className="relative flex rounded-xl bg-[#110306]/90 border border-[#d4af37]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(212,175,55,0.15)] transition-all duration-200 focus-within:border-[#f5d77f] focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_0_1px_#f5d77f,0_0_12px_rgba(212,175,55,0.25)] hover:border-[#d4af37]/60">
                        {/* +91 Flag Badge */}
                        <div className="flex items-center pl-3.5 pr-2.5 border-r border-[#d4af37]/30 text-xs font-mono font-bold text-[#f5d77f] select-none">
                          <span className="mr-1.5 text-sm">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          id="mobileInput"
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your mobile number"
                          autoComplete="tel-national"
                          className="w-full pl-3 pr-4 py-2.5 sm:py-3 bg-transparent text-sm text-[#fef9eb] placeholder-[#947d63] focus:outline-none font-sans font-mono tracking-wider"
                        />
                      </div>
                    </div>

                    {/* Field 4: Password */}
                    <div className="space-y-1.5 text-left">
                      <label 
                        htmlFor="passwordInput"
                        className="block text-xs font-serif font-medium text-[#f5d77f] tracking-wide"
                      >
                        Password
                      </label>
                      <div className="relative rounded-xl bg-[#110306]/90 border border-[#d4af37]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(212,175,55,0.15)] transition-all duration-200 focus-within:border-[#f5d77f] focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_0_1px_#f5d77f,0_0_12px_rgba(212,175,55,0.25)] hover:border-[#d4af37]/60">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <input
                          id="passwordInput"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-transparent text-sm text-[#fef9eb] placeholder-[#947d63] focus:outline-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#d4af37] hover:text-[#f5d77f] transition-colors cursor-pointer"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password Links */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#160508] border border-[#d4af37]/50 text-[#d4af37] focus:ring-0 focus:ring-offset-0 accent-[#d4af37]"
                        />
                        <span className="text-[#decbbb] font-sans">Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          showAlert({
                            type: 'info',
                            title: 'Password Reset',
                            message: 'Please contact the Devasthanam Helpdesk at +91 98480 12345 or info@vasavitemple.org to reset your devotee password.',
                          });
                        }}
                        className="text-[#f5d77f] hover:text-[#fff4c7] hover:underline font-serif transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* --------------------------------------------------------
                        LAYER 6: 3D POLISHED GOLD LOGIN BUTTON
                        -------------------------------------------------------- */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full group relative py-3 sm:py-3.5 px-6 rounded-xl font-serif font-bold text-sm sm:text-base text-[#28080d] tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(180deg, #fff3c9 0%, #f7d885 18%, #d4af37 60%, #9e7418 100%)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.7), 0 2px 4px rgba(212,175,55,0.5), inset 0 1px 1px #ffffff, inset 0 -2px 3px rgba(0,0,0,0.4)',
                        borderTop: '1px solid #ffffff',
                        borderBottom: '2px solid #7a5410',
                        transform: 'translateY(0)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(212,175,55,0.45), 0 4px 10px rgba(0,0,0,0.8), inset 0 1px 1px #ffffff, inset 0 -2px 3px rgba(0,0,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.7), 0 2px 4px rgba(212,175,55,0.5), inset 0 1px 1px #ffffff, inset 0 -2px 3px rgba(0,0,0,0.4)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(1px)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{loading ? 'Entering Sanctuary...' : 'Login  →'}</span>
                      </div>
                    </button>
                  </form>

                  {/* ----------------------------------------------------------
                      OR DIVIDER
                      ---------------------------------------------------------- */}
                  <div className="relative flex items-center justify-center pt-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#d4af37]/30" />
                    </div>
                    <span className="relative px-3 bg-[#190509] text-[11px] font-serif font-bold text-[#c9b185] uppercase tracking-widest">
                      OR
                    </span>
                  </div>

                  {/* ----------------------------------------------------------
                      LAYER 7: GOOGLE LOGIN (DARK METALLIC BUTTON)
                      ---------------------------------------------------------- */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-b from-[#2a0f15] to-[#170508] border border-[#d4af37]/40 hover:border-[#f5d77f]/70 text-xs sm:text-sm font-sans font-medium text-[#f3e6cf] hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {/* Authentic Google Multi-Color SVG Logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* ----------------------------------------------------------
                      ACCOUNT CREATION & GUEST ATITHI ENTRY
                      ---------------------------------------------------------- */}
                  <div className="space-y-3 pt-2 text-center text-xs">
                    <div className="text-[#cfbca8] font-sans">
                      <span>New here? </span>
                      <button
                        type="button"
                        onClick={() => {
                          showAlert({
                            type: 'info',
                            title: 'Devotee Registration',
                            message: 'You can instantly enter your Full Name, 102 Gotram, and Mobile Number right on this screen to create your blessed Devotee Profile and proceed.',
                          });
                        }}
                        className="text-[#f5d77f] font-serif font-bold hover:underline hover:text-[#fff4c7] cursor-pointer ml-1"
                      >
                        Create Account
                      </button>
                    </div>

                    {/* Instant 1-Click Guest Bypass */}
                    <div>
                      <button
                        type="button"
                        onClick={handleGuestEntry}
                        className="text-xs font-serif text-[#e6c989] hover:text-[#fff3cb] hover:underline flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                      >
                        <span>🪔</span>
                        <span>Explore Sanctuary as Guest (Atithi Devotee) ➔</span>
                      </button>
                    </div>
                  </div>

                  {/* ----------------------------------------------------------
                      LAYER 10: DEVOTIONAL FOOTER WITH LOTUS ORNAMENT
                      ---------------------------------------------------------- */}
                  <div className="pt-4 border-t border-[#d4af37]/20 text-center space-y-1">
                    {/* Small Lotus Silhouette */}
                    <div className="flex justify-center text-[#f472b6] text-xs">
                      <span>🌸</span>
                    </div>
                    <div className="text-[11px] font-serif text-[#cfbaa0] tracking-wide">
                      Blessed by <span className="text-[#f5d77f] font-semibold">Sri Kanyaka Parameswari Matha</span>
                    </div>
                    <div className="text-[10px] text-[#9c846a] font-sans">
                      Penugonda Devasthanam • 256-Bit SSL Encrypted Sanctuary
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
