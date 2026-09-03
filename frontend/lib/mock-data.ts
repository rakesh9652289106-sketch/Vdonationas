import {
  Temple,
  DonationCategory,
  Campaign,
  Festival,
  PoojaSeva,
  QRCodeItem,
  Donation,
  User,
  OfflineDonation,
  ReconciliationRecord,
  RefundRecord,
  AuditLogItem,
  SecurityAlert,
  SupportTicketItem,
  NotificationItem,
  PanchangamData,
} from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-super-admin',
    email: 'admin@vasavimatha.org',
    fullName: 'Ramesh Sharma (Super Admin)',
    mobile: '+91 9876543210',
    role: 'SUPER_ADMIN',
    isTwoFactorAuth: true,
    language: 'en',
  },
  {
    id: 'usr-temple-admin-1',
    email: 'admin.penugonda@vasavimatha.org',
    fullName: 'Srinivasa Rao (Penugonda Admin)',
    mobile: '+91 9876543211',
    role: 'TEMPLE_ADMIN',
    templeIds: ['tpl-vasavi-01'],
    isTwoFactorAuth: true,
    language: 'te',
  },
  {
    id: 'usr-finance-admin',
    email: 'finance@vasavimatha.org',
    fullName: 'Anand Kumar (Finance Controller)',
    mobile: '+91 9876543213',
    role: 'FINANCE_ADMIN',
    isTwoFactorAuth: true,
    language: 'en',
  },
  {
    id: 'usr-devotee-1',
    email: 'devotee@gmail.com',
    fullName: 'Radha Krishna (Devotee)',
    mobile: '+91 9123456789',
    role: 'DEVOTEE',
    isTwoFactorAuth: false,
    language: 'en',
  },
];

export const MOCK_TEMPLES: Temple[] = [
  {
    id: 'tpl-vasavi-01',
    code: 'TPL-VASAVI-001',
    name: 'Sri Vasavi Kanyaka Parameswari Matha',
    deity: 'Sri Vasavi Kanyaka Parameswari Matha',
    description:
      'Sacred global devasthanam & heritage matha dedicated to Sri Vasavi Kanyaka Parameswari Matha, revered goddess of the Arya Vysya community. Promotes Seva, Ahimsa, Nitya Annadanam, and Education.',
    history:
      'Originating from Penugonda, Andhra Pradesh, Sri Vasavi Matha sacrificed her mortal form to uphold righteousness, peace, and community dignity, establishing a divine legacy of charity and devotion.',
    address: 'Penugonda Devasthanam, West Godavari',
    city: 'Penugonda',
    state: 'Andhra Pradesh',
    pinCode: '534320',
    country: 'India',
    contactPhone: '+91 8819 246789',
    contactEmail: 'seva@vasavimatha.org',
    website: 'https://vasavimatha.org',
    trustName: 'Sri Vasavi Kanyaka Parameswari Devasthanam Trust',
    registrationNo: 'REG/AP/VKP/10089',
    taxBenefitInfo: '80G Exempt under Section 80G(5)(vi) of IT Act 1961',
    logoUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop',
    timings: '05:00 AM - 09:30 PM',
    verificationStatus: 'VERIFIED',
    isActive: true,
    gallery: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
    ],
  },
];

