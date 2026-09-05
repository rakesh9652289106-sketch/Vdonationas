'use client';

import React from 'react';
import { InitiativeStage, STAGE_STEPS } from '@/lib/initiatives-data';
import { CheckCircle2, Clock, Sparkles, Building2, Flame, Landmark } from 'lucide-react';

interface InitiativeTimeline3DProps {
  currentStage: InitiativeStage;
  updates?: any[];
  startDate?: string;
  targetEndDate?: string;
}

const STAGE_ORDER: InitiativeStage[] = ['PROPOSED', 'FOUNDATION', 'STRUCTURE', 'FINISHING', 'COMPLETED'];

export default function InitiativeTimeline3D({
  currentStage,
  updates = [],
  startDate,
  targetEndDate,
}: InitiativeTimeline3DProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  const getStageStatus = (stage: InitiativeStage, index: number) => {
    if (index < currentIndex) return 'COMPLETED';
    if (index === currentIndex) return 'IN_PROGRESS';
    return 'UPCOMING';
  };

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-devotional-gold/30 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-devotional-saffron text-[11px] font-bold uppercase border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5" /> 3D Milestone Progress Timeline
          </div>
          <h3 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-300 mt-1">
            Execution Stages & Agama Milestones
          </h3>
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Current: <span className="font-bold text-devotional-saffron uppercase">{currentStage}</span>
        </div>
      </div>

      {/* 3D Horizontal Stepper (Desktop) / Vertical Stepper (Mobile) */}
      <div className="relative py-4">
        {/* Desktop Track */}
        <div className="hidden md:block absolute top-10 inset-x-12 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full z-0 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-devotional-maroon via-devotional-gold to-amber-400 transition-all duration-700 rounded-full"
            style={{
              width: `${(currentIndex / (STAGE_ORDER.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          {STAGE_STEPS.map((step, idx) => {
            const status = getStageStatus(step.stage, idx);
            const isCompleted = status === 'COMPLETED';
            const isCurrent = status === 'IN_PROGRESS';
            const isUpcoming = status === 'UPCOMING';

            return (
              <div
                key={step.stage}
                className={`relative flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 p-4 rounded-2xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-500/10 dark:bg-amber-400/10 border-2 border-devotional-gold shadow-lg shadow-amber-500/10 -translate-y-1'
                    : 'bg-stone-50/50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800'
                }`}
              >
                {/* 3D Floating Circle Node */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-devotional-gold text-white shadow-gold animate-bounce-subtle ring-4 ring-amber-400/40'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                  }`}
                  style={{
                    transform: isCurrent ? 'perspective(500px) translateZ(12px)' : 'none',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <Flame className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <span className="font-serif font-bold text-sm">{step.stepNumber}</span>
                  )}
                </div>

                {/* Node Details */}
                <div className="flex-1 md:text-center space-y-1">
                  <div className="flex items-center md:justify-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isCurrent
                          ? 'bg-devotional-saffron text-white'
                          : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                      }`}
                    >
                      {status === 'IN_PROGRESS' ? 'Active Now' : status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    {step.label}
                  </h4>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vedic Milestone Assurance Footer */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-devotional-gold/30 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-3">
        <Landmark className="w-5 h-5 text-devotional-saffron shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-stone-900 dark:text-stone-100">Agamic Quality & Structural Integrity Certification</p>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            Every phase is subjected to Vedic rites by Matha Peetham priests and structural load safety inspections certified by licensed civil engineers before advancing.
          </p>
        </div>
      </div>
    </div>
  );
}
