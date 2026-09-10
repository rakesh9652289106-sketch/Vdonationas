'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Repeat,
  Landmark,
  Utensils,
  BookOpen,
  HeartPulse,
  Flower2,
  Check,
} from 'lucide-react';
import VasaviGoddess3DCanvas from '@/components/3d/VasaviGoddess3DCanvas';
import {
  IconSacredDonateFAB,
  IconSacredDiya,
  IconPalmleafScroll,
  IconDevoteeMedal,
  IconAnnadanamPot,
  IconDevotionalCoin,
  IconTempleMatha,
  IconSacredPushpa,
  IconPoojaAarti,
  IconVidyaScroll,
  IconArogyaHealing,
  IconSevaSupport,
} from '@/components/icons/DevotionalIcons';
import { MOCK_USERS, MOCK_CAMPAIGNS, MOCK_DONATIONS } from '@/lib/mock-data';
import { INITIAL_INITIATIVES, INITIATIVE_TYPE_LABELS } from '@/lib/initiatives-data';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';

export default function MobileHomeScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const devoteeFullName = user?.fullName || (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || 'Devotee' : 'Devotee');
  const devoteeFirstName = devoteeFullName.split(' ')[0] || 'Devotee';
  const devoteeInitial = devoteeFullName.charAt(0) || '🪔';
  const devoteeGotram = user?.gotram || (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_gotram') || '' : '');
  const [quickAmount, setQuickAmount] = useState(102);
  const [monthlyAmount, setMonthlyAmount] = useState(102);

  const sevasList = [
    {
      id: 'annadanam',
      iconComponent: IconAnnadanamPot,
      name: 'Annadanam',
      desc: 'Daily wholesome meals to pilgrims',
      amount: 1001,
      tag: 'Most Popular',
    },
    {
      id: 'pushpa',
      iconComponent: IconSacredPushpa,
      name: 'Pushpa',
      desc: 'Fresh fragrant floral garlands',
      amount: 501,
      tag: 'Sacred',
    },
    {
      id: 'pooja',
      iconComponent: IconPoojaAarti,
      name: 'Pooja',
      desc: 'Special Kumkumarchana & Sankalpam',
      amount: 1001,
      tag: 'Daily',
    },
    {
      id: 'development',
      iconComponent: IconTempleMatha,
      name: 'Development',
      desc: 'Matha renovation & Gopuram gilding',
      amount: 5001,
      tag: 'Heritage',
    },
    {
      id: 'education',
      iconComponent: IconVidyaScroll,
      name: 'Education',
      desc: 'Scholarships for deserving students',
      amount: 2501,
      tag: 'Community',
    },
    {
      id: 'welfare',
      iconComponent: IconArogyaHealing,
      name: 'Welfare',
      desc: 'Free medical camps & senior care',
      amount: 1001,
      tag: 'Compassion',
    },
  ];

  return (
    <div className="space-y-4 pb-6 text-stone-900 dark:text-stone-100 font-sans">
      {/* 1. SACRED GODDESS MOBILE HERO (SECOND IMAGE - FIRST VISIBLE TO DEVOTEES) */}
      <section className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-3xl bg-stone-950 text-white border-2 border-devotional-gold/70 shadow-2xl space-y-3">
          {/* Main Mobile Sacred Image Container */}
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-900">
            <img
              src="/welcome/welcome-mobile.jpg"
              alt="Sri Vasavi Kanyaka Parameswari Ammavaru"
              className="w-full h-full object-cover object-[center_20%] brightness-[0.92] contrast-[1.05]"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/60 pointer-events-none" />

            {/* Sacred Badges */}
            <div className="absolute top-3 left-3 flex items-center pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-gold">
                <Sparkles className="w-3 h-3 text-amber-400" /> Penugonda Matha
              </span>
            </div>

            {/* Bottom Inscription on Image */}
            <div className="absolute bottom-3 left-3 right-3 text-center space-y-1">
              <h1 className="text-xl font-serif font-bold text-gold-gradient tracking-tight drop-shadow-lg">
                శ్రీ వాసవీ కన్యకా పరమేశ్వరి మాతా
              </h1>
              <p className="text-xs font-serif text-amber-100/90 italic drop-shadow-md">
                Sri Vasavi Kanyaka Parameswari Matha • Penugonda
              </p>
            </div>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="p-3 pt-0">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/darshan"
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 border border-emerald-400/40 active-press"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live Darshan</span>
              </Link>
              <Link
                href="/donate/recurring"
                className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-serif font-semibold text-xs flex items-center justify-center gap-1.5 active-press"
              >
                <Repeat className="w-3.5 h-3.5 text-amber-400" />
                <span>Monthly AutoPay</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEVOTEE GREETING SECTION */}
      <section className="px-4">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-300">
                Namaste, {devoteeFirstName} 🙏
              </h2>
              {devoteeGotram && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60">
                  {devoteeGotram}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
              May Sri Vasavi Kanyaka Parameswari bless you and your family.
            </p>
          </div>
          <Link href="/devotee/profile" className="shrink-0 ml-3 active-press">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-devotional-maroon to-devotional-saffron text-amber-200 flex items-center justify-center font-bold text-sm border-2 border-devotional-gold/70 shadow-sm">
              {devoteeInitial}
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FAST DONATE SECTION */}
      <section className="px-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Quick Devotional Offering
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
              80G Tax-Exempt
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[102, 516, 1116, 2116, 5116, 10116].map((amt) => {
              const isSelected = quickAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setQuickAmount(amt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all active-press flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-devotional-maroon/30 text-devotional-maroon dark:text-amber-300 border-devotional-gold shadow-xs ring-2 ring-devotional-gold/40'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <IconDevotionalCoin size={14} />
                  <span>₹{amt.toLocaleString('en-IN')}</span>
                </button>
              );
            })}
          </div>

          <Link
            href={`/donate?amount=${quickAmount}`}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-200 font-bold text-xs flex items-center justify-center gap-2 active-press shadow-xs hover:brightness-110 transition-colors"
          >
            <span>Donate ₹{quickAmount.toLocaleString('en-IN')}</span>
          </Link>
        </div>
      </section>

      {/* 5. QUICK ACTIONS (2x2 Grid with Realistic Devotional Icons) */}
      <section className="px-4">
        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 px-1">
          Quick Shortcuts
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/donate"
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/30 dark:border-stone-800 shadow-xs flex items-center gap-3 active-press hover:border-devotional-gold/60 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-devotional-maroon to-devotional-maroon-dark p-1 flex items-center justify-center shadow-sm border border-amber-400/40 shrink-0">
              <IconSacredDonateFAB size={28} />
            </div>
            <div>
              <p className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">Donate</p>
              <p className="text-[10px] text-stone-500">General & Sevas</p>
            </div>
          </Link>

          <Link
            href="/devotee/poojas"
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/30 dark:border-stone-800 shadow-xs flex items-center gap-3 active-press hover:border-devotional-gold/60 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-1 flex items-center justify-center shadow-sm border border-amber-300/40 shrink-0">
              <IconSacredDiya size={26} active={true} />
            </div>
            <div>
              <p className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">Seva</p>
              <p className="text-[10px] text-stone-500">Book Slots</p>
            </div>
          </Link>

          <Link
            href="/devotee/donations"
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/30 dark:border-stone-800 shadow-xs flex items-center gap-3 active-press hover:border-devotional-gold/60 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-50 to-amber-100 dark:from-stone-800 dark:to-stone-750 p-1 flex items-center justify-center shadow-sm border border-devotional-gold/40 shrink-0">
              <IconPalmleafScroll size={26} />
            </div>
            <div>
              <p className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">History</p>
              <p className="text-[10px] text-stone-500">80G Receipts</p>
            </div>
          </Link>

          <Link
            href="/devotee/rewards"
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-devotional-gold/30 dark:border-stone-800 shadow-xs flex items-center gap-3 active-press hover:border-devotional-gold/60 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-stone-800 dark:to-stone-750 p-1 flex items-center justify-center shadow-sm border border-amber-400/60 shrink-0">
              <IconDevoteeMedal size={26} />
            </div>
            <div>
              <p className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">Rewards</p>
              <p className="text-[10px] text-stone-500">3D Medals</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. MONTHLY SEVA (AUTOPAY) */}
      <section className="px-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-devotional-cream via-amber-50/70 to-stone-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-850 border-2 border-devotional-gold/40 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <IconAnnadanamPot size={26} />
                <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-300">
                  Monthly Seva
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Support the Matha every month
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-devotional-saffron/15 text-devotional-saffron text-[10px] font-bold uppercase">
              AutoPay
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[102, 516, 1116, 2116, 5116, 10116].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setMonthlyAmount(amt)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all active-press ${
                  monthlyAmount === amt
                    ? 'bg-devotional-maroon text-amber-200 border-amber-400 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}/mo
              </button>
            ))}
          </div>

          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            Automated recurring seva via UPI AutoPay & e-Mandate. You can pause or cancel anytime with one tap.
          </p>

          <Link
            href={`/donate/recurring?amount=${monthlyAmount}`}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-serif font-bold text-xs flex items-center justify-center gap-1 active-press shadow-xs hover:brightness-105 transition-all"
          >
            <span>Activate</span>
          </Link>
        </div>
      </section>

      {/* 7. CAMPAIGNS (Horizontal Swipe Cards) */}
      <section className="space-y-2">
        <div className="px-4 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
            Sacred Campaigns
          </h3>
          <Link href="/campaigns" className="text-[11px] text-devotional-saffron font-bold">
            View
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x">
          {MOCK_CAMPAIGNS.map((c) => {
            const pct = Math.round((c.currentRaised / c.goalAmount) * 100);
            return (
              <div
                key={c.id}
                className="w-64 shrink-0 snap-start p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 font-bold uppercase">
                    Penugonda Shrine
                  </span>
                  <h4 className="font-serif font-bold text-xs line-clamp-1">{c.title}</h4>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-devotional-maroon dark:text-amber-400">
                      ₹{(c.currentRaised / 100000).toFixed(1)}L / ₹{(c.goalAmount / 100000).toFixed(1)}L
                    </span>
                    <span className="text-stone-500 font-mono">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-devotional-saffron to-devotional-gold"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/donate?campaignId=${c.id}`}
                  className="w-full py-2 rounded-xl border border-devotional-gold/60 text-devotional-maroon dark:text-amber-300 font-bold text-[11px] text-center active-press hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Donate
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7B. SACRED INITIATIVES (Horizontal 3D Swipeable Cards) */}
      <section className="space-y-2">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
              Sacred Initiatives & Dharma Projects
            </h3>
            <span className="text-[10px] bg-amber-400/20 text-devotional-saffron font-bold px-1.5 py-0.2 rounded">
              80G
            </span>
          </div>
          <Link href="/initiatives" className="text-[11px] text-devotional-saffron font-bold">
            View
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x">
          {INITIAL_INITIATIVES.slice(0, 4).map((ini) => {
            const pct = Math.min(Math.round((ini.current_raised / ini.target_amount) * 100), 100);
            const typeConf = INITIATIVE_TYPE_LABELS[ini.initiative_type] || INITIATIVE_TYPE_LABELS.OTHER;

            return (
              <div
                key={ini.code}
                className="w-72 shrink-0 snap-start rounded-3xl bg-white dark:bg-stone-900 border border-devotional-gold/40 shadow-md space-y-2.5 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Banner */}
                <div className="relative h-32 w-full bg-stone-950 overflow-hidden">
                  <img
                    src={ini.cover_image}
                    alt={ini.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-900/80 text-amber-300 border border-amber-400/40">
                      {typeConf.icon} {ini.custom_type || typeConf.label}
                    </span>
                    {ini.is_urgent && (
                      <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-1.5 right-2 font-mono text-[9px] text-amber-200/80 bg-stone-950/70 px-1.5 py-0.5 rounded">
                    {ini.code}
                  </span>
                </div>

                <div className="p-3 pt-0 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-xs line-clamp-1 text-stone-900 dark:text-stone-100">
                      {ini.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {ini.city}, {ini.state}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-devotional-maroon dark:text-amber-400 font-serif">
                        ₹{(ini.current_raised / 100000).toFixed(1)}L
                      </span>
                      <span className="text-stone-400">
                        ₹{(ini.target_amount / 100000).toFixed(1)}L ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-devotional-maroon via-devotional-gold to-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/initiatives/${ini.code}`}
                      className="py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[11px] text-center active-press"
                    >
                      View
                    </Link>
                    <Link
                      href={`/donate?initiativeId=${encodeURIComponent(ini.code)}&title=${encodeURIComponent(ini.title)}`}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white font-bold text-[11px] text-center active-press shadow-xs"
                    >
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. SEVAS (2-Column Grid) */}
      <section className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
            Devotional Sevas
          </h3>
          <Link href="/devotee/poojas" className="text-[11px] text-devotional-saffron font-bold">
            View
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {sevasList.map((s) => {
            const IconComponent = s.iconComponent;
            return (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 p-1.5 flex items-center justify-center border border-amber-300/40 shadow-xs shrink-0">
                      <IconComponent size={24} />
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider">
                      {s.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs">{s.name}</h4>
                    <p className="text-[10px] text-stone-500 leading-tight line-clamp-2 mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                  <span className="font-serif font-bold text-xs text-devotional-maroon dark:text-amber-400">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/donate?purpose=${encodeURIComponent(s.name)}&amount=${s.amount}`}
                    className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-200 font-bold text-[11px] active-press hover:brightness-110 transition-all shadow-xs"
                  >
                    Seva
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. IMPACT SECTION */}
      <section className="px-4 space-y-2.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="space-y-0.5 text-center">
            <span className="text-[10px] font-bold uppercase text-devotional-saffron tracking-wider">
              Sacred Contributions
            </span>
            <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
              Your Seva Creates Impact
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100/60 dark:bg-stone-700/60 flex items-center justify-center p-1">
                <IconAnnadanamPot size={22} />
              </div>
              <p className="font-bold font-serif text-sm text-devotional-maroon dark:text-amber-300">1,25,000+</p>
              <p className="text-[10px] text-stone-500">Meals Served</p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100/60 dark:bg-stone-700/60 flex items-center justify-center p-1">
                <IconTempleMatha size={22} />
              </div>
              <p className="font-bold font-serif text-sm text-devotional-maroon dark:text-amber-300">12 Shrines</p>
              <p className="text-[10px] text-stone-500">Temple Development</p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100/60 dark:bg-stone-700/60 flex items-center justify-center p-1">
                <IconVidyaScroll size={22} />
              </div>
              <p className="font-bold font-serif text-sm text-devotional-maroon dark:text-amber-300">450+ Youth</p>
              <p className="text-[10px] text-stone-500">Education Grants</p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-100/60 dark:bg-stone-700/60 flex items-center justify-center p-1">
                <IconArogyaHealing size={22} />
              </div>
              <p className="font-bold font-serif text-sm text-devotional-maroon dark:text-amber-300">1,800+</p>
              <p className="text-[10px] text-stone-500">Medical Welfare</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. RECENT ACTIVITY (Live Devotional Community Activity Feed) */}
      <section className="px-4 space-y-2">
        <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
          Recent Activity
        </h3>

        <div className="space-y-2">
          {MOCK_DONATIONS.slice(0, 3).map((d) => (
            <div
              key={d.id}
              className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-xs p-1">
                  <IconSevaSupport size={20} />
                </div>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
                    {d.donorName}
                  </p>
                  <p className="text-[10px] text-stone-500">{d.categoryName}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif font-bold text-devotional-maroon dark:text-amber-300">
                  ₹{d.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] text-stone-400">{d.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
