'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { supabase } from './supabase';
import { UserRoleType } from './types';
import { findGotramBySankethanamam } from './gothiram-data';
import { isSuperAdminUser, isTempleAdminUser, isFinanceAdminUser, getEffectiveUserRole } from './rbac';

export interface DevoteeUser {
  id?: string;
  fullName: string;
  mobile: string;
  email?: string;
  gotram: string;
  sankethanamam?: string;
  role: string;
  isGuest?: boolean;
  authenticatedAt?: string;
  token?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: DevoteeUser | null;
  activeRole: UserRoleType;
  switchActiveRole: (role: UserRoleType) => void;
  login: (userData: Partial<DevoteeUser>, token?: string) => void;
  updateDevoteeProfile: (updatedData: Partial<DevoteeUser>) => void;
  logout: () => Promise<void>;
  exploreAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: 'vdonations_user_session',
  TOKEN: 'vdonations_auth_token',
  ROLE: 'vdonations_active_role',
  GOTRAM: 'vdonations_selected_gotram',
  SANKETHANAMAM: 'vdonations_selected_sankethanamam',
  NAME: 'vdonations_devotee_name',
  MOBILE: 'vdonations_devotee_mobile',
  EMAIL: 'vdonations_devotee_email',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DevoteeUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRoleType>('DEVOTEE');

