'use client';

import React, { useState } from 'react';
import { User, Save, Flame, ShieldCheck } from 'lucide-react';
import { calculateDevoteeMedals } from '@/lib/medals';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeProfilePage() {
  const { t } = useLanguage();
  const [name, setName] = useState('Radha Krishna');
  const [email, setEmail] = useState('devotee@gmail.com');
  const [mobile, setMobile] = useState('+91 9123456789');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [isSaved, setIsSaved] = useState(false);

  const medalProgress = calculateDevoteeMedals(MOCK_DONATIONS);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarMyProfile')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarMyProfile')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Manage Devotee Identity & 80G Tax Exemption Certificate Details
          </p>
        </div>

        {medalProgress.currentMedal && (
          <div className="px-4 py-2 bg-amber-400/20 border border-amber-400/40 rounded-2xl flex items-center gap-2 relative z-10">
            <span className="text-2xl">{medalProgress.currentMedal.badge}</span>
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase block">SEVA ACHIEVEMENT</span>
              <span className="font-serif font-bold text-xs text-amber-300">
                {medalProgress.currentMedal.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold shadow-md">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* 3D PROFILE FORM CARD WITH HOVER MOTION */}
      <form onSubmit={handleSave} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">Mobile Number *</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold text-xs rounded-2xl shadow-gold hover:brightness-110 transition-all border border-amber-400/40 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-devotional-saffron" /> Save Profile Information
          </button>
        </div>
      </form>
    </div>
  );
}
