'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  Info,
  Bell,
  User,
  Building2,
  Tv,
  Printer,
  X,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { DevotionalSelect } from '@/components/ui/DevotionalSelect';
import { NakshatraSelect } from '@/components/ui/VedicSelects';
import { PoojaItem, getPoojaCatalog } from '@/lib/pooja-store';
import {
  isDateInApprovedRelease,
  getUpcomingScheduledRelease,
  isDateBlocked,
  getMonthReleaseDetails,
  getLatestApprovedReleasedMonth,
  getNextUpcomingSevaRelease,
} from '@/lib/quota-store';

const NAKSHATRAS = [
  'Anuradha',
  'Ardra',
  'Ashlesha',
  'Ashwini',
  'Bharani',
  'Chitra',
  'Dhanishta',
  'Hasta',
  'Jyeshtha',
  'Krittika',
  'Magha',
  'Mrigashira',
  'Mula',
  'Punarvasu',
  'Purva Ashadha',
  'Purva Bhadrapada',
  'Purva Phalguni',
  'Pushya',
  'Revati',
  'Rohini',
  'Shatabhisha',
  'Shravana',
  'Swati',
  'Uttara Ashadha',
  'Uttara Bhadrapada',
  'Uttara Phalguni',
  'Vishakha',
];

const POPULAR_GOTRAS = [
  'Kaundinya', 'Bharadwaja', 'Kasyapa', 'Harithasa', 'Vasishta',
  'Gautama', 'Srivatsa', 'Agasthya', 'Gargya', 'Koushika',
  'Noble 102 Vasavi Gotra Lineage', 'Other Gotra',
];

interface BookedPooja {
  id: string;
  bookingRef: string;
  poojaTitle: string;
  date: string;
  slot: string;
  devoteeName: string;
  gotra: string;
  nakshatra: string;
  purpose: string;
  mobile: string;
  email: string;
  mode: 'IN_PERSON' | 'ONLINE_LIVE';
  amount: number;
  status: 'CONFIRMED';
  reminderScheduledDate: string;
  bookedAt: string;
}

