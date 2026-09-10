'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Initiative,
  InitiativeType,
  getInitiatives,
  isInitiativeTeaserVisible,
  INITIATIVE_TYPE_LABELS,
} from '@/lib/initiatives-data';
import InitiativeCard3D from '@/components/3d/InitiativeCard3D';
import AuspiciousMuhurthamTeaser from '@/components/initiatives/AuspiciousMuhurthamTeaser';
import {
  Search,
  Sparkles,
  Flame,
  ShieldCheck,
  TrendingUp,
  Filter,
  Heart,
  Users,
  RefreshCw,
  ChevronDown,
  X,
} from 'lucide-react';

export default function InitiativesCatalogPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'URGENT' | 'MOST_FUNDED' | 'TARGET_HIGH' | 'NEWEST'>('URGENT');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInitiatives({ status: 'PUBLISHED' });
      setInitiatives(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Sort
  const filteredInitiatives = useMemo(() => {
    // Include PUBLISHED as well as SCHEDULED initiatives that have teaser visible to devotees
    let list = initiatives.filter(
      (item) => item.status === 'PUBLISHED' || isInitiativeTeaserVisible(item)
    );

    if (urgentOnly) {
      list = list.filter((i) => i.is_urgent);
    }

    if (selectedCategory !== 'ALL') {
      list = list.filter((i) => i.initiative_type === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q) ||
          (i.custom_type && i.custom_type.toLowerCase().includes(q))
      );
    }

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'URGENT') {
        if (a.is_urgent && !b.is_urgent) return -1;
        if (!a.is_urgent && b.is_urgent) return 1;
        return (b.percentage_funded || 0) - (a.percentage_funded || 0);
      }
      if (sortBy === 'MOST_FUNDED') {
        return (b.percentage_funded || 0) - (a.percentage_funded || 0);
      }
      if (sortBy === 'TARGET_HIGH') {
        return b.target_amount - a.target_amount;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [initiatives, selectedCategory, urgentOnly, searchQuery, sortBy]);

  // Extract active scheduled initiatives with teaser enabled and visible
  const activeTeasers = useMemo(() => {
    return initiatives.filter((i) => isInitiativeTeaserVisible(i));
  }, [initiatives]);

  // Aggregate stats
  const totalRaised = initiatives.reduce((acc, i) => acc + i.current_raised, 0);
  const totalDonors = initiatives.reduce((acc, i) => acc + i.donor_count, 0);

  const categoryPills = [
    { key: 'ALL', label: 'All Causes', icon: '✨' },
    { key: 'TEMPLE_CONSTRUCTION', label: 'Construction', icon: '🛕' },
    { key: 'TEMPLE_RENOVATION', label: 'Renovation', icon: '🏛️' },
    { key: 'ANNADANAM', label: 'Annadanam', icon: '🍲' },
    { key: 'SCHOLARSHIPS', label: 'Scholarships', icon: '🎓' },
    { key: 'MEDICAL_ASSISTANCE', label: 'Medical', icon: '🏥' },
    { key: 'EMERGENCY_RELIEF', label: 'Disaster Relief', icon: '🚨' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans pb-20">
      {/* 3D Immersive Hero Header */}
      <div className="relative bg-gradient-to-b from-devotional-maroon-dark via-devotional-maroon to-stone-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-2 border-devotional-gold/40 overflow-hidden shadow-2xl">
        {/* Ambient Sacred Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/40">
              <Sparkles className="w-4 h-4 text-devotional-gold" /> Sri Vasavi Matha Dharma Projects
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-300 tracking-tight">
              Sacred Initiatives & Fundraising
            </h1>
            <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Join hands in building temples, feeding pilgrims through Nitya Annadanam, educating underprivileged youth, and providing critical medical assistance. 100% tax-exempt under Section 80G.
            </p>
          </div>

          {/* Quick 3D Aggregate Metric Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
            <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-devotional-gold/30 text-center space-y-0.5">
              <p className="text-[10px] text-amber-300/70 uppercase font-bold tracking-wider">Active Causes</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-white">{initiatives.length}</p>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-devotional-gold/30 text-center space-y-0.5">
              <p className="text-[10px] text-amber-300/70 uppercase font-bold tracking-wider">Total Raised</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-devotional-gold">
                ₹{(totalRaised / 100000).toFixed(1)}L
              </p>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-devotional-gold/30 text-center space-y-0.5">
              <p className="text-[10px] text-amber-300/70 uppercase font-bold tracking-wider">Sacred Donors</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-white">{totalDonors.toLocaleString('en-IN')}</p>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-devotional-gold/30 text-center space-y-0.5">
              <p className="text-[10px] text-amber-300/70 uppercase font-bold tracking-wider">Audited Escrow</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-emerald-400">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8 relative z-20">
        {/* Pre-Launch Auspicious Muhurtham Countdown Teasers */}
        {activeTeasers.length > 0 && (
          <div className="space-y-4">
            {activeTeasers.map((teaser) => (
              <AuspiciousMuhurthamTeaser
                key={teaser.code}
                initiative={teaser}
                onReminderToggled={loadData}
              />
            ))}
          </div>
        )}

        {/* Search & Filter Bar Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-devotional-gold/40 shadow-xl space-y-3.5">
          {/* Main Controls Row: Responsive inline on tablet/desktop, clean 2-row on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search initiatives by title, code, city, or cause..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-devotional-gold transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions (Urgent & Sort Dropdown side-by-side) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Urgent Toggle Button */}
              <button
                type="button"
                onClick={() => setUrgentOnly(!urgentOnly)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  urgentOnly
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md shadow-red-950/30 ring-2 ring-red-400/50'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-amber-200 fill-current animate-pulse' : 'text-rose-500'}`} />
                <span className="whitespace-nowrap">{urgentOnly ? 'Urgent Only' : 'Urgent'}</span>
              </button>

              {/* Sort Dropdown with Custom Chevron */}
              <div className="flex-1 sm:flex-initial relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  aria-label="Sort initiatives by"
                  className="w-full sm:w-auto px-3.5 py-2.5 pr-8 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-devotional-gold cursor-pointer appearance-none"
                >
                  <option value="URGENT">Sort: Urgent First</option>
                  <option value="MOST_FUNDED">Sort: Most Funded (%)</option>
                  <option value="TARGET_HIGH">Sort: Target (High to Low)</option>
                  <option value="NEWEST">Sort: Newest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Clean horizontal scroll with hidden scrollbar) */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
              {categoryPills.map((cat) => {
                const active = selectedCategory === cat.key;
                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                      active
                        ? 'bg-gradient-to-r from-devotional-maroon to-devotional-saffron text-white shadow-md shadow-red-950/20 ring-1 ring-amber-300 scale-[1.02]'
                        : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 border border-stone-200/60 dark:border-stone-700/60'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count & Actions */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <p>
            Showing <span className="font-bold text-devotional-maroon dark:text-amber-400">{filteredInitiatives.length}</span> sacred causes
          </p>
          {(searchQuery || selectedCategory !== 'ALL' || urgentOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setUrgentOnly(false);
              }}
              className="text-devotional-saffron hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 3D Cards Grid */}
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-devotional-gold animate-spin mx-auto" />
            <p className="text-xs text-stone-400">Loading sacred initiatives...</p>
          </div>
        ) : filteredInitiatives.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-xl">
              🪔
            </div>
            <h3 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
              No initiatives match your filters
            </h3>
            <p className="text-xs text-stone-500">Try broadening your search query or switching categories.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setUrgentOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-devotional-maroon text-white font-bold text-xs shadow-md"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInitiatives.map((item) => (
              <InitiativeCard3D key={item.code} initiative={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
