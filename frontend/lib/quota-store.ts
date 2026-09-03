export interface MonthReleaseRecord {
  id: string;
  templeId: string;
  templeName: string;
  sevaId: string; // Specific pooja ID (e.g. 'pooja-01')
  sevaTitle: string;
  year: number;
  month: number; // 0 to 11
  monthName: string;
  dailySlotQuota: number;
  releaseDate: string; // YYYY-MM-DD (Date when tickets go live)
  releaseTime: string; // e.g. "10:00 AM" or "14:30"
  releaseDateTimeISO: string; // Full ISO string for live trigger comparison
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
  devoteeNotificationSent?: boolean;
  devoteeNotificationDate?: string;
  resubmittedCount?: number;
  resubmittedAt?: string;
}

export interface TempleAdminNotification {
  id: string;
  type: 'REJECTION' | 'APPROVAL' | 'BLOCK_DECISION' | 'SUSPEND_DECISION' | 'SYSTEM';
  title: string;
  message: string;
  sevaId?: string;
  sevaTitle?: string;
  releaseRecordId?: string;
  monthName?: string;
  reason?: string;
  createdAt: string;
  read?: boolean;
}

export interface BlockedDateRecord {
  id: string;
  templeId: string;
  templeName: string;
  sevaId: string; // 'ALL' or specific pooja ID
  sevaTitle: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "06:00 AM"
  endDate: string; // YYYY-MM-DD
  endTime: string; // e.g. "06:00 PM"
  reason: string;
  notes?: string;
  requestType: 'BLOCK' | 'UNBLOCK';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface SevaSuspensionRecord {
  id: string;
  templeId: string;
  templeName: string;
  sevaId: string;
  sevaTitle: string;
  action: 'SUSPEND' | 'UNSUSPEND';
  reason: string;
  notes?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface SevaModificationRecord {
  id: string;
  templeId: string;
  templeName: string;
  sevaId: string;
  sevaTitle: string;
  action: 'EDIT' | 'DELETE' | 'CREATE';
  proposedData?: {
    title?: string;
    deity?: string;
    description?: string;
    price?: number;
    duration?: string;
    availableSlots?: string[];
    bannerGradient?: string;
    benefits?: string[];
    isActive?: boolean;
  };
  originalData?: {
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
  };
  reason?: string;
  notes?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = 'vasavi_monthly_seva_releases';
const BLOCKED_STORAGE_KEY = 'vasavi_temple_blocked_dates';
const SUSPENSIONS_STORAGE_KEY = 'vasavi_seva_suspension_requests';
const MODIFICATIONS_STORAGE_KEY = 'vasavi_seva_catalog_modifications';
const TEMPLE_ADMIN_NOTIFS_KEY = 'vasavi_temple_admin_notifications';

// Initial default released records: ALL September 2026 tickets released & active!
export const DEFAULT_RELEASES: MonthReleaseRecord[] = [
  {
    id: 'rel-2026-09-pooja-01',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-01',
    sevaTitle: 'Sahasranama Kumkumarchana',
    year: 2026,
    month: 8, // September (0-indexed)
    monthName: 'September 2026',
    dailySlotQuota: 50,
    releaseDate: '2026-08-20',
    releaseTime: '09:00 AM',
    releaseDateTimeISO: '2026-08-20T09:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September monthly Kumkumarchana quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-09-pooja-02',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-02',
    sevaTitle: 'Nitya Suprabhatam & Holy Archana',
    year: 2026,
    month: 8, // September
    monthName: 'September 2026',
    dailySlotQuota: 40,
    releaseDate: '2026-08-20',
    releaseTime: '12:00 PM',
    releaseDateTimeISO: '2026-08-20T12:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September Suprabhatam seva quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-09-pooja-03',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-03',
    sevaTitle: 'Navagraha Shanti Mahayagnam & Homam',
    year: 2026,
    month: 8,
    monthName: 'September 2026',
    dailySlotQuota: 30,
    releaseDate: '2026-08-20',
    releaseTime: '03:00 PM',
    releaseDateTimeISO: '2026-08-20T15:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September Navagraha Homam quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-09-pooja-04',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-04',
    sevaTitle: 'Sri Vasavi Ammavaru Mahabhishekam',
    year: 2026,
    month: 8,
    monthName: 'September 2026',
    dailySlotQuota: 45,
    releaseDate: '2026-08-21',
    releaseTime: '09:00 AM',
    releaseDateTimeISO: '2026-08-21T09:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September Mahabhishekam quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-09-pooja-05',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-05',
    sevaTitle: 'Sri Chakra Nava Avarana Pooja',
    year: 2026,
    month: 8,
    monthName: 'September 2026',
    dailySlotQuota: 25,
    releaseDate: '2026-08-21',
    releaseTime: '01:00 PM',
    releaseDateTimeISO: '2026-08-21T13:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September Sri Chakra Pooja quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-09-pooja-06',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-06',
    sevaTitle: 'Annadanam Mahaprasadam Seva',
    year: 2026,
    month: 8,
    monthName: 'September 2026',
    dailySlotQuota: 100,
    releaseDate: '2026-08-21',
    releaseTime: '04:30 PM',
    releaseDateTimeISO: '2026-08-21T16:30:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-08-15',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-08-16',
    notes: 'September Annadanam seva quota released.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-10-pooja-01',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-01',
    sevaTitle: 'Sahasranama Kumkumarchana',
    year: 2026,
    month: 9, // October
    monthName: 'October 2026',
    dailySlotQuota: 50,
    releaseDate: '2026-09-15',
    releaseTime: '10:00 AM',
    releaseDateTimeISO: '2026-09-15T10:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-09-01',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-09-02',
    notes: 'October Navaratri special daily Kumkumarchana slots.',
    devoteeNotificationSent: true,
  },
  {
    id: 'rel-2026-10-pooja-02',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'pooja-02',
    sevaTitle: 'Nitya Suprabhatam & Holy Archana',
    year: 2026,
    month: 9, // October
    monthName: 'October 2026',
    dailySlotQuota: 40,
    releaseDate: '2026-09-15',
    releaseTime: '02:00 PM',
    releaseDateTimeISO: '2026-09-15T14:00:00',
    requestedBy: 'Srinivasa Rao (Penugonda Admin)',
    requestedAt: '2026-09-01',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-09-02',
    notes: 'October daily Suprabhatam seva slots.',
    devoteeNotificationSent: true,
  },
];

// Initial default blocked date sample
export const DEFAULT_BLOCKED_DATES: BlockedDateRecord[] = [
  {
    id: 'blk-sample-01',
    templeId: 'tpl-vasavi-01',
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    sevaId: 'ALL',
    sevaTitle: 'All Temple Sevas & Poojas',
    startDate: '2026-10-24',
    startTime: '04:00 AM',
    endDate: '2026-10-24',
    endTime: '08:00 PM',
    reason: 'Surya Grahanam (Solar Eclipse) - Holy Sanctum Closed for Samprokshanam',
    notes: 'Temple doors closed during eclipse grahana kalam as per Agama Shastra.',
    requestType: 'BLOCK',
    status: 'APPROVED',
    approvedBy: 'Ramesh Sharma (Super Admin)',
    approvedAt: '2026-09-02',
    createdAt: '2026-09-01',
    createdBy: 'Srinivasa Rao (Penugonda Admin)',
  },
];

export const DEFAULT_SUSPENSIONS: SevaSuspensionRecord[] = [];

export function getSevaSuspensions(): SevaSuspensionRecord[] {
  if (typeof window === 'undefined') return DEFAULT_SUSPENSIONS;
  try {
    const data = localStorage.getItem(SUSPENSIONS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SUSPENSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SUSPENSIONS));
      return DEFAULT_SUSPENSIONS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_SUSPENSIONS;
  } catch {
    return DEFAULT_SUSPENSIONS;
  }
}

export function saveSevaSuspensions(records: SevaSuspensionRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUSPENSIONS_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('seva_suspensions_updated'));
  } catch (err) {
    console.error('Failed to save seva suspensions', err);
  }
}

