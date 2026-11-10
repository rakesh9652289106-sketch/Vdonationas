import { Temple, DonationCategory, Campaign } from './types';
import { MOCK_TEMPLES, MOCK_CATEGORIES, MOCK_CAMPAIGNS } from './mock-data';
import { dispatchTempleAdminNotification } from './quota-store';

// ==========================================
// 1. DATA MODELS & TYPES
// ==========================================

export interface ProfileChangeRequest {
  id: string;
  templeId: string;
  templeName: string;
  proposedData: {
    name: string;
    deity: string;
    trustName: string;
    registrationNo: string;
    timings: string;
    description: string;
    address?: string;
    city?: string;
    state?: string;
    contactPhone?: string;
    contactEmail?: string;
    taxBenefitInfo?: string;
  };
  originalData: {
    name: string;
    deity: string;
    trustName: string;
    registrationNo: string;
    timings: string;
    description: string;
    address?: string;
    city?: string;
    state?: string;
    contactPhone?: string;
    contactEmail?: string;
    taxBenefitInfo?: string;
  };
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface CategoryChangeRequest {
  id: string;
  templeId: string;
  templeName: string;
  action: 'CREATE' | 'EDIT' | 'DELETE';
  category: DonationCategory;
  originalCategory?: DonationCategory;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface CampaignChangeRequest {
  id: string;
  templeId: string;
  templeName: string;
  action: 'CREATE' | 'EDIT' | 'DELETE';
  campaign: Campaign;
  originalCampaign?: Campaign;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

// ==========================================
// 2. STORAGE KEYS
// ==========================================

const PROFILE_ACTIVE_KEY = 'vasavi_active_temple_profile';
const PROFILE_REQUESTS_KEY = 'vasavi_temple_profile_requests';

const CATEGORIES_ACTIVE_KEY = 'vasavi_active_donation_categories';
const CATEGORY_REQUESTS_KEY = 'vasavi_category_requests';

const CAMPAIGNS_ACTIVE_KEY = 'vasavi_active_campaigns';
const CAMPAIGN_REQUESTS_KEY = 'vasavi_campaign_requests';

// ==========================================
// 3. SHRINE PROFILE GOVERNANCE
// ==========================================

export function getActiveTempleProfile(templeId?: string): Temple {
  if (typeof window === 'undefined') return MOCK_TEMPLES[0];
  try {
    const data = localStorage.getItem(PROFILE_ACTIVE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && (!templeId || parsed.id === templeId)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse active temple profile', err);
  }
  return MOCK_TEMPLES.find((t) => !templeId || t.id === templeId) || MOCK_TEMPLES[0];
}

export function saveActiveTempleProfile(temple: Temple): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_ACTIVE_KEY, JSON.stringify(temple));
    window.dispatchEvent(new Event('temple_profile_updated'));
  } catch (err) {
    console.error('Failed to save active temple profile', err);
  }
}

export function getProfileChangeRequests(): ProfileChangeRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PROFILE_REQUESTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProfileChangeRequests(requests: ProfileChangeRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('temple_profile_requests_updated'));
  } catch (err) {
    console.error('Failed to save profile change requests', err);
  }
}

export function submitProfileChangeRequest(
  templeId: string,
  proposedData: Partial<Temple>,
  requestedBy: string = 'Srinivasa Rao (Penugonda Admin)',
  notes?: string
): ProfileChangeRequest {
  const current = getActiveTempleProfile(templeId);

  const originalData = {
    name: current.name,
    deity: current.deity,
    trustName: current.trustName,
    registrationNo: current.registrationNo,
    timings: current.timings,
    description: current.description,
    address: current.address,
    city: current.city,
    state: current.state,
    contactPhone: current.contactPhone,
    contactEmail: current.contactEmail,
    taxBenefitInfo: current.taxBenefitInfo,
  };

  const fullProposed = {
    name: proposedData.name !== undefined ? proposedData.name : current.name,
    deity: proposedData.deity !== undefined ? proposedData.deity : current.deity,
    trustName: proposedData.trustName !== undefined ? proposedData.trustName : current.trustName,
    registrationNo: proposedData.registrationNo !== undefined ? proposedData.registrationNo : current.registrationNo,
    timings: proposedData.timings !== undefined ? proposedData.timings : current.timings,
    description: proposedData.description !== undefined ? proposedData.description : current.description,
    address: proposedData.address !== undefined ? proposedData.address : current.address,
    city: proposedData.city !== undefined ? proposedData.city : current.city,
    state: proposedData.state !== undefined ? proposedData.state : current.state,
    contactPhone: proposedData.contactPhone !== undefined ? proposedData.contactPhone : current.contactPhone,
    contactEmail: proposedData.contactEmail !== undefined ? proposedData.contactEmail : current.contactEmail,
    taxBenefitInfo: proposedData.taxBenefitInfo !== undefined ? proposedData.taxBenefitInfo : current.taxBenefitInfo,
  };

  const newRequest: ProfileChangeRequest = {
    id: `pcr-${Date.now()}`,
    templeId: current.id,
    templeName: current.name,
    proposedData: fullProposed,
    originalData,
    status: 'PENDING_APPROVAL',
    requestedBy,
    requestedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    notes,
  };

  const existing = getProfileChangeRequests();
  saveProfileChangeRequests([newRequest, ...existing]);
  return newRequest;
}

