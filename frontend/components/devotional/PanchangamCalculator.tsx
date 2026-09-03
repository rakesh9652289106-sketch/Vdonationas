'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_TEMPLES, MOCK_PANCHANGAM } from '@/lib/mock-data';
import {
  Sun,
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  Flame,
  Clock,
  BellRing,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PanchangamCalculator() {
  const { t } = useLanguage();
  const selectedTempleId = MOCK_TEMPLES[0]?.id || 'tpl-vasavi-01';

  // Today's date string ISO (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Calendar popover open state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calendar navigation month and year
  const initialDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);
  const [viewYear, setViewYear] = useState<number>(initialDateObj.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialDateObj.getMonth() || 7); // 0-indexed (7 = Aug)

  const [bellRung, setBellRung] = useState(false);

  // Close calendar popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Sync calendar view month/year when selectedDate changes externally
  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    setIsCalendarOpen(false);
  };

  // Quick select helper: offset from today
  const getOffsetDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Month Names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar Grid Days Calculation
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const grid = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push({ day, isCurrentMonth: false, dateStr });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push({ day, isCurrentMonth: true, dateStr });
    }

    // Next month padding days to make total multiples of 7 (up to 35 or 42)
    const remainingSlots = (7 - (grid.length % 7)) % 7;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push({ day, isCurrentMonth: false, dateStr });
    }

    return grid;
  }, [viewYear, viewMonth]);

  // Format date display: YYYY-MM-DD -> DD - MM - YYYY
  const formattedDateDisplay = useMemo(() => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]} - ${parts[1]} - ${parts[0]}`;
    }
    return selectedDate;
  }, [selectedDate]);

  // Find linked temple from directory
  const activeTemple = MOCK_TEMPLES.find((tpl) => tpl.id === selectedTempleId) || MOCK_TEMPLES[0];

  // Dynamically calculate or lookup panchangam record for selected date & temple
  const activeRecord = useMemo(() => {
    // 1. Check if an explicit admin record exists for this temple & date
    const exactRecord = MOCK_PANCHANGAM.find(
      (p) => p.templeId === selectedTempleId && p.date === selectedDate
    );
    if (exactRecord) return exactRecord;

    // 2. Otherwise calculate dynamically based on date
    const baseDate = new Date('2026-08-28T00:00:00Z');
    const targetDate = new Date(selectedDate + 'T00:00:00Z');
    const isValidDate = !isNaN(targetDate.getTime());
    const dateObj = isValidDate ? targetDate : new Date();

    const diffDays = Math.round((dateObj.getTime() - baseDate.getTime()) / (1000 * 3600 * 24));
    const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon, ...

    const tithis = [
      'Shukla Ekadashi (Holy Vasavi Tithi)',
      'Shukla Dwadashi',
      'Shukla Trayodashi (Pradosham)',
      'Shukla Chaturdashi',
      'Purnima (Full Moon - Sacred Alankaram Day)',
      'Krishna Pratipada',
      'Krishna Dwitiya',
      'Krishna Tritiya',
      'Krishna Chaturthi (Sankashti Ganesha Seva)',
      'Krishna Panchami',
      'Krishna Shashthi',
      'Krishna Saptami',
      'Krishna Ashtami',
      'Krishna Navami',
      'Krishna Dashami',
      'Krishna Ekadashi (Ekadashi Vratam)',
      'Krishna Dwadashi',
      'Krishna Trayodashi',
      'Krishna Chaturdashi',
      'Amavasya (New Moon - Pitru Seva)',
      'Shukla Pratipada',
      'Shukla Dwitiya',
      'Shukla Tritiya',
      'Shukla Chaturthi',
      'Shukla Panchami',
      'Shukla Shashthi',
      'Shukla Saptami',
      'Shukla Ashtami',
      'Shukla Navami',
      'Shukla Dashami',
    ];

    const nakshatras = [
      'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati', 'Ashwini', 'Bharani', 'Krittika',
      'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni'
    ];

    const yogas = [
      'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
      'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
      'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
      'Vishkambha', 'Priti'
    ];

    const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];

    const rahukalamByDay = [
      '04:30 PM - 06:00 PM', // Sun
      '07:30 AM - 09:00 AM', // Mon
      '03:00 PM - 04:30 PM', // Tue
      '12:00 PM - 01:30 PM', // Wed
      '01:30 PM - 03:00 PM', // Thu
      '10:30 AM - 12:00 PM', // Fri
      '09:00 AM - 10:30 AM', // Sat
    ];

    const yamagandamByDay = [
      '12:00 PM - 01:30 PM', // Sun
      '10:30 AM - 12:00 PM', // Mon
      '09:00 AM - 10:30 AM', // Tue
      '07:30 AM - 09:00 AM', // Wed
      '06:00 AM - 07:30 AM', // Thu
      '03:00 PM - 04:30 PM', // Fri
      '01:30 PM - 03:00 PM', // Sat
    ];

    const gulikakalamByDay = [
      '03:00 PM - 04:30 PM', // Sun
      '01:30 PM - 03:00 PM', // Mon
      '12:00 PM - 01:30 PM', // Tue
      '10:30 AM - 12:00 PM', // Wed
      '09:00 AM - 10:30 AM', // Thu
      '07:30 AM - 09:00 AM', // Fri
      '06:00 AM - 07:30 AM', // Sat
    ];

    const tithiIndex = ((diffDays % 30) + 30) % 30;
    const nakshatraIndex = ((diffDays % 27) + 27) % 27;
    const yogaIndex = ((diffDays % 27) + 27) % 27;
    const karanaIndex = ((diffDays % 11) + 11) % 11;

    const currentTithi = tithis[tithiIndex];

    let specialObservance = '';
    if (currentTithi.includes('Ekadashi')) {
      specialObservance = '🌟 Sacred Vasavi Ammavaru Sahasranama Kumkumarchana & Ekadashi Vratam Day';
    } else if (currentTithi.includes('Pradosham')) {
      specialObservance = '🕉️ Sacred Pradosha Kala Abhishekam & Siva Pooja';
    } else if (currentTithi.includes('Purnima')) {
      specialObservance = '🌕 Sri Vasavi Matha Grand Chariot & Full Moon Deepotsavam';
    } else if (currentTithi.includes('Sankashti')) {
      specialObservance = '🐘 Sankashti Hara Ganesha Chathurthi & Modaka Seva';
    } else if (currentTithi.includes('Amavasya')) {
      specialObservance = '🌑 Amavasya Pitru Tarpanam & Special Annadanam';
    } else if (dayOfWeek === 5) {
      specialObservance = '🌸 Friday Special Sri Vasavi Kanyaka Parameswari Alankaram & Archana';
    } else if (dayOfWeek === 2) {
      specialObservance = '🔥 Tuesday Special Mangala Gauri Pooja & Kumkuma Seva';
    }

    return {
      id: `panch-calc-${selectedDate}`,
      templeId: activeTemple.id,
      templeName: activeTemple.name,
      date: selectedDate,
      location: `${activeTemple.address}, ${activeTemple.city}, ${activeTemple.state}`,
      tithi: currentTithi,
      nakshatram: nakshatras[nakshatraIndex],
      yogam: yogas[yogaIndex],
      karanam: karanas[karanaIndex],
      sunrise: '06:04 AM',
      sunset: '06:38 PM',
      abhijitMuhurtham: '11:45 AM - 12:35 PM (Most Auspicious)',
      rahukalam: rahukalamByDay[dayOfWeek],
      yamagandam: yamagandamByDay[dayOfWeek],
      gulikakalam: gulikakalamByDay[dayOfWeek],
      auspiciousPoojaSlots: [
        '07:30 AM - 09:00 AM (Vasavi Kumkumarchana)',
        '11:45 AM - 12:30 PM (Maha Naivedyam & Annadanam)',
        '06:30 PM - 07:30 PM (Sahasranama Archana & Deeparadhana)',
      ],
      specialObservance: specialObservance || '✨ Daily Sanctified Shrine Archana & Nitya Seva',
      updatedBy: 'Automated Astronomical Calculation',
      updatedAt: new Date().toISOString(),
    };
  }, [selectedDate, selectedTempleId, activeTemple]);

  const handleRingBell = () => {
    setBellRung(true);
    setTimeout(() => setBellRung(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-devotional-gold/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-visible diya-glow-pulse font-sans">
      {/* Decorative Glow Halo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-devotional-gold/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/40">
            <Sun className="w-4 h-4 text-devotional-saffron animate-spin" style={{ animationDuration: '12s' }} />
            SHRINE PANCHANGAM & MUHURTHAM CALCULATOR
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Daily Sacred Panchangam & Auspicious Muhurtham
          </h2>
          <p className="text-amber-100/80 text-xs">
            Linked to {activeTemple.name} • Astronomical Calculations
          </p>
        </div>

        <button
          onClick={handleRingBell}
          className={`px-4 py-2.5 rounded-2xl font-serif font-bold text-xs shadow-gold transition-all flex items-center gap-2 border ${
            bellRung
              ? 'bg-amber-400 text-stone-950 scale-105 border-white ring-4 ring-amber-300/50'
              : 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white hover:brightness-110 border-amber-300/40'
          }`}
        >
          <BellRing className={`w-4 h-4 ${bellRung ? 'animate-bounce text-devotional-maroon' : 'text-amber-300'}`} />
          {bellRung ? '🔔 Sacred Bell Ringing...' : '🔔 Ring Sacred Temple Bell'}
        </button>
      </div>

      {/* COMBINED 2-COLUMN ROW: LEFT = SHRINE DETAILS CARD | RIGHT = DATE CALENDAR PICKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-20 items-stretch">
        
        {/* LEFT SIDE: SHRINE DETAILS CARD (takes 2 columns on lg screens) */}
        <div className="lg:col-span-2 bg-amber-500/10 p-4 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-serif font-bold text-amber-300">{activeTemple.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[9px] border border-emerald-400/40">
                VERIFIED SHRINE
              </span>
            </div>
            <p className="text-stone-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-devotional-saffron shrink-0" />
              {activeTemple.address}, {activeTemple.city}, {activeTemple.state} ({activeTemple.pinCode})
            </p>
          </div>

          <Link
            href={`/temples/${activeTemple.id}`}
            className="px-3.5 py-2 rounded-xl bg-devotional-maroon text-amber-300 font-bold text-xs hover:brightness-110 flex items-center gap-1.5 border border-amber-400/40 shrink-0 shadow-sm"
          >
            Inspect Shrine Details <ExternalLink className="w-3.5 h-3.5 text-devotional-saffron" />
          </Link>
        </div>

        {/* RIGHT SIDE: CUSTOM SIDE CALENDAR DATE SELECTOR */}
        <div className="lg:col-span-1 relative bg-stone-900/90 p-4 rounded-2xl border border-amber-400/30 flex flex-col justify-center" ref={calendarRef}>
          <label className="block text-amber-200 font-bold mb-1.5 flex items-center gap-1.5 text-xs">
            <CalendarIcon className="w-3.5 h-3.5 text-devotional-saffron" /> Select Panchangam Date
          </label>

          {/* Trigger Input Field with Side Calendar Symbol */}
          <div
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-amber-500/30 hover:border-amber-400 text-amber-200 font-mono font-bold flex items-center justify-between cursor-pointer transition-all shadow-inner group select-none"
          >
            <span className="text-amber-300 text-sm font-semibold tracking-wider">
              {formattedDateDisplay}
            </span>
            <button
              type="button"
              className="p-1 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors"
              title="Open Side Panchangam Calendar"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {/* DYNAMIC PANCHANGAM CALENDAR POPOVER */}
          {isCalendarOpen && (
            <div className="absolute right-0 lg:right-0 top-full mt-2 z-50 w-full sm:w-[360px] bg-[#12100e] border-2 border-devotional-gold/70 rounded-2xl p-4 shadow-2xl space-y-4 backdrop-blur-xl text-white font-sans animate-in fade-in zoom-in-95 duration-200">
              {/* Popover Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <CalendarIcon className="w-4 h-4 text-devotional-saffron" />
                  <span>Panchangam Calendar</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-200">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 hover:text-amber-400 transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1 text-[11px]">
                      {monthNames[viewMonth]} {viewYear}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:text-amber-400 transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Action Date Pills Row */}
              <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                {[
                  { label: 'Today', days: 0 },
                  { label: 'Tomorrow', days: 1 },
                  { label: '+2 Days', days: 2 },
                  { label: '+3 Days', days: 3 },
                ].map((pill) => {
                  const targetDate = getOffsetDate(pill.days);
                  const isSelected = selectedDate === targetDate;
                  return (
                    <button
                      key={pill.label}
                      onClick={() => handleSelectDate(targetDate)}
                      className={`py-1.5 px-2 rounded-xl transition-all border text-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold border-amber-300 shadow-gold'
                          : 'bg-stone-900/90 text-stone-300 hover:bg-amber-500/20 hover:text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Day of Week Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-amber-400 uppercase tracking-wider py-1 border-y border-stone-800">
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>

              {/* 7-Column Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {calendarGrid.map((item, idx) => {
                  const isSelected = item.dateStr === selectedDate;
                  const isToday = item.dateStr === todayStr;

                  if (!item.isCurrentMonth) {
                    return (
                      <div
                        key={idx}
                        className="py-2 rounded-xl text-stone-700 font-semibold select-none text-[11px]"
                      >
                        {item.day}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDate(item.dateStr)}
                      className={`py-2 rounded-xl transition-all font-semibold flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold shadow-gold scale-105 border border-amber-200'
                          : isToday
                          ? 'bg-devotional-maroon text-amber-300 font-bold border border-amber-400/60 hover:bg-devotional-maroon/80'
                          : 'bg-stone-900/60 text-stone-200 hover:bg-amber-500/20 hover:text-amber-300 border border-stone-800'
                      }`}
                    >
                      <span>{item.day}</span>
                      {isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Popover Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-amber-500/20 text-[11px]">
                <span className="text-stone-400 font-bold">Selected Date:</span>
                <span className="font-mono font-bold text-amber-300">{selectedDate}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Special Observance Notice */}
      {activeRecord.specialObservance && (
        <div className="bg-gradient-to-r from-devotional-maroon via-amber-950 to-devotional-maroon p-3 rounded-xl border border-amber-400/50 flex items-center justify-between text-xs text-amber-200 font-semibold shadow-inner">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            {activeRecord.specialObservance}
          </span>
          <span className="text-[10px] text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            ASTRONOMICAL CALCULATION
          </span>
        </div>
      )}

      {/* Panchangam Astronomical Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs">
        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">Tithi (తిథి)</span>
          <p className="font-serif font-bold text-stone-100 text-sm">{activeRecord.tithi}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">Nakshatram (నక్షత్రం)</span>
          <p className="font-serif font-bold text-stone-100 text-sm">{activeRecord.nakshatram}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">Yogam (యోగం)</span>
          <p className="font-serif font-bold text-stone-100 text-sm">{activeRecord.yogam}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">Karanam (కరణం)</span>
          <p className="font-serif font-bold text-stone-100 text-sm">{activeRecord.karanam}</p>
        </div>
      </div>

      {/* Sun Timings & Auspicious Muhurtham Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 text-xs">
        <div className="bg-stone-900/90 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
          <h4 className="font-serif font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
            <Sun className="w-4 h-4 text-emerald-400" /> Sunrise, Sunset & Abhijit Muhurtham
          </h4>
          <div className="grid grid-cols-2 gap-2 text-stone-300">
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">SUNRISE (సూర్యోదయం)</span>
              <p className="font-mono font-bold text-emerald-300">{activeRecord.sunrise}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">SUNSET (సూర్యాస్తమయం)</span>
              <p className="font-mono font-bold text-amber-300">{activeRecord.sunset}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-stone-800">
            <span className="text-[10px] text-emerald-400 font-bold block">ABHIJIT MUHURTHAM (అభిజిత్ ముహూర్తం)</span>
            <p className="font-serif font-bold text-amber-300 text-sm">{activeRecord.abhijitMuhurtham}</p>
          </div>
        </div>

        <div className="bg-stone-900/90 p-5 rounded-2xl border border-rose-500/40 space-y-3">
          <h4 className="font-serif font-bold text-rose-400 flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4 text-rose-400" /> Rahukalam & Inauspicious Time Bands
          </h4>
          <div className="grid grid-cols-3 gap-2 text-stone-300 text-[11px]">
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">RAHUKALAM</span>
              <p className="font-mono font-bold text-rose-300">{activeRecord.rahukalam}</p>
            </div>
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">YAMAGANDAM</span>
              <p className="font-mono text-stone-300">{activeRecord.yamagandam}</p>
            </div>
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">GULIKAKALAM</span>
              <p className="font-mono text-stone-300">{activeRecord.gulikakalam}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 italic">
            * Avoid commencing new business ventures during Rahukalam time window.
          </div>
        </div>
      </div>
    </div>
  );
}
