'use client';

import React, { useState } from 'react';
import { InitiativeStage, InitiativeType } from '@/lib/initiatives-data';
import {
  Sparkles,
  Layers,
  Eye,
  RotateCw,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  Compass,
  Building2,
  Shield,
  Info,
} from 'lucide-react';

interface InitiativeElevation3DProps {
  currentStage: InitiativeStage;
  percentageFunded: number;
  initiativeType: InitiativeType;
  title: string;
}

const STAGES_ORDER: InitiativeStage[] = [
  'PROPOSED',
  'FOUNDATION',
  'STRUCTURE',
  'FINISHING',
  'COMPLETED',
];

const STAGE_DETAILS = {
  PROPOSED: {
    tier: 'Stage 1: Prathama Sankalpa',
    part: 'Agama Sthapana & Blueprint',
    desc: 'Vedic astrological orientation, soil purification, and Sthapati architectural grid blueprint approval.',
    heightMeters: '0m (Site Sanctification)',
    progress: 10,
  },
  FOUNDATION: {
    tier: 'Stage 2: Adhishthana Peetham',
    part: 'Plinth & Sacred Substructure',
    desc: 'Multi-layered granite Adhishthana, Garbhadhana ceremonial copper yantra, and high-load foundation pillars.',
    heightMeters: '4.5m Granite Plinth',
    progress: 35,
  },
  STRUCTURE: {
    tier: 'Stage 3: Pada & Sthambhas',
    part: 'Sanctum Walls & Lintel Arches',
    desc: 'Carved granite sanctum walls, ornamental Agamic pillars, Prastara architraves, and inner circumambulatory pathway.',
    heightMeters: '12.8m Wall Elevation',
    progress: 65,
  },
  FINISHING: {
    tier: 'Stage 4: Vimana & Shikhara',
    part: 'Stepped Gopuram Superstructure',
    desc: 'Ornate stepped stucco vimana pyramid, carved divine vahanas, and sacred deity niches around the tiers.',
    heightMeters: '24.0m Vimana Apex',
    progress: 88,
  },
  COMPLETED: {
    tier: 'Stage 5: Mahakumbhabhishekam',
    part: 'Golden Kalasha Finial Consecration',
    desc: 'Gold-plated panchaloha Kalasha installation, consecration homams, and eternal Mahakumbhabhishekam darshan.',
    heightMeters: '28.5m Kalasham Consecrated',
    progress: 100,
  },
};