export default function DevoteePoojaBookingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-bookings'>('catalog');
  const [poojas, setPoojas] = useState<PoojaItem[]>([]);
  const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);

  // Calendar Date Picker States
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Maximum 2-Month (60 Days) Limit calculation
  const maxBookingDate = new Date(today);
  maxBookingDate.setDate(maxBookingDate.getDate() + 60);
  maxBookingDate.setHours(23, 59, 59, 999);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Form Fields
  const [devoteeName, setDevoteeName] = useState('Radha Krishna');
  const [gotra, setGotra] = useState('Kaundinya');
  const [customGotra, setCustomGotra] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [purpose, setPurpose] = useState('Family Health, Peace & Prosperity');
  const [mobile, setMobile] = useState('9123456789');
  const [email, setEmail] = useState('devotee@gmail.com');
  const [attendanceMode, setAttendanceMode] = useState<'IN_PERSON' | 'ONLINE_LIVE'>('IN_PERSON');

  // Error and Success handling
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<BookedPooja | null>(null);
  const [myBookings, setMyBookings] = useState<BookedPooja[]>([]);

  // Load pooja catalog and sync dynamically
  const loadCatalog = () => {
    const catalog = getPoojaCatalog();
    // Only display active sevas configured by temple admin
    setPoojas(catalog.filter((p) => p.isActive));
  };

  useEffect(() => {
    loadCatalog();
    window.addEventListener('pooja_catalog_updated', loadCatalog);
    return () => window.removeEventListener('pooja_catalog_updated', loadCatalog);
  }, []);

  // Load existing bookings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vasavi_devotee_pooja_bookings');
      if (saved) {
        setMyBookings(JSON.parse(saved));
      } else {
        const defaultBooking: BookedPooja = {
          id: 'bk-01',
          bookingRef: 'POOJA-2026-88192',
          poojaTitle: 'Sahasranama Kumkumarchana',
          date: '2026-09-12',
          slot: '10:30 AM',
          devoteeName: 'Radha Krishna',
          gotra: 'Kaundinya',
          nakshatra: 'Rohini',
          purpose: 'Family Health & Prosperity',
          mobile: '9123456789',
          email: 'devotee@gmail.com',
          mode: 'IN_PERSON',
          amount: 1001,
          status: 'CONFIRMED',
          reminderScheduledDate: '2026-09-11 (1 day prior at 09:00 AM)',
          bookedAt: '2026-09-01 11:30 AM',
        };
        setMyBookings([defaultBooking]);
        localStorage.setItem('vasavi_devotee_pooja_bookings', JSON.stringify([defaultBooking]));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Calendar Helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateInPast = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateBeyond2Months = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > maxBookingDate;
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Open booking modal for selected pooja
  const handleOpenBooking = (pooja: PoojaItem) => {
    setSelectedPooja(pooja);
    setValidationErrors([]);
    setSelectedSlot(pooja.availableSlots[0] || '');

    // Default select tomorrow's date
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    setCurrentMonth(tmrw.getMonth());
    setCurrentYear(tmrw.getFullYear());
    setSelectedDate(formatDateStr(tmrw.getFullYear(), tmrw.getMonth(), tmrw.getDate()));
  };

  // Comprehensive Form & Error Verification
  const handleConfirmBooking = () => {
    const errors: string[] = [];

    // 1. Date check & 2-Month Limit check
    if (!selectedDate) {
      errors.push('Please select a pooja execution date on the calendar.');
    } else {
      const parts = selectedDate.split('-');
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const d = parseInt(parts[2]);

      const blockCheck = isDateBlocked(selectedDate, selectedPooja?.id || 'ALL');
      if (blockCheck.blocked) {
        errors.push(`This date is blocked by Temple Management (${blockCheck.reason || 'Blackout Window'}). Tickets are not available.`);
      } else if (isDateInPast(y, m, d)) {
        errors.push('Selected date is in the past. Please choose a future auspicious date.');
      } else if (!isDateInApprovedRelease(selectedDate, selectedPooja?.id || 'ALL')) {
        const details = getMonthReleaseDetails(y, m, selectedPooja?.id || 'ALL');
        errors.push(details.message);
      }
    }

    // 2. Time slot check
    if (!selectedSlot) {
      errors.push('Please select an auspicious seva time slot.');
    }

    // 3. Devotee Name check
    if (!devoteeName.trim() || devoteeName.trim().length < 3) {
      errors.push('Please enter a valid Devotee / Yajamana Name (minimum 3 characters).');
    }

    // 4. Gotra check
    const effectiveGotra = gotra === 'Other Gotra' ? customGotra.trim() : gotra;
    if (!effectiveGotra) {
      errors.push('Please select or specify your Gotra for holy Sankalpam recitation.');
    }

    // 5. Mobile Phone check
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      errors.push('Please provide a valid 10-digit Indian Mobile Number for SMS / WhatsApp reminder.');
    }

    // 6. Email check
    if (!email || !email.includes('@') || !email.includes('.')) {
      errors.push('Please provide a valid Email Address for the official digital seva token.');
    }

    // 7. Purpose check
    if (!purpose.trim()) {
      errors.push('Please state the purpose or occasion of this sacred pooja.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      const modalEl = document.getElementById('pooja-booking-modal-body');
      if (modalEl) modalEl.scrollTop = 0;
      return;
    }

    // Calculate 1-Day Prior Auto Notification Date
    const sevaDateObj = new Date(selectedDate);
    const reminderDateObj = new Date(sevaDateObj);
    reminderDateObj.setDate(reminderDateObj.getDate() - 1);
    const reminderStr = `${reminderDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} (1 day prior at 09:00 AM)`;

    // Create Booking Object
    const newBooking: BookedPooja = {
      id: `bk-${Date.now()}`,
      bookingRef: `POOJA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      poojaTitle: selectedPooja!.title,
      date: selectedDate,
      slot: selectedSlot,
      devoteeName: devoteeName.trim(),
      gotra: effectiveGotra,
      nakshatra: nakshatra.trim() || 'Not Specified',
      purpose: purpose.trim(),
      mobile: cleanMobile,
      email: email.trim(),
      mode: attendanceMode,
      amount: selectedPooja!.price,
      status: 'CONFIRMED',
      reminderScheduledDate: reminderStr,
      bookedAt: new Date().toLocaleString('en-IN'),
    };

    // Save Booking
    const updatedBookings = [newBooking, ...myBookings];
    setMyBookings(updatedBookings);
    try {
      localStorage.setItem('vasavi_devotee_pooja_bookings', JSON.stringify(updatedBookings));

      // Auto-schedule notification in Devotee Notifications storage
      const existingNotifs = JSON.parse(localStorage.getItem('vasavi_devotee_notifications') || '[]');
      const autoNotif = {
        id: `notif-pooja-${Date.now()}`,
        title: `⏰ Auto-Reminder Scheduled: ${selectedPooja!.title}`,
        message: `Your sacred seva is scheduled for ${selectedDate} at ${selectedSlot}. You will receive an SMS & WhatsApp live darshan alert on ${reminderStr} (1 day prior).`,
        createdAt: 'Just now • Auto-Scheduled',
        isPoojaReminder: true,
        bookingRef: newBooking.bookingRef,
      };
      localStorage.setItem('vasavi_devotee_notifications', JSON.stringify([autoNotif, ...existingNotifs]));
    } catch {
      // Ignored
    }

    setValidationErrors([]);
    setConfirmedBooking(newBooking);
  };

  const formattedMaxDate = maxBookingDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarPoojaBookings')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarPoojaBookings')} & Sacred Seva Slots
          </h1>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
            Book specific dates &amp; auspicious time slots for temple sevas and poojas.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-stone-900/80 backdrop-blur-sm p-1 rounded-2xl border border-amber-400/40 shrink-0">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Pooja Catalog ({poojas.length})
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-bookings'
                ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> My Booked Poojas ({myBookings.length})
          </button>
        </div>
      </div>

      {/* RELEASED MONTH BOOKING POLICY BANNER WITH NEXT RELEASING SEVA */}
      {(() => {
        const latest = getLatestApprovedReleasedMonth('ALL');
        const nextRelease = getNextUpcomingSevaRelease();

        return (
          <div className="p-4 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-950/40 rounded-2xl border border-amber-400/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-amber-950 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-devotional-saffron shrink-0" />
                <span>
                  <strong>Booking Policy:</strong> Online bookings open up to <strong>{latest?.monthName || 'September 2026'}</strong>.
                </span>
              </div>

              {nextRelease && (
                <div className="flex items-center gap-1.5 pl-0 md:pl-3 md:border-l md:border-amber-300 dark:md:border-amber-800 text-amber-900 dark:text-amber-200">
                  <Bell className="w-3.5 h-3.5 text-devotional-saffron animate-pulse shrink-0" />
                  <span>
                    <strong>Next Releasing Seva:</strong> <strong className="text-devotional-maroon dark:text-amber-300">{nextRelease.sevaTitle}</strong> ({nextRelease.monthName}) on <strong>{nextRelease.releaseDate} at {nextRelease.releaseTime}</strong>.
                  </span>
                </div>
              )}
            </div>

            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-300 shrink-0">
              1-Day Prior Auto-Alert Active
            </span>
          </div>
        );
      })()}

      {/* TAB 1: POOJA SERVICES CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-devotional-saffron" />
              Available Sacred Sevas & Daily Poojas
            </h2>
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-devotional-saffron" /> Sri Vasavi Matha Devasthanam, Penugonda
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poojas.map((pooja) => (
              <div
                key={pooja.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 flex flex-col justify-between overflow-hidden group"
              >
                <div className={`p-6 bg-gradient-to-r ${pooja.bannerGradient} text-white space-y-2 relative`}>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                    {pooja.deity}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-amber-200 group-hover:text-amber-100 transition-colors">
                    {pooja.title}
                  </h3>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-amber-200/80 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Duration: {pooja.duration}
                    </span>
                    <span className="font-serif font-bold text-2xl text-amber-300">
                      ₹{pooja.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pooja.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Divine Blessings & Inclusions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pooja.benefits.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 text-[10px] font-semibold rounded-lg border border-amber-200 dark:border-amber-900/50"
                        >
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => handleOpenBooking(pooja)}
                      className="w-full py-3 bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-amber-300 font-serif font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md hover:brightness-110 hover:ring-2 hover:ring-amber-400/40 transition-all border border-amber-400/40"
                    >
                      <CalendarIcon className="w-4 h-4 text-devotional-saffron" />
                      Select Date &amp; Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKED POOJAS */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-devotional-saffron" />
              My Scheduled Pooja Bookings
            </h2>
            <span className="text-xs text-stone-500 font-semibold">
              {myBookings.length} Active Confirmed Sevas
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 p-12 text-center rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 space-y-3">
              <Sparkles className="w-10 h-10 text-devotional-saffron mx-auto animate-bounce" />
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                No Pooja Bookings Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore our sacred pooja catalog to reserve auspicious dates with automated 1-day prior reminders.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 bg-devotional-maroon text-amber-300 font-bold text-xs rounded-xl shadow-md"
              >
                Browse Pooja Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4 hover:border-amber-400 transition-all"
                >
                  <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-devotional-maroon dark:text-amber-400">
                        {bk.bookingRef}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                        {bk.poojaTitle}
                      </h3>
                      <p className="text-xs text-stone-500">Sri Vasavi Kanyaka Parameswari Matha, Penugonda</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-300">
                      ✓ {bk.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Seva Date & Time</span>
                      <span className="font-bold text-devotional-maroon dark:text-amber-400 text-xs">
                        📅 {bk.date} at {bk.slot}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Sankalpam Yajamana</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                        {bk.devoteeName} ({bk.gotra})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Nakshatra</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300 text-xs">{bk.nakshatra}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Attendance Mode</span>
                      <span className="font-bold text-emerald-600 text-xs">
                        {bk.mode === 'IN_PERSON' ? '🛕 In-Person Sanctum' : '📱 Live E-Pooja Stream'}
                      </span>
                    </div>
                  </div>

                  {/* 1-Day Prior Auto Notification Banner */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-900/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-900 text-devotional-maroon dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-devotional-saffron animate-pulse" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-amber-950 dark:text-amber-300 block text-[11px]">
                        🔔 Auto-Reminder Active (1 Day Prior)
                      </span>
                      <p className="text-[10px] text-amber-800 dark:text-amber-400">
                        Alert scheduled on <span className="font-bold">{bk.reminderScheduledDate}</span> via SMS, WhatsApp & App Notification.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      Offering: ₹{bk.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setConfirmedBooking(bk)}
                      className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-colors"
                    >
                      View Booking Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE CALENDAR & SLOT BOOKING MODAL WITH 2-MONTH LIMIT */}
      {selectedPooja && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-4xl rounded-3xl shadow-2xl border-2 border-devotional-gold my-auto relative flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Pinned Modal Header */}
            <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 p-6 sm:px-8 pb-4 shrink-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md">
              <div>
                <span className="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-saffron text-[10px] font-bold uppercase border border-amber-300">
                  {selectedPooja.deity}
                </span>
                <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-1">
                  Book {selectedPooja.title}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Select your date (within 2 months) &amp; time slot with automated 1-day prior reminder
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPooja(null);
                  setValidationErrors([]);
                }}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div
              id="pooja-booking-modal-body"
              className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-amber-600/50 scrollbar-track-transparent"
            >
              {/* Validation Error Alert Banner */}
            {validationErrors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/60 border-2 border-red-400 rounded-2xl space-y-2 text-xs animate-shake">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Please correct the following errors before proceeding:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400 font-medium pl-2">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN: INTERACTIVE VISUAL CALENDAR & SLOTS */}
              <div className="space-y-5">
                <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-3xl border border-amber-400/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-devotional-saffron" /> Select Auspicious Date
                      </h3>
                      {(() => {
                        const latest = getLatestApprovedReleasedMonth(selectedPooja?.id || 'ALL');
                        return (
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                            Online Bookings Open Until: {latest ? latest.monthName : 'September 2026'}
                          </p>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevMonth}
                        aria-label="Previous Month"
                        className="p-1.5 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 border border-stone-200 dark:border-stone-700"
                      >
                        <ChevronLeft className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                      </button>
                      <span className="text-xs font-bold text-devotional-maroon dark:text-amber-400">
                        {monthNames[currentMonth]} {currentYear}
                      </span>
                      <button
                        onClick={handleNextMonth}
                        aria-label="Next Month"
                        className="p-1.5 rounded-lg bg-white dark:bg-stone-800 hover:bg-amber-100 border border-stone-200 dark:border-stone-700"
                      >
                        <ChevronRight className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Accurate Month Status Notice Banner */}
                  {(() => {
                    const details = getMonthReleaseDetails(currentYear, currentMonth, selectedPooja?.id || 'ALL');
                    const latest = getLatestApprovedReleasedMonth(selectedPooja?.id || 'ALL');

                    if (details.state === 'APPROVED_SCHEDULED') {
                      return (
                        <div className="p-2.5 bg-amber-100 dark:bg-amber-950/70 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-devotional-saffron animate-pulse shrink-0" />
                          <span>
                            <strong>Scheduled Release:</strong> {details.message}
                          </span>
                        </div>
                      );
                    }

                    if (details.state === 'PENDING_APPROVAL') {
                      return (
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-devotional-saffron shrink-0" />
                          <span>
                            <strong>Under Review:</strong> {details.message}
                          </span>
                        </div>
                      );
                    }

                    if (details.state === 'NOT_REQUESTED') {
                      return (
                        <div className="p-2.5 bg-stone-100 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span>
                            <strong>Notice:</strong> Bookings are currently open until <strong>{latest?.monthName || 'September 2026'}</strong>. Bookings for {monthNames[currentMonth]} {currentYear} have not been released yet by Temple Management.
                          </span>
                        </div>
                      );
                    }

                    if (details.state === 'APPROVED_LIVE') {
                      return (
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Active:</strong> Online bookings are currently open up to <strong>{latest?.monthName || monthNames[currentMonth] + ' ' + currentYear}</strong>.
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })()}

                  {/* Day of week headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-500 uppercase">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid with Whole Month Release Enforcement */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = formatDateStr(currentYear, currentMonth, day);
                      const isPast = isDateInPast(currentYear, currentMonth, day);
                      const blockInfo = isDateBlocked(dateStr, selectedPooja?.id || 'ALL');
                      const isBlocked = blockInfo.blocked;
                      const isUnreleased = !isPast && !isBlocked && !isDateInApprovedRelease(dateStr, selectedPooja?.id || 'ALL');
                      const isDisabled = isPast || isBlocked || isUnreleased;
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={day}
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(dateStr)}
                          title={
                            isBlocked
                              ? `🚫 Blocked by Temple: ${blockInfo.reason} (${blockInfo.timeWindow})`
                              : isPast
                              ? 'Past Date (Cannot book)'
                              : isUnreleased
                              ? 'Month not yet released by Temple & Super Admin'
                              : 'Click to select auspicious seva date'
                          }
                          className={`p-2 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center h-10 ${
                            isBlocked
                              ? 'text-red-400 bg-red-100/50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 cursor-not-allowed line-through opacity-60'
                              : isPast
                              ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed line-through'
                              : isUnreleased
                              ? 'text-stone-400 dark:text-stone-600 bg-stone-100/40 dark:bg-stone-900/40 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 shadow-md ring-2 ring-amber-400'
                              : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <span>{day}</span>
                          {isBlocked ? (
                            <span className="text-[8px] font-bold text-red-500">🚫</span>
                          ) : isUnreleased ? (
                            <Lock className="w-2.5 h-2.5 text-stone-400 mt-0.5" />
                          ) : null}
                          {!isDisabled && (day % 7 === 5 || day % 11 === 0) && (
                            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && (
                    <div className="p-3 bg-amber-100/60 dark:bg-amber-950/60 rounded-xl border border-amber-300 text-xs flex items-center justify-between">
                      <span className="font-bold text-amber-950 dark:text-amber-300">
                        Selected Date: {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded font-bold text-emerald-900 dark:text-emerald-200">
                        ✓ Month Released &amp; Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Seva Time Slots for Selected Date */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-devotional-saffron" /> Choose Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPooja.availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                            isSelected
                              ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300">
                            Available
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Attendance Mode */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Pooja Attendance Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAttendanceMode('IN_PERSON')}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all text-left space-y-1 border ${
                        attendanceMode === 'IN_PERSON'
                          ? 'bg-amber-50 dark:bg-stone-800 border-devotional-maroon dark:border-amber-400 ring-1 ring-amber-400'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-devotional-maroon dark:text-amber-400 font-bold">
                        <Building2 className="w-4 h-4" /> In-Person Sanctum
                      </div>
                      <p className="text-[10px] text-stone-500">Attend physically at Penugonda Temple</p>
                    </button>

                    <button
                      onClick={() => setAttendanceMode('ONLINE_LIVE')}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all text-left space-y-1 border ${
                        attendanceMode === 'ONLINE_LIVE'
                          ? 'bg-amber-50 dark:bg-stone-800 border-devotional-maroon dark:border-amber-400 ring-1 ring-amber-400'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-devotional-maroon dark:text-amber-400 font-bold">
                        <Tv className="w-4 h-4" /> Live E-Pooja Stream
                      </div>
                      <p className="text-[10px] text-stone-500">Online live stream & Prasadam via post</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DEVOTEE SANKALPAM DETAILS & ERROR VALIDATION */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-devotional-saffron" /> Devotee Sankalpam Particulars
                </h3>

                {/* Devotee / Yajamana Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                    Yajamana / Devotee Full Name *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="Enter full name for Sankalpam"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                {/* Gotra & Nakshatra Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DevotionalSelect
                    label="Gotra"
                    required
                    value={gotra}
                    onChange={setGotra}
                    placeholder="Select Devotional Gotra"
                    searchPlaceholder="Search Gotras..."
                    footerText="Vedic Gotra Lineages"
                    showBadge={true}
                    showSparkle={true}
                    options={POPULAR_GOTRAS.map((g) => ({
                      value: g,
                      label: g,
                      badge: g.charAt(0).toUpperCase(),
                    }))}
                  />

                  <NakshatraSelect
                    label="Janma Nakshatra"
                    value={nakshatra}
                    onChange={setNakshatra}
                    placeholder="Select Nakshatra (Optional)"
                    searchPlaceholder="Search 27 Nakshatras..."
                    footerText="27 Vedic Janma Nakshatras"
                    allowClear={true}
                  />
                </div>

                {gotra === 'Other Gotra' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                      Enter Custom Gotra Name *
                    </label>
                    <input
                      type="text"
                      value={customGotra}
                      onChange={(e) => setCustomGotra(e.target.value)}
                      placeholder="e.g. Shandilya, Parashara..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                )}

                {/* Sankalpam Purpose */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                    Pooja Purpose / Occasion *
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Birthday, Wedding Anniversary, Health & Prosperity"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                {/* Contact Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                      Mobile for 1-Day Alert *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase">
                      Email for Seva Pass *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="devotee@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* 1-Day Prior Automated Reminder Feature Guarantee */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-devotional-maroon dark:text-amber-400 font-bold">
                    <Bell className="w-4 h-4 text-devotional-saffron animate-bounce" />
                    <span>Automated 1-Day Prior Seva Reminder</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    Our system will automatically trigger a personalized SMS, WhatsApp message & in-app reminder <strong>24 hours prior</strong> to your booked pooja with priest details and live darshan link.
                  </p>
                </div>

                {/* Price & Submit Action */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Seva Offering</span>
                    <span className="font-serif font-bold text-2xl text-devotional-maroon dark:text-amber-400">
                      ₹{selectedPooja.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="px-6 py-3.5 bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-amber-950 text-amber-300 font-serif font-bold text-sm rounded-2xl flex items-center gap-2 shadow-lg hover:brightness-110 hover:ring-2 hover:ring-amber-400 transition-all border border-amber-400/40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Confirm & Schedule Seva
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* BOOKING CONFIRMATION & 1-DAY PRIOR ALERT SUCCESS MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-scale-up">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-6 border-4 border-devotional-gold relative">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                ॥ శ్రీరస్తు - శుభమస్తు - దివ్య ప్రసాద ప్రాప్తిరస్తు ॥
              </span>
              <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                Pooja Slot Confirmed Successfully!
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Official Booking Reference: <strong className="font-mono text-devotional-maroon dark:text-amber-400">{confirmedBooking.bookingRef}</strong>
              </p>
            </div>

            <div className="p-5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-amber-400/40 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                <span className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
                  {confirmedBooking.poojaTitle}
                </span>
                <span className="font-bold text-emerald-600">
                  ₹{confirmedBooking.amount.toLocaleString('en-IN')} (Paid)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Scheduled Seva Date</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    📅 {confirmedBooking.date} ({confirmedBooking.slot})
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Yajamana & Gotra</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {confirmedBooking.devoteeName} ({confirmedBooking.gotra})
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Janma Nakshatra</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{confirmedBooking.nakshatra}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Attendance Mode</span>
                  <span className="font-bold text-emerald-600 text-xs">
                    {confirmedBooking.mode === 'IN_PERSON' ? '🛕 In-Person Sanctum' : '📱 Live E-Pooja Stream'}
                  </span>
                </div>
              </div>
            </div>

            {/* AUTOMATED 1-DAY PRIOR REMINDER HIGHLIGHT */}
            <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-stone-950 dark:via-amber-950/40 dark:to-stone-950 rounded-2xl border-2 border-amber-400 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-devotional-maroon dark:text-amber-300 font-bold">
                <Bell className="w-5 h-5 text-devotional-saffron animate-pulse" />
                <span>Automated 1-Day Prior Alert Scheduled</span>
              </div>
              <p className="text-[11px] text-stone-700 dark:text-stone-300">
                You will automatically receive an SMS alert, WhatsApp Seva Pass, and app notification on:
              </p>
              <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl font-bold text-xs text-devotional-maroon dark:text-amber-400 border border-amber-300 flex items-center justify-between">
                <span>⏰ {confirmedBooking.reminderScheduledDate}</span>
                <span className="text-[10px] text-emerald-600 font-mono">Status: ACTIVE QUEUE</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Booking Pass
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    setSelectedPooja(null);
                    setActiveTab('my-bookings');
                  }}
                  className="px-6 py-2.5 bg-devotional-maroon text-amber-300 font-serif font-bold text-xs rounded-xl hover:brightness-110 shadow-md"
                >
                  View in My Booked Poojas →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
