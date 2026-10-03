'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sun,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  calculateTeluguPanchangam,
  TeluguPanchangamDetails,
  TELUGU_VAARAMULU,
} from '@/lib/telugu-calendar';

export default function PanchangamCalculator() {
  const { t } = useLanguage();

  // Today's date string ISO (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Calendar popover open state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calendar navigation month and year
  const initialDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);
  const [viewYear, setViewYear] = useState<number>(initialDateObj.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialDateObj.getMonth() || 9); // 0-indexed (9 = Oct)

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

  // Gregorian Month Names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate authentic Telugu Panchangam for the currently active/selected date
  const activeTelugu: TeluguPanchangamDetails = useMemo(() => {
    return calculateTeluguPanchangam(selectedDate);
  }, [selectedDate]);

  // Sample mid-month date to display the representative Telugu month in the calendar header
  const headerTeluguInfo = useMemo(() => {
    const midMonthDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-15`;
    return calculateTeluguPanchangam(midMonthDate);
  }, [viewYear, viewMonth]);

  // Calendar Grid Days Calculation with full Telugu Panchangam metadata per day
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
      const teluguData = calculateTeluguPanchangam(dateStr);
      grid.push({ day, isCurrentMonth: false, dateStr, teluguData });
    }

    // Current month days with authentic Telugu calendar Tithi
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const teluguData = calculateTeluguPanchangam(dateStr);
      grid.push({ day, isCurrentMonth: true, dateStr, teluguData });
    }

    // Next month padding days to make total multiples of 7 (up to 35 or 42)
    const remainingSlots = (7 - (grid.length % 7)) % 7;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const teluguData = calculateTeluguPanchangam(dateStr);
      grid.push({ day, isCurrentMonth: false, dateStr, teluguData });
    }

    return grid;
  }, [viewYear, viewMonth]);

  // Find next upcoming sacred tithis for quick selection
  const quickSacredDates = useMemo(() => {
    const today = new Date();
    let ekadashiDate = '';
    let purnimaDate = '';
    let amavasyaDate = '';

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      const p = calculateTeluguPanchangam(ds);
      if (!ekadashiDate && p.isEkadashi) ekadashiDate = ds;
      if (!purnimaDate && p.isPurnima) purnimaDate = ds;
      if (!amavasyaDate && p.isAmavasya) amavasyaDate = ds;
      if (ekadashiDate && purnimaDate && amavasyaDate) break;
    }

    return { ekadashiDate, purnimaDate, amavasyaDate };
  }, []);

  // Format date display: YYYY-MM-DD -> DD - MM - YYYY
  const formattedDateDisplay = useMemo(() => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]} - ${parts[1]} - ${parts[0]}`;
    }
    return selectedDate;
  }, [selectedDate]);

  return (
    <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-devotional-gold/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-visible diya-glow-pulse font-sans">
      {/* Decorative Glow Halo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-devotional-gold/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col justify-start items-start gap-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/40">
          <Sun className="w-4 h-4 text-devotional-saffron animate-spin" style={{ animationDuration: '12s' }} />
          <span>తెలుగు పంచాంగం & ముహూర్తం • TELUGU PANCHANGAM & MUHURTHAM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
          Daily Sacred Telugu Panchangam & Auspicious Muhurtham
        </h2>
        <p className="text-amber-100/80 text-xs">
          శ్రీ వాసవి కన్యకా పరమేశ్వరి అమ్మవారి నిత్య పంచాంగం • చాంద్రమాన తెలుగు పంచాంగ ఖగోళ గణనలు
        </p>
      </div>

      {/* INTERACTIVE TELUGU CALENDAR DATE SELECTOR */}
      <div className="relative bg-stone-900/90 p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col justify-center relative z-20" ref={calendarRef}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-amber-200 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
            <CalendarIcon className="w-4 h-4 text-devotional-saffron" /> Select Telugu Panchangam Date
          </label>
          <span className="px-2.5 py-0.5 rounded-full bg-[#3d0d16] text-[#f5d77f] text-xs font-serif font-bold border border-[#f5d77f]/40">
            తెలుగు క్యాలెండర్
          </span>
        </div>

          {/* Trigger Input Field with Side Calendar Symbol & Telugu Tithi preview */}
          <div
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-amber-500/30 hover:border-amber-400 text-amber-200 font-sans flex items-center justify-between cursor-pointer transition-all shadow-inner group select-none"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 text-sm font-semibold tracking-wider font-mono">
                  {formattedDateDisplay}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
                  {activeTelugu.vaaramTelugu}
                </span>
              </div>
              <span className="text-[11px] text-[#f3cf7a] font-serif font-medium mt-0.5">
                {activeTelugu.masam} • {activeTelugu.tithiFullTelugu}
              </span>
            </div>

            <button
              type="button"
              className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors"
              title="Open Telugu Panchangam Calendar"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          {/* AUTHENTIC TELUGU PANCHANGAM CALENDAR POPOVER */}
          {isCalendarOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-full sm:w-[400px] bg-[#140e0c] border-2 border-devotional-gold/80 rounded-2xl p-4 shadow-2xl space-y-3.5 backdrop-blur-xl text-white font-sans animate-in fade-in zoom-in-95 duration-200">
              
              {/* Popover Header with Telugu Month & Gregorian Month */}
              <div className="border-b border-amber-500/20 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                    <CalendarIcon className="w-4 h-4 text-devotional-saffron" />
                    <span>తెలుగు పంచాంగం క్యాలెండర్</span>
                  </div>

                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Month Navigator with Telugu Masam */}
                <div className="flex items-center justify-between bg-stone-950/90 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:text-amber-400 text-stone-300 transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="text-center">
                    <span className="text-xs font-bold text-amber-300 block font-serif">
                      {headerTeluguInfo.masam} • {headerTeluguInfo.samvatsaram}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {monthNames[viewMonth]} {viewYear}
                    </span>
                  </div>

                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:text-amber-400 text-stone-300 transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Action Sacred Day Pills */}
              <div className="grid grid-cols-5 gap-1 text-[10px] font-bold">
                {[
                  { label: 'నేడు (Today)', date: todayStr },
                  { label: 'రేపు (Tomorrow)', date: getOffsetDate(1) },
                  { label: '🌟 ఏకాదశి', date: quickSacredDates.ekadashiDate },
                  { label: '🌕 పౌర్ణమి', date: quickSacredDates.purnimaDate },
                  { label: '🌑 అమావాస్య', date: quickSacredDates.amavasyaDate },
                ].map((pill) => {
                  const isSelected = selectedDate === pill.date;
                  return (
                    <button
                      key={pill.label}
                      onClick={() => pill.date && handleSelectDate(pill.date)}
                      className={`py-1.5 px-1 rounded-lg transition-all border text-center truncate ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-200 shadow-gold'
                          : 'bg-stone-900/90 text-stone-300 hover:bg-amber-500/20 hover:text-amber-300 border-amber-500/20'
                      }`}
                      title={pill.label}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Telugu & English Day of Week Header */}
              <div className="grid grid-cols-7 gap-1 text-center py-1 border-y border-amber-500/20">
                {TELUGU_VAARAMULU.map((v) => (
                  <div key={v.english} className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-amber-400 font-serif leading-none">
                      {v.shortTelugu}
                    </span>
                    <span className="text-[8px] text-stone-400 uppercase tracking-tighter">
                      {v.shortEnglish}
                    </span>
                  </div>
                ))}
              </div>

              {/* 7-Column Days Grid Showing Gregorian Day & Telugu Tithi */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarGrid.map((item, idx) => {
                  const isSelected = item.dateStr === selectedDate;
                  const isToday = item.dateStr === todayStr;
                  const isSpecial = item.teluguData.isEkadashi || item.teluguData.isPurnima || item.teluguData.isAmavasya;

                  if (!item.isCurrentMonth) {
                    return (
                      <div
                        key={idx}
                        className="py-1.5 rounded-lg text-stone-700 font-semibold select-none text-[10px] flex flex-col items-center opacity-40"
                      >
                        <span>{item.day}</span>
                        <span className="text-[8px] truncate max-w-[40px]">{item.teluguData.tithiAbbreviation}</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDate(item.dateStr)}
                      className={`py-1.5 px-0.5 rounded-xl transition-all font-semibold flex flex-col items-center justify-center relative min-h-[46px] border ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 font-bold shadow-gold scale-105 border-white z-10'
                          : isToday
                          ? 'bg-[#4a101b] text-[#f7d885] font-bold border-amber-400/70 hover:bg-[#5e1422]'
                          : isSpecial
                          ? 'bg-amber-950/40 text-amber-200 border-amber-500/40 hover:bg-amber-500/20'
                          : 'bg-stone-900/70 text-stone-200 hover:bg-amber-500/20 hover:text-amber-300 border-stone-800'
                      }`}
                    >
                      <span className="text-xs leading-none font-bold">{item.day}</span>
                      <span className={`text-[8px] mt-0.5 leading-tight truncate max-w-[46px] ${
                        isSelected ? 'text-stone-950 font-bold' : isSpecial ? 'text-amber-300 font-bold' : 'text-stone-400'
                      }`}>
                        {item.teluguData.tithiAbbreviation}
                      </span>
                      {isToday && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Popover Footer with Full Telugu Date Summary */}
              <div className="flex flex-col gap-1 pt-2 border-t border-amber-500/20 text-[11px] text-stone-300">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">ఎంచుకున్న తేదీ (Selected):</span>
                  <span className="font-mono font-bold text-amber-300">{selectedDate} ({activeTelugu.vaaramTelugu})</span>
                </div>
                <div className="text-center font-serif text-[#ffe28a] text-[11px] font-semibold bg-stone-950/60 py-1 px-2 rounded-lg border border-amber-500/20">
                  {activeTelugu.samvatsaram} • {activeTelugu.masam} • {activeTelugu.tithiFullTelugu}
                </div>
              </div>
            </div>
          )}
        </div>


      {/* GRAND TELUGU PANCHANGAM RIBBON (సంవత్సరం, ఆయనం, ఋతువు, మాసం, పక్షం, వారం) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#2f0810]/80 to-amber-950/70 border border-amber-400/40 shadow-inner grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="space-y-0.5 border-r border-amber-500/10 last:border-r-0">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">సంవత్సరం (Year)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.samvatsaram}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.samvatsaramEnglish}</span>
        </div>

        <div className="space-y-0.5 border-r border-amber-500/10 last:border-r-0">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">ఆయనం (Solstice)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.ayanam}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.ayanamEnglish}</span>
        </div>

        <div className="space-y-0.5 border-r border-amber-500/10 last:border-r-0">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">ఋతువు (Season)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.rutuvu}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.rutuvuEnglish}</span>
        </div>

        <div className="space-y-0.5 border-r border-amber-500/10 last:border-r-0">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">మాసం (Month)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.masam}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.masamEnglish}</span>
        </div>

        <div className="space-y-0.5 border-r border-amber-500/10 last:border-r-0">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">పక్షం (Fortnight)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.paksham}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.pakshamEnglish}</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">వారం (Weekday)</span>
          <p className="font-serif font-bold text-[#ffe28a] text-xs sm:text-sm">{activeTelugu.vaaramTelugu}</p>
          <span className="text-[9px] text-stone-400 block">{activeTelugu.vaaramEnglish}</span>
        </div>
      </div>

      {/* Special Observance & Festival Notice */}
      {activeTelugu.festivalOrVratam && (
        <div className="bg-gradient-to-r from-devotional-maroon via-amber-950 to-devotional-maroon p-3.5 rounded-2xl border border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200 font-semibold shadow-inner">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span className="font-serif text-amber-100 font-bold text-sm sm:text-base">
              {activeTelugu.festivalOrVratam}
            </span>
          </span>
          <span className="text-[10px] text-amber-300 font-mono bg-amber-400/15 px-2.5 py-1 rounded-full border border-amber-400/30">
            తెలుగు పంచాంగ గణన
          </span>
        </div>
      )}

      {/* 4 Primary Limbs of Panchangam (తిథి, నక్షత్రం, యోగం, కరణం) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs">
        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1.5 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">
            Tithi (తిథి)
          </span>
          <p className="font-serif font-bold text-amber-200 text-sm sm:text-base">{activeTelugu.tithiFullTelugu}</p>
          <p className="text-[11px] text-stone-300">{activeTelugu.tithiFullEnglish}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1.5 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">
            Nakshatram (నక్షత్రం)
          </span>
          <p className="font-serif font-bold text-amber-200 text-sm sm:text-base">{activeTelugu.nakshatramTelugu}</p>
          <p className="text-[11px] text-stone-300">{activeTelugu.nakshatramEnglish}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1.5 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">
            Yogam (యోగం)
          </span>
          <p className="font-serif font-bold text-amber-200 text-sm sm:text-base">{activeTelugu.yogamTelugu}</p>
          <p className="text-[11px] text-stone-300">{activeTelugu.yogamEnglish}</p>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-amber-400/30 space-y-1.5 hover:border-amber-400 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 block">
            Karanam (కరణం)
          </span>
          <p className="font-serif font-bold text-amber-200 text-sm sm:text-base">{activeTelugu.karanamTelugu}</p>
          <p className="text-[11px] text-stone-300">{activeTelugu.karanamEnglish}</p>
        </div>
      </div>

      {/* Auspicious Muhurthams & Sun Timings vs Inauspicious Periods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 text-xs">
        
        {/* AUSPICIOUS TIMINGS (శుభ సమయాలు) */}
        <div className="bg-stone-900/90 p-5 rounded-2xl border border-emerald-500/40 space-y-3.5">
          <h4 className="font-serif font-bold text-emerald-400 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-emerald-400" /> శుభ సమయాలు (Auspicious Timings)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-sans border border-emerald-500/30">
              అమృత ఘడియలు
            </span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-stone-300">
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">సూర్యోదయం (SUNRISE)</span>
              <p className="font-mono font-bold text-emerald-300 text-sm">{activeTelugu.sunrise}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block font-semibold">సూర్యాస్తమయం (SUNSET)</span>
              <p className="font-mono font-bold text-amber-300 text-sm">{activeTelugu.sunset}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold block">అభిజిత్ ముహూర్తం (ABHIJIT MUHURTHAM)</span>
              <p className="font-serif font-bold text-amber-300 text-sm">{activeTelugu.abhijitMuhurtham}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-stone-400 font-semibold block">అమృత కాలం (AMRUTHA KALAM)</span>
                <p className="font-mono font-bold text-emerald-300">{activeTelugu.amruthaKalam}</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-semibold block">బ్రహ్మ ముహూర్తం (BRAHMA MUHURTHAM)</span>
                <p className="font-mono text-amber-200">{activeTelugu.brahmaMuhurtham}</p>
              </div>
            </div>
          </div>
        </div>

        {/* INAUSPICIOUS TIMINGS & VARJYAM (అశుభ సమయాలు & వర్జ్యం) */}
        <div className="bg-stone-900/90 p-5 rounded-2xl border border-rose-500/40 space-y-3.5">
          <h4 className="font-serif font-bold text-rose-400 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" /> అశుభ సమయాలు (Inauspicious Bands)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-sans border border-rose-500/30">
              వర్జ్య కాలాలు
            </span>
          </h4>

          <div className="grid grid-cols-3 gap-2 text-stone-300 text-[11px]">
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">రాహుకాలం</span>
              <p className="font-mono font-bold text-rose-300">{activeTelugu.rahukalam}</p>
            </div>
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">యమగండం</span>
              <p className="font-mono text-stone-300">{activeTelugu.yamagandam}</p>
            </div>
            <div>
              <span className="text-[9px] text-stone-400 block font-semibold">గుళికాకాలం</span>
              <p className="font-mono text-stone-300">{activeTelugu.gulikakalam}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-800 text-[11px]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-rose-300 font-semibold block">దుర్ముహూర్తం (DURMUHURTHAM)</span>
                <p className="font-mono text-rose-200">{activeTelugu.durmuhurtham}</p>
              </div>
              <div>
                <span className="text-[10px] text-rose-300 font-semibold block">వర్జ్యం (VARJYAM)</span>
                <p className="font-mono text-rose-200">{activeTelugu.varjyam}</p>
              </div>
            </div>
            <div className="text-[10px] text-stone-400 italic pt-1">
              * ముఖ్యమైన మరియు నూతన కార్యాలను రాహుకాలం, దుర్ముహూర్తం సమయాల్లో ప్రారంభించరాదు.
            </div>
          </div>
        </div>

      </div>

      {/* TEMPLE POOJA & SEVA TIMINGS */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-400/20 space-y-2 text-xs">
        <span className="text-amber-300 font-serif font-bold flex items-center gap-1.5 text-sm">
          <Flame className="w-4 h-4 text-devotional-saffron" />
          శ్రీ వాసవి కన్యకా పరమేశ్వరి అమ్మవారి నిత్యార్చన & ఆరాధనా సమయాలు
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-stone-300">
          <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <span className="text-amber-200 font-bold block text-[11px]">07:30 AM - 09:00 AM</span>
              <span className="text-[10px] text-stone-400">వాసవి నిత్య కుంకుమార్చన & అభిషేకం</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <span className="text-amber-200 font-bold block text-[11px]">11:45 AM - 12:30 PM</span>
              <span className="text-[10px] text-stone-400">మహా నైవేద్యం & నిత్యాన్నదాన సేవ</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <span className="text-amber-200 font-bold block text-[11px]">06:30 PM - 07:30 PM</span>
              <span className="text-[10px] text-stone-400">సహస్రనామార్చన & మహామంగళ హారతి</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
