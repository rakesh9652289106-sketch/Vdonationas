'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES, MOCK_DONATIONS } from '@/lib/mock-data';
import { calculateDevoteeMedals, MedalTier } from '@/lib/medals';
import { Heart, Sparkles, ShieldCheck, Check, Lock, Flame } from 'lucide-react';
import VasaviDonationSuccessModal from './VasaviDonationSuccessModal';
import MedalUnlockCelebrationModal from './MedalUnlockCelebrationModal';

export default function VasaviDonationCard3D() {
  const [selectedTempleId, setSelectedTempleId] = useState(MOCK_TEMPLES[0].id);
  const [selectedCategory, setSelectedCategory] = useState('Annadanam Seva');
  const [amount, setAmount] = useState(1001);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonation, setLastDonation] = useState<any>(null);
  const [unlockedMedalAlert, setUnlockedMedalAlert] = useState<MedalTier | null>(null);

  const presetAmounts = [1, 116, 216, 516, 1016, 2116];

  const sevaCategories = [
    { name: 'Annadanam Seva', desc: 'Offer food to devotees' },
    { name: 'Pushpa Seva', desc: 'Offer flowers to the Goddess' },
    { name: 'Matha Development', desc: 'Support temple development' },
    { name: 'Pooja Seva', desc: 'Participate in sacred worship' },
    { name: 'Community Development', desc: 'Support Arya Vysya community initiatives' },
    { name: 'Education', desc: 'Support educational initiatives' },
    { name: 'Social Service', desc: 'Support community welfare' },
  ];

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes('-')) return;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    } else if (val === '' || parsed <= 0) {
      setAmount(1);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || isNaN(amount)) {
      alert('Donation amount must be a positive number (minimum ₹1).');
      return;
    }
    setIsProcessing(true);

    const prevProgress = calculateDevoteeMedals(MOCK_DONATIONS);

    setTimeout(() => {
      setIsProcessing(false);
      const temple = MOCK_TEMPLES.find((t) => t.id === selectedTempleId) || MOCK_TEMPLES[0];
      const donId = `DON-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const recId = `REC-VASAVI-${Math.floor(10000 + Math.random() * 90000)}`;

      const newDonation = {
        id: donId,
        donationId: donId,
        receiptNo: recId,
        templeName: temple.name,
        amount: amount,
        categoryName: selectedCategory,
        paymentMethod: paymentMethod,
        status: 'SUCCESS',
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      };

      const updatedDonationsList = [newDonation, ...MOCK_DONATIONS];
      const newProgress = calculateDevoteeMedals(updatedDonationsList);

      setLastDonation(newDonation);
      setShowSuccessModal(true);

      if (
        newProgress.currentMedal &&
        (!prevProgress.currentMedal || newProgress.currentMedal.id !== prevProgress.currentMedal.id)
      ) {
        setUnlockedMedalAlert(newProgress.currentMedal);
      }
    }, 1200);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* 3D Elevated Glass Panel Container */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl border-2 border-devotional-gold/60 shadow-[0_25px_70px_-15px_rgba(107,29,47,0.4)] p-6 sm:p-8 space-y-6 transform hover:-translate-y-1 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-300/40 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-devotional-saffron text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-devotional-saffron animate-pulse" /> SRI VASAVI MATHA DIVINE SEVA
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-0.5">
              Offer Your Contribution to Sri Vasavi Matha
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 flex items-center justify-center font-bold text-xl shadow-gold shrink-0">
            🌺
          </div>
        </div>

        <form onSubmit={handleDonateSubmit} className="space-y-6 text-xs">
          {/* Temple Shrine Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Select Matha / Temple Location
            </label>
            <select
              value={selectedTempleId}
              onChange={(e) => setSelectedTempleId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-devotional-saffron"
            >
              {MOCK_TEMPLES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          {/* 7 Seva Categories Selector */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Select Seva Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sevaCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    selectedCategory === cat.name
                      ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 border-devotional-gold shadow-md font-bold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  <p className="font-serif font-bold text-xs">{cat.name}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3D RAISED GOLD DONATION CARD DISPLAY */}
          <div className="space-y-3">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Select Contribution Amount (₹)
            </label>
            <div className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 p-5 rounded-2xl border-2 border-amber-400/80 text-center space-y-1 shadow-gold">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 uppercase font-bold tracking-wider">
                SELECTED SEVA OFFERING
              </span>
              <div className="text-3xl sm:text-5xl font-serif font-bold text-devotional-maroon dark:text-amber-300 transition-all duration-300 drop-shadow-sm">
                ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 3D Raised Preset Amount Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`py-2.5 rounded-xl font-bold transition-all border transform ${
                    amount === amt && !customAmount
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-gold scale-105 font-bold -translate-y-1 ring-2 ring-amber-300'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="Or enter custom amount in ₹"
              className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Payment Gateway Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'CARD', 'NETBANKING'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2.5 rounded-xl font-bold text-center border transition-all ${
                    paymentMethod === method
                      ? 'bg-emerald-700 text-white border-emerald-500 shadow-md'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {method === 'UPI' ? '📱 UPI / QR' : method === 'CARD' ? '💳 Card' : '🏦 NetBanking'}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Elevated CTA Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-serif font-bold text-base shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 border border-devotional-gold/60"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-amber-300" /> Processing Sacred Offering...
              </span>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-current text-amber-300" /> 🙏 Offer Seva of ₹
                {amount.toLocaleString('en-IN')}
              </>
            )}
          </button>

          {/* Security Guarantee Notice */}
          <div className="pt-1 text-center text-[10px] text-stone-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted • Immediate Official Sri Vasavi Matha Digital Seva Certificate</span>
          </div>
        </form>
      </div>

      {/* 3D Success Modal */}
      {showSuccessModal && lastDonation && (
        <VasaviDonationSuccessModal
          donationData={lastDonation}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Medal Unlock Alert Modal */}
      {unlockedMedalAlert && (
        <MedalUnlockCelebrationModal
          unlockedTier={unlockedMedalAlert}
          onClose={() => setUnlockedMedalAlert(null)}
        />
      )}
    </div>
  );
}