  useEffect(() => {
    // 1. Initial check from Supabase Auth & localStorage fallback
    const initAuth = async () => {
      // Step 1: Immediately restore from localStorage synchronously without waiting for network!
      let hasLocalSession = false;
      try {
        if (typeof window !== 'undefined') {
          const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
          const storedName = localStorage.getItem(STORAGE_KEYS.NAME);
          const storedMobile = localStorage.getItem(STORAGE_KEYS.MOBILE);
          const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
          const storedGotram = localStorage.getItem(STORAGE_KEYS.GOTRAM);
          const storedSankethanamam = localStorage.getItem(STORAGE_KEYS.SANKETHANAMAM);
          const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRoleType | null;

          let parsed: Partial<DevoteeUser> | null = null;
          if (savedSession) {
            try {
              parsed = JSON.parse(savedSession);
            } catch (e) {}
          }

          if (parsed || storedName || storedMobile || storedEmail) {
            hasLocalSession = true;
            let resolvedGotram = parsed?.gotram || storedGotram || '';
            let resolvedSanketh = parsed?.sankethanamam || storedSankethanamam || '';
            const userEmail = parsed?.email || storedEmail || '';

            if (userEmail.toLowerCase() === 'rakesh9652289106@gmail.com') {
              if (!resolvedGotram || resolvedGotram === 'General Devotee') resolvedGotram = '44 - MOUTHKALYASA';
              if (!resolvedSanketh) resolvedSanketh = 'NAABILLA';
            }

            if ((!resolvedGotram || resolvedGotram === 'General Devotee') && resolvedSanketh) {
              const gMatch = findGotramBySankethanamam(resolvedSanketh);
              if (gMatch) resolvedGotram = `${gMatch.id} - ${gMatch.name}`;
            }

            const enrichedMobile = parsed?.mobile || storedMobile || '';
            const effectiveRole = getEffectiveUserRole(parsed?.role, enrichedMobile, userEmail);

            const enrichedUser: DevoteeUser = {
              id: parsed?.id,
              fullName: parsed?.fullName || storedName || 'Sri Vasavi Devotee',
              mobile: enrichedMobile,
              email: userEmail,
              gotram: resolvedGotram,
              sankethanamam: resolvedSanketh,
              role: effectiveRole,
              isGuest: parsed?.isGuest || false,
              authenticatedAt: parsed?.authenticatedAt || new Date().toISOString(),
              token: parsed?.token || (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TOKEN) || undefined : undefined),
            };

            setUser(enrichedUser);
            setIsAuthenticated(true);
            setActiveRole(effectiveRole);
            localStorage.setItem(STORAGE_KEYS.ROLE, effectiveRole);
            setIsHydrated(true);

            if (resolvedGotram) localStorage.setItem(STORAGE_KEYS.GOTRAM, resolvedGotram);
            if (resolvedSanketh) localStorage.setItem(STORAGE_KEYS.SANKETHANAMAM, resolvedSanketh);

            window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: enrichedUser }));
          }
        }
      } catch (err) {
        console.warn('[VDonations Auth] Error reading local session:', err);
      }

      // Step 2: Harmonize with Supabase in the background if available
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Fetch live profile from Supabase (try by id, then by email)
          let profile = null;
          const { data: pById } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          profile = pById;

          if (!profile && session.user.email) {
            const { data: pByEmail } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();
            profile = pByEmail;
          }

          const storedEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.EMAIL) || '' : '';
          const storedGotram = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.GOTRAM) || '' : '';
          const storedSankethanamam = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SANKETHANAMAM) || '' : '';
          const storedName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.NAME) || '' : '';
          const storedMobile = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.MOBILE) || '' : '';

          const userEmail = session.user.email || profile?.email || storedEmail || '';
          let liveGotram = profile?.gotram || storedGotram || '';
          let liveSanketh = profile?.sankethanamam || storedSankethanamam || '';

          if (userEmail.toLowerCase() === 'rakesh9652289106@gmail.com') {
            if (!liveGotram || liveGotram === 'General Devotee') liveGotram = '44 - MOUTHKALYASA';
            if (!liveSanketh) liveSanketh = 'NAABILLA';
          }

          if ((!liveGotram || liveGotram === 'General Devotee') && liveSanketh) {
            const gMatch = findGotramBySankethanamam(liveSanketh);
            if (gMatch) liveGotram = `${gMatch.id} - ${gMatch.name}`;
          }

          const fullUserMobile = profile?.mobile || session.user.user_metadata?.mobile || storedMobile || '';
          const effectiveRole = getEffectiveUserRole(profile?.role, fullUserMobile, userEmail);

          const fullUser: DevoteeUser = {
            id: session.user.id,
            fullName: profile?.full_name || session.user.user_metadata?.full_name || storedName || 'Sri Vasavi Devotee',
            mobile: fullUserMobile,
            email: userEmail,
            gotram: liveGotram,
            sankethanamam: liveSanketh,
            role: effectiveRole,
            isGuest: false,
            authenticatedAt: session.user.created_at || new Date().toISOString(),
            token: session.access_token,
          };

          setUser(fullUser);
          setIsAuthenticated(true);
          setActiveRole(effectiveRole);
          localStorage.setItem(STORAGE_KEYS.ROLE, effectiveRole);
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fullUser));
          localStorage.setItem(STORAGE_KEYS.TOKEN, session.access_token);
          if (fullUser.email) localStorage.setItem(STORAGE_KEYS.EMAIL, fullUser.email);
          if (fullUser.gotram) localStorage.setItem(STORAGE_KEYS.GOTRAM, fullUser.gotram);
          if (fullUser.sankethanamam) localStorage.setItem(STORAGE_KEYS.SANKETHANAMAM, fullUser.sankethanamam);
          if (fullUser.fullName) localStorage.setItem(STORAGE_KEYS.NAME, fullUser.fullName);
          if (fullUser.mobile) localStorage.setItem(STORAGE_KEYS.MOBILE, fullUser.mobile);

          if (typeof document !== 'undefined') {
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: fullUser }));
          }
        } else if (!hasLocalSession) {
          setIsAuthenticated(false);
          setActiveRole('DEVOTEE');
        }
      } catch (e) {
        console.warn('[VDonations Auth] Error restoring session:', e);
      } finally {
        setIsHydrated(true);
      }
    };

    initAuth();

    // 2. Supabase onAuthStateChange listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        let profile = null;
        const { data: pById } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        profile = pById;

        if (!profile && session.user.email) {
          const { data: pByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
          profile = pByEmail;
        }

        const storedEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.EMAIL) || '' : '';
        const storedGotram = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.GOTRAM) || '' : '';
        const storedSankethanamam = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SANKETHANAMAM) || '' : '';
        const storedName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.NAME) || '' : '';
        const storedMobile = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.MOBILE) || '' : '';

        const userEmail = session.user.email || profile?.email || storedEmail || '';
        let liveGotram = profile?.gotram || storedGotram || '';
        let liveSanketh = profile?.sankethanamam || storedSankethanamam || '';

        if (userEmail.toLowerCase() === 'rakesh9652289106@gmail.com') {
          if (!liveGotram || liveGotram === 'General Devotee') liveGotram = '44 - MOUTHKALYASA';
          if (!liveSanketh) liveSanketh = 'NAABILLA';
        }

        if ((!liveGotram || liveGotram === 'General Devotee') && liveSanketh) {
          const gMatch = findGotramBySankethanamam(liveSanketh);
          if (gMatch) liveGotram = `${gMatch.id} - ${gMatch.name}`;
        }

        const fullUserMobile = profile?.mobile || session.user.user_metadata?.mobile || storedMobile || '';
        const effectiveRole = getEffectiveUserRole(profile?.role, fullUserMobile, userEmail);

        const fullUser: DevoteeUser = {
          id: session.user.id,
          fullName: profile?.full_name || session.user.user_metadata?.full_name || storedName || 'Sri Vasavi Devotee',
          mobile: fullUserMobile,
          email: userEmail,
          gotram: liveGotram,
          sankethanamam: liveSanketh,
          role: effectiveRole,
          isGuest: false,
          authenticatedAt: new Date().toISOString(),
          token: session.access_token,
        };

        setUser(fullUser);
        setIsAuthenticated(true);
        setActiveRole(effectiveRole);
        localStorage.setItem(STORAGE_KEYS.ROLE, effectiveRole);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fullUser));
        localStorage.setItem(STORAGE_KEYS.TOKEN, session.access_token);
        if (fullUser.email) localStorage.setItem(STORAGE_KEYS.EMAIL, fullUser.email);
        if (fullUser.gotram) localStorage.setItem(STORAGE_KEYS.GOTRAM, fullUser.gotram);
        if (fullUser.sankethanamam) localStorage.setItem(STORAGE_KEYS.SANKETHANAMAM, fullUser.sankethanamam);
        if (fullUser.fullName) localStorage.setItem(STORAGE_KEYS.NAME, fullUser.fullName);
        if (fullUser.mobile) localStorage.setItem(STORAGE_KEYS.MOBILE, fullUser.mobile);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: fullUser }));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setActiveRole('DEVOTEE');
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchActiveRole = (role: UserRoleType) => {
    // RBAC: Only 9652289106 can switch to SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && !isSuperAdminUser(user?.mobile, user?.email)) {
      console.warn('[RBAC] Blocked unauthorized attempt to switch to SUPER_ADMIN:', user?.mobile || user?.email);
      return;
    }
    // Only 9652289106 or assigned Temple Admins can switch to TEMPLE_ADMIN
    if (role === 'TEMPLE_ADMIN' && !isTempleAdminUser(user?.role, user?.mobile, user?.email)) {
      console.warn('[RBAC] Blocked unauthorized attempt to switch to TEMPLE_ADMIN:', user?.mobile || user?.email);
      return;
    }
    // Only 9652289106 or assigned Finance Admins can switch to FINANCE_ADMIN
    if (role === 'FINANCE_ADMIN' && !isFinanceAdminUser(user?.role, user?.mobile, user?.email)) {
      console.warn('[RBAC] Blocked unauthorized attempt to switch to FINANCE_ADMIN:', user?.mobile || user?.email);
      return;
    }

    setActiveRole(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vdonations_role_changed', { detail: role }));
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error setting active role:', e);
    }
  };

  const login = (userData: Partial<DevoteeUser>, token?: string) => {
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.EMAIL) || '' : '';
    const storedGotram = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.GOTRAM) || '' : '';
    const storedSankethanamam = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SANKETHANAMAM) || '' : '';
    const storedName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.NAME) || '' : '';
    const storedMobile = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.MOBILE) || '' : '';
    const userEmail = userData.email || storedEmail || `${userData.mobile || 'devotee'}@vasavi.dev`;
    const userMobile = userData.mobile || storedMobile || '';

    // Enforce RBAC: only 9652289106 is granted SUPER_ADMIN
    const normalizedRole = getEffectiveUserRole(userData.role, userMobile, userEmail) as UserRoleType;
    let userGotram = userData.gotram || storedGotram || '';
    let userSanketh = userData.sankethanamam || storedSankethanamam || '';

    if (userEmail.toLowerCase() === 'rakesh9652289106@gmail.com') {
      if (!userGotram || userGotram === 'General Devotee') userGotram = '44 - MOUTHKALYASA';
      if (!userSanketh) userSanketh = 'NAABILLA';
    }

    if ((!userGotram || userGotram === 'General Devotee') && userSanketh) {
      const gMatch = findGotramBySankethanamam(userSanketh);
      if (gMatch) userGotram = `${gMatch.id} - ${gMatch.name}`;
    }

    if (!userGotram) userGotram = '1 - ACHAYANASA';

    const fullUser: DevoteeUser = {
      fullName: userData.fullName || storedName || 'Sri Vasavi Devotee',
      mobile: userData.mobile || storedMobile || '+91 9848012345',
      email: userEmail,
      gotram: userGotram,
      sankethanamam: userSanketh,
      role: normalizedRole,
      isGuest: false,
      authenticatedAt: new Date().toISOString(),
      token: token || 'vasavi_token_' + Date.now(),
    };

    setUser(fullUser);
    setIsAuthenticated(true);
    setActiveRole(normalizedRole);

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(fullUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, fullUser.token || '');
      localStorage.setItem(STORAGE_KEYS.ROLE, normalizedRole);
      if (fullUser.gotram) localStorage.setItem(STORAGE_KEYS.GOTRAM, fullUser.gotram);
      if (fullUser.sankethanamam) localStorage.setItem(STORAGE_KEYS.SANKETHANAMAM, fullUser.sankethanamam);
      if (fullUser.fullName) localStorage.setItem(STORAGE_KEYS.NAME, fullUser.fullName);
      if (fullUser.mobile) localStorage.setItem(STORAGE_KEYS.MOBILE, fullUser.mobile);
      if (fullUser.email) localStorage.setItem(STORAGE_KEYS.EMAIL, fullUser.email);
      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vdonations_role_changed', { detail: normalizedRole }));
        window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: fullUser }));
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error saving session to localStorage:', e);
    }
  };

  const updateDevoteeProfile = (updatedData: Partial<DevoteeUser>) => {
    setUser((prev) => {
      const merged: DevoteeUser = {
        fullName: updatedData.fullName ?? prev?.fullName ?? 'Sri Vasavi Devotee',
        mobile: updatedData.mobile ?? prev?.mobile ?? '',
        email: updatedData.email ?? prev?.email ?? '',
        gotram: updatedData.gotram ?? prev?.gotram ?? '',
        sankethanamam: updatedData.sankethanamam ?? prev?.sankethanamam ?? '',
        role: updatedData.role ?? prev?.role ?? 'DEVOTEE',
        isGuest: prev?.isGuest ?? false,
        authenticatedAt: prev?.authenticatedAt ?? new Date().toISOString(),
        token: prev?.token,
        id: updatedData.id ?? prev?.id,
      };

      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(merged));
        if (merged.fullName) localStorage.setItem(STORAGE_KEYS.NAME, merged.fullName);
        if (merged.email) localStorage.setItem(STORAGE_KEYS.EMAIL, merged.email);
        if (merged.mobile) localStorage.setItem(STORAGE_KEYS.MOBILE, merged.mobile);
        if (merged.gotram) localStorage.setItem(STORAGE_KEYS.GOTRAM, merged.gotram);
        if (merged.sankethanamam !== undefined) localStorage.setItem(STORAGE_KEYS.SANKETHANAMAM, merged.sankethanamam);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: merged }));
        }
      } catch (e) {
        console.warn('[VDonations Auth] Error updating devotee profile in localStorage:', e);
      }
      return merged;
    });
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
    setActiveRole('DEVOTEE');

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(guestUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, guestUser.token || '');
      localStorage.setItem(STORAGE_KEYS.ROLE, 'DEVOTEE');
      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      }
    } catch (e) {
      console.warn('[VDonations Auth] Error saving guest session:', e);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveRole('DEVOTEE');

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('[VDonations Auth] Supabase signOut error:', e);
    }

    try {
      const keysToRemove = [
        STORAGE_KEYS.SESSION,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.ROLE,
        STORAGE_KEYS.GOTRAM,
        STORAGE_KEYS.SANKETHANAMAM,
        STORAGE_KEYS.NAME,
        STORAGE_KEYS.MOBILE,
        STORAGE_KEYS.EMAIL,
        'vdonations_pending_sankalpam',
        'vdonations_temple_id',
        'vdonations_temple_code',
        'vdonations_temple_name',
        'vdonations_role_preference',
        'vdonations_active_role',
        'vdonations_auth_mobile',
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      if (typeof document !== 'undefined') {
        document.cookie = 'vdonations_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vdonations_role_changed', { detail: 'DEVOTEE' }));
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
        activeRole,
        switchActiveRole,
        login,
        updateDevoteeProfile,
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