export const MOCK_CATEGORIES: DonationCategory[] = [
  {
    id: 'cat-01',
    templeId: 'tpl-vasavi-01',
    name: 'Nitya Annadanam Seva',
    description: 'Provide free wholesome sacred meals (prasadam) to thousands of visiting pilgrims daily.',
    icon: 'Utensils',
    isActive: true,
  },
  {
    id: 'cat-02',
    templeId: 'tpl-vasavi-01',
    name: 'Pushpa Seva & Alankaram',
    description: 'Adorn Sri Vasavi Kanyaka Parameswari Matha with fresh scented jasmine & lotus flowers.',
    icon: 'Flame',
    isActive: true,
  },
  {
    id: 'cat-03',
    templeId: 'tpl-vasavi-01',
    name: 'Matha Renovation & Development',
    description: 'Support new queue complex, dining hall, and Gopuram gilding.',
    icon: 'Building',
    isActive: true,
  },
  {
    id: 'cat-04',
    templeId: 'tpl-vasavi-01',
    name: 'Gau Seva (Cow Protection)',
    description: 'Feed, protect, and maintain sacred cows at Penugonda Goshala.',
    icon: 'Heart',
    isActive: true,
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-01',
    templeId: 'tpl-vasavi-01',
    title: 'Penugonda Annadanam Mega Complex Construction',
    description: 'Constructing a modern 5,000-seater dining hall to serve 1,00,000 devotees daily at Penugonda.',
    story:
      'With increasing footfall of devotees, the existing dining facilities are operating at peak capacity. This campaign funds the new multi-story Annadanam Complex.',
    bannerUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop',
    goalAmount: 1000000,
    currentRaised: 750000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    minDonation: 101,
    status: 'ACTIVE',
    isFeatured: true,
    updates: [
      {
        id: 'upd-101',
        campaignId: 'cmp-01',
        title: 'Dining Hall Construction Reached 60% Completion',
        description: 'Foundation and second floor roofing complete. Kitchen equipment arriving next month.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
        date: '2026-08-15',
      },
    ],
  },
];

export const MOCK_FESTIVALS: Festival[] = [
  {
    id: 'fst-01',
    templeId: 'tpl-vasavi-01',
    name: 'Sri Vasavi Atmarpanotsavam & Jayanthi 2026',
    description: 'Grand sacred festival celebrating Sri Vasavi Matha Jayanthi and Penugonda chariot procession.',
    startDate: '2026-09-15',
    endDate: '2026-09-24',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600',
    isLive: true,
  },
];

export const MOCK_POOJAS: PoojaSeva[] = [
  {
    id: 'ps-01',
    templeId: 'tpl-vasavi-01',
    title: 'Sahasranama Kumkumarchana',
    description: 'Sacred Kumkumarchana performed daily for Sri Vasavi Kanyaka Parameswari Matha.',
    price: 1001,
    timing: '10:30 AM',
    type: 'POOJA',
  },
  {
    id: 'ps-02',
    templeId: 'tpl-vasavi-01',
    title: 'Nitya Suprabhatam & Archana',
    description: 'Awakening ritual and holy archana performed at inner sanctum.',
    price: 501,
    timing: '05:00 AM',
    type: 'SEVA',
  },
];

export const MOCK_QR_CODES: QRCodeItem[] = [
  {
    id: 'qr-item-1',
    qrCodeId: 'QR-001',
    templeId: 'tpl-vasavi-01',
    provider: 'UPI_DIRECT',
    upiId: 'vasavimatha@upi',
    displayName: 'Sri Vasavi Matha Main Counter QR',
    qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=vasavimatha@upi&pn=Sri%20Vasavi%20Matha%20Devasthanam&cu=INR',
    categoryId: 'cat-01',
    status: 'ACTIVE',
    isDefault: true,
    startDate: '2026-01-01',
  },
];

export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'don-1001',
    donationId: 'DON-20260822-9081',
    userId: 'usr-devotee-1',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    categoryId: 'cat-01',
    categoryName: 'Nitya Annadanam Seva',
    campaignId: 'cmp-01',
    campaignTitle: 'Penugonda Annadanam Mega Complex Construction',
    amount: 1001,
    paymentMethod: 'UPI',
    transactionId: 'TXN-9988112233',
    status: 'SUCCESS',
    isAnonymous: false,
    isPublic: true,
    dedicationMsg: 'May Sri Vasavi Matha bless our family with health and peace.',
    onBehalfOf: 'Parents - Birthday Blessing',
    donorName: 'Radha Krishna',
    donorEmail: 'devotee@gmail.com',
    donorPhone: '+91 9123456789',
    donorPan: 'ABCDE1234F',
    donorAddress: 'Penugonda, AP',
    receiptNo: 'REC-2026-89102',
    verificationCode: 'VK89102X',
    createdAt: '2026-08-22 10:15 AM',
  },
];

export const MOCK_OFFLINE_DONATIONS: OfflineDonation[] = [
  {
    id: 'off-01',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    donorName: 'Subba Rao',
    amount: 10000,
    paymentMethod: 'CASH',
    referenceNo: 'COUNTER-REC-889',
    date: '2026-08-22',
    recordedBy: 'Srinivasa Rao (Penugonda Admin)',
    notes: 'Direct cash donation handed over at Penugonda Hundi Counter #1.',
  },
];