export function getMonthlyReleases(): MonthReleaseRecord[] {
  if (typeof window === 'undefined') return DEFAULT_RELEASES;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RELEASES));
      return DEFAULT_RELEASES;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((p: any) => p.id));
      const merged = [...parsed];
      for (const def of DEFAULT_RELEASES) {
        if (!existingIds.has(def.id)) {
          merged.push(def);
        }
      }
      return merged;
    }
    return DEFAULT_RELEASES;
  } catch {
    return DEFAULT_RELEASES;
  }
}

export function saveMonthlyReleases(records: MonthReleaseRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('seva_releases_updated'));
  } catch (err) {
    console.error('Failed to save monthly releases', err);
  }
}

export function getTempleAdminNotifications(): TempleAdminNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TEMPLE_ADMIN_NOTIFS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTempleAdminNotifications(records: TempleAdminNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEMPLE_ADMIN_NOTIFS_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('temple_admin_notifs_updated'));
  } catch (err) {
    console.error('Failed to save temple admin notifications', err);
  }
}

export function dispatchTempleAdminNotification(notif: {
  type: 'REJECTION' | 'APPROVAL' | 'BLOCK_DECISION' | 'SUSPEND_DECISION' | 'SYSTEM';
  title: string;
  message: string;
  sevaId?: string;
  sevaTitle?: string;
  releaseRecordId?: string;
  monthName?: string;
  reason?: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getTempleAdminNotifications();
    const newNotif: TempleAdminNotification = {
      id: `tan-notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      sevaId: notif.sevaId,
      sevaTitle: notif.sevaTitle,
      releaseRecordId: notif.releaseRecordId,
      monthName: notif.monthName,
      reason: notif.reason,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };
    saveTempleAdminNotifications([newNotif, ...existing]);
  } catch (err) {
    console.error('Failed to dispatch notification to temple admin', err);
  }
}

export function markTempleAdminNotificationRead(id: string): void {
  const existing = getTempleAdminNotifications();
  const updated = existing.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveTempleAdminNotifications(updated);
}

export function markAllTempleAdminNotificationsRead(): void {
  const existing = getTempleAdminNotifications();
  const updated = existing.map((n) => ({ ...n, read: true }));
  saveTempleAdminNotifications(updated);
}

export function deleteTempleAdminNotification(id: string): void {
  const existing = getTempleAdminNotifications();
  const updated = existing.filter((n) => n.id !== id);
  saveTempleAdminNotifications(updated);
}

export function clearAllTempleAdminNotifications(): void {
  saveTempleAdminNotifications([]);
}

export function dispatchTempleAdminRejectionNotification(record: MonthReleaseRecord, reason: string): void {
  dispatchTempleAdminNotification({
    type: 'REJECTION',
    title: `⚠️ Super Admin Rejected Release Request: ${record.sevaTitle}`,
    message: `Super Admin has rejected the release request for "${record.sevaTitle}" (${record.monthName}). Reason: "${reason}". You can edit the schedule/quota and re-submit for approval.`,
    sevaId: record.sevaId,
    sevaTitle: record.sevaTitle,
    releaseRecordId: record.id,
    monthName: record.monthName,
    reason,
  });
}

export function getBlockedDates(): BlockedDateRecord[] {
  if (typeof window === 'undefined') return DEFAULT_BLOCKED_DATES;
  try {
    const data = localStorage.getItem(BLOCKED_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(DEFAULT_BLOCKED_DATES));
      return DEFAULT_BLOCKED_DATES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_BLOCKED_DATES;
  } catch {
    return DEFAULT_BLOCKED_DATES;
  }
}

export function saveBlockedDates(records: BlockedDateRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('blocked_dates_updated'));
  } catch (err) {
    console.error('Failed to save blocked dates', err);
  }
}

export function getSevaModifications(): SevaModificationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MODIFICATIONS_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSevaModifications(records: SevaModificationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MODIFICATIONS_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('seva_modifications_updated'));
  } catch (err) {
    console.error('Failed to save seva modifications', err);
  }
}

// Check if a specific date & seva is in an APPROVED blocked blackout window
export function isDateBlocked(dateStr: string, sevaId: string): { blocked: boolean; reason?: string; timeWindow?: string } {
  if (!dateStr) return { blocked: false };
  try {
    const blockedList = getBlockedDates();
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    for (const b of blockedList) {
      if (b.status !== 'APPROVED') continue;

      const start = new Date(b.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(b.endDate);
      end.setHours(0, 0, 0, 0);

      const matchDate = targetDate >= start && targetDate <= end;
      const matchSeva = b.sevaId === 'ALL' || b.sevaId === sevaId || sevaId === 'ALL';

      if (matchDate && matchSeva) {
        return {
          blocked: true,
          reason: b.reason,
          timeWindow: `${b.startTime} to ${b.endTime}`,
        };
      }
    }
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

// Check if a date for blocking falls within the 4 to 7 Months Advance Planning Window (Jan 1 to Apr 30 for Sep current month)
export function isWithin4To7MonthsWindow(targetDateStr: string): {
  valid: boolean;
  minAllowedDateStr: string;
  maxAllowedDateStr: string;
  minDateISO: string;
  maxDateISO: string;
} {
  const now = new Date();

  // Start of 4th month in advance (e.g. From September -> Jan 1, 2027)
  const minDate = new Date(now.getFullYear(), now.getMonth() + 4, 1, 0, 0, 0, 0);

  // End of 7th month in advance (e.g. From September -> Apr 30, 2027)
  const maxDate = new Date(now.getFullYear(), now.getMonth() + 8, 0, 23, 59, 59, 999);

  const targetDate = new Date(targetDateStr);
  targetDate.setHours(0, 0, 0, 0);

  const minAllowedDateStr = minDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const maxAllowedDateStr = maxDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Format as YYYY-MM-DD local
  const minDateISO = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}-${String(minDate.getDate()).padStart(2, '0')}`;
  const maxDateISO = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;

  const valid = targetDate >= minDate && targetDate <= maxDate;

  return {
    valid,
    minAllowedDateStr,
    maxAllowedDateStr,
    minDateISO,
    maxDateISO,
  };
}

// Backward-compatible aliases for other imports
export const isAfter4MonthsRequirement = isWithin4To7MonthsWindow;
export const isWithin4MonthsLimit = isWithin4To7MonthsWindow;

// Convert "10:00 AM" or "14:30" or "02:00 PM" into total minutes from midnight (0 - 1439)
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return -1;
  const clean = timeStr.trim().toUpperCase();

  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3];

    if (meridiem === 'AM' && hours === 12) hours = 0;
    if (meridiem === 'PM' && hours < 12) hours += 12;
    return hours * 60 + minutes;
  }

  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return -1;
}

