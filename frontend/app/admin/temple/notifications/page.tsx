'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  CheckCheck,
  Search,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Filter,
  X,
  Ban,
  Building2,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  TempleAdminNotification,
  getTempleAdminNotifications,
  markTempleAdminNotificationRead,
  markAllTempleAdminNotificationsRead,
  deleteTempleAdminNotification,
  clearAllTempleAdminNotifications,
} from '@/lib/quota-store';

export default function TempleAdminNotificationsPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [notifications, setNotifications] = useState<TempleAdminNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const loadNotifications = () => {
    setNotifications(getTempleAdminNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('temple_admin_notifs_updated', loadNotifications);
    return () => {
      window.removeEventListener('temple_admin_notifs_updated', loadNotifications);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    markTempleAdminNotificationRead(id);
    loadNotifications();
    showAlert({
      type: 'info',
      title: 'Marked Read',
      message: 'Notification marked as read.',
    });
  };

  const handleMarkAllRead = () => {
    markAllTempleAdminNotificationsRead();
    loadNotifications();
    showAlert({
      type: 'info',
      title: 'All Marked Read',
      message: 'All administrative notifications marked as read.',
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: 'Delete Notification?',
      message: 'Are you sure you want to remove this administrative notice from your dashboard? This action cannot be reversed.',
      confirmText: 'Delete Notification',
      variant: 'danger',
    });
    if (!confirmed) return;

    deleteTempleAdminNotification(id);
    loadNotifications();
    showAlert({
      type: 'danger',
      title: 'Notification Deleted',
      message: 'Notification removed successfully.',
    });
  };

  const handleClearAll = async () => {
    const confirmed = await confirmAction({
      title: 'Clear All Notifications?',
      message: 'Are you sure you want to clear all administrative notifications, Super Admin approvals, and decision logs? This cannot be undone.',
      confirmText: 'Yes, Clear All',
      variant: 'danger',
    });
    if (!confirmed) return;

    clearAllTempleAdminNotifications();
    loadNotifications();
    showAlert({
      type: 'danger',
      title: 'Notifications Cleared',
      message: 'All notifications have been cleared from your records.',
    });
  };

  // Filtered list
  const filteredNotifications = notifications.filter((n) => {
    // Type Filter
    if (typeFilter === 'UNREAD' && n.read) return false;
    if (typeFilter === 'APPROVAL' && n.type !== 'APPROVAL') return false;
    if (typeFilter === 'REJECTION' && n.type !== 'REJECTION') return false;
    if (typeFilter === 'SUSPEND_DECISION' && n.type !== 'SUSPEND_DECISION') return false;
    if (typeFilter === 'BLOCK_DECISION' && n.type !== 'BLOCK_DECISION') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.sevaTitle && n.sevaTitle.toLowerCase().includes(q)) ||
        (n.reason && n.reason.toLowerCase().includes(q)) ||
        (n.monthName && n.monthName.toLowerCase().includes(q)) ||
        n.createdAt.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const approvalsCount = notifications.filter((n) => n.type === 'APPROVAL').length;
  const rejectionsCount = notifications.filter((n) => n.type === 'REJECTION').length;
  const suspensionsCount = notifications.filter((n) => n.type === 'SUSPEND_DECISION').length;
  const blocksCount = notifications.filter((n) => n.type === 'BLOCK_DECISION').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Bell className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> Super Admin Communications
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Temple Admin Notifications
          </h1>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
            Real-time governance decisions, seva release approvals, blackout authorizations, and rejection feedback from Super Admin.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read ({unreadCount})
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>


      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by title, message, seva name, or date..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-semibold text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset Filters */}
          {(searchQuery || typeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
              }}
              className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all shrink-0 border border-stone-200 dark:border-stone-700"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'ALL'
                ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setTypeFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              typeFilter === 'UNREAD'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Unread ({unreadCount})
          </button>

          <button
            onClick={() => setTypeFilter('APPROVAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'APPROVAL'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            ✓ Approvals ({approvalsCount})
          </button>

          <button
            onClick={() => setTypeFilter('REJECTION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'REJECTION'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            ⚠️ Rejections ({rejectionsCount})
          </button>

          <button
            onClick={() => setTypeFilter('SUSPEND_DECISION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'SUSPEND_DECISION'
                ? 'bg-stone-800 text-amber-300 shadow-md border border-amber-400'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            ⏱️ Suspensions ({suspensionsCount})
          </button>

          <button
            onClick={() => setTypeFilter('BLOCK_DECISION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'BLOCK_DECISION'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            🚫 Blackouts &amp; Unblocks ({blocksCount})
          </button>
        </div>
      </div>

      {/* NOTIFICATION CARDS LIST */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 p-12 text-center rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            No Notifications Found
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {(searchQuery || typeFilter !== 'ALL')
              ? 'No notifications match your current search and filter criteria.'
              : 'You are all caught up! There are no new notifications from Super Admin.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const isRejection = notif.type === 'REJECTION';
            const isApproval = notif.type === 'APPROVAL';
            const isSuspension = notif.type === 'SUSPEND_DECISION';
            const isBlock = notif.type === 'BLOCK_DECISION';

            return (
              <div
                key={notif.id}
                className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl space-y-4 transition-all relative overflow-hidden ${
                  !notif.read
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : isRejection
                    ? 'border-red-300 dark:border-red-900/60'
                    : isApproval
                    ? 'border-emerald-300 dark:border-emerald-900/60'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Unread Accent Bar */}
                {!notif.read && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-devotional-saffron to-amber-500" />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isRejection
                          ? 'bg-red-100 dark:bg-red-950 text-red-600 border border-red-300 dark:border-red-800'
                          : isApproval
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800'
                          : isSuspension
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-600 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {isRejection ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : isApproval ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isSuspension ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Ban className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400">
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {notif.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Card Right Actions */}
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-stone-800 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {notif.message}
                </p>

                {/* Rejection Specific Box */}
                {notif.reason && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 text-xs space-y-1">
                    <span className="font-bold text-red-900 dark:text-red-300 block">
                      Super Admin Reason / Operational Note:
                    </span>
                    <p className="text-stone-800 dark:text-stone-200">{notif.reason}</p>
                  </div>
                )}

                {/* Direct Action Link to Pooja Catalog */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href="/admin/temple/poojas"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-gold transition-all"
                  >
                    <span>Go to Pooja Catalog &amp; Quotas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
