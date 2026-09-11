/**
 * Centralized Role-Based Access Control (RBAC) Module
 *
 * Enforces strict authorization policies across the Sri Vasavi Devasthanam Platform:
 * 1. Super Admin: STRICTLY mobile 9652289106 (or rakesh9652289106@gmail.com).
 *    Only this user can access all 4 panels: Super Admin, Temple Admin, Finance Admin, Devotee.
 * 2. Assigned Numbers:
 *    - TEMPLE_ADMIN / TEMPLE_MANAGER: Can access Devotee and Temple Admin panels only.
 *    - FINANCE_ADMIN: Can access Devotee and Finance Admin panels only.
 * 3. General Devotees (all other numbers):
 *    Can access ONLY 1 panel: Devotee panel. Blocked from all admin panels.
 */

export const SUPER_ADMIN_MOBILE = '9652289106';
export const SUPER_ADMIN_EMAIL = 'rakesh9652289106@gmail.com';

/**
 * Normalizes any phone number string into clean digits.
 */
export function normalizeMobileNumber(mobile?: string | null): string {
  if (!mobile) return '';
  return mobile.replace(/\D/g, '');
}

/**
 * Validates if the user is the single authorized Super Admin (mobile 9652289106 or rakesh9652289106@gmail.com).
 * Absolutely no other number or email can ever be Super Admin.
 */
export function isSuperAdminUser(mobile?: string | null, email?: string | null): boolean {
  if (email && email.toLowerCase().trim() === SUPER_ADMIN_EMAIL) {
    return true;
  }
  const clean = normalizeMobileNumber(mobile);
  return clean.endsWith(SUPER_ADMIN_MOBILE);
}

/**
 * Checks if a user is authorized to access the Temple Admin panel.
 * Allowed if:
 * 1. Super Admin (9652289106 has access to all 4 panels)
 * 2. An assigned user whose account role is explicitly TEMPLE_ADMIN or TEMPLE_MANAGER
 */
export function isTempleAdminUser(role?: string | null, mobile?: string | null, email?: string | null): boolean {
  if (isSuperAdminUser(mobile, email)) return true;
  const r = (role || '').toUpperCase();
  return r === 'TEMPLE_ADMIN' || r === 'TEMPLE_MANAGER';
}

/**
 * Checks if a user is authorized to access the Finance Admin panel.
 * Allowed if:
 * 1. Super Admin (9652289106 has access to all 4 panels)
 * 2. An assigned user whose account role is explicitly FINANCE_ADMIN
 */
export function isFinanceAdminUser(role?: string | null, mobile?: string | null, email?: string | null): boolean {
  if (isSuperAdminUser(mobile, email)) return true;
  const r = (role || '').toUpperCase();
  return r === 'FINANCE_ADMIN';
}

/**
 * Returns the effective authorized role for a user.
 * - If 9652289106 -> 'SUPER_ADMIN'
 * - Else if assigned TEMPLE_ADMIN / TEMPLE_MANAGER -> 'TEMPLE_ADMIN'
 * - Else if assigned FINANCE_ADMIN -> 'FINANCE_ADMIN'
 * - All other numbers (general devotees) -> strictly 'DEVOTEE'
 */
export function getEffectiveUserRole(
  rawRole?: string | null,
  mobile?: string | null,
  email?: string | null
): 'SUPER_ADMIN' | 'TEMPLE_ADMIN' | 'FINANCE_ADMIN' | 'DEVOTEE' {
  if (isSuperAdminUser(mobile, email)) {
    return 'SUPER_ADMIN';
  }
  const r = (rawRole || '').toUpperCase();
  if (r === 'TEMPLE_ADMIN' || r === 'TEMPLE_MANAGER') {
    return 'TEMPLE_ADMIN';
  }
  if (r === 'FINANCE_ADMIN') {
    return 'FINANCE_ADMIN';
  }
  return 'DEVOTEE';
}