// Validate Time Window (9:00 AM to 6:30 PM) AND 3-Hour Gap between releases on the same date
export function validateReleaseTimeAndGap(
  releaseDate: string,
  releaseTimeStr: string,
  existingReleases: MonthReleaseRecord[],
  excludeRecordId?: string
): { valid: boolean; error?: string } {
  const minutes = parseTimeToMinutes(releaseTimeStr);
  if (minutes < 0) {
    return { valid: false, error: 'Invalid time format. Please provide time (e.g. 10:00 AM or 02:30 PM).' };
  }

  // 1. Time Window Check: 09:00 AM (540 mins) to 06:30 PM (1110 mins)
  const MIN_TIME = 9 * 60; // 09:00 AM
  const MAX_TIME = 18 * 60 + 30; // 06:30 PM

  if (minutes < MIN_TIME || minutes > MAX_TIME) {
    return {
      valid: false,
      error: 'Seva Release Time Window Violation: Releases are only permitted between 09:00 AM and 06:30 PM.',
    };
  }

  // 2. Minimum 3-Hour Gap Check on the same release date
  const sameDayReleases = existingReleases.filter(
    (r) =>
      r.releaseDate === releaseDate &&
      r.status !== 'REJECTED' &&
      (!excludeRecordId || r.id !== excludeRecordId)
  );

  for (const r of sameDayReleases) {
    const existingMin = parseTimeToMinutes(r.releaseTime);
    if (existingMin >= 0) {
      const diff = Math.abs(minutes - existingMin);
      if (diff < 180) { // 180 minutes = 3 hours
        return {
          valid: false,
          error: `3-Hour Release Time Gap Violation: A minimum 3-hour difference is required between seva releases on the same day. (Conflicting with "${r.sevaTitle}" scheduled at ${r.releaseTime}).`,
        };
      }
    }
  }

  return { valid: true };
}

