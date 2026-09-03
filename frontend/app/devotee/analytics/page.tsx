'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PieChart as LucidePieChart,
  BarChart3,
  TrendingUp,
  Heart,
  Flame,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  QrCode,
  Search,
  Filter,
  Eye,
  Sparkles,
  ArrowUpRight,
  Info,
  Layers,
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
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '@/lib/language-context';
import { MOCK_DONATIONS } from '@/lib/mock-data';
import ReceiptViewModal from '@/components/ReceiptViewModal';

// Sample dataset extended for multi-year comparison
const FY_DATA: Record<
  string,
  {
    total: number;
    count: number;
    taxExempt: number;
    avgOffering: number;
    topCategory: string;
    topCategoryPct: number;
    monthly: { month: string; amount: number; offerings: number }[];
    categories: { name: string; value: number; color: string; count: number }[];
    paymentModes: { mode: string; percentage: number; amount: number }[];
    donations: Array<{
      id: string;
      receiptNo: string;
      date: string;
      category: string;
      temple: string;
      mode: string;
      amount: number;
      taxExempt: boolean;
      txnId: string;
    }>;
  }
> = {
  '2025-2026': {
    total: 125500,
    count: 18,
    taxExempt: 125500,
    avgOffering: 6972,
    topCategory: 'Nitya Annadanam Seva',
    topCategoryPct: 60,
    monthly: [
      { month: 'Apr', amount: 15000, offerings: 2 },
      { month: 'May', amount: 8000, offerings: 1 },
      { month: 'Jun', amount: 12000, offerings: 2 },
      { month: 'Jul', amount: 25000, offerings: 3 },
      { month: 'Aug', amount: 18500, offerings: 3 },
      { month: 'Sep', amount: 9000, offerings: 1 },
      { month: 'Oct', amount: 15000, offerings: 2 },
      { month: 'Nov', amount: 8000, offerings: 1 },
      { month: 'Dec', amount: 5000, offerings: 1 },
      { month: 'Jan', amount: 4000, offerings: 1 },
      { month: 'Feb', amount: 3000, offerings: 1 },
      { month: 'Mar', amount: 3000, offerings: 0 },
    ],
    categories: [
      { name: 'Nitya Annadanam Seva', value: 75300, color: '#E06D29', count: 9 },
      { name: 'Temple Renovation & Gopuram', value: 25000, color: '#6B1D2F', count: 3 },
      { name: 'Sahasranama Kumkumarchana', value: 15200, color: '#D4AF37', count: 4 },
      { name: 'Go Seva (Cow Protection)', value: 10000, color: '#10B981', count: 2 },
    ],
    paymentModes: [
      { mode: 'UPI (GPay / PhonePe / Paytm)', percentage: 70, amount: 87850 },
      { mode: 'Net Banking (NEFT / IMPS)', percentage: 20, amount: 25100 },
      { mode: 'Debit / Credit Card', percentage: 10, amount: 12550 },
    ],
    donations: [
      {
        id: 'don-01',
        receiptNo: 'REC-2026-89102',
        date: '24 Aug 2025',
        category: 'Nitya Annadanam Seva',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 5001,
        taxExempt: true,
        txnId: 'TXN-9988112233',
      },
      {
        id: 'don-02',
        receiptNo: 'REC-2025-78210',
        date: '15 Jul 2025',
        category: 'Temple Renovation & Gopuram',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'Net Banking',
        amount: 25000,
        taxExempt: true,
        txnId: 'TXN-8877221144',
      },
      {
        id: 'don-03',
        receiptNo: 'REC-2025-67109',
        date: '28 Jun 2025',
        category: 'Sahasranama Kumkumarchana',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 5001,
        taxExempt: true,
        txnId: 'TXN-7766332255',
      },
      {
        id: 'don-04',
        receiptNo: 'REC-2025-56098',
        date: '12 May 2025',
        category: 'Nitya Annadanam Seva',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 8000,
        taxExempt: true,
        txnId: 'TXN-6655443366',
      },
      {
        id: 'don-05',
        receiptNo: 'REC-2025-45087',
        date: '18 Apr 2025',
        category: 'Go Seva (Cow Protection)',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 10000,
        taxExempt: true,
        txnId: 'TXN-5544552277',
      },
      {
        id: 'don-06',
        receiptNo: 'REC-2025-34076',
        date: '05 Apr 2025',
        category: 'Nitya Annadanam Seva',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'Cards',
        amount: 5000,
        taxExempt: true,
        txnId: 'TXN-4433661188',
      },
    ],
  },
  '2024-2025': {
    total: 85200,
    count: 12,
    taxExempt: 85200,
    avgOffering: 7100,
    topCategory: 'Nitya Annadanam Seva',
    topCategoryPct: 55,
    monthly: [
      { month: 'Apr', amount: 8000, offerings: 1 },
      { month: 'May', amount: 5000, offerings: 1 },
      { month: 'Jun', amount: 6000, offerings: 1 },
      { month: 'Jul', amount: 15000, offerings: 2 },
      { month: 'Aug', amount: 12000, offerings: 2 },
      { month: 'Sep', amount: 7000, offerings: 1 },
      { month: 'Oct', amount: 10000, offerings: 1 },
      { month: 'Nov', amount: 5000, offerings: 1 },
      { month: 'Dec', amount: 5200, offerings: 1 },
      { month: 'Jan', amount: 4000, offerings: 1 },
      { month: 'Feb', amount: 4000, offerings: 0 },
      { month: 'Mar', amount: 4000, offerings: 0 },
    ],
    categories: [
      { name: 'Nitya Annadanam Seva', value: 46860, color: '#E06D29', count: 6 },
      { name: 'Sahasranama Kumkumarchana', value: 20000, color: '#D4AF37', count: 3 },
      { name: 'Vidya Daanam & Education', value: 18340, color: '#10B981', count: 3 },
    ],
    paymentModes: [
      { mode: 'UPI (GPay / PhonePe / Paytm)', percentage: 65, amount: 55380 },
      { mode: 'Net Banking (NEFT / IMPS)', percentage: 25, amount: 21300 },
      { mode: 'Debit / Credit Card', percentage: 10, amount: 8520 },
    ],
    donations: [
      {
        id: 'don-24-01',
        receiptNo: 'REC-2024-51001',
        date: '10 Aug 2024',
        category: 'Nitya Annadanam Seva',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 12000,
        taxExempt: true,
        txnId: 'TXN-240810-11',
      },
      {
        id: 'don-24-02',
        receiptNo: 'REC-2024-42099',
        date: '22 Jul 2024',
        category: 'Sahasranama Kumkumarchana',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'Net Banking',
        amount: 15000,
        taxExempt: true,
        txnId: 'TXN-240722-22',
      },
    ],
  },
  '2023-2024': {
    total: 54000,
    count: 8,
    taxExempt: 54000,
    avgOffering: 6750,
    topCategory: 'Nitya Annadanam Seva',
    topCategoryPct: 50,
    monthly: [
      { month: 'Apr', amount: 5000, offerings: 1 },
      { month: 'May', amount: 4000, offerings: 1 },
      { month: 'Jul', amount: 12000, offerings: 2 },
      { month: 'Aug', amount: 8000, offerings: 1 },
      { month: 'Oct', amount: 10000, offerings: 1 },
      { month: 'Dec', amount: 5000, offerings: 1 },
      { month: 'Jan', amount: 10000, offerings: 1 },
    ],
    categories: [
      { name: 'Nitya Annadanam Seva', value: 27000, color: '#E06D29', count: 4 },
      { name: 'Sahasranama Kumkumarchana', value: 17000, color: '#D4AF37', count: 2 },
      { name: 'Go Seva (Cow Protection)', value: 10000, color: '#10B981', count: 2 },
    ],
    paymentModes: [
      { mode: 'UPI (GPay / PhonePe / Paytm)', percentage: 60, amount: 32400 },
      { mode: 'Net Banking (NEFT / IMPS)', percentage: 30, amount: 16200 },
      { mode: 'Debit / Credit Card', percentage: 10, amount: 5400 },
    ],
    donations: [
      {
        id: 'don-23-01',
        receiptNo: 'REC-2023-10022',
        date: '15 Jul 2023',
        category: 'Nitya Annadanam Seva',
        temple: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        mode: 'UPI',
        amount: 12000,
        taxExempt: true,
        txnId: 'TXN-230715-99',
      },
    ],
  },
};