export function approveProfileChangeRequest(requestId: string, approvedBy: string = 'Super Admin RAKESH'): void {
  const existing = getProfileChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  // 1. Update live profile
  const currentProfile = getActiveTempleProfile(target.templeId);
  const updatedProfile: Temple = {
    ...currentProfile,
    name: target.proposedData.name,
    deity: target.proposedData.deity,
    trustName: target.proposedData.trustName,
    registrationNo: target.proposedData.registrationNo,
    timings: target.proposedData.timings,
    description: target.proposedData.description,
    address: target.proposedData.address || currentProfile.address,
    city: target.proposedData.city || currentProfile.city,
    state: target.proposedData.state || currentProfile.state,
    contactPhone: target.proposedData.contactPhone || currentProfile.contactPhone,
    contactEmail: target.proposedData.contactEmail || currentProfile.contactEmail,
    taxBenefitInfo: target.proposedData.taxBenefitInfo || currentProfile.taxBenefitInfo,
  };
  saveActiveTempleProfile(updatedProfile);

  // 2. Mark request approved
  const updated = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'APPROVED' as const,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveProfileChangeRequests(updated);

  // 3. Dispatch notification to Temple Admin
  dispatchTempleAdminNotification({
    type: 'PROFILE_APPROVAL',
    title: '✓ Super Admin Approved Shrine Profile Changes',
    message: `Super Admin has approved your profile modification request for "${target.templeName}". All updated details are now live on public devotee pages.`,
    targetSection: 'profile',
  });
}

export function rejectProfileChangeRequest(
  requestId: string,
  reason: string,
  approvedBy: string = 'Super Admin RAKESH'
): void {
  const existing = getProfileChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  const finalReason = reason.trim() || 'Profile changes did not meet regulatory documentation standards.';

  const updated = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'REJECTED' as const,
          rejectionReason: finalReason,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveProfileChangeRequests(updated);

  dispatchTempleAdminNotification({
    type: 'PROFILE_REJECTION',
    title: '⚠️ Super Admin Rejected Shrine Profile Changes',
    message: `Super Admin rejected the profile update request for "${target.templeName}". Reason: "${finalReason}". Existing shrine information remains unchanged.`,
    targetSection: 'profile',
    reason: finalReason,
  });
}

export function cancelProfileChangeRequest(requestId: string): void {
  const existing = getProfileChangeRequests();
  const updated = existing.filter((r) => r.id !== requestId);
  saveProfileChangeRequests(updated);
}

// ==========================================
// 4. DONATION CATEGORIES GOVERNANCE
// ==========================================

export function getActiveCategories(templeId?: string): DonationCategory[] {
  if (typeof window === 'undefined') return MOCK_CATEGORIES;
  try {
    const data = localStorage.getItem(CATEGORIES_ACTIVE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return templeId ? parsed.filter((c) => c.templeId === templeId) : parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse active categories', err);
  }
  return templeId ? MOCK_CATEGORIES.filter((c) => c.templeId === templeId) : MOCK_CATEGORIES;
}

export function saveActiveCategories(categories: DonationCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_ACTIVE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('categories_updated'));
  } catch (err) {
    console.error('Failed to save active categories', err);
  }
}

export function getCategoryChangeRequests(): CategoryChangeRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CATEGORY_REQUESTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCategoryChangeRequests(requests: CategoryChangeRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORY_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('category_requests_updated'));
  } catch (err) {
    console.error('Failed to save category requests', err);
  }
}