// Check if target month is within 3-Month Prior Window
export function isWithin3MonthsLimit(targetYear: number, targetMonth: number): { valid: boolean; maxAllowedMonthStr: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const maxDate = new Date(currentYear, currentMonth + 3, 1);
  const targetDate = new Date(targetYear, targetMonth, 1);
  const minDate = new Date(currentYear, currentMonth, 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const maxAllowedMonthStr = `${monthNames[maxDate.getMonth()]} ${maxDate.getFullYear()}`;

  const valid = targetDate >= minDate && targetDate <= maxDate;
  return { valid, maxAllowedMonthStr };
}

export interface MonthStatusInfo {
  year: number;
  month: number;
  monthName: string;
  status: 'AVAILABLE' | 'ALREADY_RELEASED' | 'PENDING_APPROVAL' | 'BEYOND_3_MONTHS';
  statusBadge: string;
  isSelectable: boolean;
}

// Generate all 12 rolling months with status tags relative to the selected seva
export function getRolling12MonthsStatus(sevaId: string, releases: MonthReleaseRecord[]): MonthStatusInfo[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const result: MonthStatusInfo[] = [];

  for (let i = 0; i < 12; i++) {
    let m = currentMonth + i;
    let y = currentYear;
    if (m > 11) {
      m = m % 12;
      y = currentYear + 1;
    }

    const monthName = `${monthNames[m]} ${y}`;

    // 1. Check if existing release request or approval exists for this seva in this month
    const existing = releases.find(
      (r) => r.year === y && r.month === m && (r.sevaId === sevaId || r.sevaId === 'ALL') && r.status !== 'REJECTED'
    );

    if (existing) {
      if (existing.status === 'APPROVED') {
        result.push({
          year: y,
          month: m,
          monthName,
          status: 'ALREADY_RELEASED',
          statusBadge: '✓ Released & Active',
          isSelectable: false,
        });
        continue;
      } else if (existing.status === 'PENDING_APPROVAL') {
        result.push({
          year: y,
          month: m,
          monthName,
          status: 'PENDING_APPROVAL',
          statusBadge: '⏳ Request Pending with Super Admin',
          isSelectable: false,
        });
        continue;
      }
    }

    // 2. Check 3-Month Prior Window Rule
    const limit = isWithin3MonthsLimit(y, m);
    if (!limit.valid) {
      result.push({
        year: y,
        month: m,
        monthName,
        status: 'BEYOND_3_MONTHS',
        statusBadge: '🔒 Locked (Beyond 3-Month Window)',
        isSelectable: false,
      });
      continue;
    }

    // 3. Available for selection & release
    result.push({
      year: y,
      month: m,
      monthName,
      status: 'AVAILABLE',
      statusBadge: '✨ Open to Request Release',
      isSelectable: true,
    });
  }

  return result;
}

// Check sequential previous months released & approved for that specific seva (unless blocked/exempted)
export function validateSequentialPreviousMonths(
  targetYear: number,
  targetMonth: number,
  sevaId: string,
  existingReleases: MonthReleaseRecord[]
): { valid: boolean; missingMonthName?: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  let iterYear = currentYear;
  let iterMonth = currentMonth;

  while (iterYear < targetYear || (iterYear === targetYear && iterMonth < targetMonth)) {
    const isApproved = existingReleases.some(
      (r) =>
        r.year === iterYear &&
        r.month === iterMonth &&
        r.status === 'APPROVED' &&
        (r.sevaId === sevaId || r.sevaId === 'ALL')
    );

    if (!isApproved) {
      return {
        valid: false,
        missingMonthName: `${monthNames[iterMonth]} ${iterYear}`,
      };
    }

    iterMonth++;
    if (iterMonth > 11) {
      iterMonth = 0;
      iterYear++;
    }
  }

  return { valid: true };
}

// Trigger and Persist 1-Day Prior Devotee Broadcast Notification when Super Admin approves release
export function dispatchDevotee1DayPriorNotification(record: MonthReleaseRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('vasavi_devotee_notifications') || '[]');
    
    const releaseDateObj = new Date(record.releaseDate);
    const alertDateObj = new Date(releaseDateObj);
    alertDateObj.setDate(alertDateObj.getDate() - 1);
    const alertDateStr = alertDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const broadcastNotif = {
      id: `broadcast-rel-${record.id}`,
      title: `📢 Seva Ticket Release Alert: ${record.sevaTitle}`,
      message: `Sri Vasavi Matha Temple announces that bookings for "${record.sevaTitle}" for the month of ${record.monthName} will officially open on ${record.releaseDate} at ${record.releaseTime} (${record.dailySlotQuota} slots/day). Please prepare your Sankalpam details in advance!`,
      createdAt: `Scheduled 1 Day Prior (${alertDateStr} at 09:00 AM)`,
      isBroadcastRelease: true,
      sevaTitle: record.sevaTitle,
      releaseDate: record.releaseDate,
      releaseTime: record.releaseTime,
      monthName: record.monthName,
    };

    const updated = [broadcastNotif, ...existing.filter((e: any) => e.id !== broadcastNotif.id)];
    localStorage.setItem('vasavi_devotee_notifications', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to dispatch devotee release broadcast', err);
  }
}

