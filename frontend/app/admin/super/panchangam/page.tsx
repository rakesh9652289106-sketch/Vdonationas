'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES, MOCK_PANCHANGAM } from '@/lib/mock-data';
import { PanchangamData } from '@/lib/types';
import { Sun, Edit3, Plus, Save, Flame, MapPin, Building2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SuperAdminPanchangamPage() {
  const { t } = useLanguage();
  const [panchangamList, setPanchangamList] = useState<PanchangamData[]>(MOCK_PANCHANGAM);
  const [editingItem, setEditingItem] = useState<PanchangamData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [selectedTempleId, setSelectedTempleId] = useState(MOCK_TEMPLES[0]?.id || 'tpl-vasavi-01');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [tithi, setTithi] = useState('');
  const [nakshatram, setNakshatram] = useState('');
  const [yogam, setYogam] = useState('');
  const [karanam, setKaranam] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [abhijitMuhurtham, setAbhijitMuhurtham] = useState('');
  const [rahukalam, setRahukalam] = useState('');
  const [specialObservance, setSpecialObservance] = useState('');

  const handleOpenEdit = (item: PanchangamData) => {
    setEditingItem(item);
    setSelectedTempleId(item.templeId);
    setLocation(item.location);
    setDate(item.date);
    setTithi(item.tithi);
    setNakshatram(item.nakshatram);
    setYogam(item.yogam);
    setKaranam(item.karanam);
    setSunrise(item.sunrise);
    setSunset(item.sunset);
    setAbhijitMuhurtham(item.abhijitMuhurtham);
    setRahukalam(item.rahukalam);
    setSpecialObservance(item.specialObservance || '');
    setShowEditModal(true);
  };

  const handleCreateNew = () => {
    const defaultTemple = MOCK_TEMPLES[0];
    const newItem: PanchangamData = {
      id: `panch-${Date.now()}`,
      templeId: defaultTemple.id,
      templeName: defaultTemple.name,
      date: new Date().toISOString().split('T')[0],
      location: `${defaultTemple.address}, ${defaultTemple.city}, ${defaultTemple.state}`,
      tithi: 'Shukla Ekadashi (Holy Vasavi Tithi)',
      nakshatram: 'Uttara Phalguni',
      yogam: 'Ayushman',
      karanam: 'Bava',
      sunrise: '06:04 AM',
      sunset: '06:38 PM',
      abhijitMuhurtham: '11:45 AM - 12:35 PM (Most Auspicious)',
      rahukalam: '04:30 PM - 06:00 PM',
      yamagandam: '12:00 PM - 01:30 PM',
      gulikakalam: '03:00 PM - 04:30 PM',
      auspiciousPoojaSlots: ['07:30 AM - 09:00 AM', '11:45 AM - 12:30 PM'],
      specialObservance: '🌟 Sacred Vasavi Ammavaru Festival',
      updatedBy: 'Ramesh Sharma (Super Admin)',
      updatedAt: new Date().toISOString(),
    };
    handleOpenEdit(newItem);
  };

  const handleSavePanchangam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const targetTemple = MOCK_TEMPLES.find((t) => t.id === selectedTempleId) || MOCK_TEMPLES[0];

    const updatedRecord: PanchangamData = {
      ...editingItem,
      templeId: targetTemple.id,
      templeName: targetTemple.name,
      location: location || `${targetTemple.address}, ${targetTemple.city}`,
      date,
      tithi,
      nakshatram,
      yogam,
      karanam,
      sunrise,
      sunset,
      abhijitMuhurtham,
      rahukalam,
      specialObservance,
      updatedBy: 'Ramesh Sharma (Super Admin)',
      updatedAt: new Date().toISOString(),
    };

    const exists = panchangamList.some((p) => p.id === editingItem.id);
    if (exists) {
      setPanchangamList(panchangamList.map((p) => (p.id === editingItem.id ? updatedRecord : p)));
    } else {
      setPanchangamList([updatedRecord, ...panchangamList]);
    }

    setShowEditModal(false);
    alert(`✅ Panchangam for "${targetTemple.name}" saved & linked successfully!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarPanchangamManager')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Temple-Linked Daily Panchangam Manager
          </h1>
          <p className="text-amber-100/80 text-xs">
            Super Admin Control Panel: Dynamically linked to {MOCK_TEMPLES.length} Devasthanam Shrine Records
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 text-devotional-maroon" /> Add Temple Panchangam Record
        </button>
      </div>

      {/* PANCHANGAM RECORDS LINKED TO TEMPLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panchangamList.map((panch) => {
          const linkedTemple = MOCK_TEMPLES.find((t) => t.id === panch.templeId) || MOCK_TEMPLES[0];
          return (
            <div
              key={panch.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-xl space-y-4 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40"
            >
              <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold">
                    <Building2 className="w-4 h-4 text-devotional-saffron" /> {linkedTemple.name}
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    Date: {panch.date}
                  </h3>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" /> {panch.location}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEdit(panch)}
                  className="px-3.5 py-1.5 rounded-xl bg-devotional-maroon text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 shadow-sm shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5 text-devotional-saffron" /> Edit Panchangam
                </button>
              </div>

              {/* Astronomical Properties Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <span className="text-[10px] text-stone-500 block font-bold uppercase">Tithi</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{panch.tithi}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <span className="text-[10px] text-stone-500 block font-bold uppercase">Nakshatram</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{panch.nakshatram}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <span className="text-[10px] text-stone-500 block font-bold uppercase">Abhijit Muhurtham</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{panch.abhijitMuhurtham}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                  <span className="text-[10px] text-stone-500 block font-bold uppercase">Rahukalam</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{panch.rahukalam}</span>
                </div>
              </div>

              {panch.specialObservance && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-xs font-medium text-amber-900 dark:text-amber-200">
                  {panch.specialObservance}
                </div>
              )}

              <div className="text-[10px] text-stone-400 flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 font-mono">
                <span>Updated by: {panch.updatedBy || 'Super Admin'}</span>
                <span>{panch.updatedAt ? new Date(panch.updatedAt).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT / LINK PANCHANGAM MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
              <Sun className="w-5 h-5 text-devotional-saffron" /> Edit Shrine Panchangam & Muhurtham Record
            </h3>

            <form onSubmit={handleSavePanchangam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Link to Shrine Devasthanam *
                </label>
                <select
                  value={selectedTempleId}
                  onChange={(e) => setSelectedTempleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
                >
                  {MOCK_TEMPLES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.city}, {tpl.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Location Description
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tithi (తిథి) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tithi}
                    onChange={(e) => setTithi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nakshatram (నక్షత్రం) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nakshatram}
                    onChange={(e) => setNakshatram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Sunrise (సూర్యోదయం)
                  </label>
                  <input
                    type="text"
                    value={sunrise}
                    onChange={(e) => setSunrise(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Sunset (సూర్యాస్తమయం)
                  </label>
                  <input
                    type="text"
                    value={sunset}
                    onChange={(e) => setSunset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Abhijit Muhurtham (అభిజిత్ ముహూర్తం) *
                </label>
                <input
                  type="text"
                  required
                  value={abhijitMuhurtham}
                  onChange={(e) => setAbhijitMuhurtham(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Rahukalam (రాహుకాలం) *
                </label>
                <input
                  type="text"
                  required
                  value={rahukalam}
                  onChange={(e) => setRahukalam(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Special Festival / Observance Notice
                </label>
                <input
                  type="text"
                  value={specialObservance}
                  onChange={(e) => setSpecialObservance(e.target.value)}
                  placeholder="e.g. 🌟 Vasavi Ammavaru Sahasranama Kumkumarchana Day"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold shadow-gold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-devotional-maroon" /> Save & Link Panchangam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
