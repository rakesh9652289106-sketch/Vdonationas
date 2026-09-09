export type InitiativeType =
  | 'TEMPLE_CONSTRUCTION'
  | 'TEMPLE_RENOVATION'
  | 'TEMPLE_EXPANSION'
  | 'MATHA_DEVELOPMENT'
  | 'ANNADANAM'
  | 'EDUCATION'
  | 'SCHOLARSHIPS'
  | 'MEDICAL_ASSISTANCE'
  | 'COMMUNITY_WELFARE'
  | 'EMERGENCY_RELIEF'
  | 'INFRASTRUCTURE'
  | 'RELIGIOUS_ACTIVITIES'
  | 'CULTURAL_PROGRAMS'
  | 'DEVOTEE_SUPPORT'
  | 'OTHER';

export type InitiativePriority = 'NORMAL' | 'HIGH' | 'URGENT';

export type InitiativeStage =
  | 'PROPOSED'
  | 'FOUNDATION'
  | 'STRUCTURE'
  | 'FINISHING'
  | 'COMPLETED';

export type InitiativeStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'SCHEDULED'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CLOSED'
  | 'REJECTED';

export interface InitiativeBreakdownItem {
  id: string;
  category: string;
  target_amount: number;
  description: string;
  order: number;
}

export interface InitiativeUpdate {
  id: string;
  title: string;
  message: string;
  images: string[];
  posted_by_name?: string;
  posted_at: string;
}

export interface InitiativeExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  invoice_ref?: string;
  receipt_url?: string;
  expense_date: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  recorded_by_name?: string;
  approved_by_name?: string;
  created_at: string;
}

export interface InitiativeAuditLog {
  id: string;
  action: string;
  user_name?: string;
  previous_value?: string;
  new_value?: string;
  timestamp: string;
}

export interface InitiativeDocument {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Initiative {
  id: string;
  code: string; // e.g. 'VD-INI-2026-0001'
  title: string;
  short_title: string;
  initiative_type: InitiativeType;
  custom_type?: string;
  description: string;
  objective?: string;
  priority: InitiativePriority;
  is_urgent: boolean;

  // Location
  address?: string;
  city: string;
  district?: string;
  state: string;
  pin_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  has_physical_location: boolean;

  // Financials
  target_amount: number;
  current_raised: number;
  donor_count: number;
  min_donation: number;
  suggested_amounts: number[];
  start_date: string;
  end_date?: string;

  // Media
  cover_image?: string;
  gallery_images: string[];
  documents: InitiativeDocument[];

  // Lifecycle
  current_stage: InitiativeStage;
  status: InitiativeStatus;
  scheduled_publish_at?: string;
  is_teaser_enabled?: boolean;
  teaser_start_at?: string; // Optional: time from which devotees can see the countdown in portal
  muhurtham_name?: string;
  broadcast_on_publish?: boolean;
  excess_funds_policy: string;

  // Completion
  completion_date?: string;
  final_report?: string;
  completion_images?: string[];

  // Nested
  breakdown_items: InitiativeBreakdownItem[];
  updates: InitiativeUpdate[];
  expenses: InitiativeExpense[];
  audit_logs: InitiativeAuditLog[];

