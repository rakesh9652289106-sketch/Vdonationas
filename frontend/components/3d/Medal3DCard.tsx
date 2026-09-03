'use client';

import React, { useState, useRef } from 'react';
import { MedalTier } from '@/lib/medals';
import { Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface Medal3DCardProps {
  tier: MedalTier;
  isUnlocked: boolean;
  userTotalDonated: number;
  onClick: () => void;
}

export default function Medal3DCard({
  tier,
  isUnlocked,
  userTotalDonated,
  onClick,
}: Medal3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`
    );
  };

  const handleMouseEnter = () => setIsHovered(true);

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
      onClick={onClick}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative p-5 rounded-3xl border backdrop-blur-md shadow-xl cursor-pointer transition-all ${
        isUnlocked
          ? 'bg-gradient-to-b from-white/90 via-stone-50/90 to-amber-50/60 dark:from-stone-900/90 dark:to-stone-900/90 border-amber-400/50 hover:border-amber-300'
          : 'bg-stone-100/60 dark:bg-stone-900/40 border-stone-300/40 dark:border-stone-800 opacity-65 grayscale hover:grayscale-0'
      }`}
    >
      {/* Glow Halo for Unlocked */}
      {isUnlocked && isHovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `0 15px 40px ${tier.glowColor}`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        {/* 3D METALLIC MEDAL COIN */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Ring */}
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-tr ${tier.gradient} p-1 shadow-2xl flex items-center justify-center border-2 ${tier.metallicBorder} transform transition-transform ${
              isHovered ? 'scale-110 rotate-6' : ''
            }`}
          >
            {/* Inner Metallic Coin Disc */}
            <div className="w-20 h-20 rounded-full bg-stone-900/90 flex flex-col items-center justify-center p-1 text-center shadow-inner border border-amber-300/40">
              <span className="text-3xl select-none">{tier.badge}</span>
              <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-amber-200 mt-0.5 truncate max-w-[70px]">
                {tier.engravedText}
              </span>
            </div>
          </div>

          {/* Locked Badge Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 flex items-center justify-center text-amber-400 shadow-md">
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              {tier.name}
            </h4>
            {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </div>

          <p className="text-[10px] font-mono font-bold text-devotional-saffron">
            ₹{tier.minAmount.toLocaleString('en-IN')}+ Required
          </p>
        </div>

        {/* Unlock Status Text */}
        <div className="pt-1 w-full">
          {isUnlocked ? (
            <span className="inline-block w-full py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
              ✓ UNLOCKED
            </span>
          ) : (
            <span className="inline-block w-full py-1 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium text-[10px]">
              🔒 Donate ₹{(tier.minAmount - userTotalDonated).toLocaleString('en-IN')} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
