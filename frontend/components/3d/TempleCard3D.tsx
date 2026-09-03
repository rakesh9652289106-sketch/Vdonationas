'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Temple } from '@/lib/types';
import { MapPin, ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';

interface TempleCard3DProps {
  temple: Temple;
}

export default function TempleCard3D({ temple }: TempleCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="relative bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden group cursor-pointer"
    >
      {/* Gold Rim / Ambient Depth Highlight */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 ${
          isHovered
            ? 'opacity-100 ring-2 ring-devotional-gold/60 shadow-[0_20px_50px_rgba(212,175,55,0.25)]'
            : 'opacity-0'
        }`}
      />

      {/* Image Container with 3D Depth Elevation */}
      <div
        style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)', transition: 'transform 0.3s ease' }}
        className="relative h-48 w-full overflow-hidden bg-stone-900"
      >
        <img
          src={temple.bannerUrl}
          alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Verification & Location Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {temple.verificationStatus === 'VERIFIED' && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 font-bold text-[10px] uppercase flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED SHRINE
            </span>
          )}
        </div>

        {/* Deity Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
            {temple.deity}
          </span>
          <h3 className="font-serif font-bold text-lg leading-tight text-white group-hover:text-amber-300 transition-colors">
            {temple.name}
          </h3>
        </div>
      </div>

      {/* Body Content with 3D Floating Layer */}
      <div
        style={{ transform: isHovered ? 'translateZ(35px)' : 'translateZ(0px)', transition: 'transform 0.3s ease' }}
        className="p-5 space-y-4"
      >
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
          {temple.description}
        </p>

        <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-devotional-saffron" />
            <span>{temple.city}, {temple.state}</span>
          </div>
          <span className="font-mono text-stone-400 text-[11px]">{temple.code}</span>
        </div>

        {/* Action Button Area */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800">
          <Link
            href={`/temples/${temple.id}`}
            className="text-xs font-bold text-devotional-maroon dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Explore Shrine <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/donate?templeId=${temple.id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-current" /> Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
