'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GOTHIRAM_DATA, GothiramItem } from '@/lib/gothiram-data';
import { templeAudio } from '@/lib/templeAudio';
import { useAuth } from '@/lib/auth-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  Search,
  Sparkles,
  BookOpen,
  Share2,
  CheckCircle2,
  Copy,
  Flame,
  ShieldCheck,
  ChevronRight,
  TreePine,
  Scroll,
  Filter
} from 'lucide-react';

const SACRED_TREES = [
  'బిల్వ వృక్షం (Bilva / Bael)',
  'అశ్వత్థ వృక్షం (Sacred Peepal)',
  'వట వృక్షం (Sacred Banyan)',
  'పారిజాత వృక్షం (Parijata)',
  'తులసి & కదంబ (Tulasi & Kadamba)',
  'శమీ వృక్షం (Sacred Shami)',
];

const VEDAS = ['ఋగ్వేదం (Rigveda)', 'యజుర్వేదం (Krishna Yajurveda)', 'సామవేదం (Samaveda)'];

export default function AryaVysyaGotramExplorer() {
  const { user, updateDevoteeProfile } = useAuth();
  const { showAlert } = useConfirmAlert();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGotra, setSelectedGotra] = useState<GothiramItem>(GOTHIRAM_DATA[43] || GOTHIRAM_DATA[0]);
  const [rangeFilter, setRangeFilter] = useState<'ALL' | '1-25' | '26-50' | '51-75' | '76-102'>('ALL');

  const filteredGotrams = useMemo(() => {
    return GOTHIRAM_DATA.filter((g) => {
      if (rangeFilter === '1-25' && (g.id < 1 || g.id > 25)) return false;
      if (rangeFilter === '26-50' && (g.id < 26 || g.id > 50)) return false;
      if (rangeFilter === '51-75' && (g.id < 51 || g.id > 75)) return false;
      if (rangeFilter === '76-102' && (g.id < 76 || g.id > 102)) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchId = g.id.toString() === q;
      const matchName = g.name.toLowerCase().includes(q);
      const matchSanketh = g.sankethanamams.some((s) => s.toLowerCase().includes(q));
      return matchId || matchName || matchSanketh;
    });
  }, [searchQuery, rangeFilter]);

  const selectGotram = (g: GothiramItem) => {
    setSelectedGotra(g);
    templeAudio.playFlowerChime(0.4);
  };

  const handleSetMyGotram = () => {
    const formatted = `${selectedGotra.id} - ${selectedGotra.name}`;
    updateDevoteeProfile({
      gotram: formatted,
      sankethanamam: selectedGotra.sankethanamams[0] || '',
    });
    showAlert({
      type: 'change',
      title: 'Family Gotram Updated',
      message: `Your profile has been updated to ${formatted}. May Sri Vasavi Matha bless your lineage.`,
    });
  };

  const handleCopyPravara = () => {
    const pravaraText = `ఓం శ్రీ గురుభ్యో నమః | ${selectedGotra.id} - ${selectedGotra.name} గోత్రోద్భవస్య | మూల ఋషి: ${selectedGotra.name} మహర్షి | సంకేతనామాలు: ${selectedGotra.sankethanamams.join(', ')} | శ్రీ వాసవీ కన్యకా పరమేశ్వరీ ప్రసాద సిద్ధ్యర్థం పూజా సంకల్పం ||`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pravaraText);
      showAlert({
        type: 'change',
        title: 'Pravara Copied',
        message: 'Vedic Gotra Pravara text copied to clipboard! Ready to recite in daily puja.',
      });
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🛕 *102 Arya Vysya Sacred Gotra Heritage*\n\n*Gotram #${selectedGotra.id}:* ${selectedGotra.name}\n*Moola Rishi:* ${selectedGotra.name} Maharshi\n*Authentic Sankethanamams:* ${selectedGotra.sankethanamams.join(', ')}\n\nExplore all 102 Gotrams on Sri Vasavi Devasthanam Portal: ${typeof window !== 'undefined' ? window.location.origin : ''}/heritage/gotrams`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showAlert({
        type: 'change',
        title: 'Gotram Details Copied',
        message: 'Gotram heritage summary copied to clipboard! Ready to share with family.',
      });
    }
  };

  const selectedTree = SACRED_TREES[selectedGotra.id % SACRED_TREES.length];
  const selectedVeda = VEDAS[selectedGotra.id % VEDAS.length];

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans pb-12">
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Scroll className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> 102 ARYA VYSYA GOTRA PARAMPARA
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Sacred Gotram & Rishi Lineage Heritage Explorer
          </h1>
          <p className="text-amber-100/80 text-xs">
            Authentic 102 Vedic Rishi Gotrams, Moola Pravaras, and Unique Sankethanamams of Sri Vasavi Matha disciples
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Link
            href="/sankalpam/gotram"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-1.5 border border-amber-300"
          >
            <Sparkles className="w-4 h-4 text-devotional-maroon" /> Gotram Sankalpam Wizard
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Gotram number (1-102), Sanskrit Name (e.g. Mouthkalyasa), or Sankethanamam (e.g. Naabilla)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0 text-xs">
            {(['ALL', '1-25', '26-50', '51-75', '76-102'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRangeFilter(r)}
                className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  rangeFilter === r
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {r === 'ALL' ? 'All 102' : r}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-stone-500 dark:text-stone-400">
          Showing <strong>{filteredGotrams.length}</strong> of 102 Arya Vysya Rishi Gotrams matching your search.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-4 rounded-3xl border-2 border-devotional-gold/40 shadow-xl max-h-[640px] overflow-y-auto space-y-2">
          {filteredGotrams.map((g) => {
            const isSelected = selectedGotra.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => selectGotram(g)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 dark:bg-amber-950/40 shadow-gold ring-1 ring-amber-400/50 scale-101'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}>
                    #{g.id}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {g.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      {g.sankethanamams.length} Sankethanamam{g.sankethanamams.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-500 translate-x-1' : 'text-stone-400'} transition-transform`} />
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/60 shadow-2xl space-y-6 sticky top-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase border border-amber-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-devotional-saffron" /> GOTRAM #{selectedGotra.id} OF 102
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-1">
                {selectedGotra.name}
              </h2>
              <p className="text-stone-500 text-xs mt-0.5">
                Moola Rishi Lineage: <strong>{selectedGotra.name} Maharshi (మహర్షి)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSetMyGotram}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-1.5 border border-amber-300 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-devotional-maroon" />
                <span>Set as My Gotram</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-devotional-saffron" /> Veda Shakha
              </span>
              <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                {selectedVeda}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <TreePine className="w-3 h-3 text-emerald-500" /> Sacred Gotra Vriksha
              </span>
              <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                {selectedTree}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Unique Sankethanamams ({selectedGotra.sankethanamams.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedGotra.sankethanamams.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-400/40 text-xs font-mono font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-stone-50 to-amber-500/5 dark:from-stone-800 dark:to-stone-800/50 p-5 rounded-2xl border border-amber-400/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-devotional-maroon dark:text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5" /> Traditional Gotra Pravara (పూజా సంకల్పం)
              </span>
              <button
                onClick={handleCopyPravara}
                className="text-[11px] text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Text
              </button>
            </div>

            <p className="font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed text-xs">
              "ఓం శ్రీ గురుభ్యో నమః | {selectedGotra.id} - {selectedGotra.name} గోత్రోద్భవస్య, మూల ఋషి: {selectedGotra.name} మహర్షి, శ్రీ వాసవీ కన్యకా పరమేశ్వరీ దివ్య అనుగ్రహ సిద్ధ్యర్థం |"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyPravara}
              className="py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-stone-300 dark:border-stone-700"
            >
              <Copy className="w-3.5 h-3.5 text-amber-500" />
              <span>Copy Vedic Pravara</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share with Family</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
