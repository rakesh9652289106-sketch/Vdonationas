'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveDarshanSanctum3D from '@/components/3d/InteractiveDarshanSanctum3D';
import NavagrahaYantra3D from '@/components/3d/NavagrahaYantra3D';
import InteractiveAartiThali3D from '@/components/3d/InteractiveAartiThali3D';
import TempleGopuram3D from '@/components/3d/TempleGopuram3D';
import PanchangamCalculator from '@/components/devotional/PanchangamCalculator';
import { templeAudio } from '@/lib/templeAudio';
import {
  Sparkles,
  Flame,
  Heart,
  QrCode,
  ShieldCheck,
  Award,
  Video,
  Sun,
  Compass,
  CheckCircle2,
  Share2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function DarshanPage() {
  const { user } = useAuth();
  const [devoteeName, setDevoteeName] = useState<string>('');
  const [gothram, setGothram] = useState<string>('');
  const [sankethanamam, setSankethanamam] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [eHundiAmount, setEHundiAmount] = useState<number>(10);
  const [isHundiPaid, setIsHundiPaid] = useState(false);
  const [sankalpaReceiptNo, setSankalpaReceiptNo] = useState('');

  React.useEffect(() => {
    setIsMounted(true);
    if (user) {
      if (user.fullName) setDevoteeName(user.fullName);
      if (user.gotram) setGothram(user.gotram);
      if (user.sankethanamam) setSankethanamam(user.sankethanamam);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('vdonations_devotee_name');
      const storedGotram = localStorage.getItem('vdonations_selected_gotram');
      const storedSankethanamam = localStorage.getItem('vdonations_selected_sankethanamam');
      if (storedName) setDevoteeName(storedName);
      if (storedGotram) setGothram(storedGotram);
      if (storedSankethanamam) setSankethanamam(storedSankethanamam);
    }

    const handleProfileUpdate = (e: any) => {
      const u = e.detail;
      if (u) {
        if (u.fullName) setDevoteeName(u.fullName);
        if (u.gotram) setGothram(u.gotram);
        if (u.sankethanamam !== undefined) setSankethanamam(u.sankethanamam);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('vdonations_profile_updated', handleProfileUpdate);
      return () => window.removeEventListener('vdonations_profile_updated', handleProfileUpdate);
    }
  }, [user]);

  const handleEHundiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    templeAudio.playCoinDrop(0.7);
    const receipt = `VASAVI-DARSHAN-${Math.floor(100000 + Math.random() * 900000)}`;
    setSankalpaReceiptNo(receipt);
    setIsHundiPaid(true);
  };

  return (
    <div className="space-y-12 pb-20 bg-[#FAF7F2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">
        {/* 2. HERO LIVE 3D SANCTUM EXPERIENCE */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-devotional-maroon dark:text-amber-300 font-bold text-xs uppercase tracking-widest border border-amber-400/40 shadow-sm">
              <Flame className="w-4 h-4 text-devotional-saffron animate-pulse" /> IMMERSIVE DEVOTIONAL EXPERIENCE
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-devotional-maroon dark:text-amber-400 tracking-tight">
              Sri Vasavi Matha 3D Virtual Darshan
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
              Perform online seva, offer Pushparchana flowers, ring the sacred temple ghanta, wave Karpoora Aarti, and drop digital coins in the sacred E-Hundi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3D Main Sanctum WebGL Viewport */}
            <div className="lg:col-span-8 space-y-4">
              <InteractiveDarshanSanctum3D className="w-full h-[540px]" />

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span><strong>Sanctum Atmosphere:</strong> Switch morning, midday, evening, and Maha Aarti lighting above.</span>
                </div>
                <div className="flex items-center gap-2 font-serif text-devotional-maroon dark:text-amber-300 font-bold">
                  <span>Prasadam Dispatch Available</span>
                </div>
              </div>
            </div>

            {/* Right: E-Hundi & Live Devotee Sankalpa Box */}
            <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-devotional-gold/60 shadow-xl space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-devotional-saffron flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" /> DIGITAL E-HUNDI SEVA
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-0.5">
                  Offer Sacred E-Hundi
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Directly credited to the temple trust fund with 80G tax exemption.
                </p>
              </div>

              {isHundiPaid ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-center space-y-3">
                  <span className="text-4xl animate-bounce inline-block">🙏</span>
                  <h4 className="font-serif font-bold text-emerald-800 dark:text-emerald-300 text-lg">
                    Sankalpa & E-Hundi Accepted!
                  </h4>
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    Devotee <strong>{devoteeName || 'Devotee Family'}</strong> ({gothram ? `${gothram} Gothram` : 'Vysya Gothram'}{sankethanamam ? ` • ${sankethanamam}` : ''}).
                  </p>
                  <div className="p-2 bg-white/80 dark:bg-stone-900 rounded-lg text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    Receipt: {sankalpaReceiptNo}
                  </div>
                  <button
                    onClick={() => setIsHundiPaid(false)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 transition-colors shadow"
                  >
                    Offer Another Sankalpa
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEHundiSubmit} className="space-y-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold">
                        Devotee Name *
                      </label>
                      {isMounted && (devoteeName || gothram || sankethanamam) && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                          ✨ Auto-filled
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      placeholder="e.g. Ramesh & Sunitha Gupta"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        Devotee Gotram
                      </label>
                      <input
                        type="text"
                        value={gothram}
                        onChange={(e) => setGothram(e.target.value)}
                        placeholder="e.g. 1 - ACHAYANASA"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        Sankethanamam
                      </label>
                      <input
                        type="text"
                        value={sankethanamam}
                        onChange={(e) => setSankethanamam(e.target.value.toUpperCase())}
                        placeholder="e.g. NAABILLA"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-mono uppercase text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1.5">
                      Select E-Hundi Offering Amount
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 10, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEHundiAmount(amt)}
                          className={`py-2 rounded-xl font-bold text-center border transition-all ${
                            eHundiAmount === amt
                              ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-md font-bold'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-serif font-bold text-xs shadow-gold-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current text-amber-300" />
                    Drop ₹{eHundiAmount} into 3D E-Hundi
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-Bit Encrypted Secure UPI / Cards / NetBanking</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 3. 3D KARPOORA AARTI THALI SEVA */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-devotional-saffron flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-devotional-saffron" /> PERSONAL DEVOTIONAL SEVA
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
              Wave 3D Interactive Karpoora Aarti Thali
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <InteractiveAartiThali3D className="w-full h-[400px]" />
          </div>
        </section>

        {/* 4. 3D INTERACTIVE NAVAGRAHA PLANETARY CHAKRA */}
        <section className="space-y-6">
          <NavagrahaYantra3D />
        </section>

        {/* 5. 3D TEMPLE GOPURAM ARCHITECTURAL EXPLORER */}
        <section className="space-y-6">
          <TempleGopuram3D />
        </section>

        {/* 6. DAILY PANCHANGAM & MUHURTHAM ENGINE */}
        <section className="space-y-6">
          <PanchangamCalculator />
        </section>
      </div>
    </div>
  );
}
