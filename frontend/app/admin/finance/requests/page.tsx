'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Plus,
  RefreshCw,
  MessageSquare,
  Lock,
  Flame,
} from 'lucide-react';
import { templeService } from '@/lib/supabase-service';
import { TempleManagementRequest } from '@/lib/types';

export default function FinanceAdminRequestsPage() {
  const [requests, setRequests] = useState<TempleManagementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [templeInfo, setTempleInfo] = useState({
    id: '',
    code: 'TPL-VAS',
    name: 'Sri Vasavi Matha Devasthanam',
    officerName: 'Finance Officer',
    phone: '',
  });

  // Form State
  const [requestType, setRequestType] = useState<
    'SEVA_QUOTA' | 'PROFILE_UPDATE' | 'FESTIVAL_EVENT' | 'FINANCIAL_QR' | 'GENERAL_INQUIRY'
  >('FINANCIAL_QR');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  const loadRequests = async () => {
    try {
      setLoading(true);
      let tId = '';
      let tCode = 'TPL-VAS';
      let tName = 'Sri Vasavi Matha Devasthanam';
      let officer = 'Finance Officer';
      let ph = '';

      if (typeof window !== 'undefined') {
        const sessionRaw = localStorage.getItem('vdonations_user_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          tId = localStorage.getItem('vdonations_temple_id') || session.templeId || '';
          tCode = localStorage.getItem('vdonations_temple_code') || session.templeCode || tCode;
          tName = localStorage.getItem('vdonations_temple_name') || session.templeName || tName;
          officer = localStorage.getItem('vdonations_devotee_name') || session.fullName || officer;
          ph = localStorage.getItem('vdonations_devotee_mobile') || session.mobile || '';
        }
      }

      setTempleInfo({ id: tId, code: tCode, name: tName, officerName: officer, phone: ph });

      const all = await templeService.fetchTempleManagementRequests(tId || undefined);
      setRequests(all);
    } catch (err: any) {
      console.warn('[Finance Requests] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const handleTempleChange = () => {
      loadRequests();
    };
    window.addEventListener('vdonations_finance_temple_changed', handleTempleChange);
    return () => {
      window.removeEventListener('vdonations_finance_temple_changed', handleTempleChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter both request subject and details.' });
      return;
    }

    try {
      setSubmitting(true);
      setStatusMsg(null);

      await templeService.createTempleManagementRequest({
        templeId: templeInfo.id || '00000000-0000-0000-0000-000000000000',
        templeCode: templeInfo.code,
        templeName: templeInfo.name,
        managerId: undefined,
        managerName: templeInfo.officerName,
        managerPhone: templeInfo.phone,
        senderRole: 'FINANCE_ADMIN',
        requestType,
        title: title.trim(),
        description: description.trim(),
        urgency,
      });

      setStatusMsg({
        type: 'success',
        text: '✓ Financial inquiry/request successfully transmitted to Super Admin RAKESH!',
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setUrgency('NORMAL');
      loadRequests();
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit request to Super Admin.' });
    } finally {
      setSubmitting(false);
    }
  };

  const financeRequests = requests.filter((r) => r.senderRole === 'FINANCE_ADMIN');

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-8 rounded-3xl shadow-2xl border-2 border-emerald-500/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-400/40">
              <DollarSign className="w-4 h-4" /> {templeInfo.code} FINANCE GOVERNANCE
            </span>
            <span className="font-mono text-xs bg-emerald-900/80 px-2.5 py-0.5 rounded-full text-emerald-200 border border-emerald-700">
              {templeInfo.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Submit Request to Super Admin
          </h1>
          <p className="text-emerald-100/80 text-xs max-w-2xl">
            Official line of communication for Finance Admins. Submit settlement escalations, bank reconciliation discrepancies, gateway payout requisitions, and audit clarification requests.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> New Financial Request
          </button>
          <button
            onClick={loadRequests}
            className="p-2.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 transition-all"
            title="Refresh Requests"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
              : 'bg-red-950/80 border border-red-500 text-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* READ-ONLY & PROTOCOL NOTICE */}
      <div className="p-4 rounded-2xl bg-stone-900/90 border border-emerald-500/30 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Every financial request is logged in the permanent Devasthanam Audit Trail and routed straight to <strong>Super Admin RAKESH</strong>.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400 font-bold">
          TOTAL TRANSMISSIONS: {financeRequests.length}
        </span>
      </div>

      {/* REQUESTS LIST */}
      <div className="space-y-4">
        <h2 className="text-base font-serif font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          Submitted Inquiries & Official Directives ({financeRequests.length})
        </h2>

        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800">
            Fetching financial requests from Supabase...
          </div>
        ) : financeRequests.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
            <DollarSign className="w-8 h-8 mx-auto text-emerald-500/60" />
            <p className="font-bold text-stone-300">No requests submitted yet.</p>
            <p className="text-[11px] text-stone-500">
              Need assistance with payouts, gateway reconciliation, or budget approval? Click "New Financial Request" above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {financeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-stone-950 p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 space-y-4 shadow-xl hover:border-emerald-500/60 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {req.requestType}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        URGENCY: {req.urgency}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Filed on {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-amber-300 mt-1.5">
                      {req.title}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : req.status === 'RESOLVED'
                        ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                        : req.status === 'REJECTED'
                        ? 'bg-red-950 text-red-300 border-red-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40 animate-pulse'
                    }`}
                  >
                    STATUS: {req.status}
                  </span>
                </div>

                <p className="text-stone-600 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                  {req.description}
                </p>

                {/* Super Admin Response Box */}
                {req.superAdminReply && (
                  <div className="p-4 rounded-2xl bg-amber-400/10 dark:bg-amber-950/40 border border-amber-400/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        Official Directive from {req.repliedBy || 'Super Admin RAKESH'}:
                      </span>
                      {req.repliedAt && (
                        <span className="text-stone-500 dark:text-stone-400 font-normal font-mono text-[10px]">
                          {new Date(req.repliedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-800 dark:text-stone-100 italic whitespace-pre-wrap font-serif">
                      "{req.superAdminReply}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: SUBMIT NEW FINANCIAL REQUEST */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-950 border-2 border-emerald-500/60 rounded-3xl p-6 space-y-4 text-xs shadow-2xl text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold text-base">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit Request to Super Admin</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Financial Request Category *</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                >
                  <option value="FINANCIAL_QR">Financial & Payment Gateway Reconciliation</option>
                  <option value="GENERAL_INQUIRY">Bank Payout Clearance & Settlement Requisition</option>
                  <option value="SEVA_QUOTA">Hundi Cash & Physical Collection Discrepancy</option>
                  <option value="PROFILE_UPDATE">Major Budget & Capital Expenditure Requisition</option>
                  <option value="FESTIVAL_EVENT">Special Festival / Utsavam Financial Budget</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Urgency Level *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NORMAL', 'HIGH', 'URGENT'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                        urgency === lvl
                          ? lvl === 'URGENT'
                            ? 'bg-red-500 text-white'
                            : lvl === 'HIGH'
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-emerald-500 text-stone-950'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Request Subject / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gateway settlement discrepancy for Brahmotsavam donations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Detailed Explanation & Figures *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the discrepancy, payout reference numbers, dates, exact sums, or reason for request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-serif font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Transmitting...' : 'Send Request to Super Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
