'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VasaviGoddess3DCanvas from '@/components/3d/VasaviGoddess3DCanvas';
import VasaviDonationCard3D from '@/components/3d/VasaviDonationCard3D';
import SevaCategoryCard3D from '@/components/3d/SevaCategoryCard3D';
import AryaVysyaHeritage3D from '@/components/3d/AryaVysyaHeritage3D';
import Medal3DCard from '@/components/3d/Medal3DCard';
import InteractiveTempleMap3D from '@/components/3d/InteractiveTempleMap3D';
import MedalDetailModal from '@/components/3d/MedalDetailModal';
import VasaviVirtualDarshanModal from '@/components/3d/VasaviVirtualDarshanModal';
import NavagrahaYantra3D from '@/components/3d/NavagrahaYantra3D';
import TempleGopuram3D from '@/components/3d/TempleGopuram3D';
import InteractiveAartiThali3D from '@/components/3d/InteractiveAartiThali3D';
import PanchangamCalculator from '@/components/devotional/PanchangamCalculator';
import MobileHomeScreen from '@/components/mobile/MobileHomeScreen';
import { MEDAL_TIERS, MedalTier } from '@/lib/medals';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  Heart,
  Sparkles,
  Flame,
  Award,
  Flower2,
  Sun,
  BellRing,
  Video,
  Repeat,
  Compass,
  Landmark,
  Orbit,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const [selectedMedal, setSelectedMedal] = useState<MedalTier | null>(null);
  const [showVirtualDarshan, setShowVirtualDarshan] = useState(false);

  const sevaCategories = [
    {
      icon: '🪔',
      title: t('catAnnadanamTitle'),
      subtitle: t('catAnnadanamSubtitle'),
      desc: t('catAnnadanamDesc'),
      amount: '₹1,001',
    },
    {
      icon: '🌺',
      title: t('catPushpaTitle'),
      subtitle: t('catPushpaSubtitle'),
      desc: t('catPushpaDesc'),
      amount: '₹501',
    },
    {
      icon: '🛕',
      title: t('catMathaTitle'),
      subtitle: t('catMathaSubtitle'),
      desc: t('catMathaDesc'),
      amount: '₹5,001',
    },
    {
      icon: '📿',
      title: t('catPoojaTitle'),
      subtitle: t('catPoojaSubtitle'),
      desc: t('catPoojaDesc'),
      amount: '₹1,001',
    },
    {
      icon: '🏛️',
      title: t('catCommunityTitle'),
      subtitle: t('catCommunitySubtitle'),
      desc: t('catCommunityDesc'),
      amount: '₹10,001',
    },
    {
      icon: '📚',
      title: t('catEducationTitle'),
      subtitle: t('catEducationSubtitle'),
      desc: t('catEducationDesc'),
      amount: '₹2,501',
    },
    {
      icon: '🏥',
      title: t('catSocialTitle'),
      subtitle: t('catSocialSubtitle'),
      desc: t('catSocialDesc'),
      amount: '₹5,001',
    },
  ];

  const handleRingTempleBell = () => {
    showAlert({
      type: 'info',
      title: 'Sacred Temple Bell Ringing',
      message: '🔔 Om Sri Vasavi Kanyaka Parameswaryai Namaha! May the divine temple bell resonance bless your family with peace and abundance.',
    });
  };

  return (
    <>
      {/* NATIVE MOBILE APP HOME VIEW (< md) */}
      <div className="md:hidden">
        <MobileHomeScreen />
      </div>

      {/* DESKTOP FULL HOME EXPERIENCE (>= md) */}
      <div className="hidden md:block space-y-16 pb-16 bg-[#FAF7F2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
        {/* PANCHANGAM TICKER BANNER */}
        <div className="bg-amber-100 dark:bg-stone-900 border-b border-amber-300 dark:border-stone-800 text-xs py-2 px-4 text-center text-amber-900 dark:text-amber-300 font-medium flex items-center justify-center gap-3 overflow-x-auto">
        <span className="font-bold flex items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-devotional-saffron" /> TODAY'S SACRED PANCHANGAM:
        </span>
        <span>Shravana Masa • Ekadashi Tithi • Abhijit Muhurtham (11:45 AM - 12:35 PM)</span>
        <button
          onClick={handleRingTempleBell}
          className="px-2.5 py-0.5 rounded-full bg-devotional-maroon text-amber-300 font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-devotional-maroon-dark transition-colors shadow-sm"
        >
          <BellRing className="w-3 h-3" /> Ring Temple Bell
        </button>
      </div>

      {/* 1. CINEMATIC 3D GODDESS HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-devotional-maroon-dark to-stone-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-devotional-gold shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-devotional-saffron/20 text-amber-300 font-bold text-xs uppercase tracking-widest border border-amber-400/40 shadow-sm">
              <Flame className="w-4 h-4 text-devotional-saffron animate-pulse" /> {t('heroBadge')}
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gold-gradient tracking-tight leading-tight drop-shadow-lg">
                {t('heroTitle')}
              </h1>
              <p className="text-xl sm:text-2xl font-serif text-amber-100/90 font-medium italic">
                Seva • Dharma • Community • Devotion
              </p>
            </div>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <Link
                href="#donate-section"
                className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold-lg hover:scale-105 transition-transform flex items-center gap-2 border border-amber-300"
              >
                <Heart className="w-4 h-4 fill-current text-devotional-maroon" /> {t('heroCtaDonate')}
              </Link>
              <Link
                href="/darshan"
                className="px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold text-xs shadow-md transition-colors flex items-center gap-2 border border-emerald-400/60 hover:scale-105 transition-transform"
              >
                <Video className="w-4 h-4 text-emerald-300" /> 📹 Live 3D Virtual Darshan Portal
              </Link>
              <Link
                href="/donate/recurring"
                className="px-5 py-3.5 rounded-2xl bg-stone-900/90 text-amber-300 border border-devotional-gold/60 font-serif font-bold text-xs hover:bg-stone-900 transition-colors flex items-center gap-2"
              >
                <Repeat className="w-4 h-4" /> {t('heroCtaAutopay')}
              </Link>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-400/20 text-center lg:text-left">
              <div>
                <span className="text-2xl font-bold font-serif text-amber-300 block">₹4.8 Cr+</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  {t('heroStatsAmount')}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-serif text-amber-300 block">100%</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  {t('heroStatsTrust')}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold font-serif text-amber-300 block">1.2L+</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  {t('heroStatsDevotees')}
                </span>
              </div>
            </div>
          </div>

          {/* Right WebGL 3D Goddess Presentation Canvas */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-lg aspect-square bg-gradient-to-b from-stone-950 via-devotional-maroon-dark to-stone-950 rounded-3xl p-1 border-4 border-amber-400/80 shadow-[0_25px_90px_rgba(212,175,55,0.4)] relative overflow-hidden diya-glow-pulse">
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-gold">
                <Sparkles className="w-3 h-3 text-amber-400" /> {t('heroBadge')}
              </div>

              <VasaviGoddess3DCanvas className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. RAISED 3D GOLD DONATION CARD EXPERIENCE */}
      <section id="donate-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-devotional-saffron animate-pulse" /> {t('sevaHeaderBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            {t('sevaHeaderTitle')}
          </h2>
        </div>

        <VasaviDonationCard3D />
      </section>

      {/* 2.5 SMART DAILY PANCHANGAM & MUHURTHAM CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PanchangamCalculator />
      </section>

      {/* 3. 7 PREMIUM 3D PERSPECTIVE SEVA CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Flower2 className="w-4 h-4" /> {t('sacredSevaHeader')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            {t('chooseDevotionalService')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sevaCategories.map((cat, idx) => (
            <SevaCategoryCard3D
              key={idx}
              icon={cat.icon}
              title={cat.title}
              subtitle={cat.subtitle}
              desc={cat.desc}
              amount={cat.amount}
              onSelect={() => {
                const el = document.getElementById('donate-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. 3D INTERACTIVE NAVAGRAHA PLANETARY CHAKRA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavagrahaYantra3D />
      </section>

      {/* 5. 3D TEMPLE GOPURAM ARCHITECTURE EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TempleGopuram3D />
      </section>

      {/* 6. ARYA VYSYA HERITAGE 3D EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AryaVysyaHeritage3D />
      </section>

      {/* 7. 3D DEVOTEE MEDAL SYSTEM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 text-devotional-saffron text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" /> SACRED SEVA MILESTONES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            3D Devotee Medal & Achievement System
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MEDAL_TIERS.map((tier) => (
            <Medal3DCard
              key={tier.id}
              tier={tier}
              isUnlocked={true}
              userTotalDonated={25000}
              onClick={() => setSelectedMedal(tier)}
            />
          ))}
        </div>
      </section>

      {/* 8. INTERACTIVE 3D TEMPLE NETWORK MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveTempleMap3D />
      </section>

      {/* Mobile Native In-App Bottom Card */}
      <div className="md:hidden px-4 pt-4 pb-2 text-center">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-devotional-maroon dark:text-amber-400">
            <span>🛕</span>
            <span>Sri Vasavi Kanyaka Parameswari Matha</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            Penugonda Devasthanam • 80G Tax-Exempt Digital Seva Platform
          </p>
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-3 text-[10px] text-stone-400">
            <span>Official Mobile App</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
      </div>

      {/* Modal Dialogs */}
      {selectedMedal && (
        <MedalDetailModal
          tier={selectedMedal}
          isUnlocked={true}
          userTotalDonated={25000}
          donationCount={12}
          templesCount={1}
          onClose={() => setSelectedMedal(null)}
        />
      )}

      {showVirtualDarshan && (
        <VasaviVirtualDarshanModal onClose={() => setShowVirtualDarshan(false)} />
      )}
    </>
  );
}
