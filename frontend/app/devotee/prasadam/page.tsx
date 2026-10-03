'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  ShoppingBag,
  Flame,
  Truck,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  Package,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Gift,
  Share2
} from 'lucide-react';

interface PrasadamPackage {
  id: string;
  name: string;
  telugu: string;
  price: number;
  badge?: string;
  items: string[];
  description: string;
}

const PRASADAM_PACKAGES: PrasadamPackage[] = [
  {
    id: 'pkg-maha',
    name: 'Penugonda Maha Prasadam Box',
    telugu: 'పెనుగొండ మహా ప్రసాదం బాక్స్',
    price: 251,
    badge: 'MOST POPULAR',
    description: 'Freshly prepared pure ghee laddoos offered directly during Sri Vasavi Matha Nitya Nivedana.',
    items: [
      '2x Pure Cow Ghee Laddoos (పెనుగొండ లడ్డూలు)',
      'Sacred Penugonda Kumkuma & Sindhoor (కుంకుమ)',
      'Consecrated Akshatalu (పవిత్ర అక్షతలు)',
      'Sri Vasavi Matha Laminated Blessing Card',
    ],
  },
  {
    id: 'pkg-nitya',
    name: 'Sri Vasavi Nitya Annadanam Special Box',
    telugu: 'నిత్య అన్నదానం విశేష ప్రసాదం',
    price: 501,
    badge: 'DEVOTIONAL SPECIAL',
    description: 'Comprehensive blessing hamper offered during morning Sahasranama Archana.',
    items: [
      '4x Pure Cow Ghee Laddoos',
      'Dry Panchamrutham Packet',
      'Silver-Plated Sri Vasavi Matha Divine Yantra Coin',
      'Consecrated Red Silk Raksha Bandham Thread',
      'Sanctum Consecrated Haldi & Kumkuma',
    ],
  },
  {
    id: 'pkg-kalyanam',
    name: 'Kalyanotsavam Family Blessing Hamper',
    telugu: 'కళ్యాణోత్సవ కుటుంబ మహా ప్రసాదం',
    price: 1116,
    badge: 'FAMILY BLESSING',
    description: 'Consecrated during grand Sri Vasavi Matha celestial marriage utsavam for auspicious family harmony.',
    items: [
      '8x Pure Ghee Dry Fruit Laddoos',
      'Sri Vasavi Blessed Silk Vastram (Pavitra Shawl Piece)',
      'Dry Fruits & Kaju Sweet Prasadam',
      'Goddess Vasavi Matha Consecrated Brass Diya',
      'Personalized Family Gotra Sankalpam Certificate',
    ],
  },
];

interface ActiveOrder {
  id: string;
  token: string;
  packageName: string;
  amount: number;
  type: 'HOME_DELIVERY' | 'COUNTER_PICKUP';
  currentStage: 1 | 2 | 3 | 4;
  date: string;
  awb?: string;
  courier?: string;
  address?: string;
  counter?: string;
}