export function submitCategoryChangeRequest(
  action: 'CREATE' | 'EDIT' | 'DELETE',
  categoryData: DonationCategory,
  requestedBy: string = 'Srinivasa Rao (Penugonda Admin)',
  originalData?: DonationCategory,
  notes?: string
): CategoryChangeRequest {
  const profile = getActiveTempleProfile(categoryData.templeId);

  const newRequest: CategoryChangeRequest = {
    id: `ccr-${Date.now()}`,
    templeId: categoryData.templeId || 'tpl-vasavi-01',
    templeName: profile.name,
    action,
    category: categoryData,
    originalCategory: originalData,
    status: 'PENDING_APPROVAL',
    requestedBy,
    requestedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    notes,
  };

  const existing = getCategoryChangeRequests();
  saveCategoryChangeRequests([newRequest, ...existing]);
  return newRequest;
}

export function approveCategoryChangeRequest(requestId: string, approvedBy: string = 'Super Admin RAKESH'): void {
  const existing = getCategoryChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  const currentCategories = getActiveCategories();
  let updatedCategories: DonationCategory[] = [];

  if (target.action === 'CREATE') {
    updatedCategories = [...currentCategories, { ...target.category, isActive: true }];
  } else if (target.action === 'EDIT') {
    updatedCategories = currentCategories.map((c) =>
      c.id === target.category.id ? { ...target.category, isActive: true } : c
    );
  } else if (target.action === 'DELETE') {
    updatedCategories = currentCategories.filter((c) => c.id !== target.category.id);
  }

  saveActiveCategories(updatedCategories);

  const updatedReqs = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'APPROVED' as const,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveCategoryChangeRequests(updatedReqs);

  const actionVerb = target.action === 'CREATE' ? 'addition' : target.action === 'EDIT' ? 'modification' : 'deletion';
  dispatchTempleAdminNotification({
    type: 'CATEGORY_APPROVAL',
    title: `✓ Super Admin Approved Category ${target.action}: ${target.category.name}`,
    message: `Super Admin accepted the ${actionVerb} of donation category "${target.category.name}". The changes are now active in the devotee offering portal.`,
    categoryName: target.category.name,
    targetSection: 'categories',
  });
}

export function rejectCategoryChangeRequest(
  requestId: string,
  reason: string,
  approvedBy: string = 'Super Admin RAKESH'
): void {
  const existing = getCategoryChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  const finalReason = reason.trim() || 'Category details do not align with verified trust bylaws.';

  const updatedReqs = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'REJECTED' as const,
          rejectionReason: finalReason,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveCategoryChangeRequests(updatedReqs);

  const actionVerb = target.action === 'CREATE' ? 'creation' : target.action === 'EDIT' ? 'edit' : 'deletion';
  dispatchTempleAdminNotification({
    type: 'CATEGORY_REJECTION',
    title: `⚠️ Super Admin Rejected Category ${target.action}: ${target.category.name}`,
    message: `Super Admin rejected the ${actionVerb} request for category "${target.category.name}". Reason: "${finalReason}".`,
    categoryName: target.category.name,
    targetSection: 'categories',
    reason: finalReason,
  });
}

export function cancelCategoryChangeRequest(requestId: string): void {
  const existing = getCategoryChangeRequests();
  const updated = existing.filter((r) => r.id !== requestId);
  saveCategoryChangeRequests(updated);
}

// ==========================================
// 5. CAMPAIGNS GOVERNANCE
// ==========================================

export function getActiveCampaigns(templeId?: string, onlyPublicActive: boolean = false): Campaign[] {
  if (typeof window === 'undefined') {
    let list = MOCK_CAMPAIGNS;
    if (templeId) list = list.filter((c) => c.templeId === templeId);
    if (onlyPublicActive) list = list.filter((c) => c.status === 'ACTIVE');
    return list;
  }
  try {
    const data = localStorage.getItem(CAMPAIGNS_ACTIVE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let list = parsed as Campaign[];
        if (templeId) list = list.filter((c) => c.templeId === templeId);
        if (onlyPublicActive) list = list.filter((c) => c.status === 'ACTIVE');
        return list;
      }
    }
  } catch (err) {
    console.error('Failed to parse active campaigns', err);
  }
  let list = MOCK_CAMPAIGNS;
  if (templeId) list = list.filter((c) => c.templeId === templeId);
  if (onlyPublicActive) list = list.filter((c) => c.status === 'ACTIVE');
  return list;
}

export function saveActiveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGNS_ACTIVE_KEY, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('campaigns_updated'));
  } catch (err) {
    console.error('Failed to save active campaigns', err);
  }
}

export function getCampaignChangeRequests(): CampaignChangeRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CAMPAIGN_REQUESTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCampaignChangeRequests(requests: CampaignChangeRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGN_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('campaign_requests_updated'));
  } catch (err) {
    console.error('Failed to save campaign requests', err);
  }
}

