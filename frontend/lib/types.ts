export type UserRoleType = 'SUPER_ADMIN' | 'TEMPLE_ADMIN' | 'FINANCE_ADMIN' | 'CONTENT_ADMIN' | 'DEVOTEE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  mobile?: string;
  role: UserRoleType;
  templeIds?: string[]; // Scope restriction for Temple Admins
  isTwoFactorAuth: boolean;
  language: 'en' | 'te' | 'ta' | 'hi';
}

export type PermissionKey =
  | 'temple.view'
  | 'temple.edit'
  | 'temple.create'
  | 'donation.view'
  | 'donation.export'
  | 'donation.refund'
  | 'campaign.create'
  | 'campaign.edit'
  | 'qr.manage'
  | 'payment.manage'
  | 'report.view'
  | 'report.export'
  | 'admin.manage'
  | 'audit.view'
  | 'offline.record'
  | 'reconciliation.manage';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export interface Temple {
  id: string;
  code: string;
  name: string;
  deity: string;
  description: string;
  history?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  trustName: string;
  registrationNo: string;
  taxBenefitInfo?: string; // 80G information
  logoUrl: string;
  bannerUrl: string;
  timings: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  gallery: string[];
}

export interface DonationCategory {
  id: string;
  templeId: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

export interface Campaign {
  id: string;
  templeId: string;
  title: string;
  description: string;
  story: string;
  bannerUrl: string;
  goalAmount: number;
  currentRaised: number;
  startDate: string;
  endDate: string;
  minDonation: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isFeatured: boolean;
  updates: CampaignUpdate[];
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
}

export interface Festival {
  id: string;
  templeId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  isLive: boolean;
}

export interface PoojaSeva {
  id: string;
  templeId: string;
  title: string;
  description: string;
  price: number;
  timing?: string;
  type: 'POOJA' | 'SEVA' | 'DARSHAN';
}

export interface QRCodeItem {
  id: string;
  qrCodeId: string;
  templeId: string;
  provider: string;
  upiId: string;
  displayName: string;
  qrImageUrl: string;
  categoryId?: string;
  campaignId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REPLACED';
  isDefault: boolean;
  startDate: string;
  endDate?: string;
}

export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface Donation {
  id: string;
  donationId: string;
  userId?: string;
  templeId: string;
  templeName: string;
  categoryId?: string;
  categoryName?: string;
  campaignId?: string;
  campaignTitle?: string;
  amount: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'QR' | 'CASH' | 'CHEQUE';
  transactionId: string;
  status: PaymentStatus;
  isAnonymous: boolean;
  isPublic: boolean;
  dedicationMsg?: string;
  onBehalfOf?: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorPan?: string;
  donorAddress?: string;
  receiptNo: string;
  verificationCode: string;
  createdAt: string;
}

export interface Receipt {
  receiptNo: string;
  donationId: string;
  templeName: string;
  trustName: string;
  donorName: string;
  amount: number;
  categoryName: string;
  campaignTitle?: string;
  date: string;
  paymentMethod: string;
  transactionId: string;
  taxInfo?: string;
  verificationCode: string;
}

export interface OfflineDonation {
  id: string;
  templeId: string;
  templeName: string;
  donorName: string;
  amount: number;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER';
  referenceNo?: string;
  date: string;
  recordedBy: string;
  notes?: string;
}

export interface ReconciliationRecord {
  id: string;
  donationId: string;
  templeName: string;
  internalAmount: number;
  gatewayAmount: number;
  actualSettlement: number;
  difference: number;
  settlementId?: string;
  status: 'MATCHED' | 'PENDING' | 'MISMATCH' | 'REFUNDED';
  reconciledAt: string;
}

export interface RefundRecord {
  id: string;
  donationId: string;
  templeName: string;
  amount: number;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  refundRef: string;
  date: string;
}

export interface AuditLogItem {
  id: string;
  userName: string;
  action: string;
  templeName?: string;
  oldValue?: string;
  newValue?: string;
  date: string;
  time: string;
  ipAddress?: string;
}

export interface SecurityAlert {
  id: string;
  eventType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  date: string;
}

export interface SupportTicketItem {
  id: string;
  ticketNo: string;
  donorName: string;
  donorEmail: string;
  subject: string;
  category: 'PAYMENT' | '80G_CERTIFICATE' | 'POOJA_BOOKING' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  date: string;
  message: string;
}

export interface PanchangamData {
  id: string;
  templeId: string;
  templeName: string;
  date: string;
  location: string;
  tithi: string;
  nakshatram: string;
  yogam: string;
  karanam: string;
  sunrise: string;
  sunset: string;
  abhijitMuhurtham: string;
  rahukalam: string;
  yamagandam: string;
  gulikakalam: string;
  auspiciousPoojaSlots: string[];
  specialObservance?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'DONATION' | 'RECEIPT' | 'FESTIVAL' | 'SECURITY';
  isRead: boolean;
  createdAt: string;
}
