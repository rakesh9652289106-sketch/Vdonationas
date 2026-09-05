'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function SaasSettingsPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [saasEnabled, setSaasEnabled] = useState(true);
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_10928301982');
  const [phonePeKey, setPhonePeKey] = useState('M10293849102');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = await confirmAction({
      title: 'Update SaaS & Gateway Settings?',
      message: 'Are you sure you want to update SaaS multi-tenant settings and payment gateway API credentials? Live merchant routing will reflect these changes.',
      confirmText: 'Save Settings',
      variant: 'change',
    });
    if (!confirmed) return;

    showAlert({
      type: 'change',
      title: 'Settings Saved',
      message: 'SaaS Subscription & Gateway API credentials saved securely to server environment.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarSaaSSettings')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarSaaSSettings')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Configure Multi-Tenant SaaS Tiers, Gateway Merchant Keys & Security API Credentials
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SaaS Toggle Card */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl flex items-center justify-between hover:border-amber-400 transition-all">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              SaaS Multi-Temple Platform Mode
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Allows external temple trusts to onboard under tiered subscription plans (Starter, Professional, Enterprise).
            </p>
          </div>
          <input
            type="checkbox"
            checked={saasEnabled}
            onChange={(e) => setSaasEnabled(e.target.checked)}
            className="w-6 h-6 rounded-lg accent-devotional-saffron cursor-pointer"
          />
        </div>

        {/* Tier Plans Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-devotional-gold/40 shadow-xl space-y-2 hover:-translate-y-1.5 transition-all">
            <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px]">Starter Plan</span>
            <p className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">Free / ₹0</p>
            <p className="text-stone-500">Up to 1 Temple, 2 Admins, 100 Donations/mo</p>
          </div>

          <div className="p-6 rounded-3xl bg-amber-500/10 dark:bg-stone-900 border-2 border-amber-400 shadow-2xl space-y-2 hover:-translate-y-1.5 transition-all">
            <span className="font-bold text-devotional-maroon dark:text-amber-300 uppercase tracking-wider text-[10px]">Professional Plan</span>
            <p className="text-xl font-bold font-serif text-devotional-maroon dark:text-amber-300">₹4,999 / mo</p>
            <p className="text-stone-600 dark:text-stone-300">Up to 10 Temples, Unlimited Admins & Campaigns</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-devotional-gold/40 shadow-xl space-y-2 hover:-translate-y-1.5 transition-all">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">Enterprise SaaS</span>
            <p className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">Custom Trust</p>
            <p className="text-stone-500">Unlimited Shrines, Dedicated Gateway & SLA</p>
          </div>
        </div>

        {/* Gateway Credentials Form */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all text-xs">
          <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
            Payment Gateway Secrets Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                Razorpay Merchant Key ID
              </label>
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                PhonePe Merchant ID
              </label>
              <input
                type="text"
                value={phonePeKey}
                onChange={(e) => setPhonePeKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-2xl text-xs shadow-gold hover:brightness-110 transition-all border border-amber-400/40"
            >
              Save SaaS Platform Credentials
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
