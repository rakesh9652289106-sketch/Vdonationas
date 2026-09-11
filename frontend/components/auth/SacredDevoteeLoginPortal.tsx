'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BellRing,
  Sun,
  Flame,
  Award,
  ArrowRight,
  Volume2,
  VolumeX,
  Key,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import { templeAudio } from '@/lib/templeAudio';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { supabase } from '@/lib/supabase';
import { devoteeService, validateStrongPassword, generateHighEntropyNumberPassword } from '@/lib/supabase-service';
import { findGotramBySankethanamam } from '@/lib/gothiram-data';

interface SacredDevoteeLoginPortalProps {
  onLoginSuccess?: (userSession: any) => void;
  onExploreAsGuest?: () => void;
}

export default function SacredDevoteeLoginPortal({
  onLoginSuccess,
  onExploreAsGuest,
}: SacredDevoteeLoginPortalProps) {
  const router = useRouter();
  const { showAlert } = useConfirmAlert();

  // Active Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Devotee Credentials & Sankalpam
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gotra, setGotra] = useState('General Devotee');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Mobile uniqueness state
  const [isCheckingMobile, setIsCheckingMobile] = useState(false);
  const [mobileAlreadyExistsError, setMobileAlreadyExistsError] = useState<string | null>(null);

  // Forgot Password Modal States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // Google Provider Fallback & Sandbox Modal
  const [showGoogleProviderModal, setShowGoogleProviderModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('devotee.google@vasavi.dev');
  const [googleNameInput, setGoogleNameInput] = useState('Sri Vasavi Devotee (Google)');

  // Real-time password validations
  const pwdValidation = validateStrongPassword(password);
  const forgotPwdValidation = validateStrongPassword(forgotNewPassword);

  // Load existing gotram and check URL query parameters or pending sankalpam on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vdonations_selected_gotram');
      if (saved) setGotra(saved);

      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('tab') === 'register') {
        setActiveTab('register');
      }

      try {
        const pending = localStorage.getItem('vdonations_pending_sankalpam');
        if (pending) {
          const parsed = JSON.parse(pending);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.mobileNumber) setMobileNumber(parsed.mobileNumber);
          if (parsed.password) setPassword(parsed.password);
        }
      } catch (e) {}
    }
  }, []);

  // Visual Effects State
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [isChantPlaying, setIsChantPlaying] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [blessingToast, setBlessingToast] = useState<{ show: boolean; title: string; desc: string }>({
    show: false,
    title: '',
    desc: '',
  });

  // Ring Temple Bell Audio & Vibration with Visual Ripples
  const handleRingBell = () => {
    setIsBellRinging(true);
    try {
      templeAudio.playTempleBell(0.85);
    } catch (e) {}

    setTimeout(() => {
      setIsBellRinging(false);
    }, 1600);

    showAlert({
      type: 'info',
      title: 'Sacred Temple Bell Resonating',
      message: '🔔 Om Sri Vasavi Kanyaka Parameswaryai Namaha! May divine blessings of Penugonda Devasthanam illuminate your home with peace and prosperity.',
    });
  };

  // Toggle Sacred Mantra / Chime
  const handleToggleMantra = () => {
    if (!isChantPlaying) {
      try {
        templeAudio.playFlowerChime(0.5);
        setTimeout(() => templeAudio.playTempleBell(0.6), 350);
      } catch (e) {}
      setIsChantPlaying(true);
    } else {
      setIsChantPlaying(false);
    }
  };

  // Generate a Sacred Strong Password with MORE NUMBERS THAN WORDS and high entropy
  const handleGenerateStrongPassword = () => {
    const strongGenerated = generateHighEntropyNumberPassword();
    setPassword(strongGenerated);
    setShowPassword(true);
    setStatusMsg({
      type: 'success',
      text: `✨ Generated Unique High-Security Password: ${strongGenerated}`,
    });
  };

  // Generate strong password for Forgot Password modal
  const handleGenerateForgotStrongPassword = () => {
    const strongGenerated = generateHighEntropyNumberPassword();
    setForgotNewPassword(strongGenerated);
    setForgotConfirmPassword(strongGenerated);
    setShowForgotNewPassword(true);
  };

  // Real-time check on mobile input blur in register tab
  const handleMobileBlur = async () => {
    const clean = mobileNumber.replace(/\D/g, '');
    if (activeTab === 'register' && clean.length === 10) {
      setIsCheckingMobile(true);
      try {
        const exists = await devoteeService.checkMobileExists(clean);
        if (exists) {
          setMobileAlreadyExistsError(`Mobile +91 ${clean} is already registered! Please sign in or use Forgot Password.`);
        } else {
          setMobileAlreadyExistsError(null);
        }
      } catch (err) {
        setMobileAlreadyExistsError(null);
      } finally {
        setIsCheckingMobile(false);
      }
    } else {
      setMobileAlreadyExistsError(null);
    }
  };

  // Submit Login or Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // -------------------------------------------------------------
    // REGISTRATION / NEW SANKALPAM FLOW (Strict Mobile Uniqueness + Strong Pwd)
    // -------------------------------------------------------------
    if (activeTab === 'register') {
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      if (!cleanMobile || cleanMobile.length < 10) {
        setStatusMsg({ type: 'error', text: 'Please enter a valid 10-digit Indian mobile number.' });
        return;
      }

      if (!fullName.trim()) {
        setStatusMsg({ type: 'error', text: 'Please enter your Devotee Full Name.' });
        return;
      }

      // 1. Validate Strong Password Criteria
      const pwdVal = validateStrongPassword(password);
      if (!pwdVal.isValid) {
        setStatusMsg({
          type: 'error',
          text: 'Please ensure your password meets all 5 Sacred Security requirements (8+ chars, uppercase, lowercase, number, special symbol).',
        });
        showAlert({
          type: 'warning',
          title: 'Strong Password Required',
          message: 'Sri Vasavi Sanctuary requires all devotees to maintain a strong password (minimum 8 characters with uppercase, lowercase, number, and special character) to safeguard temple records.',
        });
        return;
      }

      // 2. Strict Mobile Uniqueness Check against Supabase
      setLoading(true);
      setStatusMsg({ type: 'success', text: '✦ Verifying mobile number availability in Sri Vasavi Sanctuary...' });

      try {
        const mobileExists = await devoteeService.checkMobileExists(cleanMobile);
        if (mobileExists) {
          setLoading(false);
          setMobileAlreadyExistsError(`Mobile +91 ${cleanMobile} is already registered!`);
          setStatusMsg({
            type: 'error',
            text: `Devotee mobile number +91 ${cleanMobile} is already registered. Please Switch to "Devotee Sign In" or click "Forgot Password".`,
          });
          showAlert({
            type: 'warning',
            title: 'Mobile Number Already Registered',
            message: `A devotee account with mobile number +91 ${cleanMobile} is already registered in the Devasthanam database. Each mobile number can only be registered once. Please switch to "Devotee Sign In" or use "Forgot Password".`,
          });
          return;
        }
      } catch (checkErr: any) {
        console.warn('[VDonations] Mobile check error:', checkErr);
      }

      // 3. Store pending sankalpam devotee data and proceed to Step 2
      const pendingDevotee = {
        fullName: fullName.trim() || 'Sri Vasavi Devotee',
        mobileNumber: cleanMobile,
        email: `${cleanMobile}@vasavi.dev`,
        password: password,
        authProvider: 'sankalpam_form',
      };

      try {
        localStorage.setItem('vdonations_pending_sankalpam', JSON.stringify(pendingDevotee));
      } catch (e) {}

      try {
        templeAudio.playCoinDrop(0.6);
      } catch (e) {}

      setLoading(false);
      setBlessingToast({
        show: true,
        title: 'Sankalpam Initiated! 🪔',
        desc: `Welcome, ${fullName}! Proceeding to Sacred Gotram (102 Gotras) & Sankethanamam...`,
      });

      setTimeout(() => {
        router.push('/sankalpam/gotram');
      }, 500);
      return;
    }

    // -------------------------------------------------------------
    // SIGN IN FLOW (Mobile Number + Password Only - No OTPs)
    // -------------------------------------------------------------
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 10-digit registered mobile number.' });
      return;
    }

    if (!password) {
      setStatusMsg({ type: 'error', text: 'Please enter your password / PIN.' });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: 'success', text: '✦ Authenticating with Penugonda Devasthanam Portal...' });

    try {
      templeAudio.playCoinDrop(0.6);
    } catch (e) {}

    let userSession: any = null;
    let authToken = 'vasavi_jwt_' + Date.now();

    try {
      // 1. Authenticate directly via devoteeService (Mobile Number & Password, no OTP needed)
      const authResult = await devoteeService.signInDevotee(cleanMobile, password);

      if (!authResult.success) {
        setLoading(false);
        const mobileExists = await devoteeService.checkMobileExists(cleanMobile);
        if (!mobileExists) {
          setStatusMsg({
            type: 'error',
            text: `No devotee account found with mobile +91 ${cleanMobile}. Please click "New Sankalpam" to register your sacred account.`,
          });
          return;
        }
        setStatusMsg({
          type: 'error',
          text: authResult.error || 'Invalid password. If you forgot your password, please click "Forgot Password?" below to reset it instantly without OTP.',
        });
        return;
      }

      userSession = authResult.user;

      // Background attempt to maintain GoTrue session if available
      try {
        const devoteeEmail = userSession?.email || `${cleanMobile}@vasavi.dev`;
        const { data: sData } = await supabase.auth.signInWithPassword({
          email: devoteeEmail,
          password: password,
        });
        if (sData?.session) {
          authToken = sData.session.access_token;
        }
      } catch (e) {}

    } catch (err: any) {
      setLoading(false);
      setStatusMsg({
        type: 'error',
        text: err?.message || 'Authentication error. Please try again.',
      });
      return;
    }

    const isSuperAdmin = userSession.role === 'SUPER_ADMIN' || userSession.role === 'SUPERADMIN' || userSession.email?.toLowerCase() === 'rakesh9652289106@gmail.com';
    const isTempleAdmin = userSession.role === 'TEMPLE_ADMIN' || userSession.role === 'TEMPLE_MANAGER';
    const isFinanceAdmin = userSession.role === 'FINANCE_ADMIN';

    let userGotram = userSession.gotram;
    let userSanketh = userSession.sankethanamam;

    if (isSuperAdmin) {
      if (!userGotram || userGotram === 'General Devotee') userGotram = '44 - MOUTHKALYASA';
      if (!userSanketh) userSanketh = 'NAABILLA';
      userSession.gotram = userGotram;
      userSession.sankethanamam = userSanketh;
    } else if (userSanketh && (!userGotram || userGotram === 'General Devotee')) {
      const match = findGotramBySankethanamam(userSanketh);
      if (match) {
        userGotram = `${match.id} - ${match.name}`;
        userSession.gotram = userGotram;
      }
    }

    const hasCompletedSankalpam =
      isSuperAdmin ||
      isTempleAdmin ||
      isFinanceAdmin ||
      (userGotram && userGotram !== 'General Devotee' && !!userSanketh);

    if (!hasCompletedSankalpam) {
      setLoading(false);
      const pendingData = {
        fullName: userSession.fullName,
        mobileNumber: userSession.mobile || cleanMobile,
        email: userSession.email || `${cleanMobile}@vasavi.dev`,
        password: password,
        userId: userSession.id,
      };
      localStorage.setItem('vdonations_pending_sankalpam', JSON.stringify(pendingData));
      localStorage.setItem('vdonations_auth_token', authToken);
      setBlessingToast({
        show: true,
        title: 'Sacred Gotram & Sankethanamam Mandatory 🪔',
        desc: 'Gotram and Sankethanamam are mandatory. Proceeding to select your 102 Sacred Gotram...',
      });
      setTimeout(() => {
        router.push('/sankalpam/gotram');
      }, 700);
      return;
    }

    // Persist session & cookie
    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
      localStorage.setItem('vdonations_auth_token', authToken);
      localStorage.setItem('vdonations_active_role', userSession.role || 'DEVOTEE');
      localStorage.setItem('vdonations_selected_gotram', userSession.gotram || gotra);
      if (userSession.sankethanamam) {
        localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
      }
      if (userSession.templeId) {
        localStorage.setItem('vdonations_temple_id', userSession.templeId);
      }
      if (userSession.templeCode) {
        localStorage.setItem('vdonations_temple_code', userSession.templeCode);
      }
      if (userSession.templeName) {
        localStorage.setItem('vdonations_temple_name', userSession.templeName);
      }
      localStorage.setItem('vdonations_devotee_name', userSession.fullName);
      localStorage.setItem('vdonations_devotee_mobile', userSession.mobile || cleanMobile);
      if (userSession.email) {
        localStorage.setItem('vdonations_devotee_email', userSession.email);
      }
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
      }
    } catch (e) {}

    setLoading(false);

    setBlessingToast({
      show: true,
      title: isSuperAdmin
        ? '👑 Super Admin Sanctuary Access'
        : isTempleAdmin
        ? '🏛️ Temple Devasthanam Portal'
        : isFinanceAdmin
        ? '💰 Temple Finance Sanctuary Portal'
        : 'Blessed by Sri Vasavi Matha! 🪔',
      desc: isSuperAdmin
        ? `Welcome, Super Admin ${userSession.fullName}! Opening Platform Control Dashboard...`
        : isTempleAdmin
        ? `Welcome, Temple Manager ${userSession.fullName}! Opening ${userSession.templeName || 'Temple'} Devasthanam Portal...`
        : isFinanceAdmin
        ? `Welcome, Finance Officer ${userSession.fullName}! Opening ${userSession.templeName || 'Temple'} Finance Sanctuary...`
        : `Welcome, ${userSession.fullName}! Entering your Devotee Sanctuary...`,
    });

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      } else if (isSuperAdmin) {
        router.push('/admin/super/dashboard');
      } else if (isTempleAdmin) {
        router.push('/admin/temple/dashboard');
      } else if (isFinanceAdmin) {
        router.push('/admin/finance/dashboard');
      } else {
        router.push('/');
      }
    }, 600);
  };


  // Google Login Handler via Supabase OAuth with Graceful Unconfigured Provider Fallback
  const handleGoogleLogin = async () => {
    try {
      templeAudio.playFlowerChime(0.5);
    } catch (e) {}

    setLoading(true);
    setStatusMsg({ type: 'success', text: '✦ Connecting to Google Authentication through Supabase...' });

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        setLoading(false);
        const errMsg = error.message || '';
        // If Google provider is not yet enabled in Supabase dashboard
        if (
          errMsg.includes('provider is not enabled') ||
          errMsg.includes('validation_failed') ||
          (error as any).status === 400 ||
          (error as any).code === 400
        ) {
          setShowGoogleProviderModal(true);
          setStatusMsg(null);
          return;
        }

        setStatusMsg({ type: 'error', text: `Google Sign In error: ${error.message}` });
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || '';
      if (errMsg.includes('provider is not enabled') || errMsg.includes('validation_failed')) {
        setShowGoogleProviderModal(true);
        setStatusMsg(null);
        return;
      }
      setStatusMsg({ type: 'error', text: errMsg || 'Failed to initialize Google login.' });
    }
  };

  // Google Devotee Direct Sandbox Sign In
  const handleDevoteeGoogleDirectSignIn = async (email: string, name: string) => {
    const devoteeEmail = email.trim() || 'devotee.google@vasavi.dev';
    const devoteeName = name.trim() || 'Sri Vasavi Devotee (Google)';

    setLoading(true);
    setShowGoogleProviderModal(false);

    try {
      templeAudio.playFlowerChime(0.5);
    } catch (e) {}

    // Check if profile exists in Supabase
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', devoteeEmail)
      .maybeSingle();

    let userSession: any;

    const role = (existingProfile?.role || 'DEVOTEE').toUpperCase();
    const isSuperAdmin =
      role === 'SUPER_ADMIN' ||
      role === 'SUPERADMIN' ||
      devoteeEmail === 'rakesh9652289106@gmail.com';
    const isTempleAdmin =
      role === 'TEMPLE_ADMIN' || role === 'TEMPLE_MANAGER';

    let resolvedGotram = existingProfile?.gotram;
    let resolvedSankethanamam = existingProfile?.sankethanamam;

    if (isSuperAdmin) {
      if (!resolvedGotram || resolvedGotram === 'General Devotee') resolvedGotram = '44 - MOUTHKALYASA';
      if (!resolvedSankethanamam) resolvedSankethanamam = 'NAABILLA';
    } else if (resolvedSankethanamam && (!resolvedGotram || resolvedGotram === 'General Devotee')) {
      const match = findGotramBySankethanamam(resolvedSankethanamam);
      if (match) resolvedGotram = `${match.id} - ${match.name}`;
    }

    const hasCompletedSankalpam =
      isSuperAdmin ||
      isTempleAdmin ||
      (existingProfile?.sankalpam_completed === true &&
        resolvedGotram &&
        resolvedGotram !== 'General Devotee' &&
        !!resolvedSankethanamam) ||
      (resolvedGotram &&
        resolvedGotram !== 'General Devotee' &&
        !!resolvedSankethanamam);

    if (hasCompletedSankalpam) {
      userSession = {
        id: existingProfile?.id || 'vasavi_devotee_' + Date.now(),
        fullName: isSuperAdmin ? 'RAKESH' : (existingProfile?.full_name || devoteeName),
        email: existingProfile?.email || devoteeEmail,
        mobile: existingProfile?.mobile || (isSuperAdmin ? '+919652289106' : '+91 9848012345'),
        gotram: resolvedGotram || '44 - MOUTHKALYASA',
        sankethanamam: resolvedSankethanamam || 'NAABILLA',
        role: isSuperAdmin ? 'SUPER_ADMIN' : isTempleAdmin ? 'TEMPLE_ADMIN' : 'DEVOTEE',
        authProvider: 'google',
        authenticatedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('vdonations_user_session', JSON.stringify(userSession));
        localStorage.setItem('vdonations_auth_token', 'vasavi_google_jwt_' + Date.now());
        localStorage.setItem('vdonations_active_role', userSession.role);
        localStorage.setItem('vdonations_selected_gotram', userSession.gotram);
        if (userSession.sankethanamam) {
          localStorage.setItem('vdonations_selected_sankethanamam', userSession.sankethanamam);
        }
        localStorage.setItem('vdonations_devotee_name', userSession.fullName);
        localStorage.setItem('vdonations_devotee_mobile', userSession.mobile);
        if (userSession.email) {
          localStorage.setItem('vdonations_devotee_email', userSession.email);
        }
        localStorage.removeItem('vdonations_pending_sankalpam');
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vdonations_profile_updated', { detail: userSession }));
        }
      } catch (e) {}

      setLoading(false);
      setBlessingToast({
        show: true,
        title: isSuperAdmin ? 'Welcome, Super Admin RAKESH! 👑' : 'Blessed by Sri Vasavi Matha! 🪔',
        desc: `Welcome, ${userSession.fullName}! Entering your Sanctuary...`,
      });

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(userSession);
        } else if (isSuperAdmin) {
          router.push('/admin/super/dashboard');
        } else if (isTempleAdmin) {
          router.push('/admin/temple/dashboard');
        } else {
          router.push('/');
        }
      }, 600);
    } else {
      const pendingDevotee = {
        fullName: devoteeName,
        mobileNumber: '9848012345',
        email: devoteeEmail,
        authProvider: 'google',
      };

      try {
        localStorage.setItem('vdonations_pending_sankalpam', JSON.stringify(pendingDevotee));
        localStorage.setItem('vdonations_auth_token', 'vasavi_google_jwt_' + Date.now());
        localStorage.setItem('vdonations_active_role', 'DEVOTEE');
        document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
      } catch (e) {}

      setLoading(false);
      setBlessingToast({
        show: true,
        title: 'Google Devotee Verified! 🪔',
        desc: 'Proceeding to select Sacred Gotram (102 Gotras) & Sankethanamam...',
      });

      setTimeout(() => {
        router.push('/sankalpam/gotram');
      }, 500);
    }
  };

  // Open Forgot Password Modal
  const handleOpenForgotPassword = () => {
    const clean = mobileNumber.replace(/\D/g, '');
    setForgotMobile(clean);
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError(null);
    setForgotSuccessMsg(null);
    setForgotStep(1);
    setShowForgotPassword(true);
  };

  // Verify Mobile in Forgot Password Modal (No OTP required)
  const handleVerifyForgotMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const clean = forgotMobile.replace(/\D/g, '');
    if (!clean || clean.length !== 10) {
      setForgotError('Please enter a valid 10-digit registered mobile number.');
      return;
    }

    setForgotLoading(true);
    try {
      const exists = await devoteeService.checkMobileExists(clean);
      if (!exists) {
        setForgotError(`No devotee account found with mobile +91 ${clean}. Please verify your number or register a New Sankalpam.`);
        setForgotLoading(false);
        return;
      }
      // Instant transition to Step 2 (Reset Password) - NO OTP required!
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err?.message || 'Error verifying devotee account.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset Devotee Password via Supabase RPC (Instant - No OTP)
  const handleResetDevoteePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotPwdValidation.isValid) {
      setForgotError('Please satisfy all 5 Strong Password security criteria.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setForgotLoading(true);
    try {
      const clean = forgotMobile.replace(/\D/g, '');
      const result = await devoteeService.resetPassword(clean, forgotNewPassword);

      if (!result.success) {
        setForgotError(result.error || 'Password update could not be completed.');
        setForgotLoading(false);
        return;
      }

      try {
        templeAudio.playTempleBell(0.85);
      } catch (e) {}

      // Update form state with the new password
      setPassword(forgotNewPassword);
      setMobileNumber(clean);
      setForgotStep(3);
    } catch (err: any) {
      setForgotError(err?.message || 'Failed to update password.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Guest / Atithi Instant Entry Handler
  const handleGuestEntry = () => {
    try {
      templeAudio.playTempleBell(0.6);
    } catch (e) {}

    const guestUser = {
      fullName: 'Atithi Devotee (Guest)',
      mobile: 'N/A',
      email: 'atithi@vasavi.dev',
      gotram: 'General Devotee',
      role: 'guest',
      isGuest: true,
      authenticatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('vdonations_user_session', JSON.stringify(guestUser));
      localStorage.setItem('vdonations_auth_token', 'guest_token_' + Date.now());
      localStorage.setItem('vdonations_active_role', 'GUEST');
      document.cookie = 'vdonations_auth=1; path=/; max-age=86400; SameSite=Lax';
    } catch (e) {}

    if (onExploreAsGuest) {
      onExploreAsGuest();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-radial from-[#380b13] via-[#1c0509] to-[#080203] text-white selection:bg-[#d4af37] selection:text-[#240a0c]">
      
      {/* ----------------------------------------------------------------------
          1. SACRED BACKGROUND EFFECTS: ROTATING MANDALA & GOLD PARTICLES
          ---------------------------------------------------------------------- */}
      
      {/* Slow-Rotating Sacred Mandala Watermark */}
      <div 
        className="fixed -left-32 -top-32 w-[650px] h-[650px] opacity-[0.07] pointer-events-none animate-[spin_120s_linear_infinite]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-[#ffe494] fill-none stroke-[0.75]">
          <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="35" />
          <circle cx="100" cy="100" r="15" />
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="5"
              x2="100"
              y2="195"
              transform={`rotate(${i * 11.25} 100 100)`}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <polygon
              key={i}
              points="100,20 120,60 100,50 80,60"
              transform={`rotate(${i * 45} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Floating Gold Diya Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-[#fde18e] blur-[1px] opacity-60 animate-pulse" />
        <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#ffd778] blur-[0.5px] opacity-40 animate-ping" />
        <div className="absolute top-[65%] left-[8%] w-2.5 h-2.5 rounded-full bg-[#f39c12] blur-[1.5px] opacity-50 animate-pulse" />
        <div className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full bg-[#fde18e] blur-[1px] opacity-70 animate-pulse" />
        <div className="absolute top-[50%] right-[8%] w-1.5 h-1.5 rounded-full bg-[#f39c12] blur-[1px] opacity-40 animate-ping" />
        <div className="absolute bottom-[20%] right-[22%] w-2 h-2 rounded-full bg-[#ffd778] blur-[0.5px] opacity-60 animate-pulse" />
      </div>

      {/* Golden Matrix Stardust Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Ambient Top & Bottom Volumetric Halos */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] rounded-full bg-gradient-to-b from-[#e5a93b]/25 via-[#996515]/10 to-transparent blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-[#b82e42]/15 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Bell Ripple Effect Overlay */}
      {isBellRinging && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border-2 border-[#f7d885] animate-ping opacity-75" />
          <div className="w-[500px] h-[500px] rounded-full border border-[#f5b041] animate-ping opacity-50" style={{ animationDelay: '150ms' }} />
          <div className="w-[700px] h-[700px] rounded-full border border-[#f39c12] animate-ping opacity-30" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2. MAIN CONTAINER: SPLIT SCREEN DEVOTEE SANCTUARY
          ---------------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ==================================================================
              LEFT COLUMN: SACRED DEVISTHANAM HERITAGE & AMMAVARU SHOWCASE
              ================================================================== */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Crest Badge with Golden Border */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5a1523]/80 via-[#3d0d16]/90 to-[#5a1523]/80 border border-[#d4af37]/60 text-[#f7d885] text-xs font-serif font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Flame className="w-4 h-4 text-[#f39c12] animate-pulse" />
              <span>Sri Kanyaka Parameswari Devasthanam</span>
            </div>

            {/* Grand Title with Sacred Metallic Gold Typography */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fff7de] via-[#f7d885] to-[#d4af37] leading-[1.18] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                Sri Vasavi Kanyaka Parameswari Matha
              </h1>
              <p className="text-sm sm:text-base font-serif text-[#f3cf7a] italic font-medium">
                Penugonda Moola Sthalam • Arya Vysya 102 Gothirams Heritage Portal
              </p>
            </div>

            {/* ----------------------------------------------------------------
                GLOWING AMMAVARU MEDALLION WITH ROTATING SUNBURST RAYS
                ---------------------------------------------------------------- */}
            <div className="flex justify-center lg:justify-start py-2">
              <div className="relative group">
                
                {/* Rotating Sunburst Halo */}
                <div 
                  className="absolute -inset-4 rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none animate-[spin_40s_linear_infinite]"
                  style={{
                    background: 'conic-gradient(from 0deg, #d4af37, #f7d885, #b37714, #ffe89e, #d4af37)',
                    filter: 'blur(10px)',
                  }}
                />

                {/* Floating Gold Sparkle Badges */}
                <div className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-[#4a101b] border border-[#f5d77f] flex items-center justify-center text-sm shadow-gold animate-bounce">
                  ✨
                </div>
                <div className="absolute top-1/2 -left-3 z-20 w-7 h-7 rounded-full bg-[#4a101b] border border-[#f5d77f] flex items-center justify-center text-xs shadow-gold animate-pulse">
                  🪙
                </div>

                {/* Concentric Golden Rim */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-[#ffe494] via-[#d4af37] to-[#b37714] shadow-[0_0_80px_rgba(212,175,55,0.5),inset_0_0_30px_rgba(212,175,55,0.4)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#2d0a10] to-[#120305] border-2 border-[#fff0ba] relative flex items-center justify-center">
                    <img
                      src="/images/vasavi_goddess_hd.png"
                      alt="Sri Vasavi Kanyaka Parameswari Matha"
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-115 transition-transform duration-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/welcome/welcome-mobile.jpg';
                      }}
                    />
                    {/* Golden Atmospheric Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#160407] via-transparent to-[#d4af37]/15 opacity-70" />
                  </div>

                  {/* Floating Sanctum Location Crest */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4d0f1a] to-[#2e080f] border-2 border-[#f5d77f] text-[#fbe18d] text-xs font-serif font-bold shadow-[0_6px_20px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-sm">🪔</span>
                    <span>Penugonda Moola Sthalam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Telugu Inscription with Gold Border Ribbon */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#29080e]/90 via-[#360b13]/90 to-[#29080e]/90 border border-[#d4af37]/40 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] space-y-1.5 max-w-lg mx-auto lg:mx-0">
              <div className="text-center font-serif text-[#ffe494] text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="text-[#f5b041]">✦</span>
                <span>&ldquo;ధర్మ రక్షణార్థాయ సంభవామి యుగే యుగే&rdquo;</span>
                <span className="text-[#f5b041]">✦</span>
              </div>
              <p className="text-[12px] text-[#e8cda2]/90 text-center leading-relaxed font-sans">
                Official digital sanctuary for Darshan, 80G Tax-Exempt Sevas, Swarna Hundi, and Arya Vysya 102 Gothirams Heritage.
              </p>
            </div>

            {/* Interactive Panchangam & Ring Temple Bell Ticker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="px-4 py-2 rounded-full bg-[#3d0d16]/90 border border-[#f5d77f]/40 text-xs font-serif text-[#ffe28a] flex items-center gap-2 shadow-sm">
                <Sun className="w-3.5 h-3.5 text-[#f6b43d]" />
                <span>Today: Shravana Masa • Ekadashi Tithi</span>
              </div>
              
              <button
                type="button"
                onClick={handleRingBell}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#a12338] via-[#85192b] to-[#63111e] hover:from-[#ba2840] hover:to-[#781525] border-2 border-[#f5d77f]/70 text-xs font-serif font-bold text-[#fff3cb] flex items-center gap-2 shadow-[0_4px_15px_rgba(161,35,56,0.5)] hover:shadow-[0_6px_20px_rgba(245,215,127,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <BellRing className={`w-4 h-4 text-[#ffe28a] ${isBellRinging ? 'animate-bounce' : ''}`} />
                <span>Ring Temple Bell</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMantra}
                className={`px-3.5 py-2 rounded-full border text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer ${
                  isChantPlaying
                    ? 'bg-[#d4af37] text-[#240c02] border-[#ffe89e] font-bold shadow-gold'
                    : 'bg-[#2b080f]/80 text-[#f5d77f] border-[#d4af37]/30 hover:bg-[#3d0d16]'
                }`}
                title="Play Sacred Temple Chimes"
              >
                {isChantPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isChantPlaying ? 'Sacred Chime Active' : 'Temple Chime'}</span>
              </button>
            </div>

            {/* Three Pillars of Trust */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#d4af37]/25 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">102</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">Sacred Gotras</span>
              </div>
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">₹4.8 Cr+</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">Devotee Sevas</span>
              </div>
              <div className="p-2 rounded-xl bg-[#28070d]/60 border border-[#d4af37]/20">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#f7d885] block">80G</span>
                <span className="text-[10px] text-[#e1b782] font-semibold uppercase tracking-wider">100% Tax Exempt</span>
              </div>
            </div>

          </div>

          {/* ==================================================================
              RIGHT COLUMN: DEVOTEE AUTHENTICATION SANCTUM CARD
              ================================================================== */}
          <div className="lg:col-span-6 flex justify-center">
            
            {/* Animated Golden Border Wrapper */}
            <div className="relative w-full max-w-md p-[2.5px] rounded-3xl bg-gradient-to-b from-[#ffe6a3] via-[#d4af37] to-[#734b08] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.3)]">
              
              {/* Card Body */}
              <div className="relative w-full rounded-[22px] p-6 sm:p-8 bg-[#1f0509]/95 backdrop-blur-2xl overflow-hidden text-left">
                
                {/* 4 Ornate Golden Corner Temple Filigrees */}
                <div className="absolute top-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute top-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute bottom-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
                <div className="absolute bottom-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>

                {/* Inner Hairline Frame */}
                <div className="absolute inset-2.5 rounded-[18px] border border-[#f5d77f]/20 pointer-events-none" />

                {/* Card Header & Tab Switcher */}
                <div className="relative z-10 mb-6 text-center space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#f7d885] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5a93b]" />
                    <span>Devotee Sanctuary Access</span>
                  </div>
                  
                  {/* Luxury Gold Tabs */}
                  <div className="flex rounded-full p-1 bg-[#120204] border border-[#d4af37]/40 shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setStatusMsg(null);
                        setMobileAlreadyExistsError(null);
                      }}
                      className={`flex-1 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                        activeTab === 'login'
                          ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] shadow-[0_2px_10px_rgba(247,216,133,0.4)]'
                          : 'text-[#e6be8a] hover:text-white'
                      }`}
                    >
                      Devotee Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('register');
                        setStatusMsg(null);
                        setMobileAlreadyExistsError(null);
                      }}
                      className={`flex-1 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                        activeTab === 'register'
                          ? 'bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] text-[#240a0c] shadow-[0_2px_10px_rgba(247,216,133,0.4)]'
                          : 'text-[#e6be8a] hover:text-white'
                      }`}
                    >
                      New Sankalpam
                    </button>
                  </div>
                </div>

                {/* Interactive Form */}
                <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                  
                  {/* Field 1: Devotee Full Name (Only in Registration / New Sankalpam) */}
                  {activeTab === 'register' && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#e5a93b]" /> Devotee Full Name
                      </label>
                      <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          autoComplete="name"
                          placeholder="e.g. Sri Vasavi Devotee"
                          className="w-full h-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none font-sans"
                          style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Field 2: Devotee Mobile Number (Direct Number & Password Auth - No Email Login) */}
                  {activeTab === 'login' ? (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                          <span>📱 Registered Mobile Number</span>
                        </label>
                      </div>
                      <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                        {/* Always Display Flag +91 for Devotee Mobile */}
                        <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#d4af37]/30 shrink-0">
                          <svg viewBox="0 0 24 16" className="w-[18px] h-[12px] rounded-[1px] shadow-xs" aria-label="India Flag">
                            <rect width="24" height="5.33" fill="#FF9933" />
                            <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                            <rect y="10.66" width="24" height="5.33" fill="#128807" />
                            <circle cx="12" cy="8" r="2" fill="#000088" />
                          </svg>
                          <span className="text-xs font-serif font-bold text-[#ffe28a]">+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobileNumber}
                          autoComplete="tel-national"
                          onChange={(e) => {
                            setMobileNumber(e.target.value.replace(/\D/g, ''));
                            setMobileAlreadyExistsError(null);
                          }}
                          placeholder="10-digit registered mobile number"
                          className="w-full h-full bg-transparent pl-3 text-sm text-white placeholder:text-[#a88267]/50 outline-none font-sans"
                          style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                          <span>📱 Devotee Mobile Number</span>
                        </label>
                        {isCheckingMobile && (
                          <span className="text-[10px] text-[#ffe28a] font-sans animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#f5d77f] animate-ping" /> Checking...
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center h-12 rounded-xl bg-[#130205] border px-3 transition-all ${
                        mobileAlreadyExistsError
                          ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                          : 'border-[#d4af37]/40 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)]'
                      }`}>
                        {/* Indian Flag SVG Badge */}
                        <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#d4af37]/30 shrink-0">
                          <svg viewBox="0 0 24 16" className="w-[18px] h-[12px] rounded-[1px] shadow-xs" aria-label="India Flag">
                            <rect width="24" height="5.33" fill="#FF9933" />
                            <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                            <rect y="10.66" width="24" height="5.33" fill="#128807" />
                            <circle cx="12" cy="8" r="2" fill="#000088" />
                          </svg>
                          <span className="text-xs font-serif font-bold text-[#ffe28a]">+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobileNumber}
                          autoComplete="tel-national"
                          onBlur={handleMobileBlur}
                          onChange={(e) => {
                            setMobileNumber(e.target.value.replace(/\D/g, ''));
                            setMobileAlreadyExistsError(null);
                          }}
                          placeholder="10-digit mobile number"
                          className="w-full h-full bg-transparent pl-3 text-sm text-white placeholder:text-[#a88267]/50 outline-none"
                          style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                        />
                      </div>
                      {mobileAlreadyExistsError && (
                        <div className="flex items-start gap-1.5 pt-1 text-[11px] text-red-300">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{mobileAlreadyExistsError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Field 3: Password with Strong Password Meter & Forgot Password Trigger */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#e5a93b]" />
                        <span>{activeTab === 'register' ? 'Sacred Strong Password' : 'Password / PIN'}</span>
                      </label>
                      {activeTab === 'login' ? (
                        <button
                          type="button"
                          onClick={handleOpenForgotPassword}
                          className="text-[11px] text-[#f7d885] hover:text-[#ffe494] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Key className="w-3 h-3 text-[#f5d77f]" />
                          <span>Forgot Password?</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGenerateStrongPassword}
                          className="text-[10px] text-[#f7d885] hover:text-[#ffe494] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#f5d77f]" />
                          <span>Suggest Strong Password</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] focus-within:shadow-[0_0_14px_rgba(245,215,127,0.35)] transition-all">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={activeTab === 'register' ? 'new-password' : 'current-password'}
                        placeholder={activeTab === 'register' ? 'Create strong password (e.g. 849206#Vk@713!)' : 'Enter your password or PIN'}
                        className="w-full h-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none"
                        style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#e5a93b] hover:text-[#ffe18d] ml-2 shrink-0 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Registration Strong Password Meter & 5 Criteria Checklist */}
                    {activeTab === 'register' && (
                      <div className="p-3 rounded-xl bg-[#140306]/90 border border-[#d4af37]/30 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#e8cda2]">Password Strength:</span>
                          <span className={`font-serif font-bold ${
                            pwdValidation.score <= 2
                              ? 'text-red-400'
                              : pwdValidation.score <= 4
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {pwdValidation.score <= 1 && 'Very Weak ⚠️'}
                            {pwdValidation.score === 2 && 'Weak ⚠️'}
                            {pwdValidation.score === 3 && 'Medium 🛡️'}
                            {pwdValidation.score === 4 && 'Strong 🛡️'}
                            {pwdValidation.score === 5 && 'Sacred Strong ✨'}
                          </span>
                        </div>

                        {/* Visual Strength Progress Bar */}
                        <div className="w-full h-1.5 bg-[#2d0a10] rounded-full overflow-hidden flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                pwdValidation.score >= lvl
                                  ? pwdValidation.score <= 2
                                    ? 'bg-red-500'
                                    : pwdValidation.score <= 4
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                                  : 'bg-stone-800'
                              }`}
                            />
                          ))}
                        </div>

                        {/* 5 Criteria Checkmarks */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                          <div className={`flex items-center gap-1.5 ${pwdValidation.hasMinLength ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                            {pwdValidation.hasMinLength ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-stone-500 shrink-0" />}
                            <span>8+ Characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidation.hasUppercase ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                            {pwdValidation.hasUppercase ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-stone-500 shrink-0" />}
                            <span>Uppercase (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidation.hasLowercase ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                            {pwdValidation.hasLowercase ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-stone-500 shrink-0" />}
                            <span>Lowercase (a-z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${pwdValidation.hasNumber ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                            {pwdValidation.hasNumber ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-stone-500 shrink-0" />}
                            <span>Number (0-9)</span>
                          </div>
                          <div className={`col-span-2 flex items-center gap-1.5 ${pwdValidation.hasSpecial ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                            {pwdValidation.hasSpecial ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-stone-500 shrink-0" />}
                            <span>Special Character (!@#$%^&*...)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-[#e8cda2]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-[#d4af37] w-4 h-4 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                    <span className="text-[#a88267] text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#e5a93b]" /> 256-Bit SSL Secured
                    </span>
                  </div>

                  {/* Status Feedback Notice */}
                  {statusMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs text-center border ${
                        statusMsg.type === 'error'
                          ? 'bg-red-950/80 border-red-500 text-red-100'
                          : 'bg-[#3d0d16]/90 border-[#d4af37] text-[#fff4d1]'
                      }`}
                    >
                      {statusMsg.text}
                    </div>
                  )}

                  {/* Primary Radiant Golden CTA Button with Shimmer */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-13 rounded-full font-serif font-bold text-base tracking-wide text-[#240a0c] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-[0_10px_35px_rgba(229,169,59,0.6),0_0_20px_rgba(255,225,141,0.4)] overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #fff3c9 0%, #f6c343 45%, #d48b17 100%)',
                    }}
                  >
                    {/* Diagonal Light Sweep Effect */}
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
                    
                    <span>
                      {loading
                        ? 'Authenticating...'
                        : activeTab === 'register'
                        ? 'Continue to Sacred Gotram (Step 1 of 2)'
                        : 'Enter Devotee Sanctuary'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Divider: OR */}
                  <div className="flex items-center justify-center gap-3 my-2">
                    <span className="flex-1 h-[1px] bg-[#d4af37]/30" />
                    <span className="text-[11px] font-bold font-serif text-[#f5d77f] tracking-widest">✦ OR ✦</span>
                    <span className="flex-1 h-[1px] bg-[#d4af37]/30" />
                  </div>

                  {/* Secondary Action: Continue with Google / Gmail */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-11 rounded-full bg-[#150306] hover:bg-[#28080f] border border-[#d4af37]/40 hover:border-[#ffe18d] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google / Gmail</span>
                  </button>

                  {/* Instant Atithi (Guest) Entry Button */}
                  <div className="pt-1.5 text-center">
                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#5a1523]/70 to-[#380b13]/70 hover:from-[#751c2f] hover:to-[#4a0e19] border border-[#f5d77f]/50 hover:border-[#f5d77f] text-[#fbe18d] font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                    >
                      <span>🪔</span>
                      <span>Explore Sanctuary as Guest (Atithi Devotee) ➔</span>
                    </button>
                  </div>

                </form>

                {/* Security & Official Seal Footer */}
                <div className="mt-6 pt-3.5 border-t border-[#d4af37]/25 text-center space-y-1 text-[11px] text-[#e8cda2]/75">
                  <div className="flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>Section 80G Tax Exempt</span>
                  </div>
                  <p className="text-[10px] text-[#f5d77f]/80 font-serif">
                    Sri Vasavi Kanyaka Parameswari Matha Devasthanam, Penugonda
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================================
          DEVOTEE FORGOT PASSWORD MODAL (SUPABASE ENCRYPTED RECOVERY)
          ================================================================== */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-[2.5px] rounded-3xl bg-gradient-to-b from-[#ffe6a3] via-[#d4af37] to-[#734b08] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.4)]">
            <div className="relative w-full rounded-[22px] p-6 sm:p-7 bg-[#1c0408] text-left">
              
              {/* Filigree corners */}
              <div className="absolute top-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute top-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute bottom-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute bottom-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-4 right-4 text-[#e5a93b] hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center space-y-1.5 mb-5 pr-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d0d16] border border-[#f5d77f]/40 text-xs font-serif text-[#ffe28a]">
                  <Key className="w-3.5 h-3.5 text-[#f5b041]" />
                  <span>Devotee Password Recovery</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#ffe89e]">
                  Sri Vasavi Sanctuary Access
                </h3>
                <p className="text-[11px] text-[#e8cda2]">
                  {forgotStep === 1 && 'Enter your registered mobile number to reset your password instantly (no OTP required).'}
                  {forgotStep === 2 && 'Create and sanctify a new strong password for your devotee account (instant - no OTP required).'}
                  {forgotStep === 3 && 'Password successfully updated in Sri Vasavi Sanctuary!'}
                </p>
              </div>

              {/* Step 1: Verify Registered Mobile Number */}
              {forgotStep === 1 && (
                <form onSubmit={handleVerifyForgotMobile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f]">
                      Registered Mobile Number
                    </label>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3 focus-within:border-[#ffe18d] transition-all">
                      <div className="flex items-center gap-1.5 pr-2.5 border-r border-[#d4af37]/30 shrink-0">
                        <svg viewBox="0 0 24 16" className="w-[18px] h-[12px] rounded-[1px] shadow-xs" aria-label="India Flag">
                          <rect width="24" height="5.33" fill="#FF9933" />
                          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
                          <rect y="10.66" width="24" height="5.33" fill="#128807" />
                          <circle cx="12" cy="8" r="2" fill="#000088" />
                        </svg>
                        <span className="text-xs font-serif font-bold text-[#ffe28a]">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={forgotMobile}
                        autoComplete="off"
                        onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit registered mobile number"
                        className="w-full h-full bg-transparent pl-3 text-sm text-white placeholder:text-[#a88267]/50 outline-none font-sans"
                        style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-12 rounded-full font-serif font-bold text-sm text-[#240a0c] bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-gold"
                  >
                    {forgotLoading ? (
                      <span>Verifying Devotee Account...</span>
                    ) : (
                      <>
                        <span>Verify Devotee Account (No OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Set New Strong Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetDevoteePassword} className="space-y-4">
                  <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-[#2b080f] border border-[#d4af37]/30 text-[#fbe18d]">
                    <span>Devotee Account:</span>
                    <span className="font-bold font-mono">
                      +91 {forgotMobile}
                    </span>
                  </div>

                  {/* New Password Input */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f]">
                        New Sacred Strong Password
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateForgotStrongPassword}
                        className="text-[10px] text-[#f7d885] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#f5d77f]" />
                        <span>Suggest Strong</span>
                      </button>
                    </div>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] transition-all">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={forgotNewPassword}
                        autoComplete="new-password"
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Create strong new password"
                        className="w-full h-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none"
                        style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="text-[#e5a93b] hover:text-[#ffe18d] ml-2 shrink-0 cursor-pointer"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Strength Meter */}
                  <div className="p-3 rounded-xl bg-[#140306]/90 border border-[#d4af37]/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#e8cda2]">Security Rating:</span>
                      <span className={`font-serif font-bold ${
                        forgotPwdValidation.score <= 2 ? 'text-red-400' :
                        forgotPwdValidation.score <= 4 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {forgotPwdValidation.score <= 1 && 'Very Weak ⚠️'}
                        {forgotPwdValidation.score === 2 && 'Weak ⚠️'}
                        {forgotPwdValidation.score === 3 && 'Medium 🛡️'}
                        {forgotPwdValidation.score === 4 && 'Strong 🛡️'}
                        {forgotPwdValidation.score === 5 && 'Sacred Strong ✨'}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#2d0a10] rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            forgotPwdValidation.score >= lvl
                              ? forgotPwdValidation.score <= 2
                                ? 'bg-red-500'
                                : forgotPwdValidation.score <= 4
                                ? 'bg-amber-400'
                                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                              : 'bg-stone-800'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                      <div className={`flex items-center gap-1 ${forgotPwdValidation.hasMinLength ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                        {forgotPwdValidation.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block mr-1" />}
                        <span>8+ Chars</span>
                      </div>
                      <div className={`flex items-center gap-1 ${forgotPwdValidation.hasUppercase ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                        {forgotPwdValidation.hasUppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block mr-1" />}
                        <span>Uppercase (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${forgotPwdValidation.hasLowercase ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                        {forgotPwdValidation.hasLowercase ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block mr-1" />}
                        <span>Lowercase (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${forgotPwdValidation.hasNumber ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                        {forgotPwdValidation.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block mr-1" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`col-span-2 flex items-center gap-1 ${forgotPwdValidation.hasSpecial ? 'text-emerald-300 font-semibold' : 'text-stone-400'}`}>
                        {forgotPwdValidation.hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block mr-1" />}
                        <span>Special Symbol (!@#$%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#f5d77f]">
                      Confirm New Password
                    </label>
                    <div className="flex items-center h-12 rounded-xl bg-[#130205] border border-[#d4af37]/40 px-3.5 focus-within:border-[#ffe18d] transition-all">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        value={forgotConfirmPassword}
                        autoComplete="new-password"
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full h-full bg-transparent text-sm text-white placeholder:text-[#a88267]/50 outline-none"
                        style={{ WebkitBoxShadow: '0 0 0 1000px #130205 inset', WebkitTextFillColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotPwdValidation.isValid}
                    className="w-full h-12 rounded-full font-serif font-bold text-sm text-[#240a0c] bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-gold"
                  >
                    {forgotLoading ? (
                      <span>Updating in Sanctuary...</span>
                    ) : (
                      <>
                        <span>Reset & Sanctify Password 🪔</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {forgotStep === 3 && (
                <div className="text-center space-y-4 py-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ffe494] via-[#d4af37] to-[#804f08] p-1 mx-auto flex items-center justify-center shadow-gold">
                    <div className="w-full h-full rounded-full bg-[#180306] flex items-center justify-center text-2xl">
                      🪔
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-base font-serif font-bold text-[#ffe89e]">
                      Password Reset Completed!
                    </h4>
                    <p className="text-xs text-[#e8cda2] leading-relaxed">
                      Your new sacred password has been securely encrypted and stored in the Sri Vasavi Sanctuary database. You may now enter your sanctuary.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setActiveTab('login');
                      setBlessingToast({
                        show: true,
                        title: 'Password Updated 🪔',
                        desc: 'You can now sign in using your new password.',
                      });
                    }}
                    className="w-full h-12 rounded-full font-serif font-bold text-sm text-[#240a0c] bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-gold"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          GOOGLE AUTHENTICATION & SANDBOX MODAL
          ================================================================== */}
      {showGoogleProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-[2.5px] rounded-3xl bg-gradient-to-b from-[#ffe6a3] via-[#d4af37] to-[#734b08] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.4)]">
            <div className="relative w-full rounded-[22px] p-6 sm:p-7 bg-[#1c0408] text-left space-y-5">
              
              {/* Filigree corners */}
              <div className="absolute top-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute top-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute bottom-2 left-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>
              <div className="absolute bottom-2 right-2 pointer-events-none text-[#f5d77f]/70 text-xs">✤</div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGoogleProviderModal(false)}
                className="absolute top-4 right-4 text-[#e5a93b] hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center space-y-1.5 pr-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d0d16] border border-[#f5d77f]/40 text-xs font-serif text-[#ffe28a]">
                  <Sparkles className="w-3.5 h-3.5 text-[#f5b041]" />
                  <span>Google Authentication in Supabase</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#ffe89e]">
                  Sri Vasavi Sanctuary Devotee Sign-In
                </h3>
              </div>

              {/* Supabase Provider Notice Box */}
              <div className="p-3.5 rounded-xl bg-[#2a070e] border border-[#d4af37]/40 space-y-2 text-xs text-[#e8cda2]">
                <div className="flex items-center gap-2 font-serif font-bold text-[#ffe494]">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Supabase Provider Configuration Notice:</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Supabase returned <code className="text-amber-300 font-mono">provider is not enabled</code>. To enable direct Google OAuth popup login with your Google Cloud credentials:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#fbe18d]/90 pl-1 font-sans">
                  <li>Open <strong>Supabase Dashboard &gt; Authentication &gt; Providers</strong>.</li>
                  <li>Click <strong>Google</strong> and toggle it <strong>Enabled</strong>.</li>
                  <li>Enter your <strong>Google Client ID</strong> and <strong>Client Secret</strong>.</li>
                </ol>
              </div>

              {/* Instant Devotee Google Sandbox Sign-In */}
              <div className="p-4 rounded-xl bg-[#130205] border border-[#d4af37]/30 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#ffe28a]">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Instant Google / Gmail Devotee Sign-In:</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-serif uppercase tracking-wider text-[#f5d77f]">
                      Devotee Name
                    </label>
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="Devotee Google Name"
                      className="w-full h-10 rounded-lg bg-[#20050a] border border-[#d4af37]/40 px-3 text-xs text-white placeholder:text-stone-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-serif uppercase tracking-wider text-[#f5d77f]">
                      Google / Gmail Address
                    </label>
                    <input
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="devotee@gmail.com"
                      className="w-full h-10 rounded-lg bg-[#20050a] border border-[#d4af37]/40 px-3 text-xs text-white placeholder:text-stone-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDevoteeGoogleDirectSignIn(googleEmailInput, googleNameInput)}
                  className="w-full py-3 rounded-full font-serif font-bold text-xs text-[#240a0c] bg-gradient-to-r from-[#ffe494] via-[#f7d885] to-[#d4af37] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-gold"
                >
                  <span>Sign In with Google / Gmail (Proceed to Gotram)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Floating Vedic Blessing Toast */}
      {blessingToast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#300910] border-2 border-[#f5d77f] text-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-3 animate-bounce">
          <span className="text-2xl">🪔</span>
          <div className="text-left">
            <h4 className="font-serif font-bold text-[#ffe28a] text-sm">{blessingToast.title}</h4>
            <p className="text-xs text-[#e8cda2]">{blessingToast.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
}
