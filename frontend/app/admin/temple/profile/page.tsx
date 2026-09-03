'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import { Building2, Save, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TempleProfileEditPage() {
  const { t } = useLanguage();
  const [temple, setTemple] = useState(MOCK_TEMPLES[0]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarTempleProfile')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarTempleProfile')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Edit Penugonda Sri Vasavi Kanyaka Parameswari Matha Shrine Profile & Darshan Timings
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold shadow-md">
          ✓ Temple profile changes saved successfully and published to public shrine pages!
        </div>
      )}

      {/* 3D PROFILE FORM CARD WITH HOVER MOTION */}
      <form onSubmit={handleSave} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Temple Name *
            </label>
            <input
              type="text"
              value={temple.name}
              onChange={(e) => setTemple({ ...temple, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Presiding Deity *
            </label>
            <input
              type="text"
              value={temple.deity}
              onChange={(e) => setTemple({ ...temple, deity: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Registered Trust Name *
            </label>
            <input
              type="text"
              value={temple.trustName}
              onChange={(e) => setTemple({ ...temple, trustName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Registration Number *
            </label>
            <input
              type="text"
              value={temple.registrationNo}
              onChange={(e) => setTemple({ ...temple, registrationNo: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Darshan Timings
          </label>
          <input
            type="text"
            value={temple.timings}
            onChange={(e) => setTemple({ ...temple, timings: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Temple Overview & Description
          </label>
          <textarea
            rows={3}
            value={temple.description}
            onChange={(e) => setTemple({ ...temple, description: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold text-xs shadow-gold hover:brightness-110 transition-all border border-amber-400/40 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-devotional-saffron" /> Save Shrine Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