// Check if a specific date and seva is in an APPROVED and TIMELY-RELEASED quota AND not blocked
export function isDateInApprovedRelease(dateStr: string, sevaId: string): boolean {
  if (!dateStr) return false;
  try {
    // Check if date is blocked
    const blockCheck = isDateBlocked(dateStr, sevaId);
    if (blockCheck.blocked) return false;

    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;

    const releases = getMonthlyReleases();
    const now = new Date();

    return releases.some((r) => {
      const matchMonth = r.year === year && r.month === month;
      const matchSeva = r.sevaId === sevaId || r.sevaId === 'ALL';
      const isApproved = r.status === 'APPROVED';

      if (!matchMonth || !matchSeva || !isApproved) return false;

      if (r.releaseDateTimeISO) {
        const releaseTime = new Date(r.releaseDateTimeISO);
        return now >= releaseTime;
      }
      return true;
    });
  } catch {
    return false;
  }
}

// Retrieve upcoming scheduled releases that are not yet open (for countdown display)
export function getUpcomingScheduledRelease(dateStr: string, sevaId: string): MonthReleaseRecord | null {
  if (!dateStr) return null;
  try {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;

    const releases = getMonthlyReleases();
    const now = new Date();

    const record = releases.find((r) => {
      const matchMonth = r.year === year && r.month === month;
      const matchSeva = r.sevaId === sevaId || r.sevaId === 'ALL';
      const isApproved = r.status === 'APPROVED';
      if (!matchMonth || !matchSeva || !isApproved) return false;

      if (r.releaseDateTimeISO) {
        const releaseTime = new Date(r.releaseDateTimeISO);
        return now < releaseTime;
      }
      return false;
    });

    return record || null;
  } catch {
    return null;
  }
}

