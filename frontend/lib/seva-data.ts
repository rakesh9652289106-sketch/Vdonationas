export interface DevotionalSeva {
  id: string; // 'annadanam', 'pushpa', 'matha', 'pooja', 'community', 'education', 'social'
  name: string;
  teluguName: string;
  subtitle: string;
  teluguSubtitle: string;
  desc: string;
  icon: string;
  amount: number;
  presets: number[];
  mantra: string;
  deity: string;
  tag: string;
  taxInfo: string;
}

export const DEVOTIONAL_SEVAS: DevotionalSeva[] = [
  {
    id: 'annadanam',
    name: 'Annadanam Seva',
    teluguName: 'అన్నదానం సేవ',
    subtitle: 'Offer Food to Devotees',
    teluguSubtitle: 'భక్తులకు నిత్య అన్నదాన సమర్పణ',
    desc: 'Sponsor daily sacred meals (Nitya Annaprasadam) for thousands of visiting devotees and pilgrims at Penugonda & Matha centers.',
    icon: '🪔',
    amount: 1001,
    presets: [501, 1001, 2501, 5001, 10001, 25001],
    mantra: 'అన్నదాత సుఖీభవ • Divine Prasadam Offering',
    deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
    tag: 'NITYA ANNADANAM',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'pushpa',
    name: 'Pushpa Seva',
    teluguName: 'పుష్ప సేవ & అలంకారం',
    subtitle: 'Offer Flowers to the Goddess',
    teluguSubtitle: 'అమ్మవారికి సుగంధ పుష్ప సమర్పణ',
    desc: 'Adorn Sri Vasavi Kanyaka Parameswari Matha with fresh scented jasmine, rose garlands, sacred bilva, and lotus flowers.',
    icon: '🌺',
    amount: 501,
    presets: [251, 501, 1001, 2116, 5001, 10001],
    mantra: 'సుగంధ పుష్పార్పణం • Divine Fragrance, Peace & Eternal Prosperity',
    deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
    tag: 'SACRED ALANKARAM',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'matha',
    name: 'Matha Development',
    teluguName: 'మాతా క్షేత్ర అభివృద్ధి సేవ',
    subtitle: 'Support Temple Development',
    teluguSubtitle: 'దేవాలయ జీర్ణోద్ధరణ & అభివృద్ధి',
    desc: 'Contribute to the architectural expansion, Gopuram gilding, stone carvings, pilgrim amenities, and sanctum preservation.',
    icon: '🛕',
    amount: 5001,
    presets: [1001, 2501, 5001, 10001, 25001, 50001],
    mantra: 'ధర్మ సంస్థాపనార్థాయ • Temple Heritage & Renovation Fund',
    deity: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    tag: 'TEMPLE DEVELOPMENT',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'pooja',
    name: 'Pooja Seva',
    teluguName: 'పూజా & అర్చన సేవ',
    subtitle: 'Participate in Sacred Worship',
    teluguSubtitle: 'గోత్ర నామాలతో నిత్య పూజ & అర్చన',
    desc: 'Book daily Archana, Sahasranama Kumkumarchana, and special Homam performed in your family name and gotram.',
    icon: '📿',
    amount: 1001,
    presets: [501, 1001, 2116, 5001, 10001, 25001],
    mantra: 'గోత్ర నామాలతో నిత్య కుంకుమార్చన • Divine Family Blessings',
    deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
    tag: 'SACRED WORSHIP',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'community',
    name: 'Community Development',
    teluguName: 'సంఘ అభివృద్ధి సేవ',
    subtitle: 'Support Arya Vysya Community Initiatives',
    teluguSubtitle: 'ఆర్య వైశ్య సేవా నిధి',
    desc: 'Fund community halls, Vysya youth skill centers, micro-grants, matrimonial centers, and heritage preservation funds.',
    icon: '🏛️',
    amount: 10001,
    presets: [2501, 5001, 10001, 25001, 50001, 100001],
    mantra: 'ఆర్య వైశ్య సేవా నిధి • Community Empowerment & Dharma',
    deity: 'Arya Vysya Mahasabha & Vasavi Trust',
    tag: 'COMMUNITY WELFARE',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'education',
    name: 'Education',
    teluguName: 'విద్యా దాన సేవ',
    subtitle: 'Support Educational Initiatives',
    teluguSubtitle: 'పేద విద్యార్థులకు విద్యా దానం',
    desc: 'Provide merit scholarships, textbooks, digital tabs, hostel fees, and coaching support for deserving students.',
    icon: '📚',
    amount: 2501,
    presets: [1001, 2501, 5001, 10001, 20001, 50001],
    mantra: 'విద్యా దానం మహా దానం • Saraswati Kataksham & Student Success',
    deity: 'Vasavi Vidya Nidhi',
    tag: 'VIDYA DAANAM',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
  {
    id: 'social',
    name: 'Social Service',
    teluguName: 'సామాజిక సేవ & వైద్యం',
    subtitle: 'Support Community Welfare',
    teluguSubtitle: 'ఉచిత వైద్య & సేవా కార్యక్రమాలు',
    desc: 'Fund free medical camps, blood donation drives, dialysis subsidies, senior citizen homes, and disaster relief.',
    icon: '🏥',
    amount: 5001,
    presets: [1001, 2501, 5001, 10001, 25001, 50001],
    mantra: 'మానవ సేవే మాధవ సేవ • Universal Healthcare & Compassion',
    deity: 'Vasavi Seva Kendra',
    tag: 'HEALTHCARE & RELIEF',
    taxInfo: 'Exempt under Section 80G(5)(vi) of IT Act 1961',
  },
];

export function findDevotionalSeva(param?: string | null): DevotionalSeva | undefined {
  if (!param) return undefined;
  const lower = param.toLowerCase().trim();
  return DEVOTIONAL_SEVAS.find((s) => {
    const sId = s.id.toLowerCase();
    const sName = s.name.toLowerCase();
    return (
      sId === lower ||
      sName === lower ||
      sName.includes(lower) ||
      lower.includes(sId) ||
      (s.id === 'matha' && (lower.includes('matha') || lower.includes('development'))) ||
      (s.id === 'pooja' && (lower.includes('pooja') || lower.includes('puja') || lower.includes('archana'))) ||
      (s.id === 'pushpa' && (lower.includes('pushpa') || lower.includes('flower'))) ||
      (s.id === 'annadanam' && (lower.includes('anna') || lower.includes('food'))) ||
      (s.id === 'community' && (lower.includes('community') || lower.includes('vysya') || lower.includes('arya'))) ||
      (s.id === 'education' && (lower.includes('education') || lower.includes('vidya') || lower.includes('scholarship'))) ||
      (s.id === 'social' && (lower.includes('social') || lower.includes('health') || lower.includes('medical')))
    );
  });
}
