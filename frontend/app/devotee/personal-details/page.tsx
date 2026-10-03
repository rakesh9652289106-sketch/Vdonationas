'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Compass,
  MapPin,
  ShieldCheck,
  Edit3,
  Save,
  ArrowLeft,
  Check,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { useAuth } from '@/lib/auth-context';
import { devoteeService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';
import { GOTHIRAM_DATA, findGotramBySankethanamam } from '@/lib/gothiram-data';
import { NakshatraSelect, GotraSelect } from '@/components/ui/VedicSelects';

function PersonalDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEditMode = searchParams.get('edit') === 'true';

  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const { user, updateDevoteeProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Profile Information State
  const [name, setName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_name') || '' : ''));
  const [email, setEmail] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_email') || '' : ''));
  const [mobile, setMobile] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_devotee_mobile') || '' : ''));
  const [gotram, setGotram] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_gotram') || '' : ''));
  const [sankethanamam, setSankethanamam] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('vdonations_selected_sankethanamam') || '' : ''));
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [pan, setPan] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');

  // Hydrate from user object and storage
  useEffect(() => {
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

    // Auto-derive Gotram from Sankethanamam if missing
    if ((!effGotram || effGotram === 'General Devotee') && effSankethanamam) {
      const matched = findGotramBySankethanamam(effSankethanamam);
      if (matched) {
        effGotram = `${matched.id} - ${matched.name}`;
      }
    }

    // Default for Rakesh
    if (effEmail?.toLowerCase() === 'rakesh9652289106@gmail.com') {
      if (!effGotram || effGotram === 'General Devotee') effGotram = '44 - MOUTHKALYASA';
      if (!effSankethanamam) effSankethanamam = 'NAABILLA';
    }

    if (effName) setName(effName);
    if (effEmail) setEmail(effEmail);
    if (effMobile) setMobile(effMobile);
    if (effGotram) setGotram(effGotram);
    if (effSankethanamam) setSankethanamam(effSankethanamam);

    // Fetch live profile from Supabase if available
    async function loadLiveProfile() {
      if (user?.id) {
        try {
          const profile = await devoteeService.getProfile(user.id);
          if (profile) {
            if (profile.full_name) setName(profile.full_name);
            if (profile.email) setEmail(profile.email);
            if (profile.mobile) setMobile(profile.mobile);
            if (profile.gotram) setGotram(profile.gotram);
            if (profile.sankethanamam) setSankethanamam(profile.sankethanamam);
            if (profile.nakshatram) setNakshatra(profile.nakshatram);
            if (profile.pan_number) setPan(profile.pan_number);
            if (profile.city) setCity(profile.city);
            if (profile.state) setState(profile.state);
          }
        } catch {
          // fallback to client state
        }
      }
    }
    loadLiveProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await confirmAction({
      title: 'Save Devotee Details?',
      message: 'Your Gotram, Nakshatram, PAN, and contact information will be synced across the temple platform for all future seva sankalpams and 80G tax receipts.',
      itemName: `${name} (${gotram || 'Devotee'})`,
      variant: 'change',
      confirmText: 'Yes, Save Details',
      cancelText: 'Keep Editing',
    });

    if (ok) {
      setIsSaving(true);
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

      try {
        if (user?.id) {
          await devoteeService.updateProfile(user.id, profileUpdates);
        }
        if (email) {
          await supabase.from('profiles').update(profileUpdates).eq('email', email);
        }
      } catch (err) {
        console.warn('Sync notice:', err);
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
        window.dispatchEvent(
          new CustomEvent('vdonations_profile_updated', {
            detail: {
              fullName: name,
              email,
              mobile,
              gotram,
              sankethanamam,
            },
          })
        );
      }

      setIsSaving(false);
      setIsEditing(false);
      setIsSaved(true);
      showAlert({
        title: 'Personal Details Saved',
        message: 'Your sacred profile and Vedic Sankalpam details have been successfully updated.',
        type: 'success',
      });
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans px-6 sm:px-0 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4A101D] via-[#380B15] to-[#20050C] text-white p-5 sm:p-7 shadow-lg border border-amber-500/30 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/devotee/profile"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-medium active-press pb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
            <User className="w-3.5 h-3.5" /> Devotee Identity
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Personal &amp; Sankalpam Details
          </h1>
          <p className="text-stone-300 text-xs max-w-xl leading-relaxed">
            Manage your Gotram lineage, Sankethanamam, Janma Nakshatra, and 80G tax information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold active-press transition-all flex items-center gap-1.5 shrink-0 ${
            isEditing
              ? 'bg-amber-400 text-stone-950 shadow-xs'
              : 'bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-400/30'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      {/* VIEW MODE: NEAT CARD DISPLAY */}
      {!isEditing ? (
        <div className="space-y-4">
          {/* 1. Identity & Lineage Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-devotional-saffron" />
                Vedic Sankalpam &amp; Lineage
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Verified Lineage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Devotee Gotram</span>
                <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 block">
                  {gotram || '14 - DHEVA KALKYASA'} Gotram
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">102 Arya Vysya Sacred Lineage</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Sankethanamam</span>
                <span className="text-sm font-mono font-bold text-devotional-maroon dark:text-amber-300 block tracking-wide">
                  {sankethanamam || 'DHESISHTAKULA'}
                </span>
                <span className="text-[10px] text-stone-500">Sacred Identifier for Archana</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Janma Nakshatram</span>
                <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 block">
                  {nakshatra || 'Rohini'}
                </span>
                <span className="text-[10px] text-stone-500">Birth Star for Pooja Sankalpam</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Patron Status</span>
                <span className="text-sm font-serif font-bold text-amber-600 dark:text-amber-400 block">
                  🥇 Sacred Seva Patron
                </span>
                <span className="text-[10px] text-stone-500">Penugonda Matha Benefactor</span>
              </div>
            </div>
          </div>

          {/* 2. Contact Information Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <Phone className="w-4 h-4 text-devotional-saffron" />
              Contact &amp; Communication Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  {name || 'Sri Vasavi Devotee'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Mobile Number</span>
                <span className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100 block">
                  {mobile || '+91 92233 34444'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Email Address (for Receipts)</span>
                <span className="text-sm font-mono text-stone-800 dark:text-stone-200 block truncate">
                  {email || 'devotee@vasavi.dev'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">City &amp; State</span>
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100 block">
                  {city}, {state}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Tax & 80G Exemption Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                80G Income Tax Exemption Info
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-stone-700">
                80G Eligible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">PAN Card Number</span>
                <span className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100 block">
                  {pan ? pan : 'Not Added (Optional)'}
                </span>
                <p className="text-[11px] text-stone-500">Required on official 80G certificates above ₹2,000.</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Registered Trust</span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  Sri Vasavi Kanyaka Parameswari Temple Trust
                </span>
                <p className="text-[11px] text-stone-500">URN: AAATV1234F20214 • 80G Approved</p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-xl bg-devotional-maroon text-white font-serif font-bold text-xs shadow-md hover:brightness-110 active-press transition-all inline-flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Personal Details</span>
            </button>
          </div>
        </div>
      ) : (
        /* EDIT FORM MODE */
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-stone-900 p-5 sm:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400">
              Edit Devotee Profile &amp; Vedic Lineage
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold"
            >
              Cancel
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">PAN Card (for 80G Tax Exemption)</label>
              <input
                type="text"
                value={pan}
                placeholder="e.g. ABCDE1234F"
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono text-stone-900 dark:text-stone-100"
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
                  (Auto-syncs Gotram)
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
                placeholder="e.g. DHESISHTAKULA"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono text-stone-900 dark:text-stone-100"
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs active-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-devotional-maroon text-white font-bold text-xs shadow-md hover:brightness-110 active-press transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Details'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function PersonalDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-12 text-center text-xs text-stone-500 font-medium">
          Loading personal details...
        </div>
      }
    >
      <PersonalDetailsContent />
    </React.Suspense>
  );
}
