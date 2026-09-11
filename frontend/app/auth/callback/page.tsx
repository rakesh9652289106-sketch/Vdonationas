'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { templeAudio } from '@/lib/templeAudio';
import { findGotramBySankethanamam } from '@/lib/gothiram-data';
import { isSuperAdminUser, isTempleAdminUser, isFinanceAdminUser, getEffectiveUserRole } from '@/lib/rbac';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Verifying sacred credentials with Sri Vasavi Matha Sanctuary...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const processAuth = async () => {
      try {
        try {
          templeAudio.playFlowerChime(0.5);
        } catch (e) {}

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[OAuth Callback] Session error:', sessionError);
          if (isMounted) setErrorMessage(sessionError.message);
          return;
        }

        if (session?.user) {
          await handleDevoteeSession(session.user, session.access_token);
          return;
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession?.user) {
            authListener.subscription.unsubscribe();
            await handleDevoteeSession(currentSession.user, currentSession.access_token);
          }
        });

        setTimeout(() => {
          if (isMounted && !session?.user) {
            setErrorMessage('Authentication session timed out. Please try signing in again.');
          }
        }, 8000);

      } catch (err: any) {
        console.error('[OAuth Callback] Unexpected error:', err);
        if (isMounted) setErrorMessage(err?.message || 'Authentication failed.');
      }
    };

    const handleDevoteeSession = async (user: any, token: string) => {
      if (!isMounted) return;

      setStatusMessage('Harmonizing devotee profile and sacred Gotram...');

      try {
        // 1. Query profile by Supabase user id or email
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile && user.email) {
          const { data: profileByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          if (profileByEmail) {
            profile = profileByEmail;
          }
        }

        const devoteeEmail = user.email || profile?.email || '';
        const rawDevoteeMobile = profile?.mobile || user.user_metadata?.mobile || '';
        const isSuper = isSuperAdminUser(rawDevoteeMobile, devoteeEmail);
        const devoteeMobile = rawDevoteeMobile || (isSuper ? '+919652289106' : '');
        const rawRole = (profile?.role || '').toUpperCase();
        const effectiveRole = isSuper ? 'SUPER_ADMIN' : getEffectiveUserRole(rawRole, devoteeMobile, devoteeEmail);
        const isSuperAdmin = isSuper;
        const isTempleAdmin = isTempleAdminUser(effectiveRole, devoteeMobile, devoteeEmail);
        const isFinanceAdmin = isFinanceAdminUser(effectiveRole, devoteeMobile, devoteeEmail);

        const devoteeName =
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (isSuperAdmin ? 'RAKESH' : 'Sri Vasavi Devotee');
        let devoteeGotram = profile?.gotram;
        let devoteeSankethanamam = profile?.sankethanamam;

        // Auto-fill Gotram and Sankethanamam based on user or community mapping
        if (devoteeEmail.toLowerCase() === 'rakesh9652289106@gmail.com') {
          if (!devoteeSankethanamam) devoteeSankethanamam = 'NAABILLA';
          if (!devoteeGotram || devoteeGotram === 'General Devotee') {
            devoteeGotram = '44 - MOUTHKALYASA';
          }
        } else if (devoteeSankethanamam && (!devoteeGotram || devoteeGotram === 'General Devotee')) {
          const matched = findGotramBySankethanamam(devoteeSankethanamam);
          if (matched) {
            devoteeGotram = `${matched.id} - ${matched.name}`;
          }
        }

        // Sync to Supabase profiles
        if (devoteeGotram || devoteeSankethanamam) {
          const syncData: any = {
            sankalpam_completed: true,
            updated_at: new Date().toISOString(),
          };
          if (devoteeGotram) syncData.gotram = devoteeGotram;
          if (devoteeSankethanamam) syncData.sankethanamam = devoteeSankethanamam;

          try {
            if (user.id) {
              await supabase.from('profiles').update(syncData).eq('id', user.id);
            }
            if (devoteeEmail) {
              await supabase.from('profiles').update(syncData).eq('email', devoteeEmail);
            }
          } catch (syncErr) {
            console.warn('[OAuth Callback] Supabase sync error:', syncErr);
          }
        }

        // 2. Admins NEVER get redirected to gotram selection
        if (isSuperAdmin) {
          const userSession = {
            id: user.id,
            fullName: 'RAKESH',
            email: devoteeEmail,
            mobile: devoteeMobile || '+919652289106',
            gotram: devoteeGotram || '44 - MOUTHKALYASA',
            sankethanamam: devoteeSankethanamam || 'NAABILLA',
            role: 'SUPER_ADMIN',
            authProvider: 'google',
            authenticatedAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
            localStorage.setItem('vdonations_auth_token', token);
            localStorage.setItem('vdonations_active_role', 'SUPER_ADMIN');
            localStorage.setItem('vdonations_devotee_name', userSession.fullName);
            localStorage.setItem('vdonations_devotee_mobile', userSession.mobile);
            localStorage.setItem('vdonations_devotee_email', userSession.email);
            localStorage.setItem('vdonations_selected_gotram', userSession.gotram);
            localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
            localStorage.removeItem('vdonations_pending_sankalpam');
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
            }
          } catch (e) {}

          setStatusMessage('Welcome, Super Admin RAKESH! Entering Command Center...');
          setTimeout(() => {
            router.replace('/admin/super/dashboard');
          }, 600);
          return;
        }

        if (isTempleAdmin) {
          const userSession = {
            id: user.id,
            fullName: devoteeName,
            email: devoteeEmail,
            mobile: devoteeMobile,
            gotram: devoteeGotram || '1 - ACHAYANASA',
            sankethanamam: devoteeSankethanamam || '',
            role: 'TEMPLE_ADMIN',
            templeId: profile?.temple_id,
            authProvider: 'google',
            authenticatedAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
            localStorage.setItem('vdonations_auth_token', token);
            localStorage.setItem('vdonations_active_role', 'TEMPLE_ADMIN');
            localStorage.setItem('vdonations_devotee_name', userSession.fullName);
            localStorage.setItem('vdonations_devotee_mobile', userSession.mobile);
            localStorage.setItem('vdonations_devotee_email', userSession.email);
            if (userSession.gotram) localStorage.setItem('vdonations_selected_gotram', userSession.gotram);
            if (userSession.sankethanamam) localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
            localStorage.removeItem('vdonations_pending_sankalpam');
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
            }
          } catch (e) {}

          setStatusMessage('Welcome, Temple Admin! Entering Devasthanam Portal...');
          setTimeout(() => {
            router.replace('/admin/temple/dashboard');
          }, 600);
          return;
        }

        if (isFinanceAdmin) {
          const userSession = {
            id: user.id,
            fullName: devoteeName,
            email: devoteeEmail,
            mobile: devoteeMobile,
            gotram: devoteeGotram || '1 - ACHAYANASA',
            sankethanamam: devoteeSankethanamam || '',
            role: 'FINANCE_ADMIN',
            templeId: profile?.temple_id,
            authProvider: 'google',
            authenticatedAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
            localStorage.setItem('vdonations_auth_token', token);
            localStorage.setItem('vdonations_active_role', 'FINANCE_ADMIN');
            localStorage.setItem('vdonations_devotee_name', userSession.fullName);
            localStorage.setItem('vdonations_devotee_mobile', userSession.mobile);
            localStorage.setItem('vdonations_devotee_email', userSession.email);
            if (userSession.gotram) localStorage.setItem('vdonations_selected_gotram', userSession.gotram);
            if (userSession.sankethanamam) localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
            localStorage.removeItem('vdonations_pending_sankalpam');
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
            }
          } catch (e) {}

          setStatusMessage('Welcome, Finance Admin! Entering Sanctuary Finance Portal...');
          setTimeout(() => {
            router.replace('/admin/finance/dashboard');
          }, 600);
          return;
        }

        // 3. For Devotees: Gotram & Sankethanamam are strictly MANDATORY
        const hasCompletedSankalpam =
          Boolean(
            devoteeGotram &&
            devoteeGotram !== 'General Devotee' &&
            devoteeSankethanamam &&
            devoteeSankethanamam.trim()
          );

        if (!hasCompletedSankalpam) {
          // FIRST TIME ONLY: Prompt for Gotram & Sankethanamam
          const pendingData = {
            fullName: devoteeName,
            mobileNumber: devoteeMobile || '',
            email: devoteeEmail,
            authProvider: 'google',
            userId: user.id,
          };

          try {
            localStorage.setItem('vdonations_pending_sankalpam', JSON.stringify(pendingData));
            localStorage.setItem('vdonations_auth_token', token);
            localStorage.setItem('vdonations_active_role', 'DEVOTEE');
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
          } catch (e) {}

          setStatusMessage('Welcome! Proceeding to Sacred Gotram (102 Gotras) & Sankethanamam...');
          setTimeout(() => {
            router.replace('/sankalpam/gotram');
          }, 800);
        } else {
          // SUBSEQUENT LOGINS (Same Email): Details already saved, never ask again!
          const userSession = {
            id: user.id,
            fullName: devoteeName,
            email: devoteeEmail,
            mobile: devoteeMobile,
            gotram: devoteeGotram || '1 - ACHAYANASA',
            sankethanamam: devoteeSankethanamam || '',
            role: 'DEVOTEE',
            authProvider: 'google',
            authenticatedAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
            localStorage.setItem('vdonations_auth_token', token);
            localStorage.setItem('vdonations_active_role', 'DEVOTEE');
            localStorage.setItem('vdonations_selected_gotram', userSession.gotram);
            if (userSession.sankethanamam) {
              localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
            }
            localStorage.setItem('vdonations_devotee_name', userSession.fullName);
            if (userSession.email) {
              localStorage.setItem('vdonations_devotee_email', userSession.email);
            }
            if (userSession.mobile) {
              localStorage.setItem('vdonations_devotee_mobile', userSession.mobile);
            }
            localStorage.removeItem('vdonations_pending_sankalpam');
            document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
            }
          } catch (e) {}

          setStatusMessage('Blessed by Sri Vasavi Matha! Entering your sanctuary...');
          setTimeout(() => {
            router.replace('/');
          }, 600);
        }
      } catch (err: any) {
        console.error('[OAuth Callback Profile Sync Error]:', err);
        router.replace('/');
      }
    };

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-radial from-[#380b13] via-[#1c0509] to-[#080203] flex items-center justify-center p-4 text-white">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#1f0509]/95 border-2 border-[#d4af37]/60 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.3)] text-center space-y-6">
        
        {/* Ornate Gold Diya Halo */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#ffe494] via-[#d4af37] to-[#804f08] p-1 shadow-[0_0_35px_rgba(212,175,55,0.6)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#170305] flex items-center justify-center">
            {errorMessage ? (
              <span className="text-3xl">⚠️</span>
            ) : (
              <div className="w-10 h-10 border-3 border-[#f5d77f] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#f7d885] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span>Sri Vasavi Matha Sanctuary</span>
          </div>
          
          <h2 className="text-xl font-serif font-bold text-[#ffe89e]">
            {errorMessage ? 'Devotee Verification Notice' : 'Connecting to Sacred Portal'}
          </h2>
          
          <p className="text-xs text-[#e8cda2] leading-relaxed">
            {errorMessage || statusMessage}
          </p>
        </div>

        {/* Error Recovery CTA */}
        {errorMessage && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] font-serif font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-gold"
            >
              Return to Devotee Login Portal
            </button>
          </div>
        )}

        {/* Footer Seal */}
        <div className="pt-4 border-t border-[#d4af37]/25 flex items-center justify-center gap-2 text-[10px] text-[#f5d77f]/75">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Penugonda Moola Sthalam • 256-Bit SSL Encrypted</span>
        </div>

      </div>
    </div>
  );
}