// Retrieve the NEXT upcoming scheduled seva release with future date & time
export function getNextUpcomingSevaRelease(): MonthReleaseRecord | null {
  try {
    const releases = getMonthlyReleases();
    const now = new Date();

    const futureApproved = releases.filter((r) => {
      if (r.status !== 'APPROVED') return false;
      if (r.releaseDateTimeISO) {
        const releaseTime = new Date(r.releaseDateTimeISO);
        return releaseTime > now;
      }
      return false;
    });

    if (futureApproved.length > 0) {
      futureApproved.sort((a, b) => {
        const timeA = new Date(a.releaseDateTimeISO || `${a.releaseDate}T${a.releaseTime}`).getTime();
        const timeB = new Date(b.releaseDateTimeISO || `${b.releaseDate}T${b.releaseTime}`).getTime();
        return timeA - timeB;
      });
      return futureApproved[0];
    }

    // Default upcoming scheduled release fallback
    return {
      id: 'rel-2026-10-pooja-01',
      templeId: 'tpl-vasavi-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
      sevaId: 'pooja-01',
      sevaTitle: 'Sahasranama Kumkumarchana',
      year: 2026,
      month: 9,
      monthName: 'October 2026',
      dailySlotQuota: 50,
      releaseDate: '2026-09-15',
      releaseTime: '10:00 AM',
      releaseDateTimeISO: '2026-09-15T10:00:00',
      requestedBy: 'Srinivasa Rao (Penugonda Admin)',
      requestedAt: '2026-09-01',
      status: 'APPROVED',
    };
  } catch {
    return null;
  }
}

