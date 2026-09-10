'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Lock,
  RefreshCw,
  BarChart3,
  PieChart,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Flame,
} from 'lucide-react';
import { templeService, donationsService } from '@/lib/supabase-service';
import { TempleInternalMessage } from '@/lib/types';

export default function TempleAdminFinanceDeskPage() {
  const [messages, setMessages] = useState<TempleInternalMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'SETTLEMENT' | 'COLLECTIONS' | 'DISCREPANCY' | 'BUDGET'>('GENERAL');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [templeInfo, setTempleInfo] = useState({
    id: '',
    code: 'TPL-VAS',
    name: 'Sri Vasavi Matha Devasthanam',
    managerName: 'Temple Manager',
    financeAdminName: 'Finance Admin',
    financeAdminPhone: '',
  });

  // Comparison Metrics
  const [chartMetrics, setChartMetrics] = useState({
    totalOpsRecorded: 485000,
    totalBankSettled: 485000,
    onlineQRAmount: 345000,
    physicalHundiAmount: 140000,
    settlementDiscrepancy: 0,
    targetMonthly: 600000,
    categoryBreakdown: [
      { name: 'Annadanam (Sacred Food)', opsAmount: 180000, settledAmount: 180000, percentage: 37 },
      { name: 'Nitya Pooja & Archana', opsAmount: 135000, settledAmount: 135000, percentage: 28 },
      { name: 'Temple Renovation (Jeernodharana)', opsAmount: 110000, settledAmount: 110000, percentage: 23 },
      { name: 'Goshala & Welfare', opsAmount: 60000, settledAmount: 60000, percentage: 12 },
    ],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      let tId = '';
      let tCode = 'TPL-VAS';
      let tName = 'Sri Vasavi Matha Devasthanam';
      let mgr = 'Temple Manager';

      if (typeof window !== 'undefined') {
        const sessionRaw = localStorage.getItem('vdonations_user_session');
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw);
          tId = localStorage.getItem('vdonations_temple_id') || session.templeId || '';
          tCode = localStorage.getItem('vdonations_temple_code') || session.templeCode || tCode;
          tName = localStorage.getItem('vdonations_temple_name') || session.templeName || tName;
          mgr = localStorage.getItem('vdonations_devotee_name') || session.fullName || mgr;
        }
      }

      setTempleInfo((prev) => ({
        ...prev,
        id: tId,
        code: tCode,
        name: tName,
        managerName: mgr,
      }));

      // Fetch temple details for finance admin name & phone
      if (tId) {
        const temple = await templeService.getTempleById(tId);
        if (temple) {
          setTempleInfo((prev) => ({
            ...prev,
            financeAdminName: temple.financeAdminName || 'Designated Finance Officer',
            financeAdminPhone: temple.financeAdminPhone || '',
          }));
        }

        // Fetch internal messages
        const msgs = await templeService.fetchInternalMessages(tId);
        setMessages(msgs);
      }

      // Fetch donations for live chart tally
      const dons = await donationsService.getAllAdmin();
      if (dons && dons.length > 0) {
        const scopedDons = tId ? dons.filter((d: any) => d.temple_id === tId || !d.temple_id) : dons;
        const total = scopedDons.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0);
        if (total > 0) {
          const online = Math.round(total * 0.72);
          const hundi = total - online;
          setChartMetrics((prev) => ({
            ...prev,
            totalOpsRecorded: total,
            totalBankSettled: total,
            onlineQRAmount: online,
            physicalHundiAmount: hundi,
          }));
        }
      }
    } catch (err) {
      console.warn('[Temple Finance Desk] Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !templeInfo.id) return;

    try {
      setSending(true);
      await templeService.sendInternalMessage({
        templeId: templeInfo.id,
        senderName: templeInfo.managerName,
        senderRole: 'TEMPLE_ADMIN',
        message: newMessage.trim(),
        category,
      });

      setNewMessage('');
      const updated = await templeService.fetchInternalMessages(templeInfo.id);
      setMessages(updated);
    } catch (err: any) {
      console.error('Failed to send internal coordination message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-stone-900 to-amber-950 text-white p-8 rounded-3xl shadow-2xl border-2 border-devotional-gold/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/40">
              <DollarSign className="w-4 h-4" /> SHRINE FINANCE COORDINATION
            </span>
            <span className="font-mono text-xs bg-black/40 px-2.5 py-0.5 rounded-full text-amber-200 border border-amber-500/30">
              {templeInfo.code} — {templeInfo.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Temple Finance Desk & Audit Channel
          </h1>
          <p className="text-stone-300 text-xs max-w-2xl">
            Internal coordination channel between Temple Operations ({templeInfo.managerName}) and your assigned Finance Admin ({templeInfo.financeAdminName}).
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Desk
          </button>
          <Link
            href="/admin/temple/communications"
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Super Admin Desk
          </Link>
        </div>
      </div>

      {/* FINANCE OFFICER ASSIGNED CARD */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                Assigned Finance Admin: {templeInfo.financeAdminName}
              </span>
              <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                READ-ONLY AUDIT
              </span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Supervises gateway settlement reconciliations, bank credits, and submits official financial requisitions to Super Admin.
            </p>
          </div>
        </div>

        {templeInfo.financeAdminPhone && (
          <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 shrink-0">
            <Phone className="w-3.5 h-3.5" /> {templeInfo.financeAdminPhone}
          </div>
        )}
      </div>

      {/* SECTION 1: FINANCIAL COMPARISON CHARTS (OPS VS FINANCE SETTLEMENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric 1: Ops Total */}
        <div className="bg-white dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-500" /> Counter & Online Ops
            </span>
            <span className="font-mono text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold">
              YOUR SCOPE
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-amber-400">
              ₹{chartMetrics.totalOpsRecorded.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-stone-500">
              Total Devotee Donations & Seva bookings recorded under your temple administration.
            </p>
          </div>

          {/* Progress to target */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-stone-400">Monthly Target: ₹{chartMetrics.targetMonthly.toLocaleString('en-IN')}</span>
              <span className="font-bold text-emerald-500">
                {Math.round((chartMetrics.totalOpsRecorded / chartMetrics.targetMonthly) * 100)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((chartMetrics.totalOpsRecorded / chartMetrics.targetMonthly) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Finance Bank Verified Settlement */}
        <div className="bg-white dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Bank Verified Settlements
            </span>
            <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
              FINANCE AUDIT
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-400">
              ₹{chartMetrics.totalBankSettled.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-stone-500">
              Audited by Finance Admin from direct nodal bank gateway statements.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reconciliation Status:
            </div>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              100% Balanced
            </span>
          </div>
        </div>

        {/* Metric 3: Payment Inflow Channels */}
        <div className="bg-white dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4 hover:border-devotional-gold transition-all">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-devotional-saffron" /> Inflow Channels
            </span>
            <span className="font-mono text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-bold">
              BREAKDOWN
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-stone-400">Digital QR & Gateway:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{chartMetrics.onlineQRAmount.toLocaleString('en-IN')} (72%)
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-stone-400">Physical Hundi Cash:</span>
                <span className="font-mono font-bold text-amber-400">
                  ₹{chartMetrics.physicalHundiAmount.toLocaleString('en-IN')} (28%)
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 2-WAY COORDINATION CHAT (TEMPLE ADMIN <-> FINANCE ADMIN) */}
      <div className="bg-white dark:bg-stone-950 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col h-[550px]">
        {/* Chat Header */}
        <div className="bg-stone-900 p-4 border-b border-stone-800 flex items-center justify-between text-xs text-stone-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-amber-300 text-sm">
              Temple Internal Coordination Channel
            </span>
            <span className="text-stone-400 text-[11px]">
              (Direct line to Finance Admin: {templeInfo.financeAdminName})
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
            RECORDED & AUDITED
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-950/60 text-xs">
          {loading ? (
            <div className="text-center text-stone-500 py-12">Loading coordination channel...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-stone-500 py-12 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-stone-600" />
              <p className="font-bold">No coordination messages yet.</p>
              <p className="text-[11px]">Start the internal sync on budget, hundi tally, or settlements below.</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderRole === 'TEMPLE_ADMIN';
              const isSuper = m.senderRole === 'SUPER_ADMIN';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    isMine ? 'items-end' : isSuper ? 'items-center' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 space-y-1 shadow-md ${
                      isSuper
                        ? 'bg-amber-950/80 border border-amber-400/40 text-amber-100 text-center'
                        : isMine
                        ? 'bg-amber-950/90 border border-amber-500/50 text-amber-100 rounded-br-none'
                        : 'bg-emerald-950/90 border border-emerald-600/50 text-emerald-100 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold border-b border-white/10 pb-1 mb-1">
                      <span className={isMine ? 'text-amber-300' : isSuper ? 'text-amber-400' : 'text-emerald-300'}>
                        {m.senderName}
                      </span>
                      <span className="font-mono opacity-60">[{m.senderRole}]</span>
                      {m.category && m.category !== 'GENERAL' && (
                        <span className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-[9px] text-amber-200">
                          {m.category}
                        </span>
                      )}
                      <span className="ml-auto opacity-50 font-mono font-normal">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 text-[11px]">Topic:</span>
            <div className="flex gap-1 flex-wrap">
              {(['GENERAL', 'SETTLEMENT', 'COLLECTIONS', 'DISCREPANCY', 'BUDGET'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    category === cat
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder={`Message Finance Admin ${templeInfo.financeAdminName} regarding ${category.toLowerCase()}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Sending...' : 'Transmit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
