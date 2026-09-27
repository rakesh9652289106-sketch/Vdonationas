'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import TempleCard from '@/components/TempleCard';
import { Search, Filter, MapPin, Sparkles, Building2 } from 'lucide-react';
import { DevotionalSelect } from '@/components/ui/DevotionalSelect';

function TempleDiscoveryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDeity, setSelectedDeity] = useState('ALL');

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  const filteredTemples = MOCK_TEMPLES.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      t.name.toLowerCase().includes(term) ||
      t.deity.toLowerCase().includes(term) ||
      t.city.toLowerCase().includes(term) ||
      t.state.toLowerCase().includes(term) ||
      t.code.toLowerCase().includes(term) ||
      t.pinCode.includes(term);

    const matchesState = selectedState === 'ALL' || t.state === selectedState;
    const matchesDeity =
      selectedDeity === 'ALL' || t.deity.toLowerCase().includes(selectedDeity.toLowerCase());

    return matchesSearch && matchesState && matchesDeity;
  });

  const stateChips = [
    { value: 'ALL', label: 'All States' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Sleek Devotional Discovery Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4A101D] via-[#380B15] to-[#20050C] text-white p-5 sm:p-7 shadow-lg border border-amber-500/30 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
          <Building2 className="w-3.5 h-3.5 text-amber-300" /> Sacred Shrines &amp; Devasthanams
        </div>
        <h1 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Explore Verified Temples across India
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Discover sacred temples, offer digital donations, sponsor daily Annadanam, and track campaign milestones with official 80G receipts.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Matha, Deity, City, State, PIN..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-devotional-maroon font-medium placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Deity Filter Dropdown */}
          <div className="md:col-span-4">
            <DevotionalSelect
              value={selectedDeity}
              onChange={setSelectedDeity}
              placeholder="All Deities"
              searchPlaceholder="Filter Sacred Deities..."
              footerText="6 Deities Configured"
              showSparkle={false}
              options={[
                { value: 'ALL', label: 'All Deities', badge: '🕉️' },
                { value: 'Venkateswara', label: 'Lord Venkateswara', badge: 'V' },
                { value: 'Narasimha', label: 'Lord Narasimha', badge: 'N' },
                { value: 'Rama', label: 'Lord Sita Rama', badge: 'R' },
                { value: 'Durga', label: 'Goddess Durga', badge: 'D' },
                { value: 'Hanuman', label: 'Lord Anjaneya', badge: 'H' },
              ]}
            />
          </div>
        </div>

        {/* 1-Tap State Filter Chips (Horizontal Swipeable Carousel for Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {stateChips.map((chip) => {
            const isSelected = selectedState === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setSelectedState(chip.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active-press ${
                  isSelected
                    ? 'bg-devotional-maroon text-white shadow-xs font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Clear Action */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="font-medium">Showing {filteredTemples.length} verified temples</span>
          {(searchTerm || selectedState !== 'ALL' || selectedDeity !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('ALL');
                setSelectedDeity('ALL');
              }}
              className="text-devotional-maroon dark:text-amber-400 font-bold hover:underline active-press"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Temple Grid */}
      {filteredTemples.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemples.map((temple) => (
            <TempleCard key={temple.id} temple={temple} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 space-y-3">
          <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            No temples matched your search "{searchTerm}"
          </h3>
          <p className="text-xs text-stone-500">
            Try searching for "Tirupati", "Yadadri", "Rama", "Durga", "517504", or "Telangana".
          </p>
        </div>
      )}
    </div>
  );
}

export default function TempleDiscoveryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading search...</div>}>
      <TempleDiscoveryContent />
    </Suspense>
  );
}