  percentage_funded?: number;
  total_approved_expenses?: number;
  remaining_funds?: number;
  created_at: string;
  updated_at?: string;
}

export const INITIATIVE_TYPE_LABELS: Record<InitiativeType, { label: string; icon: string; badgeColor: string }> = {
  TEMPLE_CONSTRUCTION: { label: 'Temple Construction', icon: '🛕', badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300' },
  TEMPLE_RENOVATION: { label: 'Temple Renovation', icon: '🏛️', badgeColor: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 border-orange-300' },
  TEMPLE_EXPANSION: { label: 'Temple Expansion', icon: '🏰', badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300' },
  MATHA_DEVELOPMENT: { label: 'Matha Development', icon: '🚩', badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300' },
  ANNADANAM: { label: 'Annadanam', icon: '🍲', badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' },
  EDUCATION: { label: 'Education', icon: '📚', badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border-blue-300' },
  SCHOLARSHIPS: { label: 'Scholarships', icon: '🎓', badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300' },
  MEDICAL_ASSISTANCE: { label: 'Medical Assistance', icon: '🏥', badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border-teal-300' },
  COMMUNITY_WELFARE: { label: 'Community Welfare', icon: '🤝', badgeColor: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300' },
  EMERGENCY_RELIEF: { label: 'Emergency Relief', icon: '🚨', badgeColor: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border-red-300' },
  INFRASTRUCTURE: { label: 'Infrastructure', icon: '🏗️', badgeColor: 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-300 border-stone-400' },
  RELIGIOUS_ACTIVITIES: { label: 'Religious Activities', icon: '🪔', badgeColor: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300' },
  CULTURAL_PROGRAMS: { label: 'Cultural Programs', icon: '🎭', badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border-purple-300' },
  DEVOTEE_SUPPORT: { label: 'Devotee Support', icon: '❤️', badgeColor: 'bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-300 border-pink-300' },
  OTHER: { label: 'Other', icon: '✨', badgeColor: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300' },
};

export const STAGE_STEPS: { stage: InitiativeStage; label: string; description: string; stepNumber: number }[] = [
  { stage: 'PROPOSED', label: 'Proposed', description: 'Architectural Agamic Planning & Approvals', stepNumber: 1 },
  { stage: 'FOUNDATION', label: 'Foundation', description: 'Bhoomi Pooja & Deep Sanctum Foundation', stepNumber: 2 },
  { stage: 'STRUCTURE', label: 'Structure', description: 'Stone Pillars, Sthapathi Carving & Walls', stepNumber: 3 },
  { stage: 'FINISHING', label: 'Finishing', description: 'Marble Flooring, Kalasham & Electrification', stepNumber: 4 },
  { stage: 'COMPLETED', label: 'Completed', description: 'Maha Kumbhabhishekam & Consecration', stepNumber: 5 },
];

export const INITIAL_INITIATIVES: Initiative[] = [
  {
    id: 'ini-001',
    code: 'VD-INI-2026-0001',
    title: 'Sri Vasavi Maha Gopuram & Temple Construction',
    short_title: 'Vijayawada Maha Gopuram',
    initiative_type: 'TEMPLE_CONSTRUCTION',
    description: 'Grand construction of a 7-tier traditional Dravidian style Rajagopuram and dedicated inner sanctum for Sri Vasavi Kanyaka Parameswari Matha in Vijayawada. Designed by traditional Shilpis conforming strictly to Agama Shastras.',
    objective: 'Erect a 63-foot sacred Rajagopuram with gold-gilded Kalashams, sanctum vimana, and marble parikrama for 5,000 pilgrims daily.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Indrakeeladri Foothills, Canal Road',
    city: 'Vijayawada',
    district: 'NTR District',
    state: 'Andhra Pradesh',
    pin_code: '520001',
    country: 'India',
    latitude: 16.5167,
    longitude: 80.6167,
    has_physical_location: true,
    target_amount: 5000000,
    current_raised: 3450000,
    donor_count: 428,
    min_donation: 100,
    suggested_amounts: [501, 1001, 2501, 5001, 10001, 25001],
    start_date: '2026-05-01',
    end_date: '2027-04-30',
    cover_image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [
      { name: 'Architectural Agamic Plan.pdf', size: '4.2 MB', type: 'PDF Blueprint' },
      { name: 'Structural Engineering Assessment.pdf', size: '2.8 MB', type: 'Government Approval' },
    ],
    current_stage: 'STRUCTURE',
    status: 'PUBLISHED',
    excess_funds_policy: 'Any excess contributions above ₹50 Lakhs will be transferred to the permanent Nitya Deeparadhana and Annadanam Endowment Corpus.',
    breakdown_items: [
      { id: 'bd-1', category: 'Bhoomi Pooja & Deep Foundation', target_amount: 800000, description: 'Reinforced stone foundation and Vedic consecration', order: 0 },
      { id: 'bd-2', category: 'Gopuram Stone Carving & Pillars', target_amount: 2200000, description: 'Granite stone carving by Master Sculptors from Kanchipuram', order: 1 },
      { id: 'bd-3', category: 'Gold-Gilded Kalasham & Vimanam', target_amount: 1200000, description: '7 Brass Kalashams plated with 24K gold foil', order: 2 },
      { id: 'bd-4', category: 'Prakaram Marble Flooring & Electrification', target_amount: 800000, description: 'Cooling Makrana marble and architectural devotional lighting', order: 3 },
    ],
    updates: [
      {
        id: 'up-1',
        title: 'Tier-4 Granite Pillars Installed Successfully',
        message: 'With the divine grace of Sri Vasavi Matha, all 16 monolithic carved granite pillars for Tier 4 were safely hoisted and locked by master artisans today.',
        images: ['https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80'],
        posted_by_name: 'Chief Sthapathi',
        posted_at: '2026-08-28T10:30:00Z',
      },
    ],
    expenses: [
      {
        id: 'exp-1',
        category: 'Granite Stone Materials',
        amount: 650000,
        description: 'Procurement of Phase-2 Krishna district black granite blocks',
        invoice_ref: 'INV-BLG-2026-088',
        expense_date: '2026-08-16',
        status: 'APPROVED',
        recorded_by_name: 'Finance Controller',
        approved_by_name: 'Super Admin',
        created_at: '2026-08-16T14:20:00Z',
      },
      {
        id: 'exp-2',
        category: 'Sculptor Artisan Dakshina',
        amount: 420000,
        description: 'Milestone payment for 12 artisan sculptors on Tier-3 iconography',
        invoice_ref: 'VCH-ART-2026-104',
        expense_date: '2026-08-26',
        status: 'APPROVED',
        recorded_by_name: 'Finance Controller',
        approved_by_name: 'Super Admin',
        created_at: '2026-08-26T18:10:00Z',
      },
    ],
    audit_logs: [
      { id: 'aud-1', action: 'INITIATIVE_PUBLISHED', user_name: 'Super Admin', previous_value: 'DRAFT', new_value: 'PUBLISHED', timestamp: '2026-05-01T09:00:00Z' },
      { id: 'aud-2', action: 'STAGE_ADVANCED', user_name: 'Super Admin', previous_value: 'FOUNDATION', new_value: 'STRUCTURE', timestamp: '2026-07-15T11:00:00Z' },
    ],
    percentage_funded: 69.0,
    total_approved_expenses: 1070000,
    remaining_funds: 2380000,
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'ini-002',
    code: 'VD-INI-2026-0002',
    title: 'Penugonda Sri Vasavi Matha Moola Sthana Renovation',
    short_title: 'Penugonda Heritage Renovation',
    initiative_type: 'TEMPLE_RENOVATION',
    description: 'Comprehensive conservation and heritage renovation of the sanctum sanctorum at the sacred birthplace and Moola Sthanam of Sri Vasavi Kanyaka Parameswari Matha in Penugonda, West Godavari.',
    objective: 'Preserve 1,000-year-old historic stone architecture, restore teak wood carvings, and modernize rainwater drainage without altering sacred antiquity.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Moola Sthana Devasthanam, Temple Street',
    city: 'Penugonda',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    country: 'India',
    latitude: 16.6667,
    longitude: 81.7333,
    has_physical_location: true,
    target_amount: 2500000,
    current_raised: 1925000,
    donor_count: 312,
    min_donation: 100,
    suggested_amounts: [501, 1001, 2116, 5001, 11116],
    start_date: '2026-06-01',
    end_date: '2026-12-31',
    cover_image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [],
    current_stage: 'STRUCTURE',
    status: 'PUBLISHED',
    excess_funds_policy: 'Excess funds will be utilized for ongoing daily floral alankaram and temple upkeep.',
    breakdown_items: [
      { id: 'bd-21', category: 'Sacred Teak Wood Carving Restoration', target_amount: 900000, description: 'Burma teak preservation & organic herbal polishing', order: 0 },
      { id: 'bd-22', category: 'Sub-Surface Water Barrier & Drainage', target_amount: 700000, description: 'Preventing dampness in ancient sanctum foundations', order: 1 },
      { id: 'bd-23', category: 'Copper Conduit Vedic Lighting', target_amount: 500000, description: 'Concealed heritage electrical safety upgrades', order: 2 },
      { id: 'bd-24', category: 'Silver Door Foil Replating', target_amount: 400000, description: 'Replating 99.9% fine silver door cladding', order: 3 },
    ],
    updates: [],
    expenses: [
      {
        id: 'exp-21',
        category: 'Teak Wood Herbal Treatment',
        amount: 340000,
        description: 'Herbal insect & moisture proofing chemical application',
        invoice_ref: 'INV-WOOD-891',
        expense_date: '2026-07-20',
        status: 'APPROVED',
        created_at: '2026-07-20T10:00:00Z',
      },
    ],
    audit_logs: [],
    percentage_funded: 77.0,
    total_approved_expenses: 340000,
    remaining_funds: 1585000,
    created_at: '2026-06-01T09:00:00Z',
  },
  {
    id: 'ini-003',
    code: 'VD-INI-2026-0003',
    title: 'Nitya Annadanam Bhavan & Pilgrim Mega Kitchen',
    short_title: 'Annadanam Mega Kitchen',
    initiative_type: 'ANNADANAM',
    description: 'Establishment of a modern eco-friendly solar-powered mega kitchen capable of serving wholesome satvik meals to 10,000 devotees and hungry pilgrims every single day.',
    objective: 'Zero hunger for any devotee visiting Sri Vasavi Matha shrines, with fully automated roti makers, steam boilers, and hygienic stainless steel dining.',
    priority: 'URGENT',
    is_urgent: true,
    address: 'Arya Vysya Pilgrim Complex, Ring Road',
    city: 'Penugonda',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    country: 'India',
    latitude: 16.671,
    longitude: 81.738,
    has_physical_location: true,
    target_amount: 3500000,
    current_raised: 2890000,
    donor_count: 645,
    min_donation: 50,
    suggested_amounts: [251, 501, 1001, 2501, 5001, 10001],
    start_date: '2026-07-01',
    end_date: '2026-11-30',
    cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [],
    current_stage: 'FINISHING',
    status: 'PUBLISHED',
    excess_funds_policy: 'Surplus donations will directly buy high quality organic rice, ghee, and provisions for continuous feeding.',
    breakdown_items: [
      { id: 'bd-31', category: 'Commercial Automated Steam Boiler Units', target_amount: 1400000, description: 'Zero-emission solar steam cooking plant', order: 0 },
      { id: 'bd-32', category: 'Stainless Steel Dining Hall & Furniture', target_amount: 1100000, description: 'SS-304 food-grade seating for 500 people per batch', order: 1 },
      { id: 'bd-33', category: 'Cold Storage & Grain Silos', target_amount: 1000000, description: 'Hygienic storage for 50 tonnes of rice & pulses', order: 2 },
    ],
    updates: [
      {
        id: 'up-31',
        title: 'Boiler & Steam Pipe Network Pressure Tested',
        message: 'All commercial steam boilers passed inspection with zero emission certification.',
        images: [],
        posted_by_name: 'Trust Engineer',
        posted_at: '2026-08-30T15:00:00Z',
      },
    ],
    expenses: [
      {
        id: 'exp-31',
        category: 'Boiler Unit Purchase',
        amount: 850000,
        description: 'Procurement of twin industrial solar-assisted boilers',
        invoice_ref: 'INV-BLR-0941',
        expense_date: '2026-08-10',
        status: 'APPROVED',
        created_at: '2026-08-10T11:00:00Z',
      },
    ],
    audit_logs: [],
    percentage_funded: 82.6,
    total_approved_expenses: 850000,
    remaining_funds: 2040000,
    created_at: '2026-07-01T08:30:00Z',
  },
  {
    id: 'ini-004',
    code: 'VD-INI-2026-0004',
    title: 'Sri Vasavi Vidya Nidhi Merit & Higher Education Scholarship',
    short_title: 'Vidya Nidhi Scholarship 2026',
    initiative_type: 'SCHOLARSHIPS',
    description: 'Annual scholarship fund providing financial assistance to deserving and underprivileged students from the Arya Vysya community pursuing Engineering, Medicine, CA, and IAS examinations.',
    objective: 'Sponsor complete tuition fees, books, and laptops for 200 meritorious students for the academic year 2026-27.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Vasavi Educational Trust Central Secretariat',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pin_code: '500001',
    country: 'India',
    has_physical_location: false,
    target_amount: 2000000,
    current_raised: 1420000,
    donor_count: 280,
    min_donation: 500,
    suggested_amounts: [1001, 2501, 5001, 10001, 25001],
    start_date: '2026-08-01',
    end_date: '2026-10-31',
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [],
    current_stage: 'STRUCTURE',
    status: 'PUBLISHED',
    excess_funds_policy: 'Excess scholarship funds will directly roll over into next semester student disbursements.',
    breakdown_items: [
      { id: 'bd-41', category: 'Engineering & Technology Tuition Grants', target_amount: 1000000, description: 'Direct college tuition grants for 80 B.Tech students', order: 0 },
      { id: 'bd-42', category: 'Medical & CA Aspirant Stipends', target_amount: 600000, description: 'Coaching fees & medical textbooks for 40 students', order: 1 },
      { id: 'bd-43', category: 'Laptop & Digital Device Aid', target_amount: 400000, description: 'Laptops for underprivileged girls pursuing coding degrees', order: 2 },
    ],
    updates: [],
    expenses: [
      {
        id: 'exp-41',
        category: 'First Semester Direct Disbursements',
        amount: 450000,
        description: 'Disbursed to 35 verified college accounts',
        invoice_ref: 'DISB-2026-001',
        expense_date: '2026-08-25',
        status: 'APPROVED',
        created_at: '2026-08-25T12:00:00Z',
      },
    ],
    audit_logs: [],
    percentage_funded: 71.0,
    total_approved_expenses: 450000,
    remaining_funds: 970000,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'ini-005',
    code: 'VD-INI-2026-0005',
    title: 'Vasavi Arogya Seva Mobile Clinic & Free Dialysis Center',
    short_title: 'Arogya Seva Mobile Clinic',
    initiative_type: 'MEDICAL_ASSISTANCE',
    description: 'Procurement of 2 state-of-the-art mobile healthcare vans and setup of 4 free dialysis machines for rural families and elderly devotees suffering from renal disorders.',
    objective: 'Deliver free preventive screening, medication, and dialysis to 15,000 rural residents annually.',
    priority: 'URGENT',
    is_urgent: true,
    address: 'Vasavi Hospital Complex',
    city: 'Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    pin_code: '522002',
    country: 'India',
    latitude: 16.3067,
    longitude: 80.4365,
    has_physical_location: true,
    target_amount: 4000000,
    current_raised: 3100000,
    donor_count: 510,
    min_donation: 250,
    suggested_amounts: [501, 1001, 2501, 5001, 15001],
    start_date: '2026-07-15',
    end_date: '2026-10-15',
    cover_image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [],
    current_stage: 'FINISHING',
    status: 'PUBLISHED',
    excess_funds_policy: 'Excess funds establish an emergency dialyzer consumables bank.',
    breakdown_items: [
      { id: 'bd-51', category: '4x Fresenius Hemodialysis Units', target_amount: 2200000, description: 'Medical grade hemodialysis systems with RO water plant', order: 0 },
      { id: 'bd-52', category: 'Customized Mobile Medical Van', target_amount: 1400000, description: 'Fully equipped van with ECG, vitals monitor, and doctor cabin', order: 1 },
      { id: 'bd-53', category: 'Consumables & Dialyzer Kits', target_amount: 400000, description: 'Dialyzer kits for first 1,000 free sessions', order: 2 },
    ],
    updates: [],
    expenses: [
      {
        id: 'exp-51',
        category: 'Hemodialysis Unit Advance',
        amount: 1100000,
        description: '50% equipment advance to authorized medical distributor',
        invoice_ref: 'INV-MED-0481',
        expense_date: '2026-08-05',
        status: 'APPROVED',
        created_at: '2026-08-05T09:00:00Z',
      },
    ],
    audit_logs: [],
    percentage_funded: 77.5,
    total_approved_expenses: 1100000,
    remaining_funds: 2000000,
    created_at: '2026-07-15T09:00:00Z',
  },
  {
    id: 'ini-006',
    code: 'VD-INI-2026-0006',
    title: 'Coastal Andhra Devotee Emergency Cyclone & Flood Relief Fund',
    short_title: 'Emergency Cyclone Relief',
    initiative_type: 'EMERGENCY_RELIEF',
    description: 'Emergency rapid response relief fund providing dry rations, tarpaulins, drinking water, medical kits, and temporary shelter rehabilitation for devotee families affected by coastal storm surges.',
    objective: 'Distribute 5,000 emergency relief kits and rebuild roof structures for 150 damaged devotee homes within 30 days.',
    priority: 'URGENT',
    is_urgent: true,
    address: 'Emergency Relief Camp, Port Road',
    city: 'Machilipatnam',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    pin_code: '521001',
    country: 'India',
    latitude: 16.18,
    longitude: 81.13,
    has_physical_location: true,
    target_amount: 1500000,
    current_raised: 1280000,
    donor_count: 390,
    min_donation: 100,
    suggested_amounts: [501, 1001, 2001, 5001, 10001],
    start_date: '2026-08-20',
    end_date: '2026-09-25',
    cover_image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [],
    current_stage: 'STRUCTURE',
    status: 'PUBLISHED',
    excess_funds_policy: 'Excess funds are kept in the Arya Vysya Disaster Contingency Reserve.',
    breakdown_items: [
      { id: 'bd-61', category: '5,000 Emergency Dry Ration Kits', target_amount: 800000, description: 'Rice, dal, oil, milk powder, salt, and matchboxes', order: 0 },
      { id: 'bd-62', category: 'Heavy Duty Waterproof Tarpaulins', target_amount: 400000, description: '1,500 thick tarpaulin sheets for damaged roofs', order: 1 },
      { id: 'bd-63', category: 'First Aid, Chlorine & Water Cans', target_amount: 300000, description: 'Water purification drops, medicines, and 20L cans', order: 2 },
    ],
    updates: [
      {
        id: 'up-61',
        title: 'First 1,200 Food & Medicine Packets Distributed',
        message: 'Relief vans reached 4 low-lying coastal villages in Krishna district with hot meals and dry ration kits.',
        images: [],
        posted_by_name: 'Disaster Relief Coordinator',
        posted_at: '2026-09-02T16:00:00Z',
      },
    ],
    expenses: [
      {
        id: 'exp-61',
        category: 'Emergency Provisions Wholesale Purchase',
        amount: 520000,
        description: 'Wholesale rice and groceries from Vijayawada APMC yard',
        invoice_ref: 'INV-APMC-902',
        expense_date: '2026-08-25',
        status: 'APPROVED',
        created_at: '2026-08-25T16:00:00Z',
      },
    ],
    audit_logs: [],
    percentage_funded: 85.3,
    total_approved_expenses: 520000,
    remaining_funds: 760000,
    created_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'ini-007',
    code: 'VD-INI-2026-0007',
    title: 'Sri Vasavi Veda Agama Gurukulam & Swarna Mandiram',
    short_title: 'Swarna Mandiram & Gurukulam',
    initiative_type: 'TEMPLE_CONSTRUCTION',
    description: 'Divine construction of a traditional 3-tier Veda Agama Gurukulam and Swarna Mandiram dedicated to Sri Vasavi Kanyaka Parameswari Matha. Free boarding, Agamic training, and Vedic scripture preservation for 108 young scholars.',
    objective: 'Erect an Agamic Gurukulam complex and gold-plated inner shrine adhering strictly to ancient Shilpa Shastras.',
    priority: 'HIGH',
    is_urgent: false,
    address: 'Penugonda Devasthanam Grounds, Near Godavari Ghat',
    city: 'Penugonda',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    pin_code: '534320',
    country: 'India',
    latitude: 16.6667,
    longitude: 81.7333,
    has_physical_location: true,
    target_amount: 10000000,
    current_raised: 0,
    donor_count: 0,
    min_donation: 501,
    suggested_amounts: [501, 1116, 2501, 5001, 11116, 25001],
    start_date: '2026-09-06',
    cover_image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [{ name: 'Vedic Sanctum Blueprint.pdf', size: '3.4 MB', type: 'PDF' }],
    current_stage: 'PROPOSED',
    status: 'SCHEDULED',
    scheduled_publish_at: '2026-09-06T04:30',
    muhurtham_name: 'Brahma Muhurtham (04:30 AM - 06:00 AM)',
    is_teaser_enabled: true,
    broadcast_on_publish: true,
    excess_funds_policy: 'Excess funds will be utilized for lifetime scholar stipends, Agamic publications, and Nitya Annadanam.',
    breakdown_items: [
      { id: 'bd-71', category: 'Vedic Sanctum Bhoomi Consecration', target_amount: 2500000, description: 'Agamic foundation and Bhoomi Pooja', order: 0 },
      { id: 'bd-72', category: 'Gurukulam Classrooms & Residential Quarters', target_amount: 4500000, description: 'Dormitories and scripture library for 108 scholars', order: 1 },
      { id: 'bd-73', category: 'Swarna Vimanam Gold Cladding', target_amount: 3000000, description: '24K pure gold plating for main sanctum vimanam', order: 2 },
    ],
    updates: [],
    expenses: [],
    audit_logs: [
      { id: 'aud-71', action: 'INITIATIVE_CREATED', user_name: 'Super Admin', previous_value: '', new_value: 'Created scheduled initiative with Brahma Muhurtham countdown', timestamp: '2026-09-05T12:00:00Z' },
    ],
    created_at: '2026-09-05T12:00:00Z',
  },
];

// Local state storage (in-memory with optional localStorage support for browser persistence)
let localInitiativesState: Initiative[] = [...INITIAL_INITIATIVES];

export function normalizeInitiative(raw: any): Initiative {
  const target_amount = Number(raw.target_amount || 0);
  const current_raised = Number(raw.current_raised || 0);
  const min_donation = Number(raw.min_donation || 100);

  const expenses = (raw.expenses || []).map((e: any, idx: number) => ({
    id: String(e.id || `exp-${idx}-${Date.now()}`),
    category: e.category || 'General',
    amount: Number(e.amount || 0),
    description: e.description || '',
    invoice_ref: e.invoice_ref || undefined,
    receipt_url: e.receipt_url || undefined,
    expense_date: e.expense_date || new Date().toISOString().split('T')[0],
    status: (e.status || 'APPROVED') as 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED',
    recorded_by_name: e.recorded_by_name,
    approved_by_name: e.approved_by_name,
    created_at: e.created_at || new Date().toISOString(),
  }));

  const approvedTotal = expenses
    .filter((e: any) => e.status === 'APPROVED')
    .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

  const breakdown_items = (raw.breakdown_items || []).map((b: any, idx: number) => ({
    id: String(b.id || `bd-${idx}`),
    category: b.category || 'Allocation',
    target_amount: Number(b.target_amount || 0),
    description: b.description || '',
    order: Number(b.order ?? idx),
  }));

  const updates = (raw.updates || []).map((u: any, idx: number) => ({
    id: String(u.id || `up-${idx}`),
    title: u.title || 'Update',
    message: u.message || '',
    images: Array.isArray(u.images) ? u.images : [],
    posted_by_name: u.posted_by_name || 'Temple Administrator',
    posted_at: u.posted_at || new Date().toISOString(),
  }));

  const audit_logs = (raw.audit_logs || []).map((a: any, idx: number) => ({
    id: String(a.id || `aud-${idx}`),
    action: a.action || 'ACTIVITY',
    user_name: a.user_name || 'System',
    previous_value: a.previous_value || '',
    new_value: a.new_value || '',
    timestamp: a.timestamp || new Date().toISOString(),
  }));

  const percentage_funded = target_amount > 0 ? Math.min(Math.round((current_raised / target_amount) * 100), 100) : 0;
  const remaining_funds = Math.max(current_raised - approvedTotal, 0);

  // If scheduled and the time has already arrived, automatically activate to PUBLISHED
  let computedStatus: InitiativeStatus = (raw.status || 'PUBLISHED') as InitiativeStatus;
  if (computedStatus === 'SCHEDULED' && raw.scheduled_publish_at) {
    if (new Date(raw.scheduled_publish_at).getTime() <= Date.now()) {
      computedStatus = 'PUBLISHED';
      if (raw.broadcast_on_publish !== false && typeof window !== 'undefined') {
        setTimeout(() => {
          dispatchInitiativeBroadcastNotification({ ...raw, status: 'PUBLISHED' } as any);
        }, 100);
      }
    }
  }

  return {
    id: String(raw.id || `ini-${Date.now()}`),
    code: String(raw.code || 'VD-INI-0000'),
    title: raw.title || 'Untitled Initiative',
    short_title: raw.short_title || raw.title?.slice(0, 30) || 'Initiative',
    initiative_type: raw.initiative_type || 'TEMPLE_CONSTRUCTION',
    custom_type: raw.custom_type,
    description: raw.description || '',
    objective: raw.objective || '',
    priority: raw.priority || 'NORMAL',
    is_urgent: !!raw.is_urgent,
    address: raw.address,
    city: raw.city || 'Penugonda',
    district: raw.district,
    state: raw.state || 'Andhra Pradesh',
    pin_code: raw.pin_code || '534320',
    country: raw.country || 'India',
    latitude: raw.latitude != null && !isNaN(Number(raw.latitude)) ? Number(raw.latitude) : undefined,
    longitude: raw.longitude != null && !isNaN(Number(raw.longitude)) ? Number(raw.longitude) : undefined,
    has_physical_location: raw.has_physical_location ?? true,
    target_amount,
    current_raised,
    donor_count: Number(raw.donor_count || 0),
    min_donation,
    suggested_amounts: Array.isArray(raw.suggested_amounts) && raw.suggested_amounts.length > 0 ? raw.suggested_amounts.map(Number) : [501, 1001, 2501, 5001, 10001],
    start_date: raw.start_date || new Date().toISOString().split('T')[0],
    end_date: raw.end_date,
    cover_image: raw.cover_image || 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80',
    gallery_images: Array.isArray(raw.gallery_images) ? raw.gallery_images : [],
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    current_stage: raw.current_stage || 'PROPOSED',
    status: computedStatus,
    scheduled_publish_at: raw.scheduled_publish_at || undefined,
    is_teaser_enabled: raw.is_teaser_enabled !== false,
    teaser_start_at: raw.teaser_start_at || undefined,
    muhurtham_name: raw.muhurtham_name || undefined,
    broadcast_on_publish: raw.broadcast_on_publish !== false,
    excess_funds_policy: raw.excess_funds_policy || 'Excess funds will be directed to temple Annadanam and devotee welfare.',
    breakdown_items,
    updates,
    expenses,
    audit_logs,
    percentage_funded,
    total_approved_expenses: approvedTotal,
    remaining_funds,
    completion_date: raw.completion_date,
    final_report: raw.final_report,
    completion_images: Array.isArray(raw.completion_images) ? raw.completion_images : [],
    created_at: raw.created_at || new Date().toISOString(),
  };
}

function getStoredInitiatives(): Initiative[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('vasavi_initiatives_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeInitiative);
        }
      } catch {
        // fallback
      }
    }
  }
  return localInitiativesState.map(normalizeInitiative);
}

function setStoredInitiatives(list: Initiative[]) {
  const normalized = list.map(normalizeInitiative);
  localInitiativesState = normalized;
  if (typeof window !== 'undefined') {
    localStorage.setItem('vasavi_initiatives_data', JSON.stringify(normalized));
  }
}

// Determines if a scheduled initiative's countdown teaser is currently visible to devotees
export function isInitiativeTeaserVisible(initiative: Initiative): boolean {
  if (initiative.status !== 'SCHEDULED' || !initiative.is_teaser_enabled) {
    return false;
  }
  const now = Date.now();
  if (initiative.scheduled_publish_at && new Date(initiative.scheduled_publish_at).getTime() <= now) {
    return false;
  }
  // Optional countdown start time: only visible to devotees from that timestamp onwards
  if (initiative.teaser_start_at) {
    const startMs = new Date(initiative.teaser_start_at).getTime();
    if (now < startMs) {
      return false; // Not yet time for devotees to see the countdown
    }
  }
  return true;
}

// Service methods with network first, fallback to store
export async function getInitiatives(filters?: { status?: string; type?: string; urgent?: boolean; search?: string }): Promise<Initiative[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
    if (filters?.urgent) params.append('urgent', 'true');
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`http://127.0.0.1:8000/api/v1/initiatives/?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      if (results.length > 0) {
        const normalizedList = results.map(normalizeInitiative);
        setStoredInitiatives(normalizedList);
        return normalizedList;
      }
    }
  } catch {
    // Backend offline or network failure, use local storage fallback
  }

  let list = getStoredInitiatives();
  if (filters?.status && filters.status !== 'ALL') {
    if (filters.status === 'PUBLISHED') {
      list = list.filter((i) => i.status === 'PUBLISHED' || isInitiativeTeaserVisible(i));
    } else {
      list = list.filter((i) => i.status === filters.status);
    }
  }
  if (filters?.type && filters.type !== 'ALL') {
    list = list.filter((i) => i.initiative_type === filters.type);
  }
  if (filters?.urgent) {
    list = list.filter((i) => i.is_urgent);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getInitiativeByCode(codeOrId: string): Promise<Initiative | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(codeOrId)}/`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const item = await res.json();
      const normalized = normalizeInitiative(item);
      // Sync into local list
      const list = getStoredInitiatives();
      const idx = list.findIndex((i) => i.code === normalized.code || i.id === normalized.id);
      if (idx >= 0) {
        list[idx] = normalized;
      } else {
        list.push(normalized);
      }
      setStoredInitiatives(list);
      return normalized;
    }
  } catch {
    // fallback
  }

  const list = getStoredInitiatives();
  return list.find((i) => i.code === codeOrId || i.id === codeOrId) || null;
}

export async function createInitiative(payload: Partial<Initiative>): Promise<Initiative> {
  const code = `VD-INI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const statusToSet: InitiativeStatus = payload.status || (payload.scheduled_publish_at ? 'SCHEDULED' : 'PUBLISHED');

  const rawInitiative = {
    id: `ini-${Date.now()}`,
    code,
    title: payload.title || 'Untitled Initiative',
    short_title: payload.short_title || payload.title?.slice(0, 30) || 'Initiative',
    initiative_type: payload.initiative_type || 'TEMPLE_CONSTRUCTION',
    custom_type: payload.custom_type,
    description: payload.description || '',
    objective: payload.objective || '',
    priority: payload.priority || 'NORMAL',
    is_urgent: !!payload.is_urgent,
    address: payload.address || '',
    city: payload.city || 'Penugonda',
    district: payload.district || '',
    state: payload.state || 'Andhra Pradesh',
    pin_code: payload.pin_code || '534320',
    country: payload.country || 'India',
    latitude: payload.latitude,
    longitude: payload.longitude,
    has_physical_location: payload.has_physical_location ?? true,
    target_amount: Number(payload.target_amount) || 100000,
    current_raised: 0,
    donor_count: 0,
    min_donation: Number(payload.min_donation) || 100,
    suggested_amounts: payload.suggested_amounts?.length ? payload.suggested_amounts : [501, 1001, 2501, 5001, 10001],
    start_date: payload.start_date || new Date().toISOString().split('T')[0],
    end_date: payload.end_date,
    cover_image: payload.cover_image || 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80',
    gallery_images: payload.gallery_images || [],
    documents: payload.documents || [],
    current_stage: payload.current_stage || 'PROPOSED',
    status: statusToSet,
    scheduled_publish_at: payload.scheduled_publish_at,
    is_teaser_enabled: payload.is_teaser_enabled ?? true,
    teaser_start_at: payload.teaser_start_at || undefined,
    muhurtham_name: payload.muhurtham_name,
    broadcast_on_publish: payload.broadcast_on_publish ?? true,
    excess_funds_policy: payload.excess_funds_policy || 'Excess funds will be utilized for continuous Matha Annadanam and educational scholarships.',
    breakdown_items: payload.breakdown_items || [],
    updates: [],
    expenses: [],
    audit_logs: [
      {
        id: `aud-${Date.now()}`,
        action: 'INITIATIVE_CREATED',
        user_name: 'Super Admin',
        previous_value: '',
        new_value: `Created initiative ${code} (Status: ${statusToSet}${payload.scheduled_publish_at ? ` | Scheduled: ${payload.scheduled_publish_at}` : ''})`,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  let newInitiative = normalizeInitiative(rawInitiative);

  // Try saving to backend
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/initiatives/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newInitiative,
        breakdown_items: payload.breakdown_items,
      }),
    });
    if (res.ok) {
      const saved = await res.json();
      newInitiative = normalizeInitiative(saved);
    }
  } catch {
    // backend silent catch
  }

  // Update local storage
  const list = getStoredInitiatives();
  list.unshift(newInitiative);
  setStoredInitiatives(list);

  // If published immediately and broadcast is enabled, dispatch broadcast right away
  if (newInitiative.status === 'PUBLISHED' && newInitiative.broadcast_on_publish) {
    dispatchInitiativeBroadcastNotification(newInitiative);
  }

  return newInitiative;
}

export async function updateInitiativeStatus(code: string, newStatus: InitiativeStatus, completionData?: { final_report?: string }): Promise<boolean> {
  // RULE ENFORCEMENT: Admin can pause/resume/publish, but cannot mark COMPLETED
  if (newStatus === 'COMPLETED') {
    console.warn('Super Admin cannot manually set status to COMPLETED as per governance protocol.');
    return false;
  }

  try {
    await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(code)}/status/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, ...completionData }),
    });
  } catch {
    // fallback
  }

  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (item) {
    const prev = item.status;
    item.status = newStatus;
    item.audit_logs.unshift({
      id: `aud-${Date.now()}`,
      action: 'STATUS_CHANGED',
      user_name: 'Super Admin',
      previous_value: prev,
      new_value: `Status changed to ${newStatus}`,
      timestamp: new Date().toISOString(),
    });
    setStoredInitiatives(list);

    // If transitioned to PUBLISHED and broadcast is enabled, dispatch notification
    if (newStatus === 'PUBLISHED' && item.broadcast_on_publish) {
      dispatchInitiativeBroadcastNotification(item);
    }

    return true;
  }
  return false;
}

// Allow Super Admin to edit initiative fields (urgent status, priority, description, etc.) even after publishing
export async function updateInitiative(
  code: string,
  updates: Partial<Initiative>
): Promise<Initiative | null> {
  try {
    await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(code)}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch {
    // fallback to local storage
  }

  const list = getStoredInitiatives();
  const index = list.findIndex((i) => i.code === code || i.id === code);
  if (index !== -1) {
    const prev = { ...list[index] };
    const updated: Initiative = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Ensure audit trail captures changes
    if (updates.is_urgent !== undefined && updates.is_urgent !== prev.is_urgent) {
      updated.audit_logs = updated.audit_logs || [];
      updated.audit_logs.unshift({
        id: `aud-${Date.now()}`,
        action: 'URGENT_STATUS_CHANGED',
        user_name: 'Super Admin',
        previous_value: prev.is_urgent ? 'URGENT APPEAL (Active)' : 'STANDARD PRIORITY',
        new_value: updates.is_urgent ? 'ELEVATED TO URGENT EMERGENCY APPEAL' : 'REVERTED TO STANDARD PRIORITY',
        timestamp: new Date().toISOString(),
      });
    } else {
      updated.audit_logs = updated.audit_logs || [];
      updated.audit_logs.unshift({
        id: `aud-${Date.now()}`,
        action: 'INITIATIVE_EDITED',
        user_name: 'Super Admin',
        previous_value: `Priority: ${prev.priority}, Target: ₹${prev.target_amount}`,
        new_value: `Updated by Super Admin`,
        timestamp: new Date().toISOString(),
      });
    }

    list[index] = updated;
    setStoredInitiatives(list);
    return updated;
  }
  return null;
}

// 1-Click quick toggle for Urgent Emergency Appeal status
export async function toggleInitiativeUrgent(code: string, isUrgent?: boolean): Promise<boolean> {
  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (!item) return false;

  const newUrgent = isUrgent !== undefined ? isUrgent : !item.is_urgent;
  const newPriority: InitiativePriority = newUrgent ? 'URGENT' : (item.priority === 'URGENT' ? 'NORMAL' : item.priority);

  const res = await updateInitiative(code, {
    is_urgent: newUrgent,
    priority: newPriority,
  });

  return Boolean(res);
}

// Trigger and persist Automated Devotee Broadcast Notification (Push, SMS, WhatsApp)
export function dispatchInitiativeBroadcastNotification(initiative: Initiative): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('vasavi_devotee_notifications') || '[]');
    const notifId = `broadcast-ini-${initiative.id || initiative.code}`;
    
    // Deduplicate if already present
    if (existing.some((n: any) => n.id === notifId)) return;

    const muhurthamText = initiative.muhurtham_name ? ` during sacred ${initiative.muhurtham_name}` : '';
    const broadcastNotif = {
      id: notifId,
      title: `🛕 Sacred Initiative Released: ${initiative.title}`,
      message: `Sri Vasavi Matha Temple announces that the sacred initiative "${initiative.title}" is now officially live${muhurthamText}. Devotees may now offer online sankalpams and contributions. 100% Tax-Exempt under 80G.`,
      createdAt: 'Just now • Automated Devotee Broadcast',
      isBroadcastRelease: true,
      isInitiativeBroadcast: true,
      initiativeCode: initiative.code,
      initiativeTitle: initiative.title,
      broadcastChannels: ['Push Notification Sent', 'SMS Dispatched', 'WhatsApp Community Broadcast Delivered'],
      timestamp: new Date().toISOString(),
    };

    const updated = [broadcastNotif, ...existing.filter((e: any) => e.id !== notifId)];
    localStorage.setItem('vasavi_devotee_notifications', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to dispatch initiative broadcast notification', err);
  }
}

// Register an Auspicious Muhurtham Reminder alert for the devotee
export function registerDevoteeMuhurthamReminder(initiative: Initiative): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = JSON.parse(localStorage.getItem('vasavi_devotee_notifications') || '[]');
    const notifId = `reminder-ini-${initiative.id || initiative.code}`;

    const dateStr = initiative.scheduled_publish_at
      ? new Date(initiative.scheduled_publish_at).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Auspicious Muhurtham';

    const reminderNotif = {
      id: notifId,
      title: `⏰ Auspicious Muhurtham Reminder: ${initiative.title}`,
      message: `Your reminder is active for "${initiative.title}". Automated release strikes on ${dateStr} (${initiative.muhurtham_name || 'Sacred Muhurtham'}). You will receive instant SMS & WhatsApp notification upon release.`,
      createdAt: 'Just now • Auto-Scheduled Alert',
      isPoojaReminder: true,
      isInitiativeReminder: true,
      initiativeCode: initiative.code,
      initiativeTitle: initiative.title,
      timestamp: new Date().toISOString(),
    };

    const updated = [reminderNotif, ...existing.filter((e: any) => e.id !== notifId)];
    localStorage.setItem('vasavi_devotee_notifications', JSON.stringify(updated));

    // Persist code in devotee's reminder checklist
    const savedCodes = JSON.parse(localStorage.getItem('vasavi_devotee_initiative_reminders') || '[]');
    if (!savedCodes.includes(initiative.code)) {
      savedCodes.push(initiative.code);
      localStorage.setItem('vasavi_devotee_initiative_reminders', JSON.stringify(savedCodes));
    }

    return true;
  } catch (err) {
    console.error('Failed to register devotee reminder', err);
    return false;
  }
}

export function isInitiativeReminderSet(code: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const savedCodes = JSON.parse(localStorage.getItem('vasavi_devotee_initiative_reminders') || '[]');
    return savedCodes.includes(code);
  } catch {
    return false;
  }
}

export async function updateInitiativeStage(code: string, newStage: InitiativeStage): Promise<boolean> {
  try {
    await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(code)}/stage/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
  } catch {
    // fallback
  }

  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (item) {
    const prev = item.current_stage;
    item.current_stage = newStage;
    item.audit_logs.unshift({
      id: `aud-${Date.now()}`,
      action: 'STAGE_ADVANCED',
      user_name: 'Super Admin',
      previous_value: prev,
      new_value: `Stage changed to ${newStage}`,
      timestamp: new Date().toISOString(),
    });
    setStoredInitiatives(list);
    return true;
  }
  return false;
}

export async function addInitiativeExpense(code: string, expense: Omit<InitiativeExpense, 'id' | 'created_at'>): Promise<InitiativeExpense> {
  let createdExpense: InitiativeExpense = {
    ...expense,
    id: `exp-${Date.now()}`,
    amount: Number(expense.amount || 0),
    status: expense.status || 'APPROVED',
    created_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(code)}/expenses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...expense,
        amount: Number(expense.amount || 0),
        status: expense.status || 'APPROVED',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      createdExpense = {
        ...data,
        amount: Number(data.amount || 0),
      };
    }
  } catch {
    // fallback
  }

  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (item) {
    if (!item.expenses) item.expenses = [];
    // remove if exists
    item.expenses = item.expenses.filter((e) => e.id !== createdExpense.id);
    item.expenses.unshift(createdExpense);
    const approvedTotal = item.expenses
      .filter((e) => e.status === 'APPROVED')
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);
    item.total_approved_expenses = approvedTotal;
    item.remaining_funds = Math.max(Number(item.current_raised || 0) - approvedTotal, 0);
    setStoredInitiatives(list);
  }
  return createdExpense;
}

export async function addInitiativeUpdate(code: string, update: { title: string; message: string; images?: string[] }): Promise<InitiativeUpdate> {
  let createdUpdate: InitiativeUpdate = {
    id: `up-${Date.now()}`,
    title: update.title,
    message: update.message,
    images: update.images || [],
    posted_by_name: 'Temple Administrator',
    posted_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/initiatives/${encodeURIComponent(code)}/updates/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (res.ok) {
      const data = await res.json();
      createdUpdate = data;
    }
  } catch {
    // fallback
  }

  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (item) {
    if (!item.updates) item.updates = [];
    item.updates = item.updates.filter((u) => u.id !== createdUpdate.id);
    item.updates.unshift(createdUpdate);
    setStoredInitiatives(list);
  }
  return createdUpdate;
}

export async function recordInitiativeDonation(code: string, donationAmount: number): Promise<boolean> {
  const amt = Number(donationAmount || 0);
  const list = getStoredInitiatives();
  const item = list.find((i) => i.code === code || i.id === code);
  if (item) {
    item.current_raised = Number(item.current_raised || 0) + amt;
    item.donor_count = Number(item.donor_count || 0) + 1;
    item.percentage_funded = Number(item.target_amount) > 0 ? Math.min(Math.round((item.current_raised / item.target_amount) * 100), 100) : 0;
    const approvedTotal = (item.expenses || [])
      .filter((e) => e.status === 'APPROVED')
      .reduce((acc, e) => acc + Number(e.amount || 0), 0);
    item.remaining_funds = Math.max(item.current_raised - approvedTotal, 0);
    setStoredInitiatives(list);
    return true;
  }
  return false;
}
