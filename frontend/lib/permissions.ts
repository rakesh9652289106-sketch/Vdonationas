import { User, PermissionKey } from './types';

// Default Role Permissions Mapping
const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  SUPER_ADMIN: [
    'temple.view',
    'temple.edit',
    'temple.create',
    'donation.view',
    'donation.export',
    'donation.refund',
    'campaign.create',
    'campaign.edit',
    'qr.manage',
    'payment.manage',
    'report.view',
    'report.export',
    'admin.manage',
    'audit.view',
    'offline.record',
    'reconciliation.manage',
  ],
  TEMPLE_ADMIN: [
    'temple.view',
    'temple.edit',
    'donation.view',
    'donation.export',
    'campaign.create',
    'campaign.edit',
    'qr.manage',
    'report.view',
    'report.export',
    'offline.record',
  ],
  FINANCE_ADMIN: [
    'donation.view',
    'donation.export',
    'donation.refund',
    'report.view',
    'report.export',
    'offline.record',
    'reconciliation.manage',
  ],
  CONTENT_ADMIN: [
    'temple.view',
    'temple.edit',
    'campaign.create',
    'campaign.edit',
  ],
  DEVOTEE: [
    'temple.view',
  ],
};

/**
 * Check if a user has a specific granular permission.
 * Also enforces multi-tenant temple scope isolation.
 */
export function hasPermission(
  user: User | null,
  permission: PermissionKey,
  targetTempleId?: string
): boolean {
  if (!user) return false;

  // Super Admin has unrestricted access across all temples
  if (user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Check role-based permission
  const allowedPerms = ROLE_PERMISSIONS[user.role] || [];
  if (!allowedPerms.includes(permission)) {
    return false;
  }

  // Enforce Multi-Tenant Data Isolation for Temple/Finance/Content Admins
  if (targetTempleId) {
    if (!user.templeIds || !user.templeIds.includes(targetTempleId)) {
      // User is attempting to access a temple outside their assigned scope
      console.warn(
        `[SECURITY WARN] User ${user.email} (Role: ${user.role}) denied access to Temple ${targetTempleId}`
      );
      return false;
    }
  }

  return true;
}

/**
 * Filter an array of items (like donations or campaigns) by the user's assigned temple scope.
 */
export function filterByTempleScope<T extends { templeId: string }>(
  user: User | null,
  items: T[]
): T[] {
  if (!user) return [];
  if (user.role === 'SUPER_ADMIN' || user.role === 'FINANCE_ADMIN') {
    return items; // Global financial role can view all authorized financial records
  }
  if (!user.templeIds || user.templeIds.length === 0) {
    return [];
  }
  return items.filter((item) => user.templeIds!.includes(item.templeId));
}
