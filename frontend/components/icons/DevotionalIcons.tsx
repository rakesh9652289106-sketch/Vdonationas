'use client';

import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
  active?: boolean;
  style?: React.CSSProperties;
  alt?: string;
}

interface RealisticIconInternalProps extends IconProps {
  src: string;
}

function RealisticDevotionalIcon({
  src,
  alt,
  size = 24,
  active = false,
  className = '',
  style = {},
}: RealisticIconInternalProps) {
  return (
    <img
      src={src}
      alt={alt || 'Devotional Icon'}
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      className={`inline-block select-none pointer-events-none object-contain transition-all duration-200 ${
        active
          ? 'scale-110 drop-shadow-[0_2px_10px_rgba(212,175,55,0.7)] brightness-110'
          : 'drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.18)] hover:brightness-105'
      } ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        ...style,
      }}
    />
  );
}

// 1. PHOTOREALISTIC 3D TEMPLE SANCTUM (HOME / DEVOTEE HOME)
export function IconSanctumHome(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/sanctum.png"
      alt="Temple Sanctum"
      size={props.size || 26}
      {...props}
    />
  );
}

// 2. PHOTOREALISTIC MULTI-TIERED STONE GOPURAM (MATHAS / SHRINES)
export function IconTempleMatha(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/gopuram.png"
      alt="Temple Gopuram"
      size={props.size || 26}
      {...props}
    />
  );
}

// 3. PHOTOREALISTIC 3D GOLDEN OFFERING KALASH (DONATE FAB / DAKSHINA)
export function IconSacredDonateFAB(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/kalash.png"
      alt="Sacred Offering Kalash"
      size={props.size || 34}
      {...props}
    />
  );
}

// 4. PHOTOREALISTIC ANTIQUE BRASS DIYA (SEVAS / DAILY POOJA)
export function IconSacredDiya(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/diya.png"
      alt="Sacred Diya"
      size={props.size || 26}
      {...props}
    />
  );
}

// 5. PHOTOREALISTIC GOLDEN NAMASTE HANDS WITH LOTUS (PROFILE / DEVOTEE)
export function IconDevoteeSacred(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/pranam.png"
      alt="Devotee Pranam"
      size={props.size || 26}
      {...props}
    />
  );
}

// 6. PHOTOREALISTIC 24K FINE GOLD DAKSHINA COIN (QUICK DONATE / FINANCE)
export function IconDevotionalCoin(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/coin.png"
      alt="24K Gold Coin"
      size={props.size || 20}
      {...props}
    />
  );
}

// 7. PHOTOREALISTIC POLISHED BRASS TEMPLE BELL (NOTIFICATIONS)
export function IconTempleBell(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/bell.png"
      alt="Temple Bell"
      size={props.size || 24}
      {...props}
    />
  );
}

// 8. PHOTOREALISTIC SACRED PALMLEAF SCROLL (RECEIPTS / 80G TAX / HISTORY)
export function IconPalmleafScroll(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/scroll.png"
      alt="Palmleaf Manuscript Receipt"
      size={props.size || 22}
      {...props}
    />
  );
}

// 9. PHOTOREALISTIC 3D GOLD MEDALLION (DEVOTEE REWARDS / SUPER ADMIN)
export function IconDevoteeMedal(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/medal.png"
      alt="Devotee Medallion of Honor"
      size={props.size || 22}
      {...props}
    />
  );
}

// 10. PHOTOREALISTIC STEAMING BRASS ANNADANAM VESSEL (MONTHLY SEVA / MEALS)
export function IconAnnadanamPot(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/annadanam.png"
      alt="Annadanam Prasadam Handi"
      size={props.size || 24}
      {...props}
    />
  );
}

// 11. PHOTOREALISTIC BRASS AARTI THALI WITH FLAME (POOJA BOOKINGS / AARTI)
export function IconPoojaAarti(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/aarti.png"
      alt="Pooja Aarti Thali"
      size={props.size || 24}
      {...props}
    />
  );
}

// 12. PHOTOREALISTIC SACRED PANCHANGAM FESTIVAL DEEPAM (FESTIVALS)
export function IconFestivalDeepam(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/diya.png"
      alt="Festival Deepam"
      size={props.size || 22}
      {...props}
    />
  );
}

// 13. PHOTOREALISTIC 24K GOLD COIN DHARMA ANALYTICS (ANALYTICS)
export function IconDonationAnalytics(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/coin.png"
      alt="Donation Analytics"
      size={props.size || 22}
      {...props}
    />
  );
}

// 14. PHOTOREALISTIC SACRED PRANAM FAMILY BLESSING (FAMILY & OCCASIONS)
export function IconFamilySacred(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/pranam.png"
      alt="Sacred Family Blessing"
      size={props.size || 22}
      {...props}
    />
  );
}

// 15. PHOTOREALISTIC 3D GOLD RAKSHA KAVACH (SECURITY & PRIVACY)
export function IconSacredKavach(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/kavach.png"
      alt="Sacred Raksha Kavach"
      size={props.size || 22}
      {...props}
    />
  );
}

// 16. PHOTOREALISTIC PRANAM LOTUS SUPPORT (DONATION SUPPORT)
export function IconSevaSupport(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/pranam.png"
      alt="Devotee Seva Support"
      size={props.size || 22}
      {...props}
    />
  );
}

// 17. PHOTOREALISTIC FRESH BLOSSOM FLORAL OFFERING (PUSHPA SEVA)
export function IconSacredPushpa(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/pranam.png"
      alt="Sacred Pushpa Lotus Offering"
      size={props.size || 24}
      {...props}
    />
  );
}

// 18. PHOTOREALISTIC SACRED VEDA SCRIPTURES SCROLL (VIDYA / EDUCATION)
export function IconVidyaScroll(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/scroll.png"
      alt="Veda Grantha Scroll"
      size={props.size || 24}
      {...props}
    />
  );
}

// 19. PHOTOREALISTIC SACRED RAKSHA HEALING KALASH (MEDICAL / AROGYA)
export function IconArogyaHealing(props: IconProps) {
  return (
    <RealisticDevotionalIcon
      src="/icons/png/kavach.png"
      alt="Arogya Raksha Shield"
      size={props.size || 24}
      {...props}
    />
  );
}


