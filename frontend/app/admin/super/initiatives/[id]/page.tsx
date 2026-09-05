'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Initiative,
  InitiativeStage,
  InitiativeStatus,
  getInitiativeByCode,
  updateInitiativeStatus,
  updateInitiativeStage,
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
} from 'lucide-react';

export default function AdminInitiativeManagePage() {
  const params = useParams();
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();
  const code = (params?.id as string) || '';

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES' | 'UPDATES' | 'AUDIT'>('OVERVIEW');

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
            <div className="flex items-center gap-2">
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
              {initiative.status === 'SCHEDULED' && initiative.scheduled_publish_at && (
                <span className="text-[10px] text-amber-400 font-mono">
                  ⏰ Scheduled for {new Date(initiative.scheduled_publish_at).toLocaleString('en-IN')}
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
    </div>
  );
}
