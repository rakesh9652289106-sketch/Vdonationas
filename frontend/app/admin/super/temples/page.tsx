'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import { Temple } from '@/lib/types';
import { Building2, Plus, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SuperAdminTemplesPage() {
  const { t } = useLanguage();
  const [temples, setTemples] = useState<Temple[]>(MOCK_TEMPLES);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [trustName, setTrustName] = useState('');

  const handleAddTemple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deity || !city) return;

    const newTemple: Temple = {
      id: `tpl-${Date.now()}`,
      code: `TPL-00${temples.length + 1}`,
      name,
      deity,
      description: 'Newly registered sacred temple shrine.',
      address: `${city}, ${state}`,
      city,
      state,
      pinCode: '500001',
      country: 'India',
      contactPhone: '+91 90000 11223',
      contactEmail: `info@${city.toLowerCase()}temple.org`,
      trustName: trustName || `${name} Devasthanam Trust`,
      registrationNo: `REG/AP/${city.substring(0, 3).toUpperCase()}/100`,
      logoUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
      bannerUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
      timings: '05:00 AM - 09:00 PM',
      verificationStatus: 'VERIFIED',
      isActive: true,
      gallery: [],
    };

    setTemples([...temples, newTemple]);
    setName('');
    setDeity('');
    setCity('');
    setTrustName('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarManageTemples')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarManageTemples')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Platform Temple Directory, Multi-Tenant Isolation & Verification Status
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 text-devotional-maroon" /> Onboard New Temple Shrine
        </button>
      </div>

      {/* 3D SHRINE DIRECTORY GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {temples.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold block">{t.code}</span>
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mt-0.5">{t.name}</h3>
                <p className="text-xs text-stone-500 font-medium">{t.deity} • {t.city}, {t.state}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-400/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {t.verificationStatus}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-300 font-semibold">{t.trustName}</span>
              <span className="text-[11px] font-mono text-stone-400">{t.contactEmail}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
              Onboard New Temple Shrine
            </h3>
            <form onSubmit={handleAddTemple} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Temple Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sri Vasavi Matha Temple"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">Presiding Deity</label>
                <input
                  type="text"
                  required
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Goddess Sri Vasavi Ammavaru"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Penugonda"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-devotional-saffron text-white font-bold"
                >
                  Save Shrine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