export default function DevoteeAnalyticsAndStatementPage() {
  const { t } = useLanguage();
  const [selectedFY, setSelectedFY] = useState<string>('2025-2026');
  const [activeTab, setActiveTab] = useState<'analytics' | 'statement' | 'combined'>('combined');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const currentData = FY_DATA[selectedFY] || FY_DATA['2025-2026'];

  // Filtered donation records
  const filteredDonations = useMemo(() => {
    return currentData.donations.filter((d) => {
      const matchCat = categoryFilter === 'ALL' || d.category === categoryFilter;
      const matchQuery =
        searchQuery === '' ||
        d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.txnId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [currentData, categoryFilter, searchQuery]);

  // Tax benefit estimated at standard 30% slab
  const estimatedTaxSaving = Math.round(currentData.taxExempt * 0.3);

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Seva Category', 'Temple', 'Payment Mode', 'Amount (INR)', '80G Exemption', 'Transaction ID'];
    const rows = currentData.donations.map((d) => [
      d.receiptNo,
      d.date,
      `"${d.category}"`,
      `"${d.temple}"`,
      d.mode,
      d.amount,
      d.taxExempt ? '100% Exempt (Sec 80G)' : 'Non-Exempt',
      d.txnId,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Vasavi_Matha_80G_Statement_FY_${selectedFY}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" />
              Devotee Analytics & 80G Tax Statement
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-300">
              Donation Analytics
            </h1>
            <p className="text-amber-100/90 text-xs sm:text-sm max-w-2xl">
              Personal Seva Contribution Trends, Category Breakdown & Annual 80G Tax Statement Generator.
            </p>
          </div>

          {/* Quick Actions & FY Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-stone-900/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-amber-400/40 flex items-center gap-2 shadow-inner">
              <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-left">
                <span className="block text-[9px] text-amber-200/70 uppercase font-bold">Financial Year</span>
                <select
                  value={selectedFY}
                  onChange={(e) => setSelectedFY(e.target.value)}
                  aria-label="Select Financial Year"
                  className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="2025-2026" className="bg-stone-900 text-white">FY 2025–2026 (Current)</option>
                  <option value="2024-2025" className="bg-stone-900 text-white">FY 2024–2025</option>
                  <option value="2023-2024" className="bg-stone-900 text-white">FY 2023–2024</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-gold transition-all"
            >
              <Download className="w-4 h-4" /> Download 80G Statement
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all border border-emerald-600/40"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel / CSV
            </button>
          </div>
        </div>
      </div>

      {/* 3D METRIC CARDS ROW WITH AMBIENT GLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
        {/* Total Contributions */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-devotional-saffron" /> TOTAL SEVA (FY {selectedFY})
          </span>
          <span className="font-serif font-bold text-3xl text-devotional-maroon dark:text-amber-400 block">
            ₹{currentData.total.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> 100% Tax Deductible under Sec 80G
          </p>
        </div>

        {/* Offerings Count & Average */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> OFFERINGS & AVERAGE
          </span>
          <span className="font-bold text-3xl text-stone-900 dark:text-stone-100 block">
            {currentData.count} Offerings
          </span>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
            Average: <span className="font-bold text-amber-600 dark:text-amber-400">₹{currentData.avgOffering.toLocaleString('en-IN')}</span> per transaction
          </p>
        </div>

        {/* Estimated Tax Savings */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 80G TAX SAVINGS
          </span>
          <span className="font-serif font-bold text-3xl text-emerald-600 dark:text-emerald-400 block">
            ~₹{estimatedTaxSaving.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-stone-500">
            Estimated at standard 30% tax bracket
          </p>
        </div>

        {/* Top Seva Focus */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-2">
          <span className="text-stone-500 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <LucidePieChart className="w-3.5 h-3.5 text-amber-500" /> PRIMARY SEVA FOCUS
          </span>
          <span className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400 block truncate">
            {currentData.topCategory}
          </span>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
            {currentData.topCategoryPct}% of annual contributions
          </p>
        </div>
      </div>

      {/* UNIFIED VIEW MODE TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setActiveTab('combined')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'combined'
                ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 shadow-md ring-1 ring-amber-400/40'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Consolidated Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 shadow-md ring-1 ring-amber-400/40'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Visual Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab('statement')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'statement'
                ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 shadow-md ring-1 ring-amber-400/40'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Annual 80G Statement
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Building2 className="w-3.5 h-3.5 text-devotional-saffron" />
          <span>Sri Vasavi Kanyaka Parameswari Matha, Penugonda</span>
        </div>
      </div>

      {/* SECTION 1: VISUAL ANALYTICS & TRENDS (Active in 'analytics' or 'combined') */}
      {(activeTab === 'analytics' || activeTab === 'combined') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-devotional-saffron" />
              Devotional Analytics & Contribution Trends
            </h2>
            <span className="text-xs text-stone-500 font-semibold">
              Period: 01 Apr {selectedFY.split('-')[0]} – 31 Mar {selectedFY.split('-')[1]}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Area Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" /> Monthly Seva Progression (₹)
                  </h3>
                  <p className="text-[11px] text-stone-500">Track your continuous offerings across all 12 months</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold border border-amber-300">
                  FY {selectedFY}
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData.monthly}>
                    <defs>
                      <linearGradient id="sevaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" stroke="#78716c" fontSize={11} />
                    <YAxis
                      stroke="#78716c"
                      fontSize={11}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Offering Amount']}
                      labelFormatter={(label) => `Month: ${label} (FY ${selectedFY})`}
                      contentStyle={{ backgroundColor: '#1C1917', borderColor: '#D4AF37', color: '#FFF', borderRadius: '16px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#sevaAreaGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut Chart */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <LucidePieChart className="w-4 h-4 text-devotional-saffron" /> Seva Category Distribution
                </h3>
                <p className="text-[11px] text-stone-500">Distribution across major temple seva funds</p>
              </div>

              <div className="h-52 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={currentData.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {currentData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Contributed']}
                      contentStyle={{ backgroundColor: '#1C1917', borderColor: '#D4AF37', color: '#FFF', borderRadius: '12px' }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Total</span>
                  <span className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
                    ₹{(currentData.total / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                {currentData.categories.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-stone-700 dark:text-stone-300 font-medium truncate max-w-[140px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      ₹{c.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mode of Offering & Temple Dedication Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Offering Channels
              </h4>
              <div className="space-y-2.5">
                {currentData.paymentModes.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-600 dark:text-stone-400 font-medium">{m.mode}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">{m.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-devotional-saffron h-full rounded-full transition-all duration-500"
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-devotional-maroon dark:text-amber-400" /> Supported Shrine
              </h4>
              <div className="p-3 bg-amber-50/60 dark:bg-stone-800/60 rounded-2xl border border-amber-300/40 space-y-1">
                <p className="font-serif font-bold text-devotional-maroon dark:text-amber-400 text-xs">
                  Sri Vasavi Kanyaka Parameswari Matha
                </p>
                <p className="text-[10px] text-stone-500">Penugonda, West Godavari, AP</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 font-bold text-[9px]">
                  100% Contributions Directed
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> 80G Tax Exemption Status
              </h4>
              <div className="space-y-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>80G Order Number:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-200">CIT/AP/80G/1042</span>
                </div>
                <div className="flex justify-between">
                  <span>Trust PAN:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-200">AAATV1234F</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity:</span>
                  <span className="font-bold text-emerald-600">Perpetual</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ANNUAL 80G STATEMENT & DETAILED LEDGER (Active in 'statement' or 'combined') */}
      {(activeTab === 'statement' || activeTab === 'combined') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                <FileText className="w-5 h-5 text-devotional-saffron" />
                Annual 80G Tax Exemption Statement & Ledger
              </h2>
              <p className="text-xs text-stone-500">
                Official Consolidated Donation Statement for Income Tax Filing under Section 80G (FY {selectedFY})
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-devotional-maroon hover:bg-devotional-maroon-dark text-amber-300 font-serif font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md border border-amber-400/40 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF Preview
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Download Excel
              </button>
            </div>
          </div>

          {/* Statement Certificate Banner */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-6">
            <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-amber-400/40 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
                    Sri Vasavi Kanyaka Parameswari Matha Trust
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Penugonda, West Godavari District, Andhra Pradesh - 534320
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Trust Reg No: <span className="font-mono font-bold">AP-SEC-TRUST-2024-8891</span> • 80G URN: <span className="font-mono font-bold">AAATV1234FE20214</span>
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 80G TAX EXEMPT CERTIFIED
                  </span>
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    100% Eligible for Tax Deduction
                  </span>
                </div>
              </div>

              {/* Devotee Info & Statement Period Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Devotee / Donor Name</span>
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">Radha Krishna</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Devotee PAN</span>
                  <span className="font-mono font-bold text-devotional-maroon dark:text-amber-400 text-sm">ABCDE1234F</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Statement Period</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    01 Apr {selectedFY.split('-')[0]} – 31 Mar {selectedFY.split('-')[1]}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Assessment Year</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    AY {parseInt(selectedFY.split('-')[0]) + 1}–{parseInt(selectedFY.split('-')[1]) + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Wise Summary */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Category-Wise Seva Breakdown (FY {selectedFY})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Seva Category</th>
                      <th className="p-3 text-center">Offerings Count</th>
                      <th className="p-3 text-right">Contributed Amount (₹)</th>
                      <th className="p-3 text-right">80G Eligible Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {currentData.categories.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="p-3 font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </td>
                        <td className="p-3 text-center text-stone-600 dark:text-stone-400">{cat.count}</td>
                        <td className="p-3 text-right font-bold text-stone-900 dark:text-stone-100">
                          ₹{cat.value.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{cat.value.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-amber-50/80 dark:bg-amber-950/40 font-bold border-t-2 border-amber-400/40">
                      <td className="p-3 text-devotional-maroon dark:text-amber-400 font-serif text-sm">
                        TOTAL CONSOLIDATED SEVA
                      </td>
                      <td className="p-3 text-center text-stone-900 dark:text-stone-100">{currentData.count}</td>
                      <td className="p-3 text-right font-serif text-devotional-maroon dark:text-amber-400 text-base">
                        ₹{currentData.total.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-serif text-emerald-600 dark:text-emerald-400 text-base">
                        ₹{currentData.taxExempt.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Itemized Transaction Ledger with Search & Filter */}
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                  Itemized Devotional Offerings Ledger ({filteredDonations.length} Records)
                </h4>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search receipt / category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-400 w-full sm:w-48"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by Seva Category"
                    className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    {currentData.categories.map((c, i) => (
                      <option key={i} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold text-[10px] border-b border-stone-200 dark:border-stone-700">
                    <tr>
                      <th className="p-3">Receipt No</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Seva Category</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">80G Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="p-3 font-mono font-bold text-devotional-maroon dark:text-amber-400">
                          {d.receiptNo}
                        </td>
                        <td className="p-3 text-stone-600 dark:text-stone-400 whitespace-nowrap">{d.date}</td>
                        <td className="p-3 font-medium text-stone-900 dark:text-stone-100">{d.category}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold">
                            {d.mode}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                          ₹{d.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Eligible
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              setActiveReceipt({
                                receiptNo: d.receiptNo,
                                donationId: d.id,
                                templeName: d.temple,
                                trustName: 'Sri Vasavi Kanyaka Parameswari Matha Trust',
                                donorName: 'Radha Krishna',
                                amount: d.amount,
                                categoryName: d.category,
                                date: d.date,
                                paymentMethod: d.mode,
                                transactionId: d.txnId,
                                verificationCode: 'VK89102X',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-400 hover:text-stone-950 font-bold text-[11px] transition-colors"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL 80G PRINTABLE ANNUAL STATEMENT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 w-full max-w-3xl rounded-3xl shadow-2xl p-8 space-y-6 my-8 border-4 border-devotional-gold relative animate-scale-up">
            {/* Action Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <span className="text-xs font-bold uppercase text-devotional-maroon tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-devotional-saffron" /> Official 80G Annual Tax Statement
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-devotional-maroon text-amber-300 font-serif font-bold text-xs rounded-xl flex items-center gap-1.5 hover:brightness-110 shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Official Letterhead */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-stone-800">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                ॥ శ్రీ వాసవీ కన్యకా పరమేశ్వరీ ప్రసన్నః ॥
              </div>
              <h2 className="text-2xl font-serif font-bold text-devotional-maroon">
                SRI VASAVI KANYAKA PARAMESWARI MATHA TRUST
              </h2>
              <p className="text-xs text-stone-600">
                Penugonda, West Godavari District, Andhra Pradesh - 534320
              </p>
              <p className="text-[10px] text-stone-500 font-mono">
                Trust Reg. No: AP-SEC-TRUST-2024-8891 • 80G Approval URN: CIT(E)/HYD/80G/2021-22/A/10294 • PAN: AAATV1234F
              </p>
            </div>

            {/* Statement Title */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-center">
              <h3 className="font-serif font-bold text-base text-devotional-maroon uppercase">
                Consolidated Annual Donation & 80G Tax Exemption Certificate
              </h3>
              <p className="text-xs text-stone-700">
                Financial Year: <strong>{selectedFY}</strong> (01-04-{selectedFY.split('-')[0]} to 31-03-{selectedFY.split('-')[1]})
              </p>
            </div>

            {/* Devotee Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Donor / Devotee Name</span>
                <span className="font-serif font-bold text-sm text-stone-900">Radha Krishna</span>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Permanent Account Number (PAN)</span>
                <span className="font-mono font-bold text-sm text-devotional-maroon">ABCDE1234F</span>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Email & Phone</span>
                <span className="font-medium text-stone-800">devotee@gmail.com • +91 9123456789</span>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Address</span>
                <span className="font-medium text-stone-800">Penugonda, Andhra Pradesh</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs border border-stone-300">
              <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5 border-b border-stone-300">S.No</th>
                  <th className="p-2.5 border-b border-stone-300">Seva Category</th>
                  <th className="p-2.5 border-b border-stone-300 text-center">Offerings</th>
                  <th className="p-2.5 border-b border-stone-300 text-right">Amount (INR)</th>
                  <th className="p-2.5 border-b border-stone-300 text-right">80G Deductible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {currentData.categories.map((c, i) => (
                  <tr key={i}>
                    <td className="p-2.5 text-stone-500">{i + 1}</td>
                    <td className="p-2.5 font-semibold text-stone-800">{c.name}</td>
                    <td className="p-2.5 text-center text-stone-600">{c.count}</td>
                    <td className="p-2.5 text-right font-bold text-stone-900">₹{c.value.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">₹{c.value.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                <tr className="bg-stone-100 font-bold border-t-2 border-stone-400">
                  <td colSpan={3} className="p-2.5 text-devotional-maroon font-serif text-sm uppercase">
                    Total Amount Donated
                  </td>
                  <td className="p-2.5 text-right font-serif text-devotional-maroon text-base">
                    ₹{currentData.total.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right font-serif text-emerald-800 text-base">
                    ₹{currentData.taxExempt.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Declaration & Signatures */}
            <div className="pt-4 border-t border-stone-200 flex justify-between items-end text-xs">
              <div className="space-y-1 max-w-sm">
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  Certified that the above mentioned sum of ₹{currentData.total.toLocaleString('en-IN')} was received as voluntary contribution / seva offering for the religious and charitable objects of the Trust. 100% eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-12 h-12 border border-stone-300 rounded-lg flex items-center justify-center bg-stone-50">
                    <QrCode className="w-8 h-8 text-stone-700" />
                  </div>
                  <span className="text-[9px] text-stone-500">
                    Scan to verify authenticity with Sri Vasavi Matha Trust Portal
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-serif font-bold text-xs text-stone-900">For Sri Vasavi Kanyaka Parameswari Matha Trust</div>
                <div className="h-8 flex items-center justify-end font-serif italic text-stone-500 text-xs">
                  [Digitally Signed & Sealed]
                </div>
                <div className="text-[10px] font-bold text-stone-700">Managing Trustee / Financial Officer</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Receipt Modal */}
      {activeReceipt && (
        <ReceiptViewModal receiptData={activeReceipt} onClose={() => setActiveReceipt(null)} />
      )}
    </div>
  );
}
