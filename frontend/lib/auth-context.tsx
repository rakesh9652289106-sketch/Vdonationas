'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DevoteeUser {
  fullName: string;
  mobile: string;
  email?: string;
  gotram: string;
  role: string;
  isGuest?: boolean;
  authenticatedAt?: string;
  token?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: DevoteeUser | null;
  login: (userData: Partial<DevoteeUser>, token?: string) => void;
  logout: () => void;
  exploreAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: 'vdonations_user_session',
  TOKEN: 'vdonations_auth_token',
  ROLE: 'vdonations_active_role',
  GOTRAM: 'vdonations_selected_gotram',
  NAME: 'vdonations_devotee_name',
  MOBILE: 'vdonations_devotee_mobile',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DevoteeUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);

      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        setIsAuthenticated(true);
        if (typeof document !== 'undefined') {
          document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.warn('[VDonations Auth] Failed to restore session from storage:', e);
      setIsAuthenticated(false);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = (userData: Partial<DevoteeUser>, token?: string) => {
    const fullUser: DevoteeUser = {
      fullName: userData.fullName || 'Sri Vasavi Devotee',
      mobile: userData.mobile || '+91 9848012345',
      email: userData.email || `${userData.mobile || 'devotee'}@vasavi.dev`,
      gotram: userData.gotram || '1 - ACHAYANASA',
      role: userData.role || 'devotee',
      isGuest: false,
      authenticatedAt: new Date().toISOString(),
      token: token || 'vasavi_token_' + Date.now(),
    };

    setUser(fullUser);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fullUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, fullUser.token || '');
      localStorage.setItem(STORAGE_KEYS.ROLE, 'DEVOTEE');
      localStorage.setItem(STORAGE_KEYS.GOTRAM, fullUser.gotram);
      localStorage.setItem(STORAGE_KEYS.NAME, fullUser.fullName);
      localStorage.setItem(STORAGE_KEYS.MOBILE, fullUser.mobile);
      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error saving session to localStorage:', e);
    }
  };

  const exploreAsGuest = () => {
    const guestUser: DevoteeUser = {
      fullName: 'Atithi Devotee (Guest)',
      mobile: 'N/A',
      email: 'atithi@vasavi.dev',
      gotram: 'General Devotee',
      role: 'guest',
      isGuest: true,
      authenticatedAt: new Date().toISOString(),
      token: 'guest_token_' + Date.now(),
    };

    setUser(guestUser);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(guestUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, guestUser.token || '');
      localStorage.setItem(STORAGE_KEYS.ROLE, 'GUEST');
      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error saving guest session:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.GOTRAM);
      localStorage.removeItem(STORAGE_KEYS.NAME);
      localStorage.removeItem(STORAGE_KEYS.MOBILE);
      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error removing session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isHydrated,
        user,
        login,
        logout,
        exploreAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
