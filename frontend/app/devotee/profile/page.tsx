'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  FileText,
  Repeat,
  Sparkles,
  Users,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Save,
  Edit3,
  Check,
  X,
  Heart,
} from 'lucide-react';
import { calculateDevoteeMedals } from '@/lib/medals';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { useAuth } from '@/lib/auth-context';
import { devoteeService, donationsService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';
import { GOTHIRAM_DATA, findGotramBySankethanamam } from '@/lib/gothiram-data';
import { NakshatraSelect, GotraSelect } from '@/components/ui/VedicSelects';
import { UserRoleType } from '@/lib/types';
import {
  IconDevoteeSacred,
  IconTempleMatha,
  IconDevotionalCoin,
  IconDevoteeMedal,
} from '@/components/icons/DevotionalIcons';

export default function DevoteeProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();
  const { user, activeRole, switchActiveRole, logout, updateDevoteeProfile } = useAuth();

  const userAccountRole = (user?.role || '').toUpperCase();
  const isSuperAdmin =
    userAccountRole === 'SUPER_ADMIN' || userAccountRole === 'SUPERADMIN';
  const isTempleAdmin =
    isSuperAdmin ||
    userAccountRole === 'TEMPLE_ADMIN' ||
    userAccountRole === 'TEMPLE_MANAGER';
  const isFinanceAdmin =
    isSuperAdmin || userAccountRole === 'FINANCE_ADMIN';

  // Profile Information - loaded dynamically from auth & storage
  const [name, setName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || '' : ''));
  const [email, setEmail] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_email') || '' : ''));
  const [mobile, setMobile] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_mobile') || '' : ''));
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [gotram, setGotram] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_gotram') || '' : ''));
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [pan, setPan] = useState('');
  const [sankethanamam, setSankethanamam] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_sankethanamam') || '' : ''));
  const [totalSeva, setTotalSeva] = useState(0);
  const [sevasCount, setSevasCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    // 1. Resolve devotee details from user object and localStorage
    let effName = name;
    let effEmail = email;
    let effMobile = mobile;
    let effGotram = gotram;
    let effSankethanamam = sankethanamam;

    if (user) {
      if (user.fullName) effName = user.fullName;
      if (user.email) effEmail = user.email;
      if (user.mobile) effMobile = user.mobile;
      if (user.gotram && user.gotram !== 'General Devotee') effGotram = user.gotram;
      if (user.sankethanamam) effSankethanamam = user.sankethanamam;
    }

    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('vdonations_devotee_name');
      const storedEmail = localStorage.getItem('vdonations_devotee_email');
      const storedMobile = localStorage.getItem('vdonations_devotee_mobile');
      const storedGotram = localStorage.getItem('vdonations_selected_gotram');
      const storedSankethanamam = localStorage.getItem('vdonations_selected_sankethanamam');

      if (!effName && storedName) effName = storedName;
      if (!effEmail && storedEmail) effEmail = storedEmail;
      if (!effMobile && storedMobile) effMobile = storedMobile;
      if ((!effGotram || effGotram === 'General Devotee') && storedGotram && storedGotram !== 'General Devotee') {
        effGotram = storedGotram;
      }
      if (!effSankethanamam && storedSankethanamam) effSankethanamam = storedSankethanamam;
    }

    // 2. Auto-derive Gotram from Sankethanamam if Gotram is missing or placeholder
    if ((!effGotram || effGotram === 'General Devotee') && effSankethanamam) {
      const matchedGotra = findGotramBySankethanamam(effSankethanamam);
      if (matchedGotra) {
        effGotram = `${matchedGotra.id} - ${matchedGotra.name}`;
      }
    }

    // 3. For Rakesh (Super Admin / Patron), ensure defaults are populated
    if (effEmail?.toLowerCase() === 'rakesh9652289106@gmail.com') {
      if (!effGotram || effGotram === 'General Devotee') {
        effGotram = '44 - MOUTHKALYASA';
      }
      if (!effSankethanamam) {
        effSankethanamam = 'NAABILLA';
      }
    }

    if (effName) setName(effName);
    if (effEmail) setEmail(effEmail);
    if (effMobile) setMobile(effMobile);
    if (effGotram) {
      setGotram(effGotram);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vdonations_selected_gotram', effGotram);
      }
    }
    if (effSankethanamam) {
      setSankethanamam(effSankethanamam);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vdonations_selected_sankethanamam', effSankethanamam);
      }
    }

    // 4. Listen to custom profile update event
    const handleProfileUpdate = (e: any) => {
      const updated = e.detail;
      if (updated) {
        if (updated.fullName) setName(updated.fullName);
        if (updated.email) setEmail(updated.email);
        if (updated.mobile) setMobile(updated.mobile);
        if (updated.sankethanamam !== undefined) {
          setSankethanamam(updated.sankethanamam);
          if (updated.sankethanamam && (!updated.gotram || updated.gotram === 'General Devotee')) {
            const mg = findGotramBySankethanamam(updated.sankethanamam);
            if (mg) setGotram(`${mg.id} - ${mg.name}`);
          }
        }
        if (updated.gotram && updated.gotram !== 'General Devotee') {
          setGotram(updated.gotram);
        }
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('vdonations_profile_updated', handleProfileUpdate);
    }

    // 5. Query live profile from Supabase by user.id OR by email
    const fetchLiveProfile = async () => {
      let prof: any = null;
      if (user?.id) {
        prof = await devoteeService.getProfile(user.id);
      }
      if (!prof && effEmail) {
        const { data: profByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', effEmail)
          .maybeSingle();
        if (profByEmail) prof = profByEmail;
      }

      if (prof) {
        if (prof.full_name) setName(prof.full_name);
        if (prof.mobile || prof.phone) setMobile(prof.mobile || prof.phone || '');
        if (prof.email) setEmail(prof.email);
        if (prof.city) setCity(prof.city);
        if (prof.state) setState(prof.state);
        if (prof.nakshatram) setNakshatra(prof.nakshatram);
        if (prof.pan_number) setPan(prof.pan_number);
        if (prof.total_donated) setTotalSeva(Number(prof.total_donated));

        let g = prof.gotram;
        let s = prof.sankethanamam;

        const currentEmail = prof.email || effEmail || email;
        if (currentEmail?.toLowerCase() === 'rakesh9652289106@gmail.com') {
          if (!g || g === 'General Devotee') g = '44 - MOUTHKALYASA';
          if (!s) s = 'NAABILLA';
        }

        if ((!g || g === 'General Devotee') && s) {
          const matched = findGotramBySankethanamam(s);
          if (matched) g = `${matched.id} - ${matched.name}`;
        }
        if (g && g !== 'General Devotee') {
          setGotram(g);
          if (typeof window !== 'undefined') localStorage.setItem('vdonations_selected_gotram', g);
        }
        if (s) {
          setSankethanamam(s);
          if (typeof window !== 'undefined') localStorage.setItem('vdonations_selected_sankethanamam', s);
        }
      }
    };
    fetchLiveProfile();

    if (user?.id) {
      donationsService.getDevoteeDonations(user.id).then((dons) => {
        if (dons && dons.length > 0) {
          setSevasCount(dons.length);
          const sum = dons.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
          setTotalSeva(sum);
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('vdonations_profile_updated', handleProfileUpdate);
      }
    };
  }, [user]);

  const medalProgress = calculateDevoteeMedals(MOCK_DONATIONS);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gotram || gotram === 'General Devotee') {
      showAlert({
        type: 'warning',
        title: 'Gotram is Mandatory',
        message: 'Please select your Sacred Gotram from the 102 Arya Vysya Gotras to complete your profile.',
      });
      return;
    }

    if (!sankethanamam || !sankethanamam.trim()) {
      showAlert({
        type: 'warning',
        title: 'Sankethanamam is Mandatory',
        message: 'Please enter your family Sankethanamam (e.g. NAABILLA) to complete your profile.',
      });
      return;
    }

    const ok = await confirmAction({
      title: 'Update Sacred Devotee Profile?',
      message: 'Are you sure you want to save these profile changes? Your Gotram, Nakshatram, and PAN details will be synced for all future seva sankalpams and 80G tax receipts.',
      itemName: `${name} (${gotram} Gotram)`,
      variant: 'change',
      confirmText: 'Yes, Save Profile',
      cancelText: 'Keep Editing',
    });
    if (ok) {
      const profileUpdates = {
        full_name: name,
        email: email,
        mobile: mobile,
        city,
        state,
        gotram,
        sankethanamam,
        nakshatram: nakshatra,
        pan_number: pan,
        sankalpam_completed: true,
        updated_at: new Date().toISOString(),
      };

      if (user?.id) {
        await devoteeService.updateProfile(user.id, profileUpdates);
      }
      if (email) {
        await supabase.from('profiles').update(profileUpdates).eq('email', email);
      }

      updateDevoteeProfile({
        fullName: name,
        email,
        mobile,
        gotram,
        sankethanamam,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('vdonations_selected_gotram', gotram);
        localStorage.setItem('vdonations_selected_sankethanamam', sankethanamam);
        localStorage.setItem('vdonations_devotee_name', name);
        localStorage.setItem('vdonations_devotee_email', email);
        localStorage.setItem('vdonations_devotee_mobile', mobile);
      }

      setIsEditing(false);
      setIsSaved(true);
      showAlert({
        title: 'Profile Updated Successfully',
        message: 'Your sacred devotee profile, Gotram, and Sankethanamam have been updated across the portal.',
        type: 'success',
      });
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Personal Details',
      sublabel: gotram ? `${gotram} Gotram • ${sankethanamam ? sankethanamam + ' • ' : ''}${email || 'Verified Devotee'}` : 'Gotram, Sankethanamam, Email, PAN for 80G',
      onClick: () => setIsEditing(true),
    },
    {
      icon: FileText,
      label: 'My Receipts',
      sublabel: 'Download 80G tax certificates',
      href: '/devotee/receipts',
    },
    {
      icon: Repeat,
      label: 'AutoPay Subscriptions',
      sublabel: 'Manage monthly recurring seva',
      href: '/devotee/recurring',
    },
    {
      icon: Sparkles,
      label: 'Rewards & Recognition',
      sublabel: 'Badges, honors & medal tiers',
      href: '/devotee/rewards',
    },
    {
      icon: Users,
      label: 'Family Members',
      sublabel: 'Add family names for sankalpam',
      href: '/devotee/family',
    },
    {
      icon: Building2,
      label: 'Favorite Mathas',
      sublabel: 'Track your sacred devasthanams',
      href: '/devotee/temples',
    },
    {
      icon: BarChart3,
      label: 'Seva Analytics',
      sublabel: 'Annual statements & tax reports',
      href: '/devotee/analytics',
    },
    {
      icon: Bell,
      label: 'Notification Preferences',
      sublabel: 'WhatsApp, SMS & Email alerts',
      href: '/devotee/notifications',
    },
    {
      icon: Settings,
      label: 'Settings',
      sublabel: 'Security, language & app options',
      href: '/devotee/settings',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans px-3 sm:px-0">
      {/* DEVOTEE IDENTITY CARD */}
      <div className="bg-gradient-to-br from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-devotional-gold/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
          {/* Avatar with Gold Diya Ring */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-devotional-maroon-dark flex items-center justify-center font-serif text-2xl font-black text-amber-300">
                {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'OM'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 text-xl">🪔</span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                {name || 'Sri Vasavi Devotee'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-400/30">
                🥇 Sacred Seva Patron
              </span>
            </div>
            <p className="text-xs text-amber-100/90 font-medium">
              {mobile ? mobile : 'Mobile not set'} {email ? `• ${email}` : ''}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/15 text-amber-200 border border-amber-400/30 text-xs font-serif font-semibold">
                🪔 {gotram ? `${gotram} Gotram` : 'Gotram Lineage'}
              </span>
              {sankethanamam && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-devotional-saffron/20 text-amber-300 border border-devotional-saffron/40 text-xs font-mono font-bold tracking-wider">
                  📜 Sankethanamam: {sankethanamam}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-300/40 text-xs font-bold active-press transition-all flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/10 text-center relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">Total Seva</span>
            <span className="font-serif font-bold text-base sm:text-lg text-amber-300">₹{totalSeva.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">Sevas Offered</span>
            <span className="font-serif font-bold text-base sm:text-lg text-white">{sevasCount}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">Mathas Supported</span>
            <span className="font-serif font-bold text-base sm:text-lg text-white">1</span>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs font-bold shadow-xs">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* EDIT PERSONAL DETAILS FORM MODAL / COLLAPSIBLE */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4"
        >
          <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400">
              Personal & Sankalpam Details
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">PAN Card (for 80G)</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono"
              />
            </div>

            <GotraSelect
              label="Devotee Gotram (Sankalpam) *"
              value={gotram}
              onChange={(newGotra) => {
                setGotram(newGotra);
                const cleanName = newGotra.replace(/^\d+\s*[-–.:]\s*/, '').trim().toUpperCase();
                const match = GOTHIRAM_DATA.find(
                  (g) => g.name.toUpperCase() === cleanName || `${g.id} - ${g.name}` === newGotra
                );
                if (match && match.sankethanamams.length > 0 && !sankethanamam) {
                  setSankethanamam(match.sankethanamams[0]);
                }
              }}
              placeholder="Select Gotram (Mandatory)"
              required={true}
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Sankethanamam *
                </label>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  (Mandatory • Auto-detects Gotram)
                </span>
              </div>
              <input
                type="text"
                required
                value={sankethanamam}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setSankethanamam(val);
                  const matched = findGotramBySankethanamam(val);
                  if (matched) {
                    setGotram(`${matched.id} - ${matched.name}`);
                  }
                }}
                placeholder="e.g. NAABILLA"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono"
              />
            </div>

            <NakshatraSelect
              label="Janma Nakshatra"
              value={nakshatra}
              onChange={setNakshatra}
              placeholder="Select Nakshatra"
            />

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs active-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-devotional-maroon text-white font-bold text-xs shadow-md hover:brightness-110 active-press transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </form>
      )}

      {/* 10-ITEM MENU LIST */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center justify-between p-4 hover:bg-amber-50/50 dark:hover:bg-stone-800/50 active-press transition-colors cursor-pointer">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-devotional-cream dark:bg-stone-800 border border-devotional-gold/30 text-devotional-maroon dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">{item.sublabel}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
            </div>
          );

          if (item.href) {
            return (
              <Link key={idx} href={item.href}>
                {content}
              </Link>
            );
          }

          return (
            <div key={idx} onClick={item.onClick}>
              {content}
            </div>
          );
        })}

        {/* 10. Logout item */}
        <div
          onClick={async () => {
            const ok = await confirmAction({
              title: 'Sign Out of Devotee Portal?',
              message: 'Are you sure you want to end your devotee session? You will need to sign in again to view your receipts, family occasions, and pooja slots.',
              variant: 'danger',
              confirmText: 'Yes, Sign Out',
              cancelText: 'Stay Signed In',
            });
            if (ok) {
              await logout();
              window.location.href = '/login';
            }
          }}
          className="flex items-center justify-between p-4 hover:bg-rose-50 dark:hover:bg-rose-950/30 active-press transition-colors cursor-pointer text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm">Logout</p>
              <p className="text-[11px] text-stone-400">Sign out of your devotee session</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </div>
      </div>

      {/* SWITCH PORTAL ACCESS (Moved from drawer to Profile Down) */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider px-2">
          Switch Portal Access
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => {
              switchActiveRole('DEVOTEE');
              router.push('/devotee/dashboard');
            }}
            className={`p-3.5 rounded-2xl border transition-all active-press flex flex-col items-center text-center gap-1.5 cursor-pointer ${
              activeRole === 'DEVOTEE'
                ? 'bg-amber-100/80 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                : 'bg-white dark:bg-stone-900 border-devotional-gold/50 shadow-xs hover:border-devotional-maroon text-stone-900 dark:text-stone-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 p-1.5 flex items-center justify-center border border-amber-300/40 shadow-xs shrink-0">
              <IconDevoteeSacred size={24} active={true} />
            </div>
            <span className="font-serif font-bold text-xs">Devotee</span>
            <span className="text-[10px] text-stone-400">Public Portal</span>
          </button>

          {isTempleAdmin && (
            <button
              type="button"
              onClick={() => {
                switchActiveRole('TEMPLE_ADMIN');
                router.push('/admin/temple/dashboard');
              }}
              className={`p-3.5 rounded-2xl border transition-all active-press flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                activeRole === 'TEMPLE_ADMIN'
                  ? 'bg-amber-100/80 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-devotional-maroon text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 p-1.5 flex items-center justify-center border border-amber-300/40 shadow-xs shrink-0">
                <IconTempleMatha size={24} active={true} />
              </div>
              <span className="font-serif font-bold text-xs">Temple Admin</span>
              <span className="text-[10px] text-stone-400">Pooja & Sevas</span>
            </button>
          )}

          {isFinanceAdmin && (
            <button
              type="button"
              onClick={() => {
                switchActiveRole('FINANCE_ADMIN');
                router.push('/admin/finance/dashboard');
              }}
              className={`p-3.5 rounded-2xl border transition-all active-press flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                activeRole === 'FINANCE_ADMIN'
                  ? 'bg-amber-100/80 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-devotional-maroon text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 p-1.5 flex items-center justify-center border border-amber-300/40 shadow-xs shrink-0">
                <IconDevotionalCoin size={22} />
              </div>
              <span className="font-serif font-bold text-xs">Finance</span>
              <span className="text-[10px] text-stone-400">80G & Accounts</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                switchActiveRole('SUPER_ADMIN');
                router.push('/admin/super/dashboard');
              }}
              className={`p-3.5 rounded-2xl border transition-all active-press flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                activeRole === 'SUPER_ADMIN'
                  ? 'bg-amber-100/80 dark:bg-stone-800 border-amber-400 font-bold text-devotional-maroon dark:text-amber-400 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-devotional-maroon text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 p-1.5 flex items-center justify-center border border-amber-300/40 shadow-xs shrink-0">
                <IconDevoteeMedal size={22} />
              </div>
              <span className="font-serif font-bold text-xs">Super Admin</span>
              <span className="text-[10px] text-stone-400">Full System</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK APP PREFERENCES (Language & Appearance) */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider px-2">
          App Preferences
        </p>
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 space-y-3.5 text-xs shadow-xs">
          {/* Language Switch */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-700 dark:text-stone-300">Language:</span>
            <div className="flex items-center rounded-full bg-stone-100 dark:bg-stone-800 p-0.5 border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all active-press ${
                  language === 'en'
                    ? 'bg-devotional-maroon text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all active-press ${
                  language === 'te'
                    ? 'bg-devotional-maroon text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* Appearance Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
            <span className="font-medium text-stone-700 dark:text-stone-300">Appearance Theme:</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  document.documentElement.classList.toggle('dark');
                }
              }}
              className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 active-press"
            >
              Toggle Light / Dark
            </button>
          </div>
        </div>
      </div>

      {/* Devotional App Build Footer */}
      <div className="text-center text-[10px] text-stone-400 dark:text-stone-500 py-3 space-y-0.5">
        <p>🙏 Sri Vasavi Kanyaka Parameswari Temple</p>
        <p className="font-mono">Digital Seva App • Build v2.4.0 (PWA & Mobile)</p>
      </div>
    </div>
  );
}
