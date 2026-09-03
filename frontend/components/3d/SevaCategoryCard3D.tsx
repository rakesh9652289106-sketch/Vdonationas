'use client';

import React, { useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

interface SevaCategoryCard3DProps {
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  amount: string;
  onSelect: () => void;
}

export default function SevaCategoryCard3D({
  icon,
  title,
  subtitle,
  desc,
  amount,
  onSelect,
}: SevaCategoryCard3DProps) {
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

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`
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
      onClick={onSelect}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="relative p-6 rounded-3xl bg-stone-900 border-2 border-devotional-gold/60 shadow-[0_15px_40px_-10px_rgba(107,29,47,0.4)] cursor-pointer hover:border-amber-400 hover:shadow-gold transition-all space-y-4 overflow-hidden group text-left"
    >
      {/* Background Gold Shimmer on Hover */}
      {isHovered && <div className="absolute inset-0 shimmer-gold pointer-events-none opacity-20" />}

      {/* Top Bar with 3D Icon & Price Tag */}
      <div className="flex justify-between items-start relative z-10">
        <div
          style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)', transition: 'transform 0.3s ease' }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-devotional-maroon via-devotional-saffron to-amber-400 text-amber-200 flex items-center justify-center font-bold text-3xl shadow-gold border border-amber-300"
        >
          {icon}
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-stone-950 border border-amber-400/60 text-amber-300 font-serif font-bold text-xs shadow-md">
          {amount}
        </span>
      </div>

      {/* Content Body with 3D Depth Elevation */}
      <div
        style={{ transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)', transition: 'transform 0.3s ease' }}
        className="space-y-1.5 relative z-10"
      >
        <h3 className="font-serif font-bold text-xl text-amber-300 group-hover:text-amber-200 transition-colors">
          {title}
        </h3>
        <p className="text-[11px] font-bold text-devotional-saffron uppercase tracking-wider">
          {subtitle}
        </p>
        <p className="text-xs text-stone-300 leading-relaxed pt-1">
          {desc}
        </p>
      </div>

      {/* Action CTA Trigger */}
      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1.5 transition-all relative z-10">
        <span>Offer This Seva Now</span> <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}
