export interface PoojaItem {
  id: string;
  title: string;
  deity: string;
  description: string;
  price: number;
  duration: string;
  availableSlots: string[];
  bannerGradient: string;
  benefits: string[];
  isActive: boolean;
  templeName?: string;
  createdAt?: string;
}

export const DEFAULT_POOJA_CATALOG: PoojaItem[] = [
  {
    id: 'pooja-01',
    title: 'Sahasranama Kumkumarchana',
    deity: 'Goddess Sri Vasavi Kanyaka Parameswari',
    description: 'Chanting of 1000 sacred divine names with holy vermilion Kumkuma at the sanctum sanctorum for family harmony, peace & auspiciousness.',
    price: 1001,
    duration: '45 mins',
    availableSlots: ['08:00 AM', '10:30 AM', '05:30 PM', '07:00 PM'],
    bannerGradient: 'from-amber-700 via-devotional-maroon to-stone-950',
    benefits: ['Family Prosperity', 'Removes Negative Energies', 'Special Archana Prasadam'],
    isActive: true,
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
  },
  {
    id: 'pooja-02',
    title: 'Nitya Suprabhatam & Holy Archana',
    deity: 'Sri Vasavi Matha & Parameswara',
    description: 'Auspicious morning awakening ritual with divine musical chanting, holy water abhishekam, and early dawn darshan at sunrise.',
    price: 501,
    duration: '30 mins',
    availableSlots: ['05:30 AM', '06:30 AM'],
    bannerGradient: 'from-devotional-maroon via-stone-900 to-amber-950',
    benefits: ['Spiritual Awakening', 'Early Morning Sanctum Darshan', 'Ammavari Raksha'],
    isActive: true,
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
  },
  {
    id: 'pooja-03',
    title: 'Navagraha Shanti Mahayagnam & Homam',
    deity: 'Sri Vasavi Matha & Navagraha Devas',
    description: 'Powerful sacred Vedic fire ritual performed by temple Vidwans to pacify planetary doshas and invoke health, prosperity and career success.',
    price: 2501,
    duration: '90 mins',
    availableSlots: ['07:30 AM', '10:00 AM'],
    bannerGradient: 'from-amber-800 via-devotional-saffron to-stone-950',
    benefits: ['Planetary Dosha Nivarana', 'Career & Business Growth', 'Sacred Bhasmam & Raksha'],
    isActive: true,
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
  },
  {
    id: 'pooja-04',
    title: 'Sri Vasavi Ammavaru Mahabhishekam',
    deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
    description: 'Grand holy bath with Panchamrutha, fragrant sandalwood, turmeric water, coconut water, and pure Godavari holy water.',
    price: 1501,
    duration: '60 mins',
    availableSlots: ['07:00 AM', '09:30 AM', '06:00 PM'],
    bannerGradient: 'from-devotional-maroon-dark via-amber-950 to-stone-950',
    benefits: ['Inner Peace & Health', 'Direct Sanctum Access', 'Panchamrutha Prasadam'],
    isActive: true,
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
  },
  {
    id: 'pooja-05',
    title: 'Gotra Namarchana & Sankalpam',
    deity: 'Sri Vasavi Matha',
    description: 'Personalized Archana invoking your family lineage and 102 sacred Gotras with special prayers for ancestor blessings and progeny prosperity.',
    price: 751,
    duration: '30 mins',
    availableSlots: ['08:30 AM', '11:00 AM', '04:30 PM', '06:30 PM'],
    bannerGradient: 'from-stone-900 via-devotional-maroon to-stone-950',
    benefits: ['102 Gotra Invocation', 'Family Ancestral Blessings', 'Blessed Kumkuma & Akshata'],
    isActive: true,
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
  },
];

const STORAGE_KEY = 'vasavi_temple_pooja_catalog';

export function getPoojaCatalog(): PoojaItem[] {
  if (typeof window === 'undefined') return DEFAULT_POOJA_CATALOG;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJA_CATALOG));
      return DEFAULT_POOJA_CATALOG;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_POOJA_CATALOG;
  } catch {
    return DEFAULT_POOJA_CATALOG;
  }
}

export function savePoojaCatalog(items: PoojaItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('pooja_catalog_updated'));
  } catch (err) {
    console.error('Failed to save pooja catalog', err);
  }
}
