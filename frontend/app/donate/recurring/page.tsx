'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Repeat, ShieldCheck, CheckCircle2, Calendar, ArrowRight, Coins } from 'lucide-react';
import { MOCK_TEMPLES } from '@/lib/mock-data';
import { useLanguage } from '@/lib/language-context';

export default function RecurringSevaPage() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(116);
  const [customAmount, setCustomAmount] = useState('');
  const [category, setCategory] = useState('Nitya Annadanam Seva');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const autopayPresets = [1, 116, 216, 516, 1016, 2116];

  const handleSelectPlan = (amt: number) => {
    setSelectedPlan(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes('-')) return;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedPlan(parsed);
    } else if (val === '' || parsed <= 0) {
      setSelectedPlan(1);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlan <= 0 || isNaN(selectedPlan)) {
      alert('Autopay monthly donation amount must be a positive number (minimum ₹1).');
      return;
    }
    setIsSubscribed(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase border border-amber-300">
          <Repeat className="w-3.5 h-3.5 text-devotional-saffron" /> {t('autopayBadge')}
        </div>
        <h1 className="text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-1">
          {t('autopayTitle')}
        </h1>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
          {t('autopaySubtitle')}
        </p>
      </div>

      {isSubscribed ? (
        <div className="bg-emerald-50 dark:bg-stone-900 p-8 rounded-3xl border-2 border-emerald-500 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
            ✓
          </div>
          <h2 className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-300">
            {t('autopaySuccessMsg')}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            Your monthly contribution of <strong>₹{selectedPlan.toLocaleString('en-IN')}/month</strong> to Sri Vasavi Matha Penugonda has been authorized. Official 80G receipts will be sent to your WhatsApp and Email automatically every month.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-xs">
            <Link
              href="/devotee/recurring"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors"
            >
              View Active Subscription
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-300 transition-colors"
            >
              {t('navHome')}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/60 shadow-xl space-y-6">
          <div className="space-y-3">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-xs block">
              {t('autopaySelectPlan')}
            </label>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {autopayPresets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPlan(amt)}
                  className={`py-3 rounded-2xl font-bold text-sm transition-all border transform ${
                    selectedPlan === amt && !customAmount
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-gold scale-105 font-bold ring-2 ring-amber-300'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}<span className="text-[10px] block opacity-70">/mo</span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder={t('customAmountPlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-serif font-bold text-base shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 border border-devotional-gold/60"
          >
            <Heart className="w-5 h-5 fill-current text-amber-300" /> {t('autopayBtnSubscribe')} (₹{selectedPlan.toLocaleString('en-IN')}/month)
          </button>
        </form>
      )}
    </div>
  );
}
