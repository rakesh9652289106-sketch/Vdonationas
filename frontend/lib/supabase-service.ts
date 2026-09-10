import { supabase, DbInitiative, DbDonation, DbReceipt, DbAutopaySubscription, DbNotification, DbProfile, DbTemple, DbDonationCategory, DbInitiativeExpense, DbInitiativeUpdate, DbInitiativeBreakdown } from './supabase';
import { Temple, TempleManagementRequest, TempleInternalMessage } from './types';

// ============================================================================
// 1. INITIATIVES SERVICE
// ============================================================================
export const initiativesService = {
  async getPublished(): Promise<DbInitiative[]> {
    const { data, error } = await supabase
      .from('initiatives')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('start_date', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch published initiatives:', error.message);
      return [];
    }
    return data || [];
  },

  async getById(id: string): Promise<{
    initiative: DbInitiative | null;
    breakdowns: DbInitiativeBreakdown[];
    updates: DbInitiativeUpdate[];
    expenses: DbInitiativeExpense[];
  }> {
    const [iniRes, bkRes, upRes, exRes] = await Promise.all([
      supabase.from('initiatives').select('*').or(`id.eq.${id},code.eq.${id}`).single(),
      supabase.from('initiative_breakdowns').select('*').eq('initiative_id', id).order('order_index'),
      supabase.from('initiative_updates').select('*').eq('initiative_id', id).order('posted_at', { ascending: false }),
      supabase.from('initiative_expenses').select('*').eq('initiative_id', id).order('expense_date', { ascending: false }),
    ]);

    return {
      initiative: iniRes.data || null,
      breakdowns: bkRes.data || [],
      updates: upRes.data || [],
      expenses: exRes.data || [],
    };
  },

  async getAllAdmin(): Promise<DbInitiative[]> {
    const { data, error } = await supabase
      .from('initiatives')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Admin initiatives error:', error.message);
      return [];
    }
    return data || [];
  },

  async create(initiative: Partial<DbInitiative>, breakdowns?: Partial<DbInitiativeBreakdown>[]): Promise<DbInitiative | null> {
    const { data, error } = await supabase
      .from('initiatives')
      .insert([initiative])
      .select()
      .single();

    if (error || !data) {
      console.error('[Supabase] Create initiative error:', error);
      throw error;
    }

    if (breakdowns && breakdowns.length > 0) {
      const items = breakdowns.map((b, idx) => ({
        initiative_id: data.id,
        category: b.category,
        target_amount: b.target_amount,
        description: b.description || '',
        order_index: idx + 1,
      }));
      await supabase.from('initiative_breakdowns').insert(items);
    }

    return data;
  },

  async updateStatus(id: string, status: DbInitiative['status']): Promise<boolean> {
    const { error } = await supabase
      .from('initiatives')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  },

  async addExpense(expense: Partial<DbInitiativeExpense>): Promise<DbInitiativeExpense | null> {
    const { data, error } = await supabase
      .from('initiative_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async approveExpense(expenseId: string, approvedByUserId: string): Promise<boolean> {
    const { error } = await supabase
      .from('initiative_expenses')
      .update({
        status: 'APPROVED',
        approved_by: approvedByUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', expenseId);

    return !error;
  },
};

// ============================================================================
// 2. DONATIONS SERVICE
// ============================================================================
export const donationsService = {
  async createDonation(params: {
    amount: number;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'CASH' | 'QR';
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    donorPan?: string;
    donorGotram?: string;
    donorSankethanamam?: string;
    dedicationMsg?: string;
    onBehalfOf?: string;
    isAnonymous?: boolean;
    initiativeId?: string;
    categoryId?: string;
    userId?: string;
  }): Promise<{ donation: DbDonation | null; transactionId: string }> {
    const timestamp = Date.now();
    const donationId = `DON-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionId = `TXN-PG-${timestamp}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          donation_id: donationId,
          transaction_id: transactionId,
          amount: params.amount,
          payment_method: params.paymentMethod,
          donor_name: params.donorName,
          donor_email: params.donorEmail,
          donor_phone: params.donorPhone,
          donor_pan: params.donorPan,
          donor_gotram: params.donorGotram,
          donor_sankethanamam: params.donorSankethanamam,
          dedication_msg: params.dedicationMsg,
          on_behalf_of: params.onBehalfOf,
          is_anonymous: params.isAnonymous || false,
          initiative_id: params.initiativeId,
          category_id: params.categoryId,
          user_id: params.userId,
          status: 'SUCCESS', // Automatically invokes trigger_donation_status_change for receipt & stats
          verified_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Donation insert error:', error);
      throw error;
    }

    return { donation: data, transactionId };
  },

  async getDevoteeDonations(userId: string): Promise<DbDonation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch devotee donations:', error.message);
      return [];
    }
    return data || [];
  },

  async getRecentDonors(limit = 10): Promise<DbDonation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .in('status', ['SUCCESS', 'PAID', 'VERIFIED'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  },

  async getAllAdmin(): Promise<DbDonation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },
};

