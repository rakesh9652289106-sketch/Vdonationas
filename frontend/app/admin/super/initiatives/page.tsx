'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Initiative,
  InitiativeStatus,
  getInitiatives,
  updateInitiativeStatus,
  toggleInitiativeUrgent,
  INITIATIVE_TYPE_LABELS,
} from '@/lib/initiatives-data';
import {
  Plus,
  Search,
  Filter,
  Flame,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Eye,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function SuperAdminInitiativesDashboard() {
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInitiatives();
      setInitiatives(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (code: string, newStatus: InitiativeStatus) => {
    const item = initiatives.find((i) => i.code === code);
    const itemTitle = item ? item.title : code;

    const isScheduledInFuture = Boolean(
      item?.scheduled_publish_at && new Date(item.scheduled_publish_at).getTime() > Date.now()
    );

    let actionText = `Change Status to ${newStatus}`;
    let message = `Are you sure you want to transition initiative "${itemTitle}" (${code}) to ${newStatus}?`;
    let confirmText = `Yes, Set to ${newStatus}`;
    let variant: 'danger' | 'warning' | 'change' | 'info' = 'change';

    if (newStatus === 'SCHEDULED') {
      actionText = 'Unpause Scheduled Launch';
      message = `Unpause "${itemTitle}" and restore its scheduled launch countdown? Devotees will resume seeing the pre-launch teaser until ${
        item?.scheduled_publish_at ? new Date(item.scheduled_publish_at).toLocaleString('en-IN') : 'the auspicious muhurtham'
      }.`;
      confirmText = 'Yes, Unpause Schedule';
      variant = 'change';
    } else if (newStatus === 'PUBLISHED') {
      const timePassed = item?.scheduled_publish_at && new Date(item.scheduled_publish_at).getTime() <= Date.now();
      actionText = timePassed ? 'Publish Initiative (Scheduled Time Reached)' : 'Publish Initiative Immediately';
      message = timePassed
        ? `The scheduled launch time for "${itemTitle}" has passed. Publish it now to open devotee contributions immediately?`
        : `Publishing "${itemTitle}" will make it live on the devotee portal for public contributions.`;
      confirmText = 'Yes, Publish Initiative';
      variant = 'change';
    } else if (newStatus === 'PAUSED') {
      actionText = 'Pause Initiative';
      message = `Pausing "${itemTitle}" will temporarily halt contributions and suspend active collection drives.`;
      confirmText = 'Yes, Pause Initiative';
      variant = 'warning';
    } else if (newStatus === 'CLOSED') {
      actionText = 'Close Initiative & Freeze Collections';
      message = `Closing "${itemTitle}" will permanently lock contributions and archive active collection drives.`;
      confirmText = 'Yes, Close Initiative';
      variant = 'danger';
    }

    const ok = await confirmAction({
      title: `${actionText}?`,
      message,
      itemName: `${itemTitle} (${code})`,
      variant,
      confirmText,
      cancelText: 'Keep Current Status',
    });

    if (!ok) return;

    setActionInProgress(code);
    await updateInitiativeStatus(code, newStatus);
    await loadData();
    setActionInProgress(null);

    showAlert({
      title: newStatus === 'SCHEDULED' ? 'Schedule Unpaused' : `Initiative ${newStatus}`,
      message:
        newStatus === 'SCHEDULED'
          ? `Initiative "${itemTitle}" has been unpaused and restored to SCHEDULED mode.`
          : `Initiative ${code} has been successfully updated to ${newStatus}.`,
      type: variant,
    });
  };

  const handleToggleUrgent = async (code: string, makeUrgent: boolean) => {
    const item = initiatives.find((i) => i.code === code);
    const itemTitle = item ? item.title : code;

    const confirmed = await confirmAction({
      title: makeUrgent ? 'Elevate to Urgent Emergency Appeal?' : 'Remove Urgent Appeal Status?',
      message: makeUrgent
        ? `Elevate "${itemTitle}" (${code}) to Urgent Appeal? It will immediately feature with glowing red emergency banners and top ranking on devotee feeds (even while ${item?.status}).`
        : `Remove Urgent Appeal status from "${itemTitle}" (${code}) and return to standard priority?`,
      confirmText: makeUrgent ? 'Yes, Elevate to Urgent' : 'Yes, Revert to Normal',
      variant: makeUrgent ? 'warning' : 'change',
    });

    if (!confirmed) return;

    setActionInProgress(code);
    await toggleInitiativeUrgent(code, makeUrgent);
    await loadData();
    setActionInProgress(null);

    showAlert({
      type: makeUrgent ? 'warning' : 'info',
      title: makeUrgent ? 'Marked as Urgent Appeal' : 'Urgent Status Removed',
      message: makeUrgent
        ? `"${itemTitle}" is now active as an Urgent Emergency Appeal.`
        : `"${itemTitle}" reverted to standard priority.`,
    });
  };

  const filtered = useMemo(() => {
    return initiatives.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && item.initiative_type !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initiatives, statusFilter, categoryFilter, searchQuery]);

  // Aggregate Metrics
  const totalTarget = initiatives.reduce((acc, i) => acc + i.target_amount, 0);
  const totalRaised = initiatives.reduce((acc, i) => acc + i.current_raised, 0);
  const totalApprovedExpenses = initiatives.reduce((acc, i) => acc + (i.total_approved_expenses || 0), 0);
  const urgentCount = initiatives.filter((i) => i.is_urgent && i.status === 'PUBLISHED').length;
  const overallProgress = totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0;
  const overallUtilization = totalRaised > 0 ? Math.round((totalApprovedExpenses / totalRaised) * 100) : 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-devotional-maroon-dark to-stone-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-devotional-gold/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-devotional-saffron" /> Global Dharma Programs
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Initiatives & Fundraising Management
          </h1>
          <p className="text-amber-100/80 text-xs">
            Review, publish, track capital utilization, post field progress updates, and audit sacred trust projects.
          </p>
        </div>

        <Link
          href="/admin/super/initiatives/create"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shrink-0 border border-amber-300/40"
        >
          <Plus className="w-4 h-4" /> Create
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-1.5">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-devotional-saffron" /> Total Projects
          </p>
          <p className="text-2xl font-bold font-serif text-white">{initiatives.length}</p>
          <p className="text-[10px] text-emerald-400 font-medium">
            {initiatives.filter((i) => i.status === 'PUBLISHED').length} Published & Active
          </p>
        </div>

        <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-1.5">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Total Funds Raised
          </p>
          <p className="text-2xl font-bold font-serif text-devotional-gold">
            ₹{(totalRaised / 100000).toFixed(1)}L
          </p>
          <p className="text-[10px] text-amber-300 font-medium">
            {overallProgress}% of ₹{(totalTarget / 100000).toFixed(1)}L Target
          </p>
        </div>

        <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-1.5">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <PieChart className="w-3.5 h-3.5 text-emerald-400" /> Funds Disbursed
          </p>
          <p className="text-2xl font-bold font-serif text-emerald-400">
            ₹{(totalApprovedExpenses / 100000).toFixed(1)}L
          </p>
          <p className="text-[10px] text-stone-400 font-medium">{overallUtilization}% Utilization Rate</p>
        </div>

        <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-1.5">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-400" /> Urgent Causes
          </p>
          <p className="text-2xl font-bold font-serif text-red-400">{urgentCount}</p>
          <p className="text-[10px] text-stone-400 font-medium">Requiring Priority Push</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-950 p-4 sm:p-5 rounded-3xl border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, title, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-devotional-gold"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter initiatives by status"
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 text-xs font-bold text-stone-200 border border-stone-800 focus:outline-none focus:ring-2 focus:ring-devotional-gold shrink-0 cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="PUBLISHED">Status: Published</option>
              <option value="SCHEDULED">Status: Scheduled</option>
              <option value="DRAFT">Status: Draft</option>
              <option value="UNDER_REVIEW">Status: Under Review</option>
              <option value="PAUSED">Status: Paused</option>
              <option value="COMPLETED">Status: Completed</option>
              <option value="CLOSED">Status: Closed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter initiatives by category"
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 text-xs font-bold text-stone-200 border border-stone-800 focus:outline-none focus:ring-2 focus:ring-devotional-gold shrink-0 cursor-pointer"
            >
              <option value="ALL">Type: All</option>
              {Object.entries(INITIATIVE_TYPE_LABELS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Initiatives Management Table */}
      <div className="bg-stone-950 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-amber-300">
            Registered Initiatives ({filtered.length})
          </h3>
          <button
            type="button"
            onClick={loadData}
            className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-stone-400">Loading initiatives from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-stone-400 space-y-3">
            <p>No initiatives match your filters.</p>
            <Link
              href="/admin/super/initiatives/create"
              className="inline-block px-4 py-2 rounded-xl bg-devotional-saffron text-white font-bold"
            >
              Create
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead>
                <tr className="border-b border-stone-800 text-[10px] text-stone-400 uppercase font-bold tracking-wider bg-stone-900/60">
                  <th className="py-3 px-4">Initiative Code & Title</th>
                  <th className="py-3 px-4">Type & Location</th>
                  <th className="py-3 px-4">Target / Raised</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map((item) => {
                  const typeConf = INITIATIVE_TYPE_LABELS[item.initiative_type] || INITIATIVE_TYPE_LABELS.OTHER;
                  const percent = item.target_amount > 0 ? Math.round((item.current_raised / item.target_amount) * 100) : 0;
                  const isProcessing = actionInProgress === item.code;

                  return (
                    <tr key={item.code} className="hover:bg-stone-900/40 transition-colors">
                      {/* Code & Title */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                            {item.code}
                          </span>
                          {item.is_urgent ? (
                            <button
                              type="button"
                              disabled={actionInProgress === item.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleUrgent(item.code, false);
                              }}
                              title="Click to remove Urgent Emergency Appeal status"
                              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1 animate-pulse transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Flame className="w-2.5 h-2.5 fill-current" /> Urgent
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionInProgress === item.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleUrgent(item.code, true);
                              }}
                              title="Click to elevate to Urgent Emergency Appeal"
                              className="text-[9px] font-semibold text-stone-500 hover:text-red-400 hover:border-red-800 px-1.5 py-0.5 rounded border border-stone-800 hover:border-red-700 bg-stone-900/60 transition-all cursor-pointer disabled:opacity-50"
                            >
                              + Urgent
                            </button>
                          )}
                        </div>
                        <p className="font-bold text-stone-100 line-clamp-1 text-sm">{item.title}</p>
                      </td>

                      {/* Type & Location */}
                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-semibold text-stone-200">{typeConf.icon} {item.custom_type || typeConf.label}</p>
                        <p className="text-[11px] text-stone-500">{item.city}, {item.state}</p>
                      </td>

                      {/* Financials & Progress */}
                      <td className="py-4 px-4 space-y-1.5 min-w-[150px]">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-amber-400">₹{item.current_raised.toLocaleString('en-IN')}</span>
                          <span className="text-stone-400">₹{item.target_amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-devotional-maroon to-devotional-gold rounded-full"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500">{percent}% funded • {item.donor_count} donors</p>
                      </td>

                      {/* Stage */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-900 border border-stone-700 text-amber-300">
                          {item.current_stage}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : item.status === 'SCHEDULED'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/80 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                              : item.status === 'DRAFT'
                              ? 'bg-stone-800 text-stone-300'
                              : item.status === 'PAUSED'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : item.status === 'COMPLETED'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.status === 'SCHEDULED' && item.scheduled_publish_at && (
                          <p className="text-[9px] text-amber-400 font-mono mt-1">
                            ⏰ Launch: {new Date(item.scheduled_publish_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} {new Date(item.scheduled_publish_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {item.status === 'SCHEDULED' && item.teaser_start_at && (
                          <p className="text-[8px] text-amber-300/80 font-mono">
                            👀 Countdown from: {new Date(item.teaser_start_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} {new Date(item.teaser_start_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {item.status === 'PAUSED' && item.scheduled_publish_at && (
                          <p className="text-[9px] text-amber-300 font-mono mt-1">
                            {new Date(item.scheduled_publish_at).getTime() > Date.now()
                              ? `⏸️ Paused (Scheduled: ${new Date(item.scheduled_publish_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} ${new Date(item.scheduled_publish_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})`
                              : '⚠️ Scheduled time reached'}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                        <Link
                          href={`/admin/super/initiatives/${item.code}`}
                          className="inline-block px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-[11px] transition-all"
                        >
                          Manage
                        </Link>

                        {(() => {
                          const isScheduledInFuture = Boolean(
                            item.scheduled_publish_at && new Date(item.scheduled_publish_at).getTime() > Date.now()
                          );

                          if (item.status === 'PAUSED') {
                            if (isScheduledInFuture) {
                              return (
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(item.code, 'SCHEDULED')}
                                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-all disabled:opacity-50 shadow-sm"
                                >
                                  Unpause
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(item.code, 'PUBLISHED')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all disabled:opacity-50"
                                >
                                  Publish
                                </button>
                              );
                            }
                          }

                          if (item.status === 'DRAFT') {
                            return (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleStatusChange(item.code, 'PUBLISHED')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all disabled:opacity-50"
                              >
                                Publish
                              </button>
                            );
                          }

                          if (item.status === 'SCHEDULED') {
                            return (
                              <>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(item.code, 'PUBLISHED')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all disabled:opacity-50"
                                >
                                  Publish Now
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleStatusChange(item.code, 'PAUSED')}
                                  className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-[11px] transition-all disabled:opacity-50"
                                >
                                  Pause
                                </button>
                              </>
                            );
                          }

                          if (item.status === 'PUBLISHED') {
                            return (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleStatusChange(item.code, 'PAUSED')}
                                className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-[11px] transition-all disabled:opacity-50"
                              >
                                Pause
                              </button>
                            );
                          }

                          return null;
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
