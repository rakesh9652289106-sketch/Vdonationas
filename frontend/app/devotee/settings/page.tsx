'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  Fingerprint,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Check,
  Flame,
  Smartphone,
  Mail,
  CreditCard,
  Building,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeSettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  // Settings State
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [festivalReminders, setFestivalReminders] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans px-3 sm:px-0">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-devotional-gold/40 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> App Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Devotee Settings
          </h1>
          <p className="text-amber-100/80 text-xs">
            Configure languages, notifications, biometric security, and account preferences
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs font-bold shadow-xs">
          ✓ Preferences saved successfully!
        </div>
      )}

      {/* 1. ACCOUNT GROUP */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
          Devotee Account
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden text-xs">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-500 text-[11px]">Mobile Number</p>
              <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">+91 9123456789</p>
            </div>
            <Link
              href="/devotee/profile"
              className="px-3.5 py-1.5 rounded-xl border border-devotional-maroon/40 text-devotional-maroon dark:text-amber-400 font-bold active-press"
            >
              Edit
            </Link>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-500 text-[11px]">Email Address</p>
              <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">devotee@gmail.com</p>
            </div>
            <Link
              href="/devotee/profile"
              className="px-3.5 py-1.5 rounded-xl border border-devotional-maroon/40 text-devotional-maroon dark:text-amber-400 font-bold active-press"
            >
              Edit
            </Link>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-500 text-[11px]">PAN Card (80G Tax Exemption)</p>
              <p className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">ABCDE1234F</p>
            </div>
            <Link
              href="/devotee/profile"
              className="px-3.5 py-1.5 rounded-xl border border-devotional-maroon/40 text-devotional-maroon dark:text-amber-400 font-bold active-press"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PREFERENCES GROUP */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
          Language & Regional
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-4">
          <div>
            <label className="block text-stone-600 dark:text-stone-400 text-xs font-semibold mb-2">
              Select App Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => {
                const isCurrent = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsSaved(true);
                      setTimeout(() => setIsSaved(false), 2000);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-left transition-all active-press ${
                      isCurrent
                        ? 'bg-devotional-maroon text-white border-devotional-maroon shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">Offering Currency</p>
              <p className="text-stone-500 text-[11px]">Indian Rupee (INR ₹)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 font-mono font-bold text-xs">
              ₹ INR
            </span>
          </div>
        </div>
      </div>

      {/* 3. NOTIFICATIONS GROUP */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
          Devotional Notifications
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden text-xs">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">WhatsApp Seva Updates</p>
              <p className="text-stone-500 text-[11px]">Instant 80G receipts & festival prasadam updates</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setWhatsappAlerts)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                whatsappAlerts ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">SMS Transaction Alerts</p>
              <p className="text-stone-500 text-[11px]">Bank verification and donor confirmation messages</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setSmsAlerts)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                smsAlerts ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">Digital Tax Receipts by Email</p>
              <p className="text-stone-500 text-[11px]">Official PDF 80G certificate attached on donation</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setEmailReceipts)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                emailReceipts ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">Auspicious Tithi & Festival Reminders</p>
              <p className="text-stone-500 text-[11px]">Vasavi Jayanthi, Navaratri, Pournami alerts</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setFestivalReminders)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                festivalReminders ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. SECURITY GROUP */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
          Security & Privacy
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden text-xs">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-devotional-saffron" />
                Biometric Login (Face ID / Fingerprint)
              </p>
              <p className="text-stone-500 text-[11px]">Unlock sacred devotee portal instantly</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setBiometricsEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                biometricsEnabled ? 'bg-devotional-maroon justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900 dark:text-stone-100">Active Sessions</p>
              <p className="text-stone-500 text-[11px]">Current device: Chrome on Windows • Active</p>
            </div>
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Current
            </span>
          </div>
        </div>
      </div>

      {/* 5. SUPPORT & LEGAL GROUP */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
          Support & About
        </h3>
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden text-xs">
          <Link
            href="/about"
            className="p-4 flex items-center justify-between hover:bg-amber-50/50 dark:hover:bg-stone-800/50 active-press transition-colors"
          >
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              About Sri Vasavi Matha Digital Seva Platform
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </Link>

          <Link
            href="/devotee/privacy"
            className="p-4 flex items-center justify-between hover:bg-amber-50/50 dark:hover:bg-stone-800/50 active-press transition-colors"
          >
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Privacy Policy & Devotee Data Safeguards
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </Link>

          <Link
            href="/devotee/support"
            className="p-4 flex items-center justify-between hover:bg-amber-50/50 dark:hover:bg-stone-800/50 active-press transition-colors"
          >
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Contact Temple Administration Helpdesk
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </Link>

          <div className="p-4 flex items-center justify-between text-stone-400 text-[11px] font-mono">
            <span>Platform Build</span>
            <span>v2.4.0 (Build 2026.09-release)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
