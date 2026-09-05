'use client';

import React, { useState } from 'react';
import { MOCK_TEMPLES, MOCK_DONATIONS } from '@/lib/mock-data';
import { calculateDevoteeMedals, MedalTier } from '@/lib/medals';
import { Heart, Sparkles, ShieldCheck, Check, Lock } from 'lucide-react';
import DonationSuccess3DModal from './DonationSuccess3DModal';
import MedalUnlockCelebrationModal from './MedalUnlockCelebrationModal';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function DonationCard3D() {
  const { showAlert } = useConfirmAlert();
  const [selectedTempleId, setSelectedTempleId] = useState(MOCK_TEMPLES[0].id);
  const [selectedCategory, setSelectedCategory] = useState('Nitya Annadanam');
  const [amount, setAmount] = useState(1001);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonation, setLastDonation] = useState<any>(null);
  const [unlockedMedalAlert, setUnlockedMedalAlert] = useState<MedalTier | null>(null);

  const presetAmounts = [501, 1001, 2501, 5001, 10001];

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
      showAlert({
        type: 'warning',
        title: 'Valid Amount Required',
        message: 'Donation amount must be a positive number (minimum ₹1).',
      });
      return;
    }
    setIsProcessing(true);

    const prevProgress = calculateDevoteeMedals(MOCK_DONATIONS);

    setTimeout(() => {
      setIsProcessing(false);
      const temple = MOCK_TEMPLES.find((t) => t.id === selectedTempleId) || MOCK_TEMPLES[0];
      const donId = `DON-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const recId = `REC-80G-${Math.floor(10000 + Math.random() * 90000)}`;

      // Simulated new donation entry
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

      // Check if a new medal tier was unlocked
      if (
        newProgress.currentMedal &&
        (!prevProgress.currentMedal || newProgress.currentMedal.id !== prevProgress.currentMedal.id)
      ) {
        setUnlockedMedalAlert(newProgress.currentMedal);
      }
    }, 1200);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      {/* 3D Elevated Glass Panel Container */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl border border-devotional-gold/40 dark:border-stone-800 shadow-[0_25px_60px_-15px_rgba(107,29,47,0.3)] p-6 sm:p-8 space-y-6 transform hover:-translate-y-1 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <span className="inline-flex items-center gap-1 text-devotional-saffron text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> SACRED DIGITAL OFFERING GATEWAY
            </span>
            <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400 mt-0.5">
              Make a Sacred Offering
            </h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-devotional-maroon dark:text-amber-300 flex items-center justify-center font-bold">
            🙏
          </div>
        </div>

        <form onSubmit={handleDonateSubmit} className="space-y-5 text-xs">
          {/* Temple Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Select Temple Shrine
            </label>
            <select
              value={selectedTempleId}
              onChange={(e) => setSelectedTempleId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-devotional-saffron"
            >
              {MOCK_TEMPLES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Donation Purpose / Seva Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Nitya Annadanam', 'Gau Seva', 'Daily Archana', 'Temple Development'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-left font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-devotional-maroon text-amber-300 border-devotional-gold shadow-md'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Animated Amount Counter display */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10px]">
              Offering Amount (₹)
            </label>
            <div className="bg-amber-50 dark:bg-stone-900 p-4 rounded-2xl border border-amber-300 dark:border-stone-700 text-center space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">SELECTED OFFERING</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-devotional-maroon dark:text-amber-400 transition-all duration-300">
                ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountSelect(amt)}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all border ${
                    amount === amt && !customAmount
                      ? 'bg-devotional-saffron text-white border-devotional-saffron shadow-md scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder="Or enter custom amount in ₹"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
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
                  className={`py-2 rounded-xl font-bold text-center border transition-all ${
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white font-serif font-bold text-base shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 border border-devotional-gold/40"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-amber-300" /> Processing Secure Gateway...
              </span>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-current text-amber-300" /> Complete Offering of ₹
                {amount.toLocaleString('en-IN')}
              </>
            )}
          </button>

          {/* Security Guarantee Notice */}
          <div className="pt-2 text-center text-[10px] text-stone-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted • Immediate Official 80G Tax Receipt Received</span>
          </div>
        </form>
      </div>

      {/* 3D Success Modal */}
      {showSuccessModal && lastDonation && (
        <DonationSuccess3DModal
          donationData={lastDonation}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* 3D Medal Unlock Celebration Modal */}
      {unlockedMedalAlert && (
        <MedalUnlockCelebrationModal
          unlockedTier={unlockedMedalAlert}
          onClose={() => setUnlockedMedalAlert(null)}
        />
      )}
    </div>
  );
}