export function submitCampaignChangeRequest(
  action: 'CREATE' | 'EDIT' | 'DELETE',
  campaignData: Campaign,
  requestedBy: string = 'Srinivasa Rao (Penugonda Admin)',
  originalData?: Campaign,
  notes?: string
): CampaignChangeRequest {
  const profile = getActiveTempleProfile(campaignData.templeId);

  const newRequest: CampaignChangeRequest = {
    id: `cmpr-${Date.now()}`,
    templeId: campaignData.templeId || 'tpl-vasavi-01',
    templeName: profile.name,
    action,
    campaign: {
      ...campaignData,
      status: 'PENDING_APPROVAL',
    },
    originalCampaign: originalData,
    status: 'PENDING_APPROVAL',
    requestedBy,
    requestedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    notes,
  };

  const existing = getCampaignChangeRequests();
  saveCampaignChangeRequests([newRequest, ...existing]);
  return newRequest;
}

export function approveCampaignChangeRequest(requestId: string, approvedBy: string = 'Super Admin RAKESH'): void {
  const existing = getCampaignChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  const currentCampaigns = getActiveCampaigns();
  let updatedCampaigns: Campaign[] = [];

  if (target.action === 'CREATE') {
    updatedCampaigns = [{ ...target.campaign, status: 'ACTIVE' }, ...currentCampaigns];
  } else if (target.action === 'EDIT') {
    updatedCampaigns = currentCampaigns.map((c) =>
      c.id === target.campaign.id ? { ...target.campaign, status: 'ACTIVE' } : c
    );
  } else if (target.action === 'DELETE') {
    updatedCampaigns = currentCampaigns.filter((c) => c.id !== target.campaign.id);
  }

  saveActiveCampaigns(updatedCampaigns);

  const updatedReqs = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'APPROVED' as const,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveCampaignChangeRequests(updatedReqs);

  const actionVerb = target.action === 'CREATE' ? 'launch' : target.action === 'EDIT' ? 'modification' : 'deletion';
  dispatchTempleAdminNotification({
    type: 'CAMPAIGN_APPROVAL',
    title: `✓ Super Admin Approved Campaign ${target.action}: ${target.campaign.title}`,
    message: `Super Admin authorized the ${actionVerb} of campaign "${target.campaign.title}". It is now published live for devotee participation.`,
    campaignTitle: target.campaign.title,
    targetSection: 'campaigns',
  });
}

export function rejectCampaignChangeRequest(
  requestId: string,
  reason: string,
  approvedBy: string = 'Super Admin RAKESH'
): void {
  const existing = getCampaignChangeRequests();
  const target = existing.find((r) => r.id === requestId);
  if (!target) return;

  const finalReason = reason.trim() || 'Fundraising goal documentation requires further verification.';

  const updatedReqs = existing.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: 'REJECTED' as const,
          rejectionReason: finalReason,
          approvedBy,
          approvedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      : r
  );
  saveCampaignChangeRequests(updatedReqs);

  const actionVerb = target.action === 'CREATE' ? 'launch' : target.action === 'EDIT' ? 'modification' : 'removal';
  dispatchTempleAdminNotification({
    type: 'CAMPAIGN_REJECTION',
    title: `⚠️ Super Admin Rejected Campaign ${target.action}: ${target.campaign.title}`,
    message: `Super Admin rejected the ${actionVerb} request for campaign "${target.campaign.title}". Reason: "${finalReason}".`,
    campaignTitle: target.campaign.title,
    targetSection: 'campaigns',
    reason: finalReason,
  });
}

export function cancelCampaignChangeRequest(requestId: string): void {
  const existing = getCampaignChangeRequests();
  const updated = existing.filter((r) => r.id !== requestId);
  saveCampaignChangeRequests(updated);
}

// ==========================================
// 6. OVERALL GOVERNANCE COUNTERS
// ==========================================

export function getTotalPendingGovernanceRequestsCount(): {
  total: number;
  profile: number;
  categories: number;
  campaigns: number;
} {
  const profile = getProfileChangeRequests().filter((r) => r.status === 'PENDING_APPROVAL').length;
  const categories = getCategoryChangeRequests().filter((r) => r.status === 'PENDING_APPROVAL').length;
  const campaigns = getCampaignChangeRequests().filter((r) => r.status === 'PENDING_APPROVAL').length;
  return {
    total: profile + categories + campaigns,
    profile,
    categories,
    campaigns,
  };
}
