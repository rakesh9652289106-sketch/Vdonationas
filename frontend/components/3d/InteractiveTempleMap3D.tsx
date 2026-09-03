'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import { MapPin, ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveTempleMap3D() {
  const [selectedTemple, setSelectedTemple] = useState(MOCK_TEMPLES[0]);

  // Positions on stylized 3D India Map matrix
  const templeMapNodes = [
    { temple: MOCK_TEMPLES[0], x: '46%', y: '72%', label: 'Penugonda (AP)' },
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-devotional-gold/40 shadow-2xl overflow-hidden">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" /> INTERACTIVE 3D TEMPLE NETWORK MAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 mt-1">
              Discover Verified Shrines Across India
            </h2>
          </div>
          <span className="text-xs text-amber-100/70">
            Click any glowing 3D marker to inspect shrine details & offerings
          </span>
        </div>

        {/* 3D Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Map Node Area */}
          <div className="lg:col-span-2 relative h-[380px] bg-stone-950/80 rounded-2xl border border-stone-800 p-4 shadow-inner flex items-center justify-center overflow-hidden">
            {/* India Contour Stylized Mesh */}
            <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center opacity-40">
              <div className="text-[120px] font-serif font-bold text-amber-400/10 select-none">
                BHARAT
              </div>
            </div>

            {/* Glowing 3D Markers */}
            {templeMapNodes.map((node, idx) => {
              const isSelected = selectedTemple.id === node.temple.id;
              return (
                <div
                  key={idx}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedTemple(node.temple)}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                >
                  {/* Outer Pulsing Ring */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-400/40 ring-4 ring-amber-300 animate-ping'
                        : 'bg-devotional-saffron/20 group-hover:bg-amber-400/30'
                    }`}
                  />

                  {/* 3D Pin Icon */}
                  <div
                    className={`absolute inset-0 m-auto w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 scale-125 ring-2 ring-white'
                        : 'bg-devotional-maroon text-amber-300 group-hover:scale-110'
                    }`}
                  >
                    🛕
                  </div>

                  {/* Label Tooltip */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30 shadow-md">
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating 3D Shrine Info Panel */}
          <div className="bg-stone-900/90 backdrop-blur-md p-6 rounded-2xl border border-devotional-gold/40 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase">
              <ShieldCheck className="w-4 h-4" /> VERIFIED TEMPLE DEVASTHANAM
            </div>

            <div>
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                {selectedTemple.deity}
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                {selectedTemple.name}
              </h3>
              <p className="text-stone-400 text-[11px] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-devotional-saffron" />
                {selectedTemple.city}, {selectedTemple.state} ({selectedTemple.code})
              </p>
            </div>

            <p className="text-stone-300 leading-relaxed text-[11px]">
              {selectedTemple.description}
            </p>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 text-[10px]">Trust Registration No:</span>
              <p className="font-mono text-amber-300 font-bold text-xs">
                {selectedTemple.registrationNo}
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <Link
                href={`/temples/${selectedTemple.id}`}
                className="flex-1 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-center transition-colors"
              >
                View Shrine
              </Link>
              <Link
                href={`/donate?templeId=${selectedTemple.id}`}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-center hover:brightness-110 transition-colors flex items-center justify-center gap-1 shadow-md"
              >
                <Heart className="w-3.5 h-3.5 fill-current" /> Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