export const MOCK_RECONCILIATION: ReconciliationRecord[] = [
  {
    id: 'rec-01',
    donationId: 'DON-20260822-9081',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    internalAmount: 1001,
    gatewayAmount: 1001,
    actualSettlement: 990.99,
    difference: 10.01,
    settlementId: 'SETTLE-20260822-01',
    status: 'MATCHED',
    reconciledAt: '2026-08-22 12:00 PM',
  },
];

export const MOCK_REFUNDS: RefundRecord[] = [
  {
    id: 'ref-01',
    donationId: 'DON-20260820-1122',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    amount: 501,
    reason: 'Duplicate payment deduction via netbanking',
    requestedBy: 'Devotee via Support Ticket #TCK-9012',
    approvedBy: 'Anand Kumar (Finance Controller)',
    status: 'APPROVED',
    refundRef: 'REF-BANK-998822',
    date: '2026-08-20',
  },
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-01',
    userName: 'Srinivasa Rao (Penugonda Admin)',
    action: 'UPDATED_TEMPLE_PROFILE',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    oldValue: 'Previous Penugonda address details',
    newValue: 'Updated Penugonda festival timings and added new Kumkumarchana seva',
    date: '2026-08-22',
    time: '11:30 AM',
    ipAddress: '103.45.12.89',
  },
];

export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'sec-01',
    eventType: 'MULTIPLE_FAILED_LOGINS',
    severity: 'MEDIUM',
    details: '3 failed login attempts detected for Penugonda admin account from IP 182.72.10.4',
    date: '2026-08-22',
  },
];

export const MOCK_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: 'tck-01',
    ticketNo: 'TCK-2026-9012',
    donorName: 'Radha Krishna',
    donorEmail: 'devotee@gmail.com',
    subject: '80G Tax Exemption Certificate Query',
    category: '80G_CERTIFICATE',
    message: 'Requesting updated 80G digital receipt for Sri Vasavi Matha Annadanam donation.',
    status: 'RESOLVED',
    date: '2026-08-21',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Sri Vasavi Matha Seva Receipt Issued',
    message: 'Your official 80G tax digital receipt for ₹1,001 has been generated.',
    type: 'RECEIPT',
    isRead: false,
    createdAt: '2026-08-22',
  },
];

export const MOCK_STATS = {
  todayCollection: 45200,
  monthlyCollection: 1245000,
  totalDonations: 2548900,
  monthlyRecurringCount: 1420,
  activeTemplesCount: 1,
  verifiedReceiptsCount: 18450,
  reconciledPercentage: 99.8,
  pendingRefundsCount: 2,
};

export const MOCK_PANCHANGAM: PanchangamData[] = [
  {
    id: 'panch-01',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    date: new Date().toISOString().split('T')[0],
    location: 'Penugonda Devasthanam, West Godavari, Andhra Pradesh',
    tithi: 'Shukla Ekadashi (Holy Vasavi Tithi)',
    nakshatram: 'Uttara Phalguni',
    yogam: 'Ayushman',
    karanam: 'Bava',
    sunrise: '06:04 AM',
    sunset: '06:38 PM',
    abhijitMuhurtham: '11:45 AM - 12:35 PM (Most Auspicious)',
    rahukalam: '04:30 PM - 06:00 PM',
    yamagandam: '12:00 PM - 01:30 PM',
    gulikakalam: '03:00 PM - 04:30 PM',
    auspiciousPoojaSlots: [
      '07:30 AM - 09:00 AM (Vasavi Kumkumarchana)',
      '11:45 AM - 12:30 PM (Maha Naivedyam & Annadanam)',
      '06:30 PM - 07:30 PM (Sahasranama Archana & Deeparadhana)',
    ],
    specialObservance: '🌟 Sacred Vasavi Ammavaru Sahasranama Kumkumarchana Day',
    updatedBy: 'Ramesh Sharma (Super Admin)',
    updatedAt: new Date().toISOString(),
  },
];

