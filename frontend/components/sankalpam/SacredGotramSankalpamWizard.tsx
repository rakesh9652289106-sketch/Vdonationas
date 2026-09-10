'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronDown,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Flame,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  GOTHIRAM_DATA,
  GothiramItem,
  getAllSankethanamamEntries,
  searchGotramAndSankethanamam,
} from '@/lib/gothiram-data';
import { templeAudio } from '@/lib/templeAudio';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { devoteeService } from '@/lib/supabase-service';

export default function SacredGotramSankalpamWizard() {
  const router = useRouter();
  const { login } = useAuth();

  // Devotee details passed from Step 1 (Login / Register / Google Auth)
  const [devotee, setDevotee] = useState({
    fullName: 'Sri Vasavi Devotee',
    mobileNumber: '9848012345',
    email: '',
    password: '',
    authProvider: 'password',
  });

  // Selected Gotram & Sankethanamam state
  const [selectedGotra, setSelectedGotra] = useState<GothiramItem | null>(null);
  const [selectedSankethanamam, setSelectedSankethanamam] = useState<string>('');

  // Search & input states for Gotram field
  const [gotraSearch, setGotraSearch] = useState('');
  const [isGotraDropdownOpen, setIsGotraDropdownOpen] = useState(false);

  // Direct Sankethanamam search states (for devotees who don't know their Gotram)
  const [directSankethanamamQuery, setDirectSankethanamamQuery] = useState('');
  const [isDirectSearchOpen, setIsDirectSearchOpen] = useState(false);

  // Confirmation Modal state when a Sankethanamam is chosen to autofill a Gotram
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    sankethanamam: string;
    gotra: GothiramItem;
    source: 'gotra_input' | 'direct_search';
  } | null>(null);

  // Status & loading feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [blessingCelebration, setBlessingCelebration] = useState(false);

  // Dropdown click outside listeners
  const gotraBoxRef = useRef<HTMLDivElement>(null);
  const directBoxRef = useRef<HTMLDivElement>(null);

  // Load pending devotee data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pendingRaw = localStorage.getItem('vdonations_pending_sankalpam');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          setDevotee({
            fullName: parsed.fullName || 'Sri Vasavi Devotee',
            mobileNumber: parsed.mobileNumber || '9848012345',
            email: parsed.email || `${parsed.mobileNumber || 'devotee'}@vasavi.dev`,
            password: parsed.password || '',
            authProvider: parsed.authProvider || 'password',
          });
        } else {
          // If no pending registration and not logged in, redirect to Step 1
          const userSession = localStorage.getItem('vdonations_user_session');
          if (!userSession) {
            router.replace('/login?tab=register');
          }
        }
      } catch (e) {
        console.warn('Could not parse pending sankalpam devotee:', e);
      }
    }
  }, [router]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gotraBoxRef.current && !gotraBoxRef.current.contains(event.target as Node)) {
        setIsGotraDropdownOpen(false);
      }
      if (directBoxRef.current && !directBoxRef.current.contains(event.target as Node)) {
        setIsDirectSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic search results for the Gotram search box
  // Matches both Gotram names/IDs AND Sankethanamams!
  const gotraSearchResults = useMemo(() => {
    return searchGotramAndSankethanamam(gotraSearch);
  }, [gotraSearch]);

  // Direct Sankethanamam suggestions across all 102 Gotras
  const allSankethanamams = useMemo(() => {
    return getAllSankethanamamEntries();
  }, []);

  const directSankethanamamSuggestions = useMemo(() => {
    const q = directSankethanamamQuery.trim().toUpperCase();
    if (!q) return allSankethanamams.slice(0, 15);
    return allSankethanamams
      .filter((entry) => entry.sankethanamam.toUpperCase().includes(q))
      .slice(0, 20);
  }, [directSankethanamamQuery, allSankethanamams]);

  // Popular Quick-Select Gotras for instant convenience
  const popularGotras = useMemo(() => {
    return [
      { id: 1, name: 'ACHAYANASA' },
      { id: 14, name: 'DHEVA KALKYASA' },
      { id: 22, name: 'GOUTHAMASA' },
      { id: 34, name: 'KASYABASA' },
      { id: 52, name: 'PAVITHRA PAANISA' },
      { id: 102, name: 'YAGNA VALKYASA' },
    ];
  }, []);

  // Handler: Select a Gotram directly
  const handleSelectGotram = (gotraItem: GothiramItem) => {
    setSelectedGotra(gotraItem);
    setSelectedSankethanamam(''); // Reset Sankethanamam to let user choose from this Gotram's list
    setIsGotraDropdownOpen(false);
    setGotraSearch(`${gotraItem.id} - ${gotraItem.name}`);
    setStatusMsg(null);

    // Play flower chime
    try {
      templeAudio.playFlowerChime(0.5);
    } catch (e) {}
  };

  // Handler: When user clicks a Sankethanamam suggestion (from Gotram search or direct search)
  // We prompt the confirmation modal to confirm autofill
  const handleRequestSankethanamamConfirm = (
    sankethanamamName: string,
    gotraItem: GothiramItem,
    source: 'gotra_input' | 'direct_search'
  ) => {
    setConfirmModal({
      isOpen: true,
      sankethanamam: sankethanamamName,
      gotra: gotraItem,
      source,
    });
    setIsGotraDropdownOpen(false);
    setIsDirectSearchOpen(false);
  };

  // Handler: Confirm autofill from modal
  const handleConfirmAutofill = () => {
    if (!confirmModal) return;

    const { sankethanamam, gotra } = confirmModal;
    setSelectedGotra(gotra);
    setSelectedSankethanamam(sankethanamam);
    setGotraSearch(`${gotra.id} - ${gotra.name}`);
    setConfirmModal(null);
    setStatusMsg({
      type: 'success',
      text: `✦ Confirmed Sankethanamam "${sankethanamam}"! Sacred Gotram "${gotra.id} - ${gotra.name}" autofilled.`,
    });

    // Play bell chime
    try {
      templeAudio.playCoinDrop(0.6);
    } catch (e) {}
  };

  // Handler: Devotee clicks on one of the unlocked Sankethanamam chips
  const handleSelectSankethanamam = (s: string) => {
    setSelectedSankethanamam(s);
    setStatusMsg(null);
    try {
      templeAudio.playFlowerChime(0.4);
    } catch (e) {}
  };

  // Handler: Reset Gotram & Sankethanamam
  const handleResetSelection = () => {
    setSelectedGotra(null);
    setSelectedSankethanamam('');
    setGotraSearch('');
    setStatusMsg(null);
  };

  // Final Submission: Complete Sacred Sankalpam
  const handleCompleteSankalpam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGotra) {
      setStatusMsg({
        type: 'error',
        text: 'Please select your Sacred Gotram (102 Gotras) to proceed with the sankalpam.',
      });
      return;
    }

    if (!selectedSankethanamam) {
      setStatusMsg({
        type: 'error',
        text: `Please choose your unique Sankethanamam for Gotram ${selectedGotra.name}.`,
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({
      type: 'success',
      text: '✦ Registering Sacred Sankalpam with Sri Vasavi Matha Devasthanam...',
    });

    // Auspicious temple chime & vibration
    try {
      templeAudio.playTempleBell(0.85);
    } catch (e) {}

    const fullSession = {
      fullName: devotee.fullName || 'Sri Vasavi Devotee',
      mobile: devotee.mobileNumber.startsWith('+91') ? devotee.mobileNumber : `+91 ${devotee.mobileNumber}`,
      email: devotee.email || `${devotee.mobileNumber}@vasavi.dev`,
      gotram: `${selectedGotra.id} - ${selectedGotra.name}`,
      gotraId: selectedGotra.id,
      sankethanamam: selectedSankethanamam,
      role: 'devotee',
      isGuest: false,
      sankalpamCompleted: true,
      authenticatedAt: new Date().toISOString(),
      token: 'vasavi_sankalpam_jwt_' + Date.now(),
    };

    // Save profile to Supabase Auth & public.profiles
    try {
      const devoteeEmail = devotee.email || `${devotee.mobileNumber}@vasavi.dev`;
      const cleanMobile = devotee.mobileNumber.replace(/\D/g, '');
      const formattedMobile = cleanMobile ? (cleanMobile.startsWith('91') && cleanMobile.length === 12 ? `+${cleanMobile}` : `+91${cleanMobile.slice(-10)}`) : '';
      const gotramString = `${selectedGotra.id} - ${selectedGotra.name}`;
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      let userId = currentSession?.user?.id || (devotee as any).userId;

      if (!userId) {
        const devoteePassword = devotee.password || ('Vasavi@' + (cleanMobile.slice(-4) || '108') + '#Matha!');
        const regRes = await devoteeService.registerDevotee(
          devotee.fullName,
          formattedMobile,
          devoteePassword,
          gotramString,
          selectedSankethanamam,
          devoteeEmail
        );

        if (!regRes.success) {
          console.warn('[Supabase Devotee Register]:', regRes.error);
        } else {
          userId = regRes.user_id;
        }
      }

      if (userId) {
        // 1. Call secure RPC to guarantee atomic save and bypass client RLS
        try {
          await supabase.rpc('save_devotee_sankalpam', {
            p_user_id: userId,
            p_full_name: devotee.fullName,
            p_mobile: formattedMobile,
            p_gotram: gotramString,
            p_sankethanamam: selectedSankethanamam,
          });
        } catch (rpcErr) {
          console.warn('[save_devotee_sankalpam RPC error]:', rpcErr);
        }

        // 2. Direct profiles upsert with sankalpam_completed: true
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            email: devoteeEmail,
            full_name: devotee.fullName,
            mobile: formattedMobile,
            gotram: gotramString,
            sankethanamam: selectedSankethanamam,
            sankalpam_completed: true,
            updated_at: new Date().toISOString(),
          });
        } catch (pErr) {
          console.warn('[Profiles direct upsert error]:', pErr);
        }
      }
    } catch (dbErr) {
      console.warn('[Supabase Sankalpam Save]:', dbErr);
    }

    // Save session in localStorage & auth context
    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(fullSession));
      localStorage.setItem('vdonations_auth_token', fullSession.token);
      localStorage.setItem('vdonations_active_role', 'DEVOTEE');
      localStorage.setItem('vdonations_selected_gotram', fullSession.gotram);
      localStorage.setItem('vdonations_selected_sankethanamam', fullSession.sankethanamam);
      localStorage.setItem('vdonations_devotee_name', fullSession.fullName);
      localStorage.setItem('vdonations_devotee_mobile', fullSession.mobile);
      if (fullSession.email) {
        localStorage.setItem('vdonations_devotee_email', fullSession.email);
      }
      localStorage.removeItem('vdonations_pending_sankalpam');
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: fullSession }));
      }
      login(fullSession, fullSession.token);
    } catch (err) {
      console.warn('Error persisting sankalpam session:', err);
    }

    setBlessingCelebration(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0102] text-stone-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Sacred Gradients & Temple Halos */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#800000]/30 via-[#420d14]/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#d4af37]/10 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full border-b border-[#d4af37]/25 bg-[#120204]/90 backdrop-blur-md px-4 py-3.5 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffe494] via-[#f7d885] to-[#d4af37] p-0.5 shadow-[0_0_15px_rgba(247,216,133,0.5)]">
            <div className="w-full h-full rounded-full bg-[#200508] flex items-center justify-center font-serif text-sm font-bold text-[#f7d885]">
              🕉️
            </div>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-serif font-bold text-[#f7d885] tracking-wider block">
              PENUGONDA DEVISTHANAM
            </span>
            <span className="text-[10px] text-[#e8cda2]/70 font-sans block">
              Arya Vysya 102 Sacred Lineage Sanctum
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-[#200508] border border-[#d4af37]/30 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[11px] font-serif text-[#ffe89e] font-semibold">
            Step 2 of 2: Lineage Initiation
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Step Title & Vedic Blessing Banner */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a060c] border border-[#d4af37]/40 text-[#f7d885] text-xs font-serif shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span>Sri Vasavi Matha Sacred Sankalpam</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] tracking-wide">
            Select Sacred Gotram & Sankethanamam
          </h1>

          <p className="text-xs sm:text-sm text-[#e8cda2]/80 max-w-lg mx-auto font-sans leading-relaxed">
            Every seva, archana, and prasadam in the Penugonda Devasthanam invokes your family&apos;s
            102 Gotram and Unique Sankethanamam for divine prosperity.
          </p>
        </div>

        {/* Devotee Summary Card (From Step 1) */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#200508] via-[#2a070e] to-[#200508] border border-[#d4af37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d0d16] border border-[#d4af37]/50 flex items-center justify-center text-[#f7d885] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#e5a93b] uppercase font-bold tracking-wider block">
                Sankalpam Initiated For
              </span>
              <span className="text-sm font-serif font-bold text-white block">
                {devotee.fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#e8cda2]/80">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span className="font-mono text-stone-200">
                {devotee.mobileNumber.startsWith('+91') ? devotee.mobileNumber : `+91 ${devotee.mobileNumber}`}
              </span>
            </div>
            <Link
              href="/login?tab=register"
              className="text-[11px] text-[#f7d885] hover:underline font-serif flex items-center gap-1 cursor-pointer"
            >
              <span>Edit Details</span>
            </Link>
          </div>
        </div>

        {/* The Interactive Sacred Gotram & Sankethanamam Sanctum Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#1c0408] via-[#140205] to-[#0d0103] border-2 border-[#d4af37]/60 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.15)] p-5 sm:p-8">
          
          {/* Corner Flourishes */}
          <div className="absolute top-2.5 left-2.5 text-[#f5d77f]/40 text-xs pointer-events-none">✤</div>
          <div className="absolute top-2.5 right-2.5 text-[#f5d77f]/40 text-xs pointer-events-none">✤</div>
          <div className="absolute bottom-2.5 left-2.5 text-[#f5d77f]/40 text-xs pointer-events-none">✤</div>
          <div className="absolute bottom-2.5 right-2.5 text-[#f5d77f]/40 text-xs pointer-events-none">✤</div>

          <form onSubmit={handleCompleteSankalpam} className="space-y-6">

            {/* ==================================================================
                FIELD 1: SACRED GOTRAM (102 GOTRAS) WITH BIDIRECTIONAL AUTOCOMPLETE
                ================================================================== */}
            <div className="space-y-2" ref={gotraBoxRef}>
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
                  <span>1. Sacred Gotram (102 Gotras)</span>
                </label>
                {selectedGotra && (
                  <button
                    type="button"
                    onClick={handleResetSelection}
                    className="text-[11px] text-[#f7d885] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change Gotram</span>
                  </button>
                )}
              </div>

              {/* Gotram Search & Selector Input */}
              <div className="relative">
                <div
                  onClick={() => setIsGotraDropdownOpen(true)}
                  className={`w-full min-h-[52px] rounded-2xl bg-[#0f0204] border-2 px-4 py-2.5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedGotra
                      ? 'border-[#ffe18d] shadow-[0_0_20px_rgba(245,215,127,0.25)]'
                      : 'border-[#d4af37]/45 hover:border-[#ffe18d] focus-within:border-[#ffe18d]'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-[#e5a93b] shrink-0" />
                    <input
                      type="text"
                      value={gotraSearch}
                      onChange={(e) => {
                        setGotraSearch(e.target.value);
                        setIsGotraDropdownOpen(true);
                        if (selectedGotra && e.target.value !== `${selectedGotra.id} - ${selectedGotra.name}`) {
                          setSelectedGotra(null);
                          setSelectedSankethanamam('');
                        }
                      }}
                      onFocus={() => setIsGotraDropdownOpen(true)}
                      placeholder="Type Gotram name, ID (1-102), or Sankethanamam..."
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-[#a88267]/60 outline-none font-serif"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedGotra ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3d0d16] border border-[#d4af37] text-[11px] font-serif font-bold text-[#ffe89e]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Gotram #{selectedGotra.id}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#f7d885]/80 font-sans hidden sm:inline">
                        102 Gotras
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-[#e5a93b]" />
                  </div>
                </div>

                {/* Dropdown Suggestions List */}
                {isGotraDropdownOpen && (
                  <div className="absolute top-[60px] left-0 right-0 z-50 rounded-2xl bg-[#1d0408] border-2 border-[#d4af37] shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3 max-h-80 overflow-y-auto flex flex-col divide-y divide-[#d4af37]/20">
                    
                    {/* Instruction Hint */}
                    <div className="pb-2 text-[11px] text-[#e8cda2]/70 font-sans flex items-center justify-between">
                      <span>✦ Select a Gotram or matching Sankethanamam below:</span>
                      <button
                        type="button"
                        onClick={() => setIsGotraDropdownOpen(false)}
                        className="text-stone-400 hover:text-white p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section A: Gotram Matches */}
                    <div className="py-2 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5a93b] block px-2">
                        102 Sacred Gotras ({gotraSearchResults.matchingGotras.length})
                      </span>
                      {gotraSearchResults.matchingGotras.map((g: GothiramItem) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleSelectGotram(g)}
                          className={`w-full py-2.5 px-3 rounded-xl text-left flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer ${
                            selectedGotra?.id === g.id
                              ? 'bg-[#5a1523] text-[#ffe89e] font-bold border border-[#d4af37]'
                              : 'text-stone-200 hover:bg-[#340911] hover:text-[#fff4d1]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#120204] border border-[#d4af37]/40 flex items-center justify-center text-[10px] font-bold text-[#e5a93b]">
                              {g.id}
                            </span>
                            <span className="font-serif tracking-wide">{g.name}</span>
                          </div>
                          {g.telugu && (
                            <span className="text-xs text-[#e8cda2]/70 font-sans">
                              {g.telugu}
                            </span>
                          )}
                        </button>
                      ))}

                      {gotraSearchResults.matchingGotras.length === 0 && (
                        <div className="py-2 text-center text-xs text-stone-400">
                          No direct Gotram name match.
                        </div>
                      )}
                    </div>

                    {/* Section B: Sankethanamam Suggestions (Auto-fill on confirmation) */}
                    {gotraSearchResults.matchingSankethanamams.length > 0 && (
                      <div className="pt-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#f7d885] block px-2">
                          ⚡ Sankethanamam Matches (Click to Autofill Gotram):
                        </span>
                        {gotraSearchResults.matchingSankethanamams.slice(0, 10).map((entry, idx) => {
                          const parentGotra = GOTHIRAM_DATA.find((g) => g.id === entry.gotraId);
                          return (
                            <button
                              key={`${entry.sankethanamam}-${idx}`}
                              type="button"
                              onClick={() => {
                                if (parentGotra) {
                                  handleRequestSankethanamamConfirm(
                                    entry.sankethanamam,
                                    parentGotra,
                                    'gotra_input'
                                  );
                                }
                              }}
                              className="w-full py-2 px-3 rounded-xl text-left flex items-center justify-between text-xs bg-[#24060c] hover:bg-[#450e18] border border-[#d4af37]/30 hover:border-[#ffe18d] text-[#ffe494] transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3b0b14] text-[#fbe18d] font-mono font-bold">
                                  🏷️ {entry.sankethanamam}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#e8cda2]/80 font-serif">
                                Belongs to Gotram #{entry.gotraId} {entry.gotraName} ➜
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Quick-select chips for popular Gotras */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-[11px]">
                <span className="text-[#a88267] font-serif shrink-0">Quick Select:</span>
                {popularGotras.map((q) => {
                  const isSelected = selectedGotra?.id === q.id;
                  const fullItem = GOTHIRAM_DATA.find((g) => g.id === q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => fullItem && handleSelectGotram(fullItem)}
                      className={`px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-serif whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#d4af37] text-[#200508] font-bold border-[#ffe89e] shadow-[0_0_10px_rgba(247,216,133,0.5)]'
                          : 'bg-[#150306] text-[#e6be8a] border-[#d4af37]/35 hover:border-[#f5d77f]'
                      }`}
                    >
                      {q.id}. {q.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================================================================
                FIELD 2: SACRED SANKETHANAMAM (BLOCKED UNTIL GOTRA IS SELECTED)
                + DIRECT SANKETHANAMAM SEARCH WITH AUTOFILL CONFIRMATION
                ================================================================== */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
                  <span>2. Sacred Sankethanamam</span>
                </label>

                {selectedGotra ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[#10b981] font-serif font-semibold">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked for {selectedGotra.name}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-[#f7d885]/70 font-serif">
                    <Lock className="w-3.5 h-3.5 text-[#e5a93b]" />
                    <span>Locked until Gotram selected</span>
                  </span>
                )}
              </div>

              {/* CASE A: Gotram NOT selected -> Field is BLOCKED with helpful prompt & Direct Search */}
              {!selectedGotra ? (
                <div className="rounded-2xl bg-[#120204]/90 border-2 border-dashed border-[#d4af37]/35 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center gap-3 text-stone-300">
                    <div className="w-9 h-9 rounded-full bg-[#200508] border border-[#d4af37]/40 flex items-center justify-center text-[#e5a93b] shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm font-serif leading-relaxed">
                      <span className="text-[#ffe89e] font-bold block">
                        Sankethanamam is currently locked.
                      </span>
                      <span className="text-[#e8cda2]/70">
                        Please select your Sacred Gotram above first, OR use the Direct Sankethanamam Lookup below.
                      </span>
                    </div>
                  </div>

                  {/* Direct Sankethanamam Search Option */}
                  <div className="pt-2 border-t border-[#d4af37]/20" ref={directBoxRef}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-serif font-bold text-[#f7d885] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#e5a93b]" />
                        <span>Don&apos;t know your Gotram? Search by Sankethanamam directly:</span>
                      </span>
                    </div>

                    <div className="relative">
                      <div className="flex items-center h-12 rounded-xl bg-[#0a0102] border border-[#d4af37]/50 px-3.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.3)] transition-all">
                        <Search className="w-4 h-4 text-[#e5a93b] mr-2 shrink-0" />
                        <input
                          type="text"
                          value={directSankethanamamQuery}
                          onChange={(e) => {
                            setDirectSankethanamamQuery(e.target.value);
                            setIsDirectSearchOpen(true);
                          }}
                          onFocus={() => setIsDirectSearchOpen(true)}
                          placeholder="Type your family's Sankethanamam (e.g. AKRAMULAKULA, KAMALAKULA)..."
                          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-[#a88267]/60 outline-none font-mono"
                        />
                      </div>

                      {/* Direct Sankethanamam Dropdown Suggestions */}
                      {isDirectSearchOpen && (
                        <div className="absolute top-14 left-0 right-0 z-50 rounded-2xl bg-[#1e0509] border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-3 max-h-60 overflow-y-auto flex flex-col divide-y divide-[#d4af37]/20">
                          <div className="pb-1.5 text-[10px] text-[#e8cda2]/70 font-sans flex items-center justify-between">
                            <span>✦ Click any Sankethanamam to confirm and autofill your Gotram:</span>
                            <button
                              type="button"
                              onClick={() => setIsDirectSearchOpen(false)}
                              className="text-stone-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="py-1 space-y-1">
                            {directSankethanamamSuggestions.map((entry, idx) => {
                              const parentGotra = GOTHIRAM_DATA.find((g) => g.id === entry.gotraId);
                              return (
                                <button
                                  key={`direct-${entry.sankethanamam}-${idx}`}
                                  type="button"
                                  onClick={() => {
                                    if (parentGotra) {
                                      handleRequestSankethanamamConfirm(
                                        entry.sankethanamam,
                                        parentGotra,
                                        'direct_search'
                                      );
                                    }
                                  }}
                                  className="w-full py-2 px-3 rounded-lg text-left flex items-center justify-between text-xs hover:bg-[#3d0d16] text-[#ffe494] transition-all cursor-pointer"
                                >
                                  <span className="font-mono font-bold">{entry.sankethanamam}</span>
                                  <span className="text-[11px] text-[#e8cda2]/70 font-serif">
                                    Gotram #{entry.gotraId} {entry.gotraName} ➜
                                  </span>
                                </button>
                              );
                            })}

                            {directSankethanamamSuggestions.length === 0 && (
                              <div className="py-3 text-center text-xs text-stone-400">
                                No matching Sankethanamam found. Try checking your family heritage spelling.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* CASE B: Gotram IS selected -> Field is UNLOCKED and shows related Sankethanamams */
                <div className="rounded-2xl bg-[#170306] border-2 border-[#d4af37]/60 p-4 sm:p-5 space-y-3.5 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#d4af37]/25">
                    <span className="text-xs text-[#ffe89e] font-serif font-bold">
                      Unique Sankethanamams for <span className="text-[#f7d885] underline">{selectedGotra.name}</span>:
                    </span>
                    <span className="text-[11px] text-[#e8cda2]/70 font-sans">
                      {selectedGotra.sankethanamams.length} lineage branches available
                    </span>
                  </div>

                  {/* Clickable Luxury Golden Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedGotra.sankethanamams.map((sankethan) => {
                      const isChosen = selectedSankethanamam === sankethan;
                      return (
                        <button
                          key={sankethan}
                          type="button"
                          onClick={() => handleSelectSankethanamam(sankethan)}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                            isChosen
                              ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#200508] shadow-[0_0_18px_rgba(247,216,133,0.6)] scale-[1.03] border border-[#ffffff]'
                              : 'bg-[#0f0204] text-[#fff4d1] border border-[#d4af37]/40 hover:border-[#ffe18d] hover:bg-[#28080f]'
                          }`}
                        >
                          {isChosen && <CheckCircle2 className="w-3.5 h-3.5 text-[#200508]" />}
                          <span>{sankethan}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Sankethanamam Confirmation Badge */}
                  {selectedSankethanamam ? (
                    <div className="p-3 rounded-xl bg-[#2b080f] border border-[#10b981]/60 text-xs text-[#d1fae5] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        <span>
                          Selected Sankethanamam: <strong>{selectedSankethanamam}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-[#e8cda2]/70 font-serif">
                        Lineage Registered
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#f7d885] flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 text-[#e5a93b]" />
                      <span>Please tap on your family&apos;s Sankethanamam chip above to confirm.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Feedback Notice */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs text-center border font-serif ${
                  statusMsg.type === 'error'
                    ? 'bg-red-950/80 border-red-500 text-red-100'
                    : 'bg-[#3d0d16]/90 border-[#d4af37] text-[#fff4d1]'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {/* Celebration Glow when completed */}
            {blessingCelebration && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5a1523] to-[#3a0d16] border-2 border-[#ffe18d] shadow-[0_0_30px_rgba(255,225,141,0.5)] text-center space-y-1 animate-pulse">
                <span className="text-xl">🪔 🕉️ 🪔</span>
                <span className="text-sm font-serif font-bold text-[#ffe89e] block">
                  Sacred Sankalpam Blessed by Sri Vasavi Kanyaka Parameswari!
                </span>
                <span className="text-xs text-[#fff4d1]/80">
                  Entering Devotee Sanctuary with full lineage blessings...
                </span>
              </div>
            )}

            {/* Submit CTA Button: Complete Sacred Sankalpam */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !selectedGotra || !selectedSankethanamam}
                className={`relative w-full h-14 rounded-full font-serif font-bold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 overflow-hidden group shadow-lg ${
                  selectedGotra && selectedSankethanamam
                    ? 'text-[#200508] hover:brightness-110 active:scale-[0.99] shadow-[0_10px_35px_rgba(229,169,59,0.6),0_0_20px_rgba(255,225,141,0.4)]'
                    : 'text-stone-400 bg-[#28080e] border border-[#d4af37]/20 cursor-not-allowed opacity-75'
                }`}
                style={
                  selectedGotra && selectedSankethanamam
                    ? { background: 'linear-gradient(135deg, #fff3c9 0%, #f6c343 45%, #d48b17 100%)' }
                    : {}
                }
              >
                {selectedGotra && selectedSankethanamam && (
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
                )}
                <span>🪔</span>
                <span>
                  {isSubmitting
                    ? 'Registering Sacred Sankalpam...'
                    : 'Complete Sacred Sankalpam & Enter Sanctuary'}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Trust Footer Badges */}
            <div className="pt-3 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-[#e8cda2]/70">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e5a93b]" /> 102 Arya Vysya Lineage Verified
              </span>
              <span className="flex items-center gap-1">
                <span>🔒</span> 256-Bit SSL Secured
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#e5a93b]" /> Penugonda Devasthanam Record
              </span>
            </div>

          </form>

        </div>

      </main>

      {/* ======================================================================
          CONFIRMATION MODAL: CONFIRM SANKETHANAMAM TO AUTOFILL GOTRAM
          ====================================================================== */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#23050a] via-[#1a0307] to-[#120204] border-2 border-[#d4af37] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.3)] space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#3d0d16] border border-[#d4af37] flex items-center justify-center text-lg">
                  🕉️
                </div>
                <div>
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#e5a93b] block">
                    Lineage Verification
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#ffe89e]">
                    Confirm Sankethanamam & Gotram
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="rounded-2xl bg-[#0f0204] border border-[#d4af37]/35 p-4 space-y-3 font-serif">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#a88267] block">
                  Identified Sankethanamam:
                </span>
                <span className="text-base font-mono font-bold text-[#ffe494]">
                  {confirmModal.sankethanamam}
                </span>
              </div>

              <div className="h-[1px] bg-[#d4af37]/20" />

              <div>
                <span className="text-[10px] uppercase font-bold text-[#a88267] block">
                  Associated Sacred Gotram (102 Gotras):
                </span>
                <span className="text-sm font-bold text-[#fff4d1] block">
                  {confirmModal.gotra.id}. {confirmModal.gotra.name}
                </span>
                {confirmModal.gotra.telugu && (
                  <span className="text-xs text-[#e8cda2]/70 font-sans block">
                    {confirmModal.gotra.telugu}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#e8cda2]/80 font-sans leading-relaxed">
              Would you like to confirm <strong>{confirmModal.sankethanamam}</strong> and autofill your
              Sacred Gotram as <strong>{confirmModal.gotra.id} - {confirmModal.gotra.name}</strong>?
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-full bg-[#200508] border border-[#d4af37]/30 text-xs font-serif text-stone-300 hover:text-white hover:border-stone-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAutofill}
                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#200508] text-xs font-serif font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(247,216,133,0.4)] cursor-pointer"
              >
                ✓ Confirm & Autofill
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-[#e8cda2]/60 border-t border-[#d4af37]/20 bg-[#0a0102]">
        <p className="font-serif">
          Om Sri Vasavi Kanyaka Parameswaryai Namaha 🪔 Penugonda Kshetram, Andhra Pradesh
        </p>
      </footer>
    </div>
  );
}
