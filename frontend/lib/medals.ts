export interface MedalTier {
  id: string;
  name: string;
  badge: string;
  minAmount: number;
  color: string;
  gradient: string;
  metallicBorder: string;
  glowColor: string;
  description: string;
  engravedText: string;
  motif: string;
}

export const MEDAL_TIERS: MedalTier[] = [
  {
    id: 'seva_bhakta',
    name: 'Seva Bhakta',
    badge: '🥉',
    minAmount: 100,
    color: '#CD7F32',
    gradient: 'from-amber-900 via-amber-800 to-amber-950',
    metallicBorder: 'border-amber-700',
    glowColor: 'rgba(205, 127, 50, 0.4)',
    description: 'Awarded for initial Seva contributions crossing ₹100 to Sri Vasavi Matha.',
    engravedText: 'SEVA BHAKTA',
    motif: '🪔 Sacred Diya Motif',
  },
  {
    id: 'dharma_bhakta',
    name: 'Dharma Bhakta',
    badge: '🥈',
    minAmount: 1000,
    color: '#C0C0C0',
    gradient: 'from-slate-300 via-slate-100 to-slate-400',
    metallicBorder: 'border-slate-300',
    glowColor: 'rgba(192, 192, 192, 0.5)',
    description: 'Awarded for dedicated Dharma Seva offerings reaching ₹1,000 across Matha causes.',
    engravedText: 'DHARMA BHAKTA',
    motif: '🏛️ Temple Pillar Motif',
  },
  {
    id: 'vasavi_bhakta',
    name: 'Vasavi Bhakta',
    badge: '🥇',
    minAmount: 10000,
    color: '#D4AF37',
    gradient: 'from-amber-300 via-amber-400 to-amber-600',
    metallicBorder: 'border-amber-400',
    glowColor: 'rgba(212, 175, 55, 0.65)',
    description: 'Awarded for devout contributions reaching ₹10,000 in divine Sri Vasavi Seva.',
    engravedText: 'VASAVI BHAKTA',
    motif: '🛕 Golden Prabhavali Motif',
  },
  {
    id: 'vasavi_seva_ratna',
    name: 'Vasavi Seva Ratna',
    badge: '💎',
    minAmount: 100000,
    color: '#B9F2FF',
    gradient: 'from-cyan-200 via-sky-300 to-amber-300',
    metallicBorder: 'border-cyan-300',
    glowColor: 'rgba(185, 242, 255, 0.85)',
    description: 'Awarded for extraordinary community & temple contributions exceeding ₹1,00,000.',
    engravedText: 'VASAVI SEVA RATNA',
    motif: '🪷 Sacred Lotus Emblem',
  },
  {
    id: 'vasavi_maha_seva_patron',
    name: 'Vasavi Maha Seva Patron',
    badge: '👑',
    minAmount: 1000000,
    color: '#FFD700',
    gradient: 'from-amber-200 via-amber-400 to-amber-700',
    metallicBorder: 'border-amber-300',
    glowColor: 'rgba(255, 215, 0, 0.95)',
    description: 'Royal Seva Distinction for lifetime contributions crossing ₹10,00,000 to Sri Vasavi Matha.',
    engravedText: 'VASAVI MAHA SEVA PATRON',
    motif: '👑 Royal Golden Crown Emblem',
  },
];

export interface DevoteeMedalProgress {
  lifetimeSuccessfulTotal: number;
  successfulDonationCount: number;
  supportedTemplesCount: number;
  currentMedal: MedalTier | null;
  nextMedal: MedalTier | null;
  amountNeededForNext: number;
  progressPercent: number;
  unlockedMedals: MedalTier[];
}

export function calculateDevoteeMedals(donations: any[]): DevoteeMedalProgress {
  const successfulDonations = donations.filter(
    (d) => d.status === 'SUCCESS' || d.status === 'COMPLETED' || !d.status
  );

  const lifetimeSuccessfulTotal = successfulDonations.reduce(
    (acc, d) => acc + (d.amount || 0),
    0
  );

  const templeSet = new Set(successfulDonations.map((d) => d.templeId || d.templeName));
  const supportedTemplesCount = templeSet.size;

  const unlockedMedals = MEDAL_TIERS.filter(
    (tier) => lifetimeSuccessfulTotal >= tier.minAmount
  );

  const currentMedal = unlockedMedals.length > 0 ? unlockedMedals[unlockedMedals.length - 1] : null;

  const nextMedalIndex = currentMedal
    ? MEDAL_TIERS.findIndex((t) => t.id === currentMedal.id) + 1
    : 0;

  const nextMedal = nextMedalIndex < MEDAL_TIERS.length ? MEDAL_TIERS[nextMedalIndex] : null;

  let amountNeededForNext = 0;
  let progressPercent = 100;

  if (nextMedal) {
    const currentBase = currentMedal ? currentMedal.minAmount : 0;
    const range = nextMedal.minAmount - currentBase;
    const achievedInRange = lifetimeSuccessfulTotal - currentBase;
    amountNeededForNext = Math.max(0, nextMedal.minAmount - lifetimeSuccessfulTotal);
    progressPercent = Math.min(100, Math.max(0, Math.round((achievedInRange / range) * 100)));
  }

  return {
    lifetimeSuccessfulTotal,
    successfulDonationCount: successfulDonations.length,
    supportedTemplesCount,
    currentMedal,
    nextMedal,
    amountNeededForNext,
    progressPercent,
    unlockedMedals,
  };
}
