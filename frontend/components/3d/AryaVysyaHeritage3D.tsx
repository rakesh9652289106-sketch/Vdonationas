'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function AryaVysyaHeritage3D() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const timelineSteps = [
    {
      title: t('heritageCard1Title'),
      subtitle: t('heritageBadge'),
      description: t('heritageCard1Desc'),
      icon: '🌺',
    },
    {
      title: t('heritageCard2Title'),
      subtitle: t('templeName'),
      description: t('heritageCard2Desc'),
      icon: '🏛️',
    },
    {
      title: t('heritageCard3Title'),
      subtitle: t('heritageBadge'),
      description: t('heritageCard3Desc'),
      icon: '🪔',
    },
    {
      title: t('catAnnadanamTitle'),
      subtitle: t('catAnnadanamSubtitle'),
      description: t('catAnnadanamDesc'),
      icon: '🍚',
    },
    {
      title: t('catSocialTitle'),
      subtitle: t('catSocialSubtitle'),
      description: t('catSocialDesc'),
      icon: '✨',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-stone-950 via-devotional-maroon-dark to-stone-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-devotional-gold/60 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Ambient Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
          <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('heritageBadge')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300">
          {t('heritageTitle')}
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm">
          {t('heritageDesc')}
        </p>
      </div>

      {/* 3D Timeline Steps Bar */}
      <div className="relative z-10 flex overflow-x-auto pb-4 gap-3 no-scrollbar">
        {timelineSteps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 min-w-[200px] p-4 rounded-2xl border text-left transition-all transform ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-gold scale-105 font-bold -translate-y-1 ring-2 ring-amber-300'
                  : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:border-amber-400/60'
              }`}
            >
              <div className="flex items-center justify-between text-xl mb-1">
                <span>{step.icon}</span>
                <span className="text-[10px] font-mono font-bold">STEP 0{idx + 1}</span>
              </div>
              <p className="font-serif font-bold text-xs line-clamp-1">{step.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <div className="relative z-10 bg-stone-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            {timelineSteps[activeStep].subtitle}
          </span>
          <h3 className="font-serif font-bold text-2xl text-white">
            {timelineSteps[activeStep].title}
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {timelineSteps[activeStep].description}
          </p>
        </div>

        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center space-y-3">
          <div className="text-5xl">{timelineSteps[activeStep].icon}</div>
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
            SACRED DHARMA PRINCIPLE
          </span>
          <p className="font-serif font-bold text-sm text-white">
            "Ahimsa • Satya • Charity"
          </p>
        </div>
      </div>
    </div>
  );
}