// ============================================================================
// 3. RECEIPTS SERVICE
// ============================================================================
export const receiptsService = {
  async getDevoteeReceipts(userId: string): Promise<DbReceipt[]> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*, donation:donations(*)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch devotee receipts:', error.message);
      return [];
    }
    return data || [];
  },

  async verifyReceipt(codeOrNumber: string): Promise<{ receipt: DbReceipt | null; donation: DbDonation | null }> {
    const clean = codeOrNumber.trim().toUpperCase();
    const { data, error } = await supabase
      .from('receipts')
      .select('*, donation:donations(*)')
      .or(`receipt_no.eq.${clean},verification_code.eq.${clean}`)
      .single();

    if (error || !data) {
      return { receipt: null, donation: null };
    }

    return {
      receipt: data,
      donation: data.donation as DbDonation,
    };
  },
};

// ============================================================================
// 4. AUTOPAY / RECURRING SERVICE
// ============================================================================
export const autopayService = {
  async createSubscription(params: {
    userId?: string;
    categoryName: string;
    amount: number;
    interval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    paymentMethod?: string;
  }): Promise<DbAutopaySubscription | null> {
    const subscriptionId = `SUB-AUTO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);

    const { data, error } = await supabase
      .from('autopay_subscriptions')
      .insert([
        {
          subscription_id: subscriptionId,
          user_id: params.userId,
          category_name: params.categoryName,
          amount: params.amount,
          interval: params.interval,
          payment_method: params.paymentMethod || 'UPI Autopay',
          status: 'ACTIVE',
          start_date: new Date().toISOString().split('T')[0],
          next_deduction_date: nextDate.toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Create subscription error:', error);
      throw error;
    }
    return data;
  },

  async getDevoteeSubscriptions(userId: string): Promise<DbAutopaySubscription[]> {
    const { data, error } = await supabase
      .from('autopay_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async updateStatus(id: string, status: DbAutopaySubscription['status']): Promise<boolean> {
    const { error } = await supabase
      .from('autopay_subscriptions')
      .update({
        status,
        cancelled_at: status === 'CANCELLED' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return !error;
  },
};

// ============================================================================
// 5. DEVOTEE PROFILE & AUTH HELPERS
// ============================================================================
export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
  score: number;
}

export function validateStrongPassword(password: string): PasswordValidationResult {
  const p = password || '';
  const hasMinLength = p.length >= 8;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p);

  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const isValid = score === 5;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    isValid,
    score,
  };
}

// Generate high-entropy, diverse password suggestions with MORE NUMBERS THAN WORDS
export function generateHighEntropyNumberPassword(): string {
  const symbols = ['@', '#', '$', '!', '&', '*', '%', '^', '='];
  const letterCombos = [
    'Vk', 'Sv', 'Om', 'Sh', 'Mth', 'Dev', 'Pr', 'Sri', 'Vsk', 'Kk', 'Pn', 'Nm',
    'Ar', 'Bg', 'Kr', 'Rd', 'Js', 'Mh', 'Tr', 'Gp', 'Bv', 'Rj', 'St', 'Al'
  ];
  
  const letters = letterCombos[Math.floor(Math.random() * letterCombos.length)];
  const sym1 = symbols[Math.floor(Math.random() * symbols.length)];
  const sym2 = symbols[Math.floor(Math.random() * symbols.length)];
  const sym3 = symbols[Math.floor(Math.random() * symbols.length)];

  // Generate varied random numbers (using more numbers than words)
  const d6 = Math.floor(100000 + Math.random() * 900000); // 6 digits
  const d4 = Math.floor(1000 + Math.random() * 9000);     // 4 digits
  const d3 = Math.floor(100 + Math.random() * 900);       // 3 digits
  const d2 = Math.floor(10 + Math.random() * 90);         // 2 digits
  const d5 = Math.floor(10000 + Math.random() * 90000);   // 5 digits

  const pattern = Math.floor(Math.random() * 6);
  let pwd = '';

  switch (pattern) {
    case 0:
      // e.g. 849206#Vk@713! (9 numbers, 2 letters, 3 symbols)
      pwd = `${d6}${sym1}${letters}${sym2}${d3}${sym3}`;
      break;
    case 1:
      // e.g. 9381$492104#Mth%19 (12 numbers, 3 letters, 3 symbols)
      pwd = `${d4}${sym1}${d6}${sym2}${letters}${sym3}${d2}`;
      break;
    case 2:
      // e.g. Sh840291#5712$93! (10 numbers, 2 letters, 3 symbols)
      pwd = `${letters}${d6}${sym1}${d4}${sym2}${d2}${sym3}`;
      break;
    case 3:
      // e.g. 7391#Om840291$921! (10 numbers, 2 letters, 3 symbols)
      pwd = `${d4}${sym1}${letters}${d6}${sym2}${d3}!`;
      break;
    case 4:
      // e.g. @849201#942$Vsk! (9 numbers, 3 letters, 4 symbols)
      pwd = `${sym1}${d6}${sym2}${d3}${sym3}${letters}!`;
      break;
    case 5:
    default:
      // e.g. 59281#Sv$849206%108 (14 numbers, 2 letters, 3 symbols)
      pwd = `${d5}${sym1}${letters}${sym2}${d6}${sym3}${d3}`;
      break;
  }

  const validation = validateStrongPassword(pwd);
  if (!validation.isValid) {
    return `${d6}${sym1}${letters}108${sym2}!`;
  }

  return pwd;
}

export const devoteeService = {
  async getProfile(userId: string): Promise<DbProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<DbProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return !error;
  },

  async signInDevotee(identifier: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('authenticate_devotee', {
        p_identifier: identifier,
        p_password: password,
      });

      if (!error && data) {
        return data as any;
      }
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.warn('[Supabase] authenticate_devotee error:', e);
    }
    return { success: false, error: 'Devotee authentication failed.' };
  },

  async registerDevotee(
    fullName: string,
    mobile: string,
    password: string,
    gotram: string,
    sankethanamam: string,
    email?: string
  ): Promise<{ success: boolean; user_id?: string; email?: string; mobile?: string; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('register_devotee_sankalpam', {
        p_full_name: fullName,
        p_mobile: mobile,
        p_password: password,
        p_gotram: gotram,
        p_sankethanamam: sankethanamam,
        p_email: email || null,
      });

      if (!error && data) {
        return data as any;
      }
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (e: any) {
      console.warn('[Supabase] register_devotee_sankalpam error:', e);
    }
    return { success: false, error: 'Registration could not be completed.' };
  },

  async checkMobileExists(mobile: string): Promise<boolean> {
    const clean = mobile.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 10) return false;
    const last10 = clean.slice(-10);

    try {
      const { data, error } = await supabase.rpc('check_devotee_mobile_exists', {
        p_mobile: last10,
      });
      if (!error && typeof data === 'boolean') {
        return data;
      }
    } catch (e) {
      console.warn('[Supabase] check_devotee_mobile_exists RPC error, falling back:', e);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, mobile')
      .or(`mobile.eq.+91${last10},mobile.eq.${last10},mobile.ilike.%${last10}%`)
      .limit(1);

    if (error || !data) return false;
    return data.length > 0;
  },

  async resetPassword(identifier: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const { data, error } = await supabase.rpc('reset_devotee_password', {
      p_identifier: identifier,
      p_new_password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return (data as any) || { success: false, error: 'Password update failed.' };
  },

  async getRewards(userId: string) {
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId);

    return data || [];
  },
};

// ============================================================================
// 6. TEMPLES & CATEGORIES SERVICE
// ============================================================================
export const templeService = {
  async getPenugondaTemple(): Promise<DbTemple | null> {
    const { data } = await supabase
      .from('temples')
      .select('*')
      .eq('code', 'TPL-VASAVI-001')
      .single();

    return data;
  },

  async getCategories(): Promise<DbDonationCategory[]> {
    const { data } = await supabase
      .from('donation_categories')
      .select('*')
      .eq('is_active', true)
      .order('base_amount');

    return data || [];
  },

  async getAllTemples(): Promise<Temple[]> {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch temples:', error.message);
      return [];
    }

    return (data || []).map((t: any) => ({
      id: t.id,
      code: t.code,
      name: t.name,
      deity: t.deity,
      description: t.description || '',
      history: t.history,
      address: t.address,
      city: t.city,
      state: t.state,
      pinCode: t.pin_code,
      country: t.country || 'India',
      contactPhone: t.contact_phone || '',
      contactEmail: t.contact_email || '',
      website: t.website,
      trustName: t.trust_name || '',
      registrationNo: t.registration_no || '',
      taxBenefitInfo: t.tax_benefit_info,
      logoUrl: t.logo_url || 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
      bannerUrl: t.banner_url || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
      timings: t.timings || '05:00 AM - 09:00 PM',
      verificationStatus: t.verification_status || 'VERIFIED',
      isActive: t.is_active !== false,
      gallery: [],
      managerId: t.manager_id,
      managerName: t.manager_name,
      managerPhone: t.manager_phone,
      financeAdminId: t.finance_admin_id,
      financeAdminName: t.finance_admin_name,
      financeAdminPhone: t.finance_admin_phone,
    }));
  },

  async getTempleById(id: string): Promise<Temple | null> {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      deity: data.deity,
      description: data.description || '',
      history: data.history,
      address: data.address,
      city: data.city,
      state: data.state,
      pinCode: data.pin_code,
      country: data.country || 'India',
      contactPhone: data.contact_phone || '',
      contactEmail: data.contact_email || '',
      website: data.website,
      trustName: data.trust_name || '',
      registrationNo: data.registration_no || '',
      taxBenefitInfo: data.tax_benefit_info,
      logoUrl: data.logo_url || 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=150',
      bannerUrl: data.banner_url || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
      timings: data.timings || '05:00 AM - 09:00 PM',
      verificationStatus: data.verification_status || 'VERIFIED',
      isActive: data.is_active !== false,
      gallery: [],
      managerId: data.manager_id,
      managerName: data.manager_name,
      managerPhone: data.manager_phone,
      financeAdminId: data.finance_admin_id,
      financeAdminName: data.finance_admin_name,
      financeAdminPhone: data.finance_admin_phone,
    };
  },

  async createTempleWithManager(params: {
    code: string;
    name: string;
    deity: string;
    address?: string;
    city: string;
    state: string;
    pinCode?: string;
    trustName?: string;
    registrationNo?: string;
    managerName: string;
    managerMobile: string;
    managerPassword: string;
    managerEmail?: string;
  }) {
    const { data, error } = await supabase.rpc('create_temple_with_manager', {
      p_code: params.code,
      p_name: params.name,
      p_deity: params.deity,
      p_address: params.address || `${params.city}, ${params.state}`,
      p_city: params.city,
      p_state: params.state,
      p_pin_code: params.pinCode || '500001',
      p_trust_name: params.trustName || `${params.name} Trust`,
      p_registration_no: params.registrationNo || `REG/${params.code}`,
      p_manager_name: params.managerName,
      p_manager_mobile: params.managerMobile,
      p_manager_password: params.managerPassword,
      p_manager_email: params.managerEmail || null,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async createTempleWithManagerAndFinance(params: {
    code: string;
    name: string;
    deity: string;
    address?: string;
    city: string;
    state: string;
    pinCode?: string;
    trustName?: string;
    registrationNo?: string;
    managerName: string;
    managerMobile: string;
    managerPassword: string;
    managerEmail?: string;
    financeName: string;
    financeMobile: string;
    financePassword: string;
    financeEmail?: string;
  }) {
    const { data, error } = await supabase.rpc('create_temple_with_manager_and_finance', {
      p_code: params.code,
      p_name: params.name,
      p_deity: params.deity,
      p_address: params.address || `${params.city}, ${params.state}`,
      p_city: params.city,
      p_state: params.state,
      p_pin_code: params.pinCode || '500001',
      p_trust_name: params.trustName || `${params.name} Trust`,
      p_registration_no: params.registrationNo || `REG/${params.code}`,
      p_manager_name: params.managerName,
      p_manager_mobile: params.managerMobile,
      p_manager_password: params.managerPassword,
      p_manager_email: params.managerEmail || null,
      p_finance_name: params.financeName,
      p_finance_mobile: params.financeMobile,
      p_finance_password: params.financePassword,
      p_finance_email: params.financeEmail || null,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async adminResetManagerPassword(templeId: string, newPassword: string) {
    const { data, error } = await supabase.rpc('admin_reset_temple_manager_password', {
      p_temple_id: templeId,
      p_new_password: newPassword,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async adminResetFinancePassword(templeId: string, newPassword: string) {
    const { data, error } = await supabase.rpc('admin_reset_temple_finance_password', {
      p_temple_id: templeId,
      p_new_password: newPassword,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async updateTempleVerificationStatus(templeId: string, status: 'VERIFIED' | 'PENDING' | 'SUSPENDED') {
    const { error } = await supabase
      .from('temples')
      .update({ verification_status: status, updated_at: new Date().toISOString() })
      .eq('id', templeId);
    if (error) throw new Error(error.message);
  },

  async fetchTempleManagementRequests(templeId?: string): Promise<TempleManagementRequest[]> {
    let query = supabase
      .from('temple_management_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (templeId) {
      query = query.eq('temple_id', templeId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Failed to fetch temple requests:', error.message);
      return [];
    }

    return (data || []).map((r: any) => ({
      id: r.id,
      templeId: r.temple_id,
      templeCode: r.temple_code,
      templeName: r.temple_name,
      managerId: r.manager_id,
      managerName: r.manager_name,
      managerPhone: r.manager_phone,
      senderRole: (r.sender_role || 'TEMPLE_ADMIN') as 'TEMPLE_ADMIN' | 'FINANCE_ADMIN',
      requestType: r.request_type,
      title: r.title,
      description: r.description,
      urgency: r.urgency,
      status: r.status,
      superAdminReply: r.super_admin_reply,
      repliedBy: r.replied_by,
      repliedAt: r.replied_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  },

  async createTempleManagementRequest(params: {
    templeId: string;
    templeCode: string;
    templeName: string;
    managerId?: string;
    managerName: string;
    managerPhone?: string;
    senderRole?: 'TEMPLE_ADMIN' | 'FINANCE_ADMIN';
    requestType: 'SEVA_QUOTA' | 'PROFILE_UPDATE' | 'FESTIVAL_EVENT' | 'FINANCIAL_QR' | 'GENERAL_INQUIRY';
    title: string;
    description: string;
    urgency: 'NORMAL' | 'HIGH' | 'URGENT';
  }) {
    const { data, error } = await supabase
      .from('temple_management_requests')
      .insert([
        {
          temple_id: params.templeId,
          temple_code: params.templeCode,
          temple_name: params.templeName,
          manager_id: params.managerId,
          manager_name: params.managerName,
          manager_phone: params.managerPhone,
          sender_role: params.senderRole || 'TEMPLE_ADMIN',
          request_type: params.requestType,
          title: params.title,
          description: params.description,
          urgency: params.urgency,
          status: 'PENDING',
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async replyTempleManagementRequest(
    requestId: string,
    reply: string,
    status: 'APPROVED' | 'RESOLVED' | 'REJECTED' | 'IN_REVIEW',
    adminName = 'Super Admin RAKESH'
  ) {
    const { error } = await supabase
      .from('temple_management_requests')
      .update({
        super_admin_reply: reply,
        status,
        replied_by: adminName,
        replied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw new Error(error.message);
  },

  async fetchInternalMessages(templeId: string): Promise<TempleInternalMessage[]> {
    const { data, error } = await supabase
      .from('temple_internal_messages')
      .select('*')
      .eq('temple_id', templeId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] Failed to fetch temple internal messages:', error.message);
      return [];
    }

    return (data || []).map((m: any) => ({
      id: m.id,
      templeId: m.temple_id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      senderRole: m.sender_role,
      message: m.message,
      category: m.category,
      metadata: m.metadata,
      createdAt: m.created_at,
    }));
  },

  async sendInternalMessage(params: {
    templeId: string;
    senderId?: string;
    senderName: string;
    senderRole: 'TEMPLE_ADMIN' | 'FINANCE_ADMIN' | 'SUPER_ADMIN';
    message: string;
    category?: 'BUDGET' | 'SETTLEMENT' | 'COLLECTIONS' | 'DISCREPANCY' | 'GENERAL';
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await supabase
      .from('temple_internal_messages')
      .insert([
        {
          temple_id: params.templeId,
          sender_id: params.senderId || null,
          sender_name: params.senderName,
          sender_role: params.senderRole,
          message: params.message,
          category: params.category || 'GENERAL',
          metadata: params.metadata || {},
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

// ============================================================================
// 7. NOTIFICATIONS SERVICE
// ============================================================================
export const notificationsService = {
  async getDevoteeNotifications(userId: string): Promise<DbNotification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    return !error;
  },
};

// ============================================================================
// 8. ADMIN DASHBOARD & AUDIT LOG SERVICE
// ============================================================================
export const adminService = {
  async getMetrics() {
    const [donRes, iniRes, devRes, autoRes] = await Promise.all([
      supabase.from('donations').select('amount, status').in('status', ['SUCCESS', 'PAID', 'VERIFIED']),
      supabase.from('initiatives').select('id, target_amount, current_raised'),
      supabase.from('profiles').select('id, role'),
      supabase.from('autopay_subscriptions').select('id, status').eq('status', 'ACTIVE'),
    ]);

    const totalCollection = (donRes.data || []).reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalInitiatives = (iniRes.data || []).length;
    const totalDevotees = (devRes.data || []).length;
    const activeAutoPayCount = (autoRes.data || []).length;

    return {
      totalCollection,
      totalDonationsCount: (donRes.data || []).length,
      totalInitiatives,
      totalDevotees,
      activeAutoPayCount,
    };
  },

  async getAuditLogs(limit = 50) {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  },

  async logAction(action: string, entityType: string, entityId?: string, oldVals?: any, newVals?: any) {
    await supabase.from('audit_logs').insert([
      {
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldVals,
        new_values: newVals,
      },
    ]);
  },
};
