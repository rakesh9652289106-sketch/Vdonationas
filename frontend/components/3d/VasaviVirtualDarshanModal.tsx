'use client';

import React, { useState, useEffect } from 'react';
import VasaviGoddess3DCanvas from './VasaviGoddess3DCanvas';
import { X, Sparkles, Flame, Heart, ShieldCheck, Video, BellRing, Volume2, QrCode } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface VasaviVirtualDarshanModalProps {
  onClose: () => void;
}

export default function VasaviVirtualDarshanModal({ onClose }: VasaviVirtualDarshanModalProps) {
  const { user } = useAuth();
  const [devoteeName, setDevoteeName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || '' : ''));
  const [gothram, setGothram] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_gotram') || '' : ''));
  const [sankethanamam, setSankethanamam] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_sankethanamam') || '' : ''));
  const [eHundiAmount, setEHundiAmount] = useState(10);
  const [isOfferingAarti, setIsOfferingAarti] = useState(false);
  const [isHundiPaid, setIsHundiPaid] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.fullName) setDevoteeName(user.fullName);
      if (user.gotram) setGothram(user.gotram);
      if (user.sankethanamam) setSankethanamam(user.sankethanamam);
    } else if (typeof window !== 'undefined') {
      const n = localStorage.getItem('vdonations_devotee_name');
      const g = localStorage.getItem('vdonations_selected_gotram');
      const s = localStorage.getItem('vdonations_selected_sankethanamam');
      if (n) setDevoteeName(n);
      if (g) setGothram(g);
      if (s) setSankethanamam(s);
    }
  }, [user]);

  const handleOfferAarti = () => {
    setIsOfferingAarti(true);
    setTimeout(() => setIsOfferingAarti(false), 3500);
  };

  const handleEHundiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsHundiPaid(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fadeIn">
      {/* 3D Elevated Glass Container */}
      <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl border-2 border-devotional-gold/80 shadow-[0_30px_90px_rgba(212,175,55,0.5)] p-6 sm:p-8 space-y-6 text-white overflow-hidden my-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE 3D SANCTUM STREAM
            </div>
            <h2 className="text-2xl font-serif font-bold text-amber-300 mt-1">
              Sri Vasavi Matha Live 3D Virtual Darshan & E-Hundi
            </h2>
          </div>

          <button
            onClick={handleOfferAarti}
            disabled={isOfferingAarti}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-devotional-saffron text-stone-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-gold"
          >
            <Flame className={`w-4 h-4 text-devotional-maroon ${isOfferingAarti ? 'animate-bounce' : ''}`} />
            {isOfferingAarti ? 'Offering Virtual Mangala Aarti...' : 'Offer Virtual Aarti'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left WebGL 3D Sanctum View */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-950 via-devotional-maroon-dark/80 to-stone-950 border border-amber-400/40 shadow-inner">
            {/* Live Aarti Overlay Effect */}
            {isOfferingAarti && (
              <div className="absolute inset-0 z-20 bg-amber-400/20 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 animate-pulse">
                <span className="text-5xl">🪔</span>
                <span className="font-serif font-bold text-amber-300 text-base">
                  Offering Sacred Mangala Aarti to Sri Vasavi Matha...
                </span>
                <span className="text-xs text-amber-100">Om Sri Vasavi Kanyaka Parameswari Mathaye Namaha</span>
              </div>
            )}

            <VasaviGoddess3DCanvas className="w-full h-full" />
          </div>

          {/* Right E-Hundi & Sankalpam Offering Panel */}
          <div className="lg:col-span-5 bg-stone-950 p-5 rounded-2xl border border-amber-400/40 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" /> DIGITAL E-HUNDI OFFERING
              </span>
              <h3 className="font-serif font-bold text-base text-white">Offer Sacred E-Hundi Seva</h3>
            </div>

            {isHundiPaid ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center space-y-2">
                <span className="text-3xl">🙏</span>
                <p className="font-serif font-bold text-emerald-300 text-sm">
                  E-Hundi Offering Received!
                </p>
                <p className="text-[11px] text-stone-300">
                  May Sri Vasavi Matha bless {devoteeName || 'your family'} ({gothram ? `${gothram} Gotram` : 'Vysya Gothram'}{sankethanamam ? ` • ${sankethanamam}` : ''}).
                </p>
                <button
                  onClick={() => setIsHundiPaid(false)}
                  className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                >
                  Offer Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleEHundiSubmit} className="space-y-3">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Devotee Name (for Sankalpam)</label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Devotee Gotram</label>
                    <input
                      type="text"
                      value={gothram}
                      onChange={(e) => setGothram(e.target.value)}
                      placeholder="e.g. 1 - ACHAYANASA"
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">Sankethanamam</label>
                    <input
                      type="text"
                      value={sankethanamam}
                      onChange={(e) => setSankethanamam(e.target.value.toUpperCase())}
                      placeholder="e.g. NAABILLA"
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white font-mono uppercase text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">E-Hundi Amount (₹)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 10, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setEHundiAmount(amt)}
                        className={`py-1.5 rounded-lg font-bold text-center border ${
                          eHundiAmount === amt
                            ? 'bg-amber-400 text-stone-950 border-amber-300'
                            : 'bg-stone-900 text-stone-300 border-stone-800'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current text-amber-300" /> Drop ₹{eHundiAmount} into 3D E-Hundi
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
