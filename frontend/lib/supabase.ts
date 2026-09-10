import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://afhuzoqzpscnuzqdmitk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaHV6b3F6cHNjbnV6cWRtaXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTI4NjMsImV4cCI6MjEwNDAyODg2M30._A1IWAkez6MENzeRownlssJ_xY3fOgDe5VZ76O4xOOY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type DbProfile = {
  id: string;
  email: string;
  full_name: string;
  mobile?: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'TEMPLE_ADMIN' | 'FINANCE_ADMIN' | 'MATHA_ADMIN' | 'DEVOTEE';
  gotram?: string;
  sankethanamam?: string;
  nakshatram?: string;
  avatar_url?: string;
  language?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  pan_number?: string;
  total_donated: number;
  donation_count: number;
  created_at: string;
  updated_at: string;
};

export type DbTemple = {
  id: string;
  code: string;
  name: string;
  deity: string;
  description?: string;
  history?: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  pin_code: string;
  country: string;
  contact_phone?: string;
  contact_email?: string;
  trust_name?: string;
  registration_no?: string;
  tax_benefit_info?: string;
  logo_url?: string;
  banner_url?: string;
  timings?: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  is_active: boolean;
  created_at: string;
};

export type DbDonationCategory = {
  id: string;
  temple_id?: string;
  name: string;
  description?: string;
  icon?: string;
  base_amount: number;
  is_active: boolean;
  created_at: string;
};

export type DbInitiative = {
  id: string;
  code: string;
  title: string;
  short_title?: string;
  initiative_type: string;
  custom_type?: string;
  description: string;
  objective?: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  is_urgent: boolean;
  address?: string;
  city: string;
  district?: string;
  state: string;
  pin_code?: string;
  target_amount: number;
  current_raised: number;
  donor_count: number;
  min_donation: number;
  suggested_amounts: number[];
  start_date: string;
  end_date?: string;
  cover_image?: string;
  gallery_images?: string[];
  documents?: string[];
  current_stage: 'PROPOSED' | 'FOUNDATION' | 'STRUCTURE' | 'FINISHING' | 'COMPLETED';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'VERIFIED' | 'PUBLISHED' | 'SCHEDULED' | 'PAUSED' | 'COMPLETED' | 'CLOSED' | 'REJECTED';
  is_teaser_enabled: boolean;
  muhurtham_name?: string;
  excess_funds_policy?: string;
  created_at: string;
  updated_at: string;
};

export type DbInitiativeBreakdown = {
  id: string;
  initiative_id: string;
  category: string;
  target_amount: number;
  description?: string;
  order_index: number;
};

export type DbInitiativeUpdate = {
  id: string;
  initiative_id: string;
  title: string;
  message: string;
  images?: string[];
  posted_at: string;
};

export type DbInitiativeExpense = {
  id: string;
  initiative_id: string;
  category: string;
  amount: number;
  description: string;
  invoice_ref?: string;
  receipt_url?: string;
  expense_date: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  created_at: string;
};

export type DbDonation = {
  id: string;
  donation_id: string;
  user_id?: string;
  temple_id?: string;
  initiative_id?: string;
  category_id?: string;
  amount: number;
  payment_method: 'UPI' | 'CARD' | 'NETBANKING' | 'CASH' | 'QR';
  transaction_id: string;
  status: 'CREATED' | 'PAYMENT_PENDING' | 'SUCCESS' | 'PAID' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
  is_anonymous: boolean;
  dedication_msg?: string;
  on_behalf_of?: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_pan?: string;
  donor_gotram?: string;
  donor_sankethanamam?: string;
  verified_at?: string;
  created_at: string;
};

export type DbReceipt = {
  id: string;
  receipt_no: string;
  donation_id: string;
  user_id?: string;
  verification_code: string;
  amount: number;
  tax_exempt_80g: boolean;
  pdf_url?: string;
  issued_at: string;
};

export type DbAutopaySubscription = {
  id: string;
  subscription_id: string;
  user_id?: string;
  temple_id?: string;
  category_name: string;
  amount: number;
  interval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  payment_method: string;
  mandate_id?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'FAILED' | 'COMPLETED';
  start_date: string;
  next_deduction_date: string;
  end_date?: string;
  cancelled_at?: string;
  created_at: string;
};

export type DbNotification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  deep_link?: string;
  is_read: boolean;
  created_at: string;
};

export type DbReward = {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_tier: string;
  points: number;
  icon?: string;
  earned_at: string;
};

export type DbAuditLog = {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  created_at: string;
};
