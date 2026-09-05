'use client';

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import {
  IconTempleBell,
  IconDevotionalCoin,
  IconPoojaAarti,
  IconAnnadanamPot,
  IconTempleMatha,
  IconFestivalDeepam,
} from '@/components/icons/DevotionalIcons';

interface MobileNotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationCategory = 'ALL' | 'PAYMENTS' | 'SEVAS' | 'AUTOPAY' | 'MATHA' | 'EVENTS';

interface NotificationItem {
  id: string;
  category: 'PAYMENTS' | 'SEVAS' | 'AUTOPAY' | 'MATHA' | 'EVENTS';
  title: string;
  message: string;
  time: string;
  isFinancial: boolean;
  read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'PAYMENTS',
    title: 'Donation received',
    message: 'Your ₹1,001 Seva donation to Sri Vasavi Matha was successful. 80G receipt generated.',
    time: '2m ago',
    isFinancial: true,
    read: false,
  },
  {
    id: 'n2',
    category: 'SEVAS',
    title: 'Sahasranama Kumkumarchana Confirmed',
    message: 'Your pooja slot for 12 Sep, 10:30 AM is reserved with Sankalpam.',
    time: '1h ago',
    isFinancial: false,
    read: false,
  },
  {
    id: 'n3',
    category: 'AUTOPAY',
    title: 'Monthly Seva Autopay Scheduled',
    message: 'Next automated deduction of ₹501 scheduled for 25 Sep via UPI AutoPay.',
    time: '5h ago',
    isFinancial: true,
    read: true,
  },
  {
    id: 'n4',
    category: 'EVENTS',
    title: 'Sri Vasavi Jayanti Mahotsavam',
    message: 'Annual Brahmotsavam celebrations begin next week at Penugonda Devasthanam.',
    time: '1d ago',
    isFinancial: false,
    read: true,
  },
  {
    id: 'n5',
    category: 'MATHA',
    title: 'Gau Shala Seva Update',
    message: 'New solar water heating system installed at Penugonda Goshala through your seva.',
    time: '2d ago',
    isFinancial: false,
    read: true,
  },
];

export default function MobileNotificationSheet({
  isOpen,
  onClose,
}: MobileNotificationSheetProps) {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('ALL');

  if (!isOpen) return null;

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((n) => {
    if (activeTab === 'ALL') return true;
    return n.category === activeTab;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'PAYMENTS':
        return <IconDevotionalCoin size={20} />;
      case 'SEVAS':
        return <IconPoojaAarti size={20} />;
      case 'AUTOPAY':
        return <IconAnnadanamPot size={20} />;
      case 'MATHA':
        return <IconTempleMatha size={20} active={true} />;
      case 'EVENTS':
        return <IconFestivalDeepam size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="relative w-full max-h-[85vh] bg-devotional-cream dark:bg-stone-900 rounded-t-3xl border-t-2 border-devotional-gold/40 shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 pb-safe">
        {/* Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        </div>

        {/* Sheet Header */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-stone-800 dark:to-stone-700 border border-amber-400/40 flex items-center justify-center p-1 shadow-xs">
              <IconTempleBell size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-devotional-maroon dark:text-amber-400">
                Notifications
              </h3>
              <p className="text-[10px] text-stone-500">Devotional & Transaction Updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-b border-stone-200 dark:border-stone-800 scrollbar-none">
          {(['ALL', 'PAYMENTS', 'SEVAS', 'AUTOPAY', 'MATHA', 'EVENTS'] as NotificationCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                activeTab === tab
                  ? 'bg-devotional-maroon text-amber-200 shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition-all ${
                  n.isFinancial
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>{n.title}</span>
                        {n.isFinancial && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                            Receipt
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
