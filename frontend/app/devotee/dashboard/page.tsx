'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';
import VasaviSevaCertificateModal from '@/components/VasaviSevaCertificateModal';
import DevaAIAssistantModal from '@/components/DevaAIAssistantModal';
import Medal3DCard from '@/components/3d/Medal3DCard';
import MedalDetailModal from '@/components/3d/MedalDetailModal';
import PanchangamCalculator from '@/components/devotional/PanchangamCalculator';
import AuspiciousMuhurthamTeaser from '@/components/initiatives/AuspiciousMuhurthamTeaser';
import { getInitiatives, Initiative } from '@/lib/initiatives-data';
import { calculateDevoteeMedals, MEDAL_TIERS, MedalTier } from '@/lib/medals';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  Heart,
  FileText,
  Download,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  PieChart,
  Repeat,
  Bot,
  Award,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';

export default function DevoteeDashboardPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);
  const [showDevaAI, setShowDevaAI] = useState(false);
  const [selectedMedalTier, setSelectedMedalTier] = useState<MedalTier | null>(null);
  const [scheduledInitiatives, setScheduledInitiatives] = useState<Initiative[]>([]);

  useEffect(() => {
    async function loadInitiatives() {
      try {
        const list = await getInitiatives();
        const scheduled = list.filter((i) => i.status === 'SCHEDULED' && i.is_teaser_enabled);
        setScheduledInitiatives(scheduled);
      } catch {
        // fallback
      }
    }
    loadInitiatives();
  }, []);

  const medalProgress = calculateDevoteeMedals(MOCK_DONATIONS);

  const monthlyTrendData = [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 20000 },
    { month: 'Mar', amount: 10001 },
    { month: 'Apr', amount: 35000 },
    { month: 'May', amount: 25001 },
    { month: 'Jun', amount: 18000 },
    { month: 'Jul', amount: 50000 },
    { month: 'Aug', amount: 35002 },
  ];

  const categoryDistribution = [
    { name: 'Annadanam Seva', value: 45000, color: '#E06D29' },
    { name: 'Pushpa Seva', value: 15000, color: '#D4AF37' },
    { name: 'Matha Development', value: 35000, color: '#6B1D2F' },
    { name: 'Education & Welfare', value: 30500, color: '#10B981' },
  ];

  const handleDownloadAnnualStatement = () => {
    showAlert({
      type: 'info',
      title: '80G Tax Statement Initialized',
      message: 'Generating verified 80G Annual Tax Exemption Statement for FY 2025-2026. PDF download initialized.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HERO BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('navDevoteeDashboard')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 flex flex-wrap items-center gap-2">
            Sri Vasavi Matha welcomes you 🙏
            {medalProgress.currentMedal && (
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 text-amber-950 font-sans font-bold text-xs border border-amber-400/80 shadow-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-none">
                <span>{medalProgress.currentMedal.badge}</span>
                <span>{medalProgress.currentMedal.name}</span>
              </span>
            )}
          </h1>
          <p className="text-amber-100/80 text-xs max-w-xl">
            Manage your sacred Seva offerings, 80G tax receipts, digital Seva certificates, and Panchangam reminders.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={() => setShowDevaAI(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-gold"
          >
            <Bot className="w-4 h-4" /> Ask DevaAI Assistant
          </button>
          <button
            onClick={handleDownloadAnnualStatement}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" /> Download 80G Statement
          </button>
        </div>
      </div>

      {/* DEVOTEE 3D HIGHLIGHT METRIC CARDS WITH HOVER MOTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-devotional-saffron" /> Total Seva Contribution
          </p>
          <p className="text-2xl font-bold font-serif text-devotional-maroon dark:text-amber-400">
            ₹{medalProgress.lifetimeSuccessfulTotal.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 100% 80G Tax-Exempt
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-500" /> Total Offerings Made
          </p>
          <p className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
            {medalProgress.successfulDonationCount} Sevas
          </p>
          <p className="text-[10px] text-amber-700 font-semibold">{medalProgress.successfulDonationCount} Verifiable Receipts</p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Devotee Medal Tier
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🏆</span>
            <p className="text-xl font-bold font-serif text-amber-600">
              {medalProgress.currentMedal ? medalProgress.currentMedal.name : 'Swarna Seva'}
            </p>
          </div>
          <p className="text-[10px] text-stone-500">
            Next Tier: {medalProgress.nextMedal ? medalProgress.nextMedal.name : 'Diamond'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5 text-devotional-saffron" /> Monthly Autopay
          </p>
          <p className="text-2xl font-bold font-serif text-emerald-600">
            ₹1,016<span className="text-xs font-sans text-stone-500">/mo</span>
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Nitya Annadanam Active</p>
        </div>
      </div>

      {/* SMART DAILY PANCHANGAM & MUHURTHAM CALCULATOR */}
      <PanchangamCalculator />

      {/* AUSPICIOUS UPCOMING MUHURTHAM RELEASES & TEASERS */}
      {scheduledInitiatives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-devotional-saffron animate-pulse" />
              Upcoming Sacred Launches & Auspicious Muhurtham
            </h2>
            <Link
              href="/initiatives"
              className="text-xs text-devotional-saffron font-bold hover:underline"
            >
              Explore All Initiatives →
            </Link>
          </div>
          {scheduledInitiatives.map((ini) => (
            <AuspiciousMuhurthamTeaser key={ini.code} initiative={ini} />
          ))}
        </div>
      )}

      {/* 3D DEVOTEE MEDAL SYSTEM WIDGET */}
      <div className="bg-gradient-to-b from-stone-950 via-devotional-maroon-dark to-stone-950 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/60 shadow-2xl space-y-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-flex items-center gap-1 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-devotional-saffron" /> DEVOTEE 3D MEDAL ACHIEVEMENTS
            </span>
            <h2 className="text-2xl font-serif font-bold text-amber-300">
              Your Devotional Seva Milestones
            </h2>
          </div>
          <Link
            href="/devotee/annual-statement"
            className="text-xs text-amber-300 underline font-bold hover:text-white"
          >
            View Full Seva History
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MEDAL_TIERS.map((tier) => (
            <Medal3DCard
              key={tier.id}
              tier={tier}
              isUnlocked={medalProgress.lifetimeSuccessfulTotal >= tier.minAmount}
              userTotalDonated={medalProgress.lifetimeSuccessfulTotal}
              onClick={() => setSelectedMedalTier(tier)}
            />
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-amber-400 transition-all">
          <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-devotional-saffron" /> 2025-2026 Seva Contribution Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <XAxis dataKey="month" stroke="#A8A29E" fontSize={11} />
                <YAxis stroke="#A8A29E" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#1C1917', borderColor: '#D4AF37', color: '#FFF', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-amber-400 transition-all">
          <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-devotional-saffron" /> Seva Category Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Contributed']}
                  contentStyle={{ backgroundColor: '#1C1917', borderColor: '#D4AF37', color: '#FFF', borderRadius: '12px' }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT SEVA OFFERINGS TABLE */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-amber-400 transition-all">
        <div className="flex justify-between items-center">
          <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
            Recent Devotional Offerings
          </h3>
          <Link
            href="/devotee/donations"
            className="text-xs font-bold text-devotional-saffron hover:underline"
          >
            View All Offerings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3">Receipt ID</th>
                <th className="p-3">Seva Category</th>
                <th className="p-3">Temple Location</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_DONATIONS.slice(0, 5).map((d) => (
                <tr key={d.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                  <td className="p-3 font-mono font-bold text-devotional-maroon dark:text-amber-400">
                    {d.donationId}
                  </td>
                  <td className="p-3 font-bold text-stone-900 dark:text-stone-100">
                    {d.categoryName}
                  </td>
                  <td className="p-3 text-stone-600 dark:text-stone-400">
                    {d.templeName}
                  </td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{d.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        setActiveReceipt({
                          receiptNo: d.donationId,
                          donationId: d.id,
                          templeName: d.templeName,
                          trustName: 'Sri Vasavi Kanyaka Parameswari Matha Trust',
                          donorName: 'Radha Krishna',
                          amount: d.amount,
                          categoryName: d.categoryName,
                          date: d.createdAt || '24 Aug 2026',
                          paymentMethod: d.paymentMethod,
                          transactionId: d.transactionId,
                          verificationCode: d.verificationCode,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-amber-400 hover:text-stone-950 transition-colors"
                    >
                      Receipt
                    </button>
                    <button
                      onClick={() =>
                        setActiveCertificate({
                          devoteeName: 'Radha Krishna',
                          sevaType: d.categoryName,
                          amount: d.amount,
                          date: d.createdAt || '24 Aug 2026',
                          transactionId: d.transactionId,
                          receiptNo: d.donationId,
                          templeName: d.templeName,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-devotional-saffron text-white font-bold hover:brightness-110 transition-colors"
                    >
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}

      {activeCertificate && (
        <VasaviSevaCertificateModal
          certificateData={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {selectedMedalTier && (
        <MedalDetailModal
          tier={selectedMedalTier}
          isUnlocked={medalProgress.lifetimeSuccessfulTotal >= selectedMedalTier.minAmount}
          userTotalDonated={medalProgress.lifetimeSuccessfulTotal}
          donationCount={medalProgress.successfulDonationCount}
          templesCount={medalProgress.supportedTemplesCount}
          onClose={() => setSelectedMedalTier(null)}
        />
      )}

      <DevaAIAssistantModal isOpen={showDevaAI} onClose={() => setShowDevaAI(false)} />
    </div>
  );
}
