'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Initiative,
  InitiativeStage,
  InitiativeStatus,
  InitiativePriority,
  getInitiativeByCode,
  updateInitiativeStatus,
  updateInitiativeStage,
  updateInitiative,
  toggleInitiativeUrgent,
  addInitiativeExpense,
  addInitiativeUpdate,
  INITIATIVE_TYPE_LABELS,
  STAGE_STEPS,
} from '@/lib/initiatives-data';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  ArrowLeft,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Receipt,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  RefreshCw,
  Edit3,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';

export default function AdminInitiativeManagePage() {
  const params = useParams();
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();
  const code = (params?.id as string) || '';

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES' | 'UPDATES' | 'AUDIT'>('OVERVIEW');

  // Edit initiative details & urgent modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    short_title: '',
    objective: '',
    description: '',
    target_amount: 0,
    city: '',
    state: '',
    is_urgent: false,
    priority: 'NORMAL' as InitiativePriority,
    teaser_start_at: '',
  });

  // Expense form state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseCat, setExpenseCat] = useState('Construction Materials');
  const [expenseAmount, setExpenseAmount] = useState('50000');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseInvoice, setExpenseInvoice] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Update form state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateImg, setUpdateImg] = useState('');

  const loadData = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const item = await getInitiativeByCode(code);
      setInitiative(item);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [code]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-2">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
        <p className="text-xs text-stone-400">Loading initiative workspace...</p>
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-xs text-red-400 font-bold">Initiative not found.</p>
        <Link href="/admin/super/initiatives" className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-bold">
          Back
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (st: InitiativeStatus) => {
    let title = `Update Initiative Status to ${st}?`;
    let message = `Are you sure you want to change the status of "${initiative.title}" to ${st}?`;
    let confirmText = `Set to ${st}`;
    let variant: 'danger' | 'warning' | 'change' | 'info' = 'change';

    if (st === 'CLOSED') {
      title = 'Close Initiative & Freeze Collections?';
      message = `Closing "${initiative.title}" will freeze all public donations and archive active collection drives. This action marks the initiative as finalized.`;
      confirmText = 'Yes, Close Initiative';
      variant = 'danger';
    } else if (st === 'PAUSED') {
      title = 'Pause Devotee Contributions?';
      message = `Pausing "${initiative.title}" will temporarily halt public online contributions until it is resumed.`;
      confirmText = 'Yes, Pause Initiative';
      variant = 'warning';
    } else if (st === 'SCHEDULED') {
      title = 'Unpause Scheduled Launch?';
      message = `Unpause "${initiative.title}" and restore its scheduled launch countdown? Devotees will resume seeing the pre-launch teaser until ${
        initiative.scheduled_publish_at ? new Date(initiative.scheduled_publish_at).toLocaleString('en-IN') : 'the auspicious muhurtham'
      }.`;
      confirmText = 'Yes, Unpause Schedule';
      variant = 'change';
    } else if (st === 'PUBLISHED') {
      const timePassed = initiative.scheduled_publish_at && new Date(initiative.scheduled_publish_at).getTime() <= Date.now();
      title = timePassed ? 'Publish Initiative (Scheduled Time Reached)?' : 'Publish Initiative for Public Giving?';
      message = timePassed
        ? `The scheduled launch window for "${initiative.title}" has arrived. Publish it now to open contributions for devotees immediately?`
        : `Publishing "${initiative.title}" makes it live on the devotee portal for receiving donations.`;
      confirmText = 'Yes, Publish Initiative';
      variant = 'change';
    }

    const confirmed = await confirmAction({
      title,
      message,
      confirmText,
      variant,
    });

    if (!confirmed) return;

    await updateInitiativeStatus(initiative.code, st);
    showAlert({
      type: variant,
      title: st === 'SCHEDULED' ? 'Schedule Unpaused' : 'Status Updated',
      message:
        st === 'SCHEDULED'
          ? `Initiative "${initiative.title}" has been unpaused and restored to SCHEDULED mode.`
          : `Initiative status successfully transitioned to ${st}.`,
    });
    await loadData();
  };

  const handleStageUpdate = async (stg: InitiativeStage) => {
    if (stg === initiative.current_stage) return;

    const confirmed = await confirmAction({
      title: `Advance Construction Stage?`,
      message: `Advance "${initiative.title}" to stage: ${stg}? Devotees and donors will see this progress milestone immediately on their live dashboards.`,
      confirmText: `Advance to ${stg}`,
      variant: 'change',
    });

    if (!confirmed) return;

    await updateInitiativeStage(initiative.code, stg);
    showAlert({
      type: 'change',
      title: 'Milestone Advanced',
      message: `Initiative stage successfully transitioned to ${stg}.`,
    });
    await loadData();
  };

  const handleToggleUrgent = async () => {
    if (!initiative) return;
    const willBeUrgent = !initiative.is_urgent;

    const confirmed = await confirmAction({
      title: willBeUrgent ? 'Elevate to Urgent Emergency Appeal?' : 'Remove Urgent Appeal Status?',
      message: willBeUrgent
        ? `Elevating "${initiative.title}" to Urgent will feature it prominently with glowing red emergency banners and top ranking across the Devotee portal (even while ${initiative.status}).`
        : `Are you sure you want to remove the Urgent appeal designation for "${initiative.title}" and return it to standard priority?`,
      confirmText: willBeUrgent ? 'Yes, Elevate to Urgent' : 'Yes, Revert to Normal',
      variant: willBeUrgent ? 'warning' : 'change',
    });

    if (!confirmed) return;

    await toggleInitiativeUrgent(initiative.code, willBeUrgent);
    showAlert({
      type: willBeUrgent ? 'warning' : 'info',
      title: willBeUrgent ? 'Marked as Urgent Appeal' : 'Urgent Status Removed',
      message: willBeUrgent
        ? `Initiative "${initiative.title}" is now active as an Urgent Emergency Appeal.`
        : `Initiative "${initiative.title}" reverted to standard priority.`,
    });
    await loadData();
  };

  const handleOpenEditModal = () => {
    if (!initiative) return;
    setEditForm({
      title: initiative.title,
      short_title: initiative.short_title || initiative.title,
      objective: initiative.objective || '',
      description: initiative.description || '',
      target_amount: initiative.target_amount,
      city: initiative.city,
      state: initiative.state,
      is_urgent: initiative.is_urgent,
      priority: initiative.priority || 'NORMAL',
      teaser_start_at: initiative.teaser_start_at || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initiative) return;

    const confirmed = await confirmAction({
      title: 'Save Initiative Modifications?',
      message: `Apply updated parameters (Urgent: ${editForm.is_urgent ? 'YES' : 'NO'}, Priority: ${editForm.priority}, Budget: ₹${Number(editForm.target_amount).toLocaleString('en-IN')}) for "${editForm.title}"? Changes take effect immediately across devotee feeds.`,
      confirmText: 'Yes, Save Changes',
      variant: 'change',
    });

    if (!confirmed) return;

    await updateInitiative(initiative.code, {
      title: editForm.title,
      short_title: editForm.short_title,
      objective: editForm.objective,
      description: editForm.description,
      target_amount: Number(editForm.target_amount),
      city: editForm.city,
      state: editForm.state,
      is_urgent: editForm.is_urgent,
      priority: editForm.priority,
      teaser_start_at: editForm.teaser_start_at.trim() ? editForm.teaser_start_at : undefined,
    });

    setShowEditModal(false);
    showAlert({
      type: 'change',
      title: 'Initiative Updated',
      message: `Modifications for "${editForm.title}" have been saved successfully with audit record.`,
    });
    await loadData();
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expenseAmount);
    if (!parsedAmount || parsedAmount <= 0) return;

    await addInitiativeExpense(initiative.code, {
      category: expenseCat,
      amount: parsedAmount,
      description: expenseDesc || `${expenseCat} disbursement`,
      invoice_ref: expenseInvoice || `INV-${Date.now().toString().slice(-4)}`,
      expense_date: expenseDate,
      status: 'APPROVED',
    });

    setShowExpenseModal(false);
    setExpenseDesc('');
    setExpenseInvoice('');
    showAlert({
      type: 'info',
      title: 'Disbursement Recorded',
      message: `₹${parsedAmount.toLocaleString('en-IN')} approved disbursement logged under ${expenseCat}.`,
    });
    await loadData();
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateMsg.trim()) return;

    await addInitiativeUpdate(initiative.code, {
      title: updateTitle,
      message: updateMsg,
      images: updateImg ? [updateImg] : [],
    });

    setShowUpdateModal(false);
    setUpdateTitle('');
    setUpdateMsg('');
    setUpdateImg('');
    showAlert({
      type: 'info',
      title: 'Update Published',
      message: `Devotee field update "${updateTitle}" has been posted with verification audit trail.`,
    });
    await loadData();
  };

  const percent = initiative.target_amount > 0 ? Math.round((initiative.current_raised / initiative.target_amount) * 100) : 0;
  const totalApproved = initiative.expenses?.filter((e) => e.status === 'APPROVED').reduce((acc, e) => acc + Number(e.amount || 0), 0) || 0;
  const utilization = initiative.current_raised > 0 ? Math.round((totalApproved / initiative.current_raised) * 100) : 0;

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/super/initiatives"
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="font-mono text-xs text-amber-400 font-bold bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
          {initiative.code}
        </span>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-devotional-maroon text-amber-300 border border-amber-400/30">
                {initiative.initiative_type}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                initiative.status === 'PUBLISHED'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : initiative.status === 'SCHEDULED'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/80 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : initiative.status === 'PAUSED'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-stone-800 text-stone-300'
              }`}>
                {initiative.status}
              </span>

              {/* Interactive Urgent Status Switch Chip */}
              {initiative.is_urgent ? (
                <button
                  type="button"
                  onClick={handleToggleUrgent}
                  title="Click to remove Urgent Emergency Appeal status"
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1 animate-pulse transition-all cursor-pointer"
                >
                  <Flame className="w-3 h-3 fill-current" /> Urgent Appeal Active
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleUrgent}
                  title="Click to elevate to Urgent Emergency Appeal"
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-stone-900 hover:bg-red-950/60 text-stone-400 hover:text-red-300 border border-stone-800 hover:border-red-600 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-stone-500" /> + Mark Urgent
                </button>
              )}

              {initiative.status === 'SCHEDULED' && initiative.scheduled_publish_at && (
                <span className="text-[10px] text-amber-400 font-mono">
                  ⏰ Scheduled for {new Date(initiative.scheduled_publish_at).toLocaleString('en-IN')}
                </span>
              )}
              {initiative.status === 'SCHEDULED' && initiative.teaser_start_at && (
                <span className="text-[10px] text-amber-300/90 font-mono bg-stone-900 px-2 py-0.5 rounded border border-amber-500/30">
                  👀 Countdown visible from: {new Date(initiative.teaser_start_at).toLocaleString('en-IN')}
                </span>
              )}
              {initiative.status === 'PAUSED' && initiative.scheduled_publish_at && (
                <span className="text-[10px] text-amber-300 font-mono">
                  {new Date(initiative.scheduled_publish_at).getTime() > Date.now()
                    ? `⏸️ Paused (Scheduled for: ${new Date(initiative.scheduled_publish_at).toLocaleString('en-IN')})`
                    : '⚠️ Scheduled launch time reached'}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
              {initiative.title}
            </h1>
            <p className="text-xs text-stone-400">
              {initiative.city}, {initiative.state} • Sanctioned Budget: ₹{initiative.target_amount.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Quick Lifecycle Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {(() => {
              const isScheduledInFuture = Boolean(
                initiative.scheduled_publish_at && new Date(initiative.scheduled_publish_at).getTime() > Date.now()
              );

              if (initiative.status === 'PAUSED') {
                if (isScheduledInFuture) {
                  return (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('SCHEDULED')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm"
                    >
                      Unpause
                    </button>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('PUBLISHED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Publish
                    </button>
                  );
                }
              }

              if (initiative.status === 'SCHEDULED') {
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('PUBLISHED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Publish Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('PAUSED')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                    >
                      Pause
                    </button>
                  </>
                );
              }

              if (initiative.status === 'DRAFT') {
                return (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('PUBLISHED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Publish
                  </button>
                );
              }

              if (initiative.status === 'PUBLISHED') {
                return (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('PAUSED')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                  >
                    Pause
                  </button>
                );
              }

              return null;
            })()}

            {initiative.status !== 'CLOSED' && (
              <button
                type="button"
                onClick={() => handleStatusUpdate('CLOSED')}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Close
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-devotional-maroon to-stone-900 hover:brightness-110 text-amber-300 border border-amber-400/50 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Initiative
            </button>
          </div>
        </div>

        {/* Milestone Stage Advance Selector */}
        <div className="space-y-3 bg-stone-900/60 p-4 sm:p-5 rounded-2xl border border-stone-800">
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-devotional-saffron" /> Milestone & Construction Stage Controller
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {STAGE_STEPS.map((step) => {
              const isCurrent = initiative.current_stage === step.stage;
              return (
                <button
                  type="button"
                  key={step.stage}
                  onClick={() => handleStageUpdate(step.stage)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-devotional-maroon text-amber-200 border-amber-400 shadow-md ring-1 ring-amber-400 font-bold'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <span className="block text-[10px] text-stone-500 uppercase">Stage {step.stepNumber}</span>
                  <span className="font-serif">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Amount Raised</span>
            <span className="font-serif font-bold text-lg text-amber-400">
              ₹{initiative.current_raised.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-400 block">{percent}% of goal</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Sanctioned Goal</span>
            <span className="font-serif font-bold text-lg text-stone-200">
              ₹{initiative.target_amount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500 block">Trust Approved</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Disbursed</span>
            <span className="font-serif font-bold text-lg text-emerald-400">
              ₹{totalApproved.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-400 block">{utilization}% utilization</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold block">Escrow Balance</span>
            <span className="font-serif font-bold text-lg text-stone-200">
              ₹{Math.max(initiative.current_raised - totalApproved, 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500 block">Available unspent</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-stone-800 pt-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Overview & Budget
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EXPENSES')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'EXPENSES' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Expenses & Utilization ({initiative.expenses?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('UPDATES')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'UPDATES' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Field Updates ({initiative.updates?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('AUDIT')}
            className={`pb-3 border-b-2 transition-colors ${activeTab === 'AUDIT' ? 'border-amber-400 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'}`}
          >
            Audit Trail ({initiative.audit_logs?.length || 0})
          </button>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 pt-2">
            {/* Urgent Appeal & Priority Governance Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              initiative.is_urgent
                ? 'bg-gradient-to-r from-red-950/60 via-stone-900 to-stone-950 border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-stone-900/80 border-stone-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className={`w-4 h-4 ${initiative.is_urgent ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-400'}`} />
                      Emergency & Urgent Appeal Governance
                    </span>
                    {initiative.is_urgent ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-md animate-pulse flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 fill-current" /> Urgent Appeal Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-800 text-stone-400 border border-stone-700">
                        Priority: {initiative.priority || 'NORMAL'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                    Super Admin can toggle emergency appeal status anytime (even while published). When active, this initiative is highlighted with glowing emergency banners and automatically prioritized in devotee feeds and search filters.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleUrgent}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                      initiative.is_urgent
                        ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600'
                        : 'bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-white shadow-red-950/50'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {initiative.is_urgent ? 'Remove Urgent Status' : '⚡ Elevate to Urgent Appeal'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-stone-200">Description</h4>
              <p className="text-xs text-stone-400 leading-relaxed whitespace-pre-line">{initiative.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-stone-200">Itemized Budget Allocation</h4>
              <div className="space-y-2">
                {initiative.breakdown_items?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-200">{item.category}</p>
                      <p className="text-[10px] text-stone-500">{item.description}</p>
                    </div>
                    <p className="font-serif font-bold text-amber-400">₹{item.target_amount.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: EXPENSES */}
        {activeTab === 'EXPENSES' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-stone-200">Disbursed Expenses</h4>
              <button
                type="button"
                onClick={() => setShowExpenseModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Record
              </button>
            </div>

            {(!initiative.expenses || initiative.expenses.length === 0) ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {initiative.expenses.map((exp) => (
                  <div key={exp.id} className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-200">{exp.category}</span>
                        {exp.invoice_ref && (
                          <span className="font-mono text-[10px] text-amber-400 bg-stone-950 px-1.5 py-0.5 rounded">
                            {exp.invoice_ref}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400">{exp.description}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{exp.expense_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-emerald-400 text-sm">₹{exp.amount.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">{exp.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: UPDATES */}
        {activeTab === 'UPDATES' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-stone-200">Public Field Updates</h4>
              <button
                type="button"
                onClick={() => setShowUpdateModal(true)}
                className="px-3 py-1.5 rounded-xl bg-devotional-saffron hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Post
              </button>
            </div>

            {(!initiative.updates || initiative.updates.length === 0) ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No updates posted yet.</p>
            ) : (
              <div className="space-y-3">
                {initiative.updates.map((up) => (
                  <div key={up.id} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-amber-300">
                      <span>{up.title}</span>
                      <span className="text-[10px] text-stone-500">{new Date(up.posted_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-300 whitespace-pre-line leading-relaxed">{up.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: AUDIT */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-sm text-stone-200">Immutable Audit Log Trail</h4>
            {(!initiative.audit_logs || initiative.audit_logs.length === 0) ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No audit records.</p>
            ) : (
              <div className="space-y-2">
                {initiative.audit_logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-devotional-saffron text-[11px] font-bold">{log.action}</span>
                      <p className="text-stone-300 text-[11px] mt-0.5">{log.new_value}</p>
                    </div>
                    <span className="text-[10px] text-stone-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-amber-300">Record Itemized Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Expense Category</label>
                <input
                  type="text"
                  value={expenseCat}
                  onChange={(e) => setExpenseCat(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Amount Disbursed (₹)</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-serif font-bold text-base"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Invoice / Voucher Ref</label>
                <input
                  type="text"
                  value={expenseInvoice}
                  onChange={(e) => setExpenseInvoice(e.target.value)}
                  placeholder="INV-2026-XXXX"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Description</label>
                <textarea
                  rows={2}
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="Material vendor, milestone details..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Field Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-amber-300">Post Field Progress Update</h3>
            <form onSubmit={handleCreateUpdate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Update Headline</label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Sanctum Gopuram Kalasham Fixed"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Field Report Statement</label>
                <textarea
                  rows={3}
                  value={updateMsg}
                  onChange={(e) => setUpdateMsg(e.target.value)}
                  placeholder="Describe progress achieved, artisan count, next steps..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 font-bold uppercase text-[10px]">Photo URL (Optional)</label>
                <input
                  type="text"
                  value={updateImg}
                  onChange={(e) => setUpdateImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-devotional-saffron hover:bg-amber-600 text-white font-bold"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Initiative Details & Urgent Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-stone-950 p-6 sm:p-7 rounded-3xl border-2 border-devotional-gold/60 shadow-2xl space-y-5 text-xs text-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-200">
                    Edit Initiative Parameters
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {initiative.code} • Status: {initiative.status}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* URGENT EMERGENCY APPEAL CONTROLLER */}
              <div className={`p-4 rounded-2xl border transition-all ${
                editForm.is_urgent
                  ? 'bg-red-950/40 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Flame className={`w-4 h-4 ${editForm.is_urgent ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-500'}`} />
                      Urgent Emergency Appeal
                    </span>
                    <p className="text-[10px] text-stone-400">
                      Feature with urgent red banner across devotee portals and boost to top of giving drives.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !editForm.is_urgent;
                      setEditForm((prev) => ({
                        ...prev,
                        is_urgent: next,
                        priority: next ? 'URGENT' : (prev.priority === 'URGENT' ? 'NORMAL' : prev.priority),
                      }));
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editForm.is_urgent ? 'bg-red-600' : 'bg-stone-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editForm.is_urgent ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Priority Level */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase">Priority Ranking</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NORMAL', 'HIGH', 'URGENT'] as InitiativePriority[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setEditForm((prev) => ({ ...prev, priority: p, is_urgent: p === 'URGENT' ? true : prev.is_urgent }))}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        editForm.priority === p
                          ? p === 'URGENT'
                            ? 'bg-red-600 text-white border-red-500 shadow-md'
                            : 'bg-amber-600 text-white border-amber-500 shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Countdown Display Start Time if SCHEDULED */}
              {initiative.status === 'SCHEDULED' && (
                <div className="p-3.5 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-amber-300 uppercase flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-devotional-saffron" />
                      Countdown Display Start Time (Optional)
                    </label>
                    {editForm.teaser_start_at && (
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, teaser_start_at: '' }))}
                        className="text-[9px] text-amber-400 hover:text-red-400 font-bold underline"
                      >
                        Clear (Show Immediately)
                      </button>
                    )}
                  </div>
                  <input
                    type="datetime-local"
                    value={editForm.teaser_start_at}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, teaser_start_at: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-mono"
                  />
                  <p className="text-[10px] text-stone-400">
                    Devotees will only see the countdown clock in their portal starting from this timestamp. If cleared, countdown is visible immediately upon scheduling.
                  </p>
                </div>
              )}

              {/* Title & Short Title */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Initiative Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Short Title (Card Heading)</label>
                  <input
                    type="text"
                    value={editForm.short_title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, short_title: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Target Sanctioned Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Target Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={editForm.target_amount}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, target_amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">State</label>
                  <input
                    type="text"
                    required
                    value={editForm.state}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, state: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase">Objective / Emergency Purpose</label>
                <textarea
                  rows={2}
                  value={editForm.objective}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, objective: e.target.value }))}
                  placeholder="Sanctum consecration, urgent flood rehabilitation..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-800 text-stone-400 font-bold hover:bg-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold flex items-center justify-center gap-1.5 shadow-gold transition-all"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
