'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { isSuperAdminUser } from './rbac';

export const GOPURAM_EXPLORER_KEY = 'vdonations_feature_show_gopuram_explorer';
export const FEATURE_FLAGS_EVENT = 'vdonations_feature_flags_updated';

export function getGopuramExplorerVisibility(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(GOPURAM_EXPLORER_KEY);
  if (stored === null) return true; // Default to visible
  return stored === 'true';
}

export function setGopuramExplorerVisibility(visible: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GOPURAM_EXPLORER_KEY, visible ? 'true' : 'false');
  window.dispatchEvent(
    new CustomEvent(FEATURE_FLAGS_EVENT, {
      detail: { showGopuramExplorer: visible },
    })
  );
}

export function checkIsSuperAdmin(user?: any, activeRole?: string): boolean {
  if (activeRole === 'SUPER_ADMIN') return true;
  if (user?.role === 'SUPER_ADMIN') return true;
  if (isSuperAdminUser(user?.mobile, user?.email)) return true;
  if (typeof window !== 'undefined') {
    const storedRole = localStorage.getItem('vdonations_active_role');
    if (storedRole === 'SUPER_ADMIN') return true;
    try {
      const sessionRaw = localStorage.getItem('vdonations_user_session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session?.role === 'SUPER_ADMIN' || isSuperAdminUser(session?.mobile, session?.email)) {
          return true;
        }
      }
    } catch {}
  }
  return false;
}

export function useGopuramExplorerVisibility() {
  const { user, activeRole } = useAuth();
  const [isVisible, setIsVisibleState] = useState<boolean>(() => getGopuramExplorerVisibility());
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(() => checkIsSuperAdmin(user, activeRole));

  useEffect(() => {
    setIsVisibleState(getGopuramExplorerVisibility());
    setIsSuperAdmin(checkIsSuperAdmin(user, activeRole));

    const handleUpdate = (e: any) => {
      if (e.detail?.showGopuramExplorer !== undefined) {
        setIsVisibleState(e.detail.showGopuramExplorer);
      } else {
        setIsVisibleState(getGopuramExplorerVisibility());
      }
    };

    window.addEventListener(FEATURE_FLAGS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(FEATURE_FLAGS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user, activeRole]);

  const setVisibility = (visible: boolean) => {
    setGopuramExplorerVisibility(visible);
    setIsVisibleState(visible);
  };

  return {
    isVisible,
    isSuperAdmin,
    setVisibility,
  };
}
