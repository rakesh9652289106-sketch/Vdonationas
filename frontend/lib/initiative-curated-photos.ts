import { InitiativeType } from './initiatives-data';

export interface CuratedInitiativePhoto {
  id: string;
  title: string;
  category: string;
  initiativeTypes: InitiativeType[];
  url: string;
  thumbnail: string;
  description: string;
  tags: string[];
}

export const PHOTO_CATEGORIES = [
  { id: 'RECOMMENDED', label: 'Recommended', icon: '✨' },
  { id: 'TEMPLE_CONSTRUCTION', label: 'Temple & Gopuram', icon: '🛕' },
  { id: 'TEMPLE_RENOVATION', label: 'Renovation & Sanctum', icon: '🏛️' },
  { id: 'ANNADANAM', label: 'Annadanam & Prasadam', icon: '🍲' },
  { id: 'EDUCATION', label: 'Education & Gurukulam', icon: '📚' },
  { id: 'MEDICAL_ASSISTANCE', label: 'Medical & Healthcare', icon: '🏥' },
  { id: 'EMERGENCY_RELIEF', label: 'Disaster & Relief', icon: '🚨' },
  { id: 'SWARNA_MANDIRAM', label: 'Swarna Mandiram & Rituals', icon: '🪔' },
  { id: 'GOSHALA', label: 'Goshala & Cow Seva', icon: '🐄' },
  { id: 'ALL', label: 'All Photos', icon: '🖼️' },
] as const;

