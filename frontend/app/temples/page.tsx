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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
          <Building2 className="w-4 h-4" /> SACRED SHRINES & DEVASTHANAMS
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 tracking-tight">
          Explore Verified Temples across India
        </h1>
        <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
          Discover sacred temples, offer digital donations, sponsor daily Annadanam, and track campaign milestones with 100% official receipts.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Matha, Deity, City, State, PIN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-devotional-maroon font-medium"
            />
          </div>

          {/* State Filter */}
          <div>
            <DevotionalSelect
              value={selectedState}
              onChange={setSelectedState}
              placeholder="All States (India)"
              searchPlaceholder="Filter Indian States..."
              footerText="5 States Configured"
              showSparkle={true}
              options={[
                { value: 'ALL', label: 'All States (India)', badge: '🇮🇳' },
                { value: 'Andhra Pradesh', label: 'Andhra Pradesh', badge: 'AP' },
                { value: 'Telangana', label: 'Telangana', badge: 'TS' },
                { value: 'Tamil Nadu', label: 'Tamil Nadu', badge: 'TN' },
                { value: 'Karnataka', label: 'Karnataka', badge: 'KA' },
              ]}
            />
          </div>

          {/* Deity Filter */}
          <div>
            <DevotionalSelect
              value={selectedDeity}
              onChange={setSelectedDeity}
              placeholder="All Deities"
              searchPlaceholder="Filter Sacred Deities..."
              footerText="6 Deities Configured"
              showSparkle={true}
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

        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span>Showing {filteredTemples.length} verified temples</span>
          {(searchTerm || selectedState !== 'ALL' || selectedDeity !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('ALL');
                setSelectedDeity('ALL');
              }}
              className="text-devotional-maroon dark:text-amber-400 font-bold hover:underline"
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