export default function DevoteePrasadamPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { confirmAction, showAlert } = useConfirmAlert();

  const [activeTab, setActiveTab] = useState<'track' | 'book'>('track');
  const [selectedPkg, setSelectedPkg] = useState<PrasadamPackage>(PRASADAM_PACKAGES[0]);
  const [deliveryMode, setDeliveryMode] = useState<'HOME_DELIVERY' | 'COUNTER_PICKUP'>('HOME_DELIVERY');

  const [recipientName, setRecipientName] = useState(user?.fullName || 'Sri Rakesh Kumar');
  const [recipientPhone, setRecipientPhone] = useState(user?.mobile || '+91 9652289106');
  const [pincode, setPincode] = useState('534320');
  const [address, setAddress] = useState('Penugonda Temple Street, West Godavari, Andhra Pradesh');

  const [orders, setOrders] = useState<ActiveOrder[]>([
    {
      id: 'ord-101',
      token: 'PRASAD-PENU-2026-991',
      packageName: 'Penugonda Maha Prasadam Box (2 Tokens)',
      amount: 251,
      type: 'HOME_DELIVERY',
      currentStage: 3,
      date: '01 Oct 2026',
      awb: 'SP-PENU-8492048IN',
      courier: 'India Post Sacred Speed Post',
      address: 'Penugonda Temple Street, West Godavari, AP - 534320',
    },
    {
      id: 'ord-102',
      token: 'TOKEN-CTR-01-482',
      packageName: 'Sri Vasavi Nitya Annadanam Special Box',
      amount: 501,
      type: 'COUNTER_PICKUP',
      currentStage: 2,
      date: '01 Oct 2026',
      counter: 'Prasadam Counter #1 (North Prakaram, Penugonda)',
    },
  ]);

  const handleBookPrasadam = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = await confirmAction({
      title: `Book ${selectedPkg.name}?`,
      message: `You are requesting ${selectedPkg.name} (${selectedPkg.telugu}) for ₹${selectedPkg.price}. ${deliveryMode === 'HOME_DELIVERY' ? 'Sacred parcel will be dispatched to your registered address.' : 'Instant QR token will be generated for counter pickup.'}`,
      confirmText: `Proceed ₹${selectedPkg.price}`,
      variant: 'change',
    });
    if (!confirmed) return;

    const newOrder: ActiveOrder = {
      id: 'ord-' + Date.now(),
      token: deliveryMode === 'HOME_DELIVERY' ? `PRASAD-DEL-${Math.floor(10000 + Math.random() * 90000)}` : `TOKEN-CTR-${Math.floor(100 + Math.random() * 900)}`,
      packageName: selectedPkg.name,
      amount: selectedPkg.price,
      type: deliveryMode,
      currentStage: 1,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      awb: deliveryMode === 'HOME_DELIVERY' ? `SP-VASAVI-${Math.floor(100000 + Math.random() * 900000)}IN` : undefined,
      courier: deliveryMode === 'HOME_DELIVERY' ? 'India Post Speed Parcel' : undefined,
      address: deliveryMode === 'HOME_DELIVERY' ? `${address}, PIN: ${pincode}` : undefined,
      counter: deliveryMode === 'COUNTER_PICKUP' ? 'Counter #1 (Penugonda Devasthanam)' : undefined,
    };

    setOrders([newOrder, ...orders]);
    setActiveTab('track');

    showAlert({
      type: 'change',
      title: 'Prasadam Booked Successfully',
      message: `Sacred ${selectedPkg.name} booked. Order Token: ${newOrder.token}. Tracking initiated!`,
    });
  };

  const STAGES = [
    { num: 1, title: 'Sanctum Nivedana', desc: 'Offered in Garbhagriha to Sri Vasavi Matha' },
    { num: 2, title: 'Sacred Packaging', desc: 'Sealed in Eco-Gold box with Kumkuma & Akshatalu' },
    { num: 3, title: 'Out for Dispatch', desc: 'With Speed Courier or Ready at Counter' },
    { num: 4, title: 'Divine Delivery', desc: 'Received at Home / Counter Handover complete' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-12">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Gift className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> SACRED MAHAPRASADAM PORTAL
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-amber-300 leading-snug">
            Divine Prasadam Tracker & Dispatch
          </h1>
          <p className="text-amber-100/80 text-xs">
            Sri Vasavi Matha Penugonda consecrated Mahaprasadam counter tokens and doorstep speed delivery
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-950/80 p-1.5 rounded-2xl border border-amber-400/40 relative z-10">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-gold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Track Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-gold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Book Prasadam</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TRACK ACTIVE ORDERS */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-devotional-gold/40 shadow-xl space-y-6 hover:border-amber-400 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      ord.type === 'HOME_DELIVERY'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}>
                      {ord.type === 'HOME_DELIVERY' ? 'Doorstep Speed Delivery' : 'Temple Counter Pickup'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{ord.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">
                    {ord.packageName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">Token: {ord.token}</p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-2xl text-devotional-maroon dark:text-amber-400">
                    ₹{ord.amount}
                  </span>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Consecrated & Verified
                  </p>
                </div>
              </div>

              {/* 4-Stage Visual Progress Bar */}
              <div className="relative pt-2 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STAGES.map((stg) => {
                    const isDone = ord.currentStage >= stg.num;
                    const isCurrent = ord.currentStage === stg.num;
                    return (
                      <div
                        key={stg.num}
                        className={`p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-400 dark:bg-amber-950/40 ring-2 ring-amber-400/40'
                            : isDone
                            ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-950/20'
                            : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? 'bg-amber-500 text-stone-950 animate-pulse'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                          }`}>
                            {isDone ? '✓' : stg.num}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider">
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">
                          {stg.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                          {stg.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Specific Details & QR or AWB */}
              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                {ord.type === 'HOME_DELIVERY' ? (
                  <div className="space-y-1">
                    <p className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-devotional-saffron" />
                      Courier AWB: <span className="font-mono text-devotional-maroon dark:text-amber-400">{ord.awb}</span>
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Destination: {ord.address}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-500" />
                      Pickup Counter: <span className="text-emerald-700 dark:text-emerald-400">{ord.counter}</span>
                    </p>
                    <p className="text-stone-500 dark:text-stone-400">
                      Show your QR code or Token ID at the Penugonda counter for instant collection.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showAlert({
                        type: 'change',
                        title: 'Divine Prasadam Token QR',
                        message: `Token: ${ord.token}. Consecrated at Penugonda Garbhagriha for ${user?.fullName || 'Devotee'}.`,
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active-press transition-all border border-amber-400/40 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> View Digital QR Token
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: BOOK NEW SACRED PRASADAM */}
      {activeTab === 'book' && (
        <form onSubmit={handleBookPrasadam} className="space-y-6">
          {/* Select Package */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-devotional-saffron" /> 1. Select Sacred Prasadam Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRASADAM_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative space-y-3 ${
                    selectedPkg.id === pkg.id
                      ? 'bg-amber-500/10 border-amber-400 dark:bg-stone-900 shadow-xl ring-2 ring-amber-400/50 scale-102'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-devotional-saffron to-amber-500 text-stone-950 font-bold text-[9px] uppercase tracking-wider shadow">
                      {pkg.badge}
                    </span>
                  )}
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {pkg.name}
                    </h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-serif font-semibold">
                      {pkg.telugu}
                    </p>
                  </div>
                  <p className="text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                    ₹{pkg.price}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">{pkg.description}</p>
                  <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1 pt-2 border-t border-stone-200 dark:border-stone-800">
                    {pkg.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Mode & Shipping Form */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-6">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-devotional-saffron" /> 2. Delivery & Recipient Details
            </h3>

            {/* Delivery Switch */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setDeliveryMode('HOME_DELIVERY')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  deliveryMode === 'HOME_DELIVERY'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-md font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <Truck className="w-4 h-4" /> Home Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('COUNTER_PICKUP')}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  deliveryMode === 'COUNTER_PICKUP'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-md font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <QrCode className="w-4 h-4" /> Temple Counter Pickup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  WhatsApp Mobile (for dispatch updates)
                </label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              {deliveryMode === 'HOME_DELIVERY' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Complete Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Postal Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-bold text-sm shadow-gold hover:brightness-110 active-press transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <ShoppingBag className="w-4 h-4 text-devotional-maroon" />
                <span>Book {selectedPkg.name} (₹{selectedPkg.price})</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