export const CURATED_INITIATIVE_PHOTOS: CuratedInitiativePhoto[] = [
  // 1. TEMPLE CONSTRUCTION & RAJAGOPURAM
  {
    id: 'photo-gopuram-dravidian-1',
    title: 'Towering Dravidian Rajagopuram',
    category: 'TEMPLE_CONSTRUCTION',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'TEMPLE_EXPANSION'],
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    description: 'Majestic multi-tiered Dravidian Rajagopuram with traditional stucco sculptures reaching towards the sky.',
    tags: ['Gopuram', 'Temple', 'Tower', 'Dravidian', 'Architecture'],
  },
  {
    id: 'photo-gopuram-detailed-2',
    title: 'Sacred Temple Tower Iconography',
    category: 'TEMPLE_CONSTRUCTION',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'TEMPLE_EXPANSION', 'RELIGIOUS_ACTIVITIES'],
    url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=400&q=80',
    description: 'Intricate traditional temple tier carvings depicting deities and celestial musicians according to Agamas.',
    tags: ['Sculptures', 'Carving', 'Agamas', 'Temple Tower'],
  },
  {
    id: 'photo-temple-traditional-3',
    title: 'Traditional Granite Stone Gopuram',
    category: 'TEMPLE_CONSTRUCTION',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'INFRASTRUCTURE'],
    url: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=400&q=80',
    description: 'Monolithic carved granite entrance gateway and majestic temple facade.',
    tags: ['Granite', 'Gateway', 'Gopuram', 'Shrine'],
  },
  {
    id: 'photo-temple-illuminated-4',
    title: 'Illuminated Golden Sanctum & Gopuram',
    category: 'TEMPLE_CONSTRUCTION',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'TEMPLE_EXPANSION', 'RELIGIOUS_ACTIVITIES'],
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    description: 'Golden glow illuminating the sacred Vimanam and sanctum sanctorum during evening Deeparadhana.',
    tags: ['Gold', 'Illumination', 'Vimanam', 'Deeparadhana'],
  },
  {
    id: 'photo-temple-architecture-5',
    title: 'Historic Dravidian Temple Structure',
    category: 'TEMPLE_CONSTRUCTION',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'INFRASTRUCTURE'],
    url: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=400&q=80',
    description: 'Grand courtyard, prakaram, and stone sanctum architecture designed for pilgrim parikrama.',
    tags: ['Courtyard', 'Prakaram', 'Sanctum', 'Parikrama'],
  },

  // 2. TEMPLE RENOVATION & HERITAGE CONSERVATION
  {
    id: 'photo-renovation-pillars-1',
    title: 'Ancient Historic Sanctum Stone Pillars',
    category: 'TEMPLE_RENOVATION',
    initiativeTypes: ['TEMPLE_RENOVATION', 'MATHA_DEVELOPMENT'],
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80',
    description: 'Thousand-year-old carved monolithic stone corridor and pillared mandapam undergoing heritage conservation.',
    tags: ['Stone Pillars', 'Heritage', 'Ancient', 'Corridor', 'Conservation'],
  },
  {
    id: 'photo-renovation-carvings-2',
    title: 'Carved Mandapam Granite Pillars',
    category: 'TEMPLE_RENOVATION',
    initiativeTypes: ['TEMPLE_RENOVATION', 'MATHA_DEVELOPMENT'],
    url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=400&q=80',
    description: 'Master sculptors restoring centuries-old intricate floral and deity carvings in sanctum pillars.',
    tags: ['Carving', 'Restoration', 'Mandapam', 'Sanctum'],
  },
  {
    id: 'photo-renovation-courtyard-3',
    title: 'Sacred Heritage Mandapam Courtyard',
    category: 'TEMPLE_RENOVATION',
    initiativeTypes: ['TEMPLE_RENOVATION', 'MATHA_DEVELOPMENT', 'DEVOTEE_SUPPORT'],
    url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=80',
    description: 'Restored inner temple courtyard with traditional stone paved parikrama and cooling stone flooring.',
    tags: ['Courtyard', 'Prakaram', 'Heritage', 'Flooring'],
  },
  {
    id: 'photo-renovation-deepam-4',
    title: 'Divine Sanctum Deeparadhana Light',
    category: 'TEMPLE_RENOVATION',
    initiativeTypes: ['TEMPLE_RENOVATION', 'RELIGIOUS_ACTIVITIES', 'MATHA_DEVELOPMENT'],
    url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=400&q=80',
    description: 'Sacred Akhanda Jyoti brass deepams illuminating the newly conserved sanctum corridor.',
    tags: ['Deepam', 'Sacred Lamp', 'Jyoti', 'Sanctum Light'],
  },

  // 3. ANNADANAM & PILGRIM MEGA KITCHEN
  {
    id: 'photo-annadanam-feast-1',
    title: 'Authentic Sacred Satvik Prasadam Feast',
    category: 'ANNADANAM',
    initiativeTypes: ['ANNADANAM', 'COMMUNITY_WELFARE'],
    url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80',
    description: 'Wholesome satvik pilgrim meal with fragrant sambar, payasam, rice, and traditional curries served with devotion.',
    tags: ['Prasadam', 'Satvik Meal', 'Annadanam', 'Feast', 'Pilgrim Dining'],
  },
  {
    id: 'photo-annadanam-community-2',
    title: 'Communal Pilgrim Hall & Hot Food Seva',
    category: 'ANNADANAM',
    initiativeTypes: ['ANNADANAM', 'COMMUNITY_WELFARE', 'DEVOTEE_SUPPORT'],
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    description: 'Large-scale hygienic community kitchen serving piping hot meals to thousands of devotees daily.',
    tags: ['Community Dining', 'Mass Feeding', 'Kitchen', 'Hot Meals'],
  },
  {
    id: 'photo-annadanam-grain-3',
    title: 'Sacred Rice & Grain Preparation',
    category: 'ANNADANAM',
    initiativeTypes: ['ANNADANAM'],
    url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80',
    description: 'Pure organic grains, pure ghee, and pulses procured for uninterrupted Nitya Annadanam.',
    tags: ['Grains', 'Rice', 'Spices', 'Kitchen Ingredients'],
  },
  {
    id: 'photo-annadanam-bhavan-4',
    title: 'Nitya Annadanam Dining Complex',
    category: 'ANNADANAM',
    initiativeTypes: ['ANNADANAM', 'INFRASTRUCTURE'],
    url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80',
    description: 'Modern spacious dining hall accommodating hundreds of devotees per batch with stainless steel hygiene.',
    tags: ['Dining Hall', 'Kitchen Bhavan', 'Stainless Steel', 'Hygiene'],
  },

  // 4. EDUCATION, VEDA PATASHALA & SCHOLARSHIPS
  {
    id: 'photo-edu-vedic-1',
    title: 'Vedic Scripture Study & Ancient Manuscripts',
    category: 'EDUCATION',
    initiativeTypes: ['EDUCATION', 'RELIGIOUS_ACTIVITIES', 'CULTURAL_PROGRAMS'],
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
    description: 'Veda Patashala scholars preserving traditional Vedic chanting, Agamas, and ancient Shastras.',
    tags: ['Veda', 'Gurukulam', 'Scriptures', 'Shastras', 'Patashala'],
  },
  {
    id: 'photo-edu-scholarship-2',
    title: 'Meritorious Higher Education Students Group',
    category: 'EDUCATION',
    initiativeTypes: ['SCHOLARSHIPS', 'EDUCATION', 'COMMUNITY_WELFARE'],
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
    description: 'Empowering bright young minds from the community with tuition grants for Engineering, Medicine, and CA.',
    tags: ['Scholarships', 'Students', 'Higher Education', 'College', 'Graduates'],
  },
  {
    id: 'photo-edu-classroom-3',
    title: 'Modern Learning Classrooms & Digital Aid',
    category: 'EDUCATION',
    initiativeTypes: ['EDUCATION', 'SCHOLARSHIPS'],
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    description: 'Classrooms equipped with modern digital infrastructure and educational assistance for underprivileged youth.',
    tags: ['Classroom', 'Digital Education', 'School', 'Youth Empowerment'],
  },

  // 5. MEDICAL ASSISTANCE & HEALTHCARE
  {
    id: 'photo-med-clinic-1',
    title: 'Free Mobile Health Van & Doctor Consultation',
    category: 'MEDICAL_ASSISTANCE',
    initiativeTypes: ['MEDICAL_ASSISTANCE', 'COMMUNITY_WELFARE'],
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    description: 'Devoted doctors providing free medical checkups, vital diagnostics, and medicines to rural pilgrims.',
    tags: ['Healthcare', 'Doctor', 'Consultation', 'Mobile Clinic', 'Medical Camp'],
  },
  {
    id: 'photo-med-hospital-2',
    title: 'Modern Dialysis & Speciality Medical Center',
    category: 'MEDICAL_ASSISTANCE',
    initiativeTypes: ['MEDICAL_ASSISTANCE'],
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    description: 'High-tech hemodialysis and advanced care units providing zero-cost treatments for patients in need.',
    tags: ['Dialysis', 'Hospital', 'ICU', 'Specialty Care', 'Life Support'],
  },
  {
    id: 'photo-med-ward-3',
    title: 'Patient Care & Diagnostic Health Facility',
    category: 'MEDICAL_ASSISTANCE',
    initiativeTypes: ['MEDICAL_ASSISTANCE', 'EMERGENCY_RELIEF'],
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80',
    description: 'State-of-the-art care ward equipped with patient monitors, ECG units, and compassionate medical staff.',
    tags: ['Clinic', 'Ward', 'Patient Care', 'Diagnostics'],
  },

  // 6. EMERGENCY RELIEF & DISASTER RESPONSE
  {
    id: 'photo-relief-hands-1',
    title: 'Compassionate Community Hands & Charity',
    category: 'EMERGENCY_RELIEF',
    initiativeTypes: ['EMERGENCY_RELIEF', 'COMMUNITY_WELFARE'],
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
    description: 'United community hands joining together to support vulnerable families in times of crisis and distress.',
    tags: ['Compassion', 'Giving', 'Charity', 'Hands', 'Support'],
  },
  {
    id: 'photo-relief-distribution-2',
    title: 'Disaster Relief Rations & Supply Distribution',
    category: 'EMERGENCY_RELIEF',
    initiativeTypes: ['EMERGENCY_RELIEF', 'COMMUNITY_WELFARE'],
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=400&q=80',
    description: 'Emergency disaster response distributing clean water, dry ration kits, and blankets to cyclone victims.',
    tags: ['Cyclone Relief', 'Flood Aid', 'Ration Kits', 'Emergency Support'],
  },
  {
    id: 'photo-relief-volunteers-3',
    title: 'Volunteer Packing of Relief Packages',
    category: 'EMERGENCY_RELIEF',
    initiativeTypes: ['EMERGENCY_RELIEF'],
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    description: 'Youth and community volunteers swiftly packing food, medicines, and essential groceries for rapid delivery.',
    tags: ['Volunteers', 'Packing', 'Dry Rations', 'Rapid Response'],
  },

  // 7. SWARNA MANDIRAM, VEDIC RITUALS & TEMPLE DOME
  {
    id: 'photo-swarna-mandiram-1',
    title: 'Gleaming Swarna Vimanam & Golden Dome',
    category: 'SWARNA_MANDIRAM',
    initiativeTypes: ['TEMPLE_CONSTRUCTION', 'RELIGIOUS_ACTIVITIES', 'TEMPLE_RENOVATION'],
    url: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=400&q=80',
    description: 'Splendid 24K gold-plated Swarna Vimanam and Kalashams radiating sacred divine brilliance.',
    tags: ['Swarna Mandiram', 'Gold Dome', 'Vimanam', 'Kalasham', 'Golden Temple'],
  },
  {
    id: 'photo-swarna-deepam-2',
    title: 'Sacred Akhanda Deepams & Temple Lamps',
    category: 'SWARNA_MANDIRAM',
    initiativeTypes: ['RELIGIOUS_ACTIVITIES', 'CULTURAL_PROGRAMS', 'TEMPLE_RENOVATION'],
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80',
    description: 'Auspicious glowing brass oil lamps creating a sanctified devotional aura in the inner sanctum.',
    tags: ['Deepam', 'Oil Lamp', 'Akhanda Jyoti', 'Temple Ritual'],
  },

  // 8. GOSHALA & SACRED COW SEVA
  {
    id: 'photo-goshala-cow-1',
    title: 'Sacred Kamadhenu Goshala Cow Seva',
    category: 'GOSHALA',
    initiativeTypes: ['OTHER', 'DEVOTEE_SUPPORT', 'RELIGIOUS_ACTIVITIES'],
    url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80',
    description: 'Devoted care and lifelong protection of sacred indigenous cows in the Matha temple Goshala.',
    tags: ['Goshala', 'Kamadhenu', 'Cow Seva', 'Gomatha'],
  },
];

// Return curated photos recommended for a specific initiative type
export function getCuratedPhotosForInitiativeType(initiativeType?: InitiativeType): CuratedInitiativePhoto[] {
  if (!initiativeType) return CURATED_INITIATIVE_PHOTOS;

  const matched = CURATED_INITIATIVE_PHOTOS.filter((p) => p.initiativeTypes.includes(initiativeType));
  if (matched.length > 0) return matched;

  // Fallback to related category
  if (initiativeType.includes('TEMPLE')) {
    return CURATED_INITIATIVE_PHOTOS.filter((p) => p.category === 'TEMPLE_CONSTRUCTION' || p.category === 'TEMPLE_RENOVATION');
  }
  return CURATED_INITIATIVE_PHOTOS;
}

// Return curated photos by category filter
export function getCuratedPhotosByCategory(category: string, initiativeType?: InitiativeType): CuratedInitiativePhoto[] {
  if (category === 'RECOMMENDED') {
    return getCuratedPhotosForInitiativeType(initiativeType);
  }
  if (category === 'ALL') {
    return CURATED_INITIATIVE_PHOTOS;
  }
  return CURATED_INITIATIVE_PHOTOS.filter((p) => p.category === category);
}