export default function InitiativeElevation3D({
  currentStage = 'FOUNDATION',
  percentageFunded = 0,
  initiativeType,
  title,
}: InitiativeElevation3DProps) {
  const [illumination, setIllumination] = useState<'SURYA' | 'SANDHYA' | 'RATRI'>('SANDHYA');
  const [selectedTier, setSelectedTier] = useState<InitiativeStage>(currentStage);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateAngle, setRotateAngle] = useState(15);

  const stageIndex = STAGES_ORDER.indexOf(currentStage);
  const selectedIndex = STAGES_ORDER.indexOf(selectedTier);
  const activeDetail = STAGE_DETAILS[selectedTier] || STAGE_DETAILS.FOUNDATION;

  // Background ambiance based on illumination
  const ambianceStyle =
    illumination === 'SURYA'
      ? 'from-amber-950/60 via-stone-900 to-stone-950 border-amber-500/40'
      : illumination === 'SANDHYA'
      ? 'from-rose-950/60 via-stone-900 to-stone-950 border-devotional-saffron/40'
      : 'from-indigo-950/70 via-stone-950 to-stone-950 border-devotional-gold/30';

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b ${ambianceStyle} p-6 sm:p-8 border shadow-2xl transition-colors duration-700`}>
      {/* Background glow orbs */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-devotional-maroon/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls Strip */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> 3D Architectural Visualizer
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Agama Shastra Elevation</span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-100">
            Sacred Gopuram & Sanctum Elevation Model
          </h3>
          <p className="text-xs text-stone-400">
            Interactive structural preview showing sacred Agamic tiers constructed as devotee funding progresses.
          </p>
        </div>

        {/* Lighting & Camera Mode Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-stone-900/90 p-1 rounded-2xl border border-stone-800">
            <button
              type="button"
              onClick={() => setIllumination('SURYA')}
              title="Surya (Day Radiance)"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                illumination === 'SURYA' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIllumination('SANDHYA')}
              title="Sandhya (Dusk Aarti Lamps)"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                illumination === 'SANDHYA' ? 'bg-devotional-saffron text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIllumination('RATRI')}
              title="Ratri (Deepotsavam Moonlight)"
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                illumination === 'RATRI' ? 'bg-devotional-gold text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-stone-900 text-amber-300 border-amber-400/40'
                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline text-[10px]">Orbit</span>
          </button>
        </div>
      </div>

      {/* Main 3D Stage & Interactive Tier Inspector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* 3D Visualizer Canvas (Left/Center - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] relative">
          {/* 3D Perspective Viewport */}
          <div
            className="w-full max-w-sm h-80 flex flex-col items-center justify-end relative select-none"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Base Altar Shadow */}
            <div
              className="absolute -bottom-4 w-72 h-20 rounded-full bg-black/60 blur-xl transform rotate-x-60"
            />

            {/* Sacred Elevation Tier Stack */}
            <div
              className={`w-full flex flex-col items-center transition-transform duration-700 ${
                autoRotate ? 'animate-pulse' : ''
              }`}
              style={{
                transform: `rotateY(${rotateAngle}deg) rotateX(10deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* TIER 5: STUPI & KALASHA CROWN */}
              {(() => {
                const isReached = stageIndex >= 4;
                const isSelected = selectedTier === 'COMPLETED';
                return (
                  <div
                    onClick={() => setSelectedTier('COMPLETED')}
                    className={`cursor-pointer transition-all duration-500 flex flex-col items-center group relative ${
                      isReached ? 'opacity-100' : 'opacity-40 grayscale'
                    }`}
                  >
                    {/* Glowing Kalasha Finial */}
                    <div
                      className={`w-7 h-10 rounded-t-full relative flex items-center justify-center transition-all ${
                        isReached
                          ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_25px_rgba(255,215,0,0.9)] scale-110'
                          : 'bg-stone-700 border border-stone-600'
                      } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-stone-900' : ''}`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isReached ? 'text-amber-950 animate-spin' : 'text-stone-500'}`} style={{ animationDuration: '4s' }} />
                    </div>
                    {/* Kalasha Plinth */}
                    <div className="w-12 h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-sm mt-0.5 shadow-md" />
                  </div>
                );
              })()}

              {/* TIER 4: SHIKHARA / VIMANA PYRAMID */}
              {(() => {
                const isReached = stageIndex >= 3;
                const isSelected = selectedTier === 'FINISHING';
                return (
                  <div
                    onClick={() => setSelectedTier('FINISHING')}
                    className={`cursor-pointer transition-all duration-500 flex flex-col items-center group w-full relative mt-1 ${
                      isReached ? 'opacity-100' : 'opacity-30 border-dashed border-amber-500/30'
                    }`}
                  >
                    {/* Stepped Vimana Tiers (Upper) */}
                    <div
                      className={`w-28 h-8 rounded-t-lg transition-all flex items-center justify-around px-2 ${
                        isReached
                          ? 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 border border-amber-400/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : 'bg-stone-800/80 border border-stone-700'
                      } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <span className="text-[8px] font-bold text-amber-200 uppercase tracking-widest">Shikhara Tier 3</span>
                    </div>

                    {/* Stepped Vimana Tiers (Middle) */}
                    <div
                      className={`w-36 h-10 rounded-t-lg -mt-0.5 transition-all flex items-center justify-around px-3 ${
                        isReached
                          ? 'bg-gradient-to-r from-stone-900 via-amber-800 to-stone-900 border border-amber-400/60 shadow-lg'
                          : 'bg-stone-800/60 border border-stone-700'
                      } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <div className="w-2 h-6 rounded-sm bg-amber-500/40" />
                      <span className="text-[9px] font-serif font-bold text-amber-300">Vimana Tier 2</span>
                      <div className="w-2 h-6 rounded-sm bg-amber-500/40" />
                    </div>

                    {/* Stepped Vimana Tiers (Lower) */}
                    <div
                      className={`w-48 h-12 rounded-t-xl -mt-0.5 transition-all flex items-center justify-between px-4 ${
                        isReached
                          ? 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-500/70 shadow-xl'
                          : 'bg-stone-900/60 border border-stone-800'
                      } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <div className="flex gap-1.5">
                        <div className="w-2 h-7 bg-amber-400/60 rounded-sm" />
                        <div className="w-2 h-7 bg-amber-400/60 rounded-sm" />
                      </div>
                      <span className="text-[10px] font-serif font-bold text-amber-200">Prastara Cornice</span>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-7 bg-amber-400/60 rounded-sm" />
                        <div className="w-2 h-7 bg-amber-400/60 rounded-sm" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TIER 3: PADA & STHAMBHAS (PILLARS & SANCTUM) */}
              {(() => {
                const isReached = stageIndex >= 2;
                const isSelected = selectedTier === 'STRUCTURE';
                return (
                  <div
                    onClick={() => setSelectedTier('STRUCTURE')}
                    className={`cursor-pointer transition-all duration-500 flex flex-col items-center group w-full relative mt-0.5 ${
                      isReached ? 'opacity-100' : 'opacity-30 border-dashed border-amber-500/30'
                    }`}
                  >
                    <div
                      className={`w-56 h-20 rounded-lg transition-all flex items-center justify-between px-6 ${
                        isReached
                          ? 'bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-950 border-2 border-amber-500/80 shadow-2xl'
                          : 'bg-stone-900/40 border border-stone-800'
                      } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      {/* Left Pillar Set */}
                      <div className="flex gap-2">
                        <div className="w-3.5 h-16 bg-gradient-to-t from-stone-800 to-amber-400/80 rounded-sm shadow-md" />
                        <div className="w-3.5 h-16 bg-gradient-to-t from-stone-800 to-amber-400/80 rounded-sm shadow-md" />
                      </div>

                      {/* Center Sanctum Doorway (Garbhagriha Portal) */}
                      <div className="w-16 h-16 rounded-t-full bg-black/90 border border-amber-500/60 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                        <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-[8px] text-amber-300 font-bold uppercase mt-1">Sanctum</span>
                      </div>

                      {/* Right Pillar Set */}
                      <div className="flex gap-2">
                        <div className="w-3.5 h-16 bg-gradient-to-t from-stone-800 to-amber-400/80 rounded-sm shadow-md" />
                        <div className="w-3.5 h-16 bg-gradient-to-t from-stone-800 to-amber-400/80 rounded-sm shadow-md" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TIER 2: ADHISHTHANA PEETHAM (PLINTH FOUNDATION) */}
              {(() => {
                const isReached = stageIndex >= 1;
                const isSelected = selectedTier === 'FOUNDATION';
                return (
                  <div
                    onClick={() => setSelectedTier('FOUNDATION')}
                    className={`cursor-pointer transition-all duration-500 flex flex-col items-center group w-full relative mt-0.5 ${
                      isReached ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-64 h-12 rounded-t-lg transition-all flex items-center justify-around px-4 ${
                        isReached
                          ? 'bg-gradient-to-r from-stone-800 via-amber-900/60 to-stone-800 border-2 border-amber-400 shadow-2xl'
                          : 'bg-stone-900 border border-stone-800'
                      } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                        Granite Adhishthana Peetham
                      </span>
                    </div>

                    {/* Sub-plinth wide steps */}
                    <div className="w-72 h-5 bg-stone-950 border-t border-amber-500/40 rounded-b-xl flex items-center justify-center shadow-2xl">
                      <span className="text-[8px] text-stone-500 uppercase font-mono">Bhoomi Pujan Sthala</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Interactive 3D Rotation Slider Control */}
          <div className="w-full max-w-xs mt-6 flex items-center gap-3">
            <span className="text-[10px] text-stone-500 font-mono">Angle</span>
            <input
              type="range"
              min="-45"
              max="45"
              value={rotateAngle}
              onChange={(e) => {
                setAutoRotate(false);
                setRotateAngle(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[10px] text-amber-400 font-mono">{rotateAngle}°</span>
          </div>
        </div>

        {/* Right Inspector & Architectural Stage Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Current Stage Card */}
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {activeDetail.tier}
              </span>
              <span className="font-bold text-[11px] text-stone-300">
                {activeDetail.heightMeters}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-stone-100">
                {activeDetail.part}
              </h4>
              <p className="text-stone-400 leading-relaxed text-xs">
                {activeDetail.desc}
              </p>
            </div>

            {/* Stage Status Badge */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Construction Status</span>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  selectedIndex < stageIndex
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : selectedIndex === stageIndex
                    ? 'bg-amber-950 text-amber-300 border border-amber-800 ring-1 ring-amber-400/40'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {selectedIndex < stageIndex
                  ? 'Phase Completed'
                  : selectedIndex === stageIndex
                  ? 'In Active Construction'
                  : 'Awaiting Target Funds'}
              </span>
            </div>
          </div>

          {/* 5-Step Agamic Architectural Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block px-1">
              Explore Architectural Tiers
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {STAGES_ORDER.map((stg, i) => {
                const info = STAGE_DETAILS[stg];
                const isDone = i < stageIndex;
                const isCurrent = i === stageIndex;
                const isSelected = selectedTier === stg;

                return (
                  <button
                    type="button"
                    key={stg}
                    onClick={() => setSelectedTier(stg)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-devotional-maroon/60 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                        : 'bg-stone-900/40 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-bold opacity-60">0{i + 1}</span>
                      <div>
                        <p className="font-serif font-bold text-xs leading-none">{info.part}</p>
                        <p className="text-[9px] text-stone-500 mt-0.5">{info.heightMeters}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                      ) : (
                        <span className="text-[10px] font-mono text-stone-600">Pending</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agama Guarantee Strip */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-devotional-gold/20 flex items-center gap-2 text-[10px] text-stone-400">
            <Shield className="w-4 h-4 text-devotional-gold shrink-0" />
            <span>Built according to traditional Vastu & Agama Shastra architectural proportions under certified Sompura Sthapatis.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