// Get the latest month up to which tickets are officially released & active
export function getLatestApprovedReleasedMonth(sevaId: string): { monthName: string; year: number; month: number } | null {
  try {
    const releases = getMonthlyReleases();
    const now = new Date();

    const activeList = releases.filter((r) => {
      const matchSeva = r.sevaId === sevaId || r.sevaId === 'ALL';
      if (r.status !== 'APPROVED' || !matchSeva) return false;
      if (r.releaseDateTimeISO) {
        return now >= new Date(r.releaseDateTimeISO);
      }
      return true;
    });

    if (activeList.length === 0) return null;

    activeList.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return {
      monthName: activeList[0].monthName,
      year: activeList[0].year,
      month: activeList[0].month,
    };
  } catch {
    return null;
  }
}

// Get comprehensive release status & clear human-readable message for a specific month
export function getMonthReleaseDetails(year: number, month: number, sevaId: string): {
  state: 'APPROVED_LIVE' | 'APPROVED_SCHEDULED' | 'PENDING_APPROVAL' | 'NOT_REQUESTED';
  message: string;
  record?: MonthReleaseRecord;
} {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = `${monthNames[month]} ${year}`;

  try {
    const releases = getMonthlyReleases();
    const now = new Date();

    const record = releases.find(
      (r) => r.year === year && r.month === month && (r.sevaId === sevaId || r.sevaId === 'ALL') && r.status !== 'REJECTED'
    );

    if (!record) {
      return {
        state: 'NOT_REQUESTED',
        message: `Bookings for ${monthName} have not been opened by Temple Management yet.`,
      };
    }

    if (record.status === 'PENDING_APPROVAL') {
      return {
        state: 'PENDING_APPROVAL',
        message: `Release request for ${record.sevaTitle} (${monthName}) has been submitted by Temple Admin and is awaiting Super Admin approval.`,
        record,
      };
    }

    if (record.status === 'APPROVED') {
      if (record.releaseDateTimeISO) {
        const releaseTime = new Date(record.releaseDateTimeISO);
        if (now < releaseTime) {
          return {
            state: 'APPROVED_SCHEDULED',
            message: `Tickets for ${record.sevaTitle} (${monthName}) will release on ${record.releaseDate} at ${record.releaseTime}.`,
            record,
          };
        }
      }

      return {
        state: 'APPROVED_LIVE',
        message: `Online bookings for ${monthName} are active.`,
        record,
      };
    }

    return {
      state: 'NOT_REQUESTED',
      message: `Bookings for ${monthName} are currently not available.`,
    };
  } catch {
    return {
      state: 'NOT_REQUESTED',
      message: `Bookings for ${monthName} are currently not available.`,
    };
  }
}
