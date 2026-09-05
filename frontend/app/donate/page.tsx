'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_TEMPLES, MOCK_CATEGORIES, MOCK_CAMPAIGNS } from '@/lib/mock-data';
import { PaymentProviderEngine } from '@/lib/payment-provider';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import {
  Heart,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock,
  QrCode,
  CreditCard,
  Building,
  RefreshCw,
  Sparkles,
  Users,
  Share2,
  Printer,
} from 'lucide-react';
import { DevotionalSelect } from '@/components/ui/DevotionalSelect';
import { NakshatraSelect, GotraSelect } from '@/components/ui/VedicSelects';
import { recordInitiativeDonation } from '@/lib/initiatives-data';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import SacredSwarnaHundi3D from '@/components/3d/SacredSwarnaHundi3D';
import DonationSuccess3DModal from '@/components/3d/DonationSuccess3DModal';

function DonationFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();

  const initialTempleId = searchParams.get('templeId') || MOCK_TEMPLES[0].id;
  const initialCategoryId = searchParams.get('categoryId') || '';
  const initialCampaignId = searchParams.get('campaignId') || '';
  const initialInitiativeId = searchParams.get('initiativeId') || '';
  const initialInitiativeTitle = searchParams.get('title') || '';

  // Form State
  const [selectedTempleId, setSelectedTempleId] = useState(initialTempleId);
  const [purpose, setPurpose] = useState(
    initialInitiativeTitle
      ? `Initiative: ${initialInitiativeTitle}`
      : initialInitiativeId
      ? `Initiative: ${initialInitiativeId}`
      : initialCategoryId
      ? 'Nitya Annadanam'
      : 'General Donation'
  );
  const [amount, setAmount] = useState<number>(1001);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('Radha Krishna');
  const [donorEmail, setDonorEmail] = useState('devotee@gmail.com');
  const [donorPhone, setDonorPhone] = useState('+91 9123456789');
  const [donorPan, setDonorPan] = useState('');
  const [donorGotra, setDonorGotra] = useState('');
  const [donorNakshatra, setDonorNakshatra] = useState('');
  const [onBehalfOf, setOnBehalfOf] = useState('');
  const [dedicationMsg, setDedicationMsg] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'QR' | 'CARD' | 'NETBANKING'>('UPI');

  // Checkout Steps
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT' | 'VERIFYING' | 'SUCCESS'>('DETAILS');
  const [viewMode, setViewMode] = useState<'FORM' | '3D_HUNDI'>('FORM');
  const [show3DSuccessModal, setShow3DSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const currentTemple = MOCK_TEMPLES.find((t) => t.id === selectedTempleId) || MOCK_TEMPLES[0];
  const presets = [100, 500, 1001, 2501, 5001, 10001];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareText = `Blessed to offer seva of ₹${receiptData?.amount || amount} to ${currentTemple.name}. Pranamam 🙏`;
      if (navigator.share) {
        navigator.share({
          title: 'Sri Vasavi Matha Seva',
          text: shareText,
          url: window.location.origin,
        }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        showAlert({
          type: 'info',
          title: 'Copied to Clipboard',
          message: 'Seva details and temple receipt link copied to clipboard.',
        });
      }
    }
  };

  const handleAmountPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes('-')) return;
    setCustomAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    } else if (val === '' || num <= 0) {
      setAmount(1);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || isNaN(amount)) {
      showAlert({
        type: 'warning',
        title: 'Valid Amount Required',
        message: 'Donation amount must be a positive number (minimum ₹1).',
      });
      return;
    }
    setStep('PAYMENT');
  };

  const handleConfirmPayment = async () => {
    setStep('VERIFYING');
    setIsProcessing(true);

    // Initiate server-side payment abstraction
    const initiateRes = await PaymentProviderEngine.initiatePayment({
      templeId: currentTemple.id,
      amount,
      currency: 'INR',
      donorName: isAnonymous ? 'Anonymous Devotee' : donorName,
      donorEmail,
      donorPhone,
      paymentMethod,
      purpose,
    });

    // Simulate server verification check (Requirement #12)
    setTimeout(async () => {
      const verifyRes = await PaymentProviderEngine.verifyPaymentServerSide(initiateRes.transactionId);

      setIsProcessing(false);
      if (verifyRes.isVerified) {
        if (initialInitiativeId) {
          recordInitiativeDonation(initialInitiativeId, amount);
        }

        const receipt = {
          receiptNo: verifyRes.receiptNo,
          donationId: `DON-${Date.now()}`,
          templeName: currentTemple.name,
          trustName: currentTemple.trustName,
          donorName: isAnonymous ? 'Anonymous Devotee' : donorName,
          amount,
          categoryName: purpose,
          campaignTitle: initialInitiativeId
            ? `Initiative (${initialInitiativeId})`
            : initialCampaignId
            ? 'Campaign Support'
            : undefined,
          date: new Date().toLocaleString(),
          paymentMethod,
          transactionId: verifyRes.transactionId,
          taxInfo: currentTemple.taxBenefitInfo,
          verificationCode: verifyRes.verificationCode,
        };

        setReceiptData(receipt);
        setStep('SUCCESS');
        setShow3DSuccessModal(true);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
      {/* Header Stepper */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-devotional-saffron text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4" /> SECURE DIGITAL SEVA GATEWAY
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
          Make a Sacred Donation
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-xs">
          Your offering is 100% server-verified and generates an official 80G digital receipt immediately.
        </p>

        {/* 3D Mode vs Standard Form Switcher */}
        {step === 'DETAILS' && (
          <div className="inline-flex bg-stone-200/80 dark:bg-stone-800/80 p-1 rounded-2xl border border-devotional-gold/30 shadow-sm mt-1">
            <button
              type="button"
              onClick={() => setViewMode('FORM')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'FORM'
                  ? 'bg-devotional-maroon text-amber-200 shadow'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              📋 Standard Seva Form
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3D_HUNDI')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === '3D_HUNDI'
                  ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              🪙 3D Interactive Swarna Hundi
            </button>
          </div>
        )}
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
        {step === 'DETAILS' && viewMode === '3D_HUNDI' && (
          <div className="p-4 sm:p-8 space-y-6 animate-fadeIn">
            <SacredSwarnaHundi3D
              templeName={currentTemple.name}
              onCoinDropped={(dropAmt) => {
                setAmount(dropAmt);
                setCustomAmount('');
              }}
            />
            {/* 3D Offering Summary & Quick Actions */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-stone-800/70 border border-devotional-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-devotional-saffron tracking-wider">
                  Selected Seva Offering
                </span>
                <p className="text-2xl font-serif font-black text-devotional-maroon dark:text-amber-400">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-stone-500">
                  For: <strong>{purpose}</strong> • {currentTemple.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('FORM')}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Edit Devotee / Gotra Info
                </button>
                <button
                  type="button"
                  onClick={() => setStep('PAYMENT')}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  Proceed with ₹{amount.toLocaleString('en-IN')} Offering →
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'DETAILS' && viewMode === 'FORM' && (
          <form onSubmit={handleProceedToPayment} className="p-4 sm:p-10 space-y-6 sm:space-y-8">
            {/* Sacred Initiative Highlight Banner */}
            {initialInitiativeId && (
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border-2 border-devotional-gold/60 flex items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-devotional-maroon dark:text-amber-300 bg-devotional-gold/20 px-2 py-0.5 rounded border border-devotional-gold/50">
                      {initialInitiativeId}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Section 80G Verified Initiative
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                    {initialInitiativeTitle || 'Sacred Vasavi Matha Initiative'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Your contribution is designated exclusively to this project escrow and logged transparently.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Temple Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                1. Select Temple Shrine
              </label>
              <DevotionalSelect
                value={selectedTempleId}
                onChange={setSelectedTempleId}
                placeholder="Select Temple Devasthanam"
                searchPlaceholder="Search holy shrines by name, city or state..."
                footerText={`${MOCK_TEMPLES.length} Sacred Devasthanams Available`}
                options={MOCK_TEMPLES.map((t) => ({
                  value: t.id,
                  label: t.name,
                  sublabel: `${t.city}, ${t.state}`,
                  badge: t.name.charAt(0).toUpperCase(),
                }))}
              />
            </div>

            {/* Step 2: Purpose */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                2. Donation Purpose / Seva Cause
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Nitya Annadanam',
                  'General Donation',
                  'Gau Seva (Cows)',
                  'Temple Development',
                  'Daily Pooja',
                  'Festival Seva',
                ].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                      purpose === p
                        ? 'border-devotional-maroon bg-amber-50 dark:bg-stone-800 text-devotional-maroon dark:text-amber-400 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Choose Amount */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                3. Choose Offering Amount (INR ₹)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presets.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleAmountPreset(val)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      amount === val && !customAmount
                        ? 'bg-devotional-maroon text-white border-devotional-maroon shadow-md'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Or enter custom amount in ₹"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-devotional-maroon"
                />
              </div>
              <button
                type="button"
                onClick={() => setViewMode('3D_HUNDI')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-devotional-gold/60 text-devotional-maroon dark:text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-devotional-saffron" />
                Drop this ₹{amount.toLocaleString('en-IN')} offering into 3D Interactive Swarna Hundi 🪙
              </button>
            </div>

            {/* Step 4: Donor Information */}
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                4. Devotee & Tax Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address (for Digital Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    PAN Card Number (Optional for 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 uppercase font-mono"
                  />
                </div>
              </div>

              {/* Devotional Sankalpam Details (Gotram & Nakshatram) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <GotraSelect
                  label="Devotee Gotram (for Temple Sankalpam)"
                  value={donorGotra}
                  onChange={setDonorGotra}
                  placeholder="Select Gotram (Optional)"
                />
                <NakshatraSelect
                  label="Devotee Janma Nakshatra"
                  value={donorNakshatra}
                  onChange={setDonorNakshatra}
                  placeholder="Select Nakshatra (Optional)"
                />
              </div>

              {/* Family Dedication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Donate on behalf of family / person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. On behalf of my parents"
                    value={onBehalfOf}
                    onChange={(e) => setOnBehalfOf(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Personal Dedication Message / Prayer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Birthday blessing / Memorial prayer"
                    value={dedicationMsg}
                    onChange={(e) => setDedicationMsg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2 text-xs pt-2">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-stone-300 text-devotional-maroon focus:ring-devotional-maroon"
                />
                <label htmlFor="anon" className="text-stone-700 dark:text-stone-300 font-medium">
                  Donate anonymously (Hide my name on public campaign supporter walls)
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-sm hover:brightness-110 shadow-gold active-press transition-all flex items-center justify-center gap-2"
            >
              <span>Pay</span>
              <span className="font-mono">₹{amount.toLocaleString('en-IN')}</span>
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION */}
        {step === 'PAYMENT' && (
          <div className="p-6 sm:p-10 space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h2 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
                Select Payment Method
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Paying ₹{amount.toLocaleString('en-IN')} to {currentTemple.name} ({purpose})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active-press ${
                  paymentMethod === 'UPI'
                    ? 'border-devotional-maroon bg-amber-50 dark:bg-stone-800 shadow-md ring-2 ring-devotional-maroon/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-xs">
                  UPI
                </div>
                <div>
                  <p className="font-bold text-xs text-stone-900 dark:text-stone-100">UPI Instant Pay</p>
                  <p className="text-[10px] text-stone-500">GPay, PhonePe, Paytm, BHIM</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QR')}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active-press ${
                  paymentMethod === 'QR'
                    ? 'border-devotional-maroon bg-amber-50 dark:bg-stone-800 shadow-md ring-2 ring-devotional-maroon/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-stone-900 dark:text-stone-100">Scan Dynamic QR</p>
                  <p className="text-[10px] text-stone-500">Scan & pay from any mobile app</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active-press ${
                  paymentMethod === 'CARD'
                    ? 'border-devotional-maroon bg-amber-50 dark:bg-stone-800 shadow-md ring-2 ring-devotional-maroon/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-stone-900 dark:text-stone-100">Cards</p>
                  <p className="text-[10px] text-stone-500">Visa, MasterCard, RuPay</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active-press ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-devotional-maroon bg-amber-50 dark:bg-stone-800 shadow-md ring-2 ring-devotional-maroon/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-devotional-maroon text-amber-300 flex items-center justify-center font-bold text-xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-stone-900 dark:text-stone-100">Net Banking</p>
                  <p className="text-[10px] text-stone-500">All major Indian banks</p>
                </div>
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="px-6 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs active-press"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-sm hover:brightness-110 active-press transition-all shadow-gold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Pay'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SERVER-SIDE VERIFICATION IN PROGRESS */}
        {step === 'VERIFYING' && (
          <div className="p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-devotional-maroon flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                Offering your seva...
              </h2>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Connecting securely to payment gateway...
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: DONATION SUCCESS (Spiritual + Functional) */}
        {step === 'SUCCESS' && receiptData && (
          <div className="p-6 sm:p-10 text-center space-y-6 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-stone-900 dark:to-stone-950">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/80 text-devotional-saffron flex items-center justify-center mx-auto border-4 border-devotional-gold/40 shadow-xl">
              <Sparkles className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                TRANSACTION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                Dhanyavadaha! Your seva has been received.
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-xs max-w-md mx-auto">
                May Sri Vasavi Kanyaka Parameswari Matha bless you and your family with peace, health, and prosperity.
              </p>
            </div>

            <div className="max-w-md mx-auto p-5 bg-white dark:bg-stone-900 rounded-2xl border border-devotional-gold/30 text-xs text-left space-y-2.5 shadow-sm">
              <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <span className="text-stone-500">Devotee:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{receiptData.donorName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <span className="text-stone-500">Matha:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-right">{receiptData.templeName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <span className="text-stone-500">Offering:</span>
                <span className="font-bold text-base text-devotional-maroon dark:text-amber-400">₹{receiptData.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Receipt:</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{receiptData.receiptNo}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShow3DSuccessModal(true)}
                className="px-6 py-3 rounded-xl bg-devotional-maroon text-amber-300 font-bold text-xs hover:bg-devotional-maroon-dark active-press transition-all flex items-center gap-1.5 shadow-md border border-devotional-gold/40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                3D Aarti Blessing
              </button>
              <button
                type="button"
                onClick={() => setReceiptData(receiptData)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Receipt
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-6 py-3 rounded-xl border border-devotional-maroon text-devotional-maroon dark:text-amber-400 font-bold text-xs hover:bg-amber-50 dark:hover:bg-stone-800 active-press transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs hover:bg-stone-200 active-press transition-all"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      {(step === 'DETAILS' || step === 'PAYMENT') && (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-3.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-devotional-gold/30 md:hidden flex items-center justify-between shadow-2xl px-5">
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Total Offering</p>
            <p className="text-lg font-serif font-black text-devotional-maroon dark:text-amber-400">
              ₹{amount.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            type="button"
            disabled={isProcessing}
            onClick={step === 'DETAILS' ? handleProceedToPayment : handleConfirmPayment}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-sm shadow-gold active-press disabled:opacity-60"
          >
            {isProcessing ? 'Processing...' : 'Pay'}
          </button>
        </div>
      )}

      {/* 3D Success Aarti Blessing Modal */}
      {show3DSuccessModal && receiptData && (
        <DonationSuccess3DModal
          donationData={{
            donationId: receiptData.donationId || `DON-${Date.now()}`,
            receiptNo: receiptData.receiptNo || 'REC-VASAVI',
            templeName: receiptData.templeName || currentTemple.name,
            amount: receiptData.amount || amount,
            categoryName: receiptData.categoryName || purpose,
            paymentMethod: receiptData.paymentMethod || paymentMethod,
            date: receiptData.date || new Date().toLocaleString(),
          }}
          onClose={() => setShow3DSuccessModal(false)}
        />
      )}

      {/* Receipt Modal Trigger */}
      {receiptData && (
        <ReceiptViewModal receiptData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
}

export default function SmartDonationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading donation gateway...</div>}>
      <DonationFormContent />
    </Suspense>
  );
}
