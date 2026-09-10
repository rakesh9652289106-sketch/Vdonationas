'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  ShieldCheck,
  Flame,
  KeyRound,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { templeService, generateHighEntropyNumberPassword } from '@/lib/supabase-service';
import { Temple, TempleManagementRequest } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';

export default function SuperAdminTemplesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'directory' | 'requests'>('directory');
  const [temples, setTemples] = useState<Temple[]>([]);
  const [requests, setRequests] = useState<TempleManagementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected Temple for Password Reset Modal
  const [resetModalTemple, setResetModalTemple] = useState<Temple | null>(null);
  const [resetTargetRole, setResetTargetRole] = useState<'manager' | 'finance'>('manager');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPw, setResettingPw] = useState(false);

  // Selected Request for Super Admin Reply Modal / Panel
  const [selectedRequest, setSelectedRequest] = useState<TempleManagementRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<'APPROVED' | 'RESOLVED' | 'REJECTED' | 'IN_REVIEW'>('APPROVED');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Filters
  const [selectedTempleFilter, setSelectedTempleFilter] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'TEMPLE_ADMIN' | 'FINANCE_ADMIN'>('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const [allTemples, allRequests] = await Promise.all([
        templeService.getAllTemples(),
        templeService.fetchTempleManagementRequests(),
      ]);
      setTemples(allTemples);
      setRequests(allRequests);
    } catch (err: any) {
      console.error('Error loading super admin temple data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerification = async (temple: Temple) => {
    const nextStatus = temple.verificationStatus === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
    try {
      await templeService.updateTempleVerificationStatus(temple.id, nextStatus as any);
      setStatusMsg({
        type: 'success',
        text: `✓ ${temple.name} status updated to ${nextStatus}`,
      });
      loadData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update status' });
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalTemple || !newPassword.trim()) return;

    try {
      setResettingPw(true);
      if (resetTargetRole === 'finance') {
        await templeService.adminResetFinancePassword(resetModalTemple.id, newPassword.trim());
        setStatusMsg({
          type: 'success',
          text: `✓ Finance Admin password for ${resetModalTemple.name} successfully updated!`,
        });
      } else {
        await templeService.adminResetManagerPassword(resetModalTemple.id, newPassword.trim());
        setStatusMsg({
          type: 'success',
          text: `✓ Manager password for ${resetModalTemple.name} successfully updated!`,
        });
      }
      setResetModalTemple(null);
      setNewPassword('');
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to reset password' });
    } finally {
      setResettingPw(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !replyText.trim()) return;

    try {
      setSubmittingReply(true);
      await templeService.replyTempleManagementRequest(
        selectedRequest.id,
        replyText.trim(),
        replyStatus,
        'Super Admin RAKESH'
      );
      const recipientDesc = selectedRequest.senderRole === 'FINANCE_ADMIN' ? 'Finance Admin' : 'Manager';
      setStatusMsg({
        type: 'success',
        text: `✓ Official decision & remarks transmitted to ${selectedRequest.templeName} ${recipientDesc}!`,
      });
      setSelectedRequest(null);
      setReplyText('');
      loadData();
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to submit official response' });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLoginAsTempleAdmin = (temple: Temple) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vdonations_active_role', 'TEMPLE_ADMIN');
      localStorage.setItem('vdonations_temple_id', temple.id);
      localStorage.setItem('vdonations_temple_code', temple.code);
      localStorage.setItem('vdonations_temple_name', temple.name);
      localStorage.setItem('vdonations_devotee_name', temple.managerName || 'Temple Manager');
      router.push('/admin/temple/dashboard');
    }
  };

  const handleLoginAsFinanceAdmin = (temple: Temple) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vdonations_active_role', 'FINANCE_ADMIN');
      localStorage.setItem('vdonations_temple_id', temple.id);
      localStorage.setItem('vdonations_temple_code', temple.code);
      localStorage.setItem('vdonations_temple_name', temple.name);
      localStorage.setItem('vdonations_devotee_name', temple.financeAdminName || 'Finance Officer');
      router.push('/admin/finance/dashboard');
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING' || r.status === 'IN_REVIEW').length;

  const filteredRequests = requests.filter((r) => {
    const matchTemple = selectedTempleFilter === 'ALL' || r.templeCode === selectedTempleFilter;
    const matchRole = selectedRoleFilter === 'ALL' || (r.senderRole || 'TEMPLE_ADMIN') === selectedRoleFilter;
    return matchTemple && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarManageTemples')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Platform Temple Directory & Governance
          </h1>
          <p className="text-amber-100/80 text-xs">
            Multi-Tenant Devasthanam Registry, Designated Manager Provisioning & Direct Super Admin Governance Channel
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={loadData}
            title="Refresh Directory"
            className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/super/temples/create"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0"
          >
            <Plus className="w-4 h-4 text-devotional-maroon" /> Onboard New Temple Shrine
          </Link>
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

      {/* TABS & STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
          <span className="text-[11px] text-stone-400 block font-medium">Total Registered Temples</span>
          <span className="font-serif font-bold text-2xl text-amber-300">{temples.length}</span>
        </div>
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
          <span className="text-[11px] text-stone-400 block font-medium">Active & Verified Shrines</span>
          <span className="font-serif font-bold text-2xl text-emerald-400">
            {temples.filter((t) => t.verificationStatus === 'VERIFIED').length}
          </span>
        </div>
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
          <span className="text-[11px] text-stone-400 block font-medium">Designated Temple Managers</span>
          <span className="font-serif font-bold text-2xl text-stone-200">
            {temples.filter((t) => t.managerPhone || t.managerName).length}
          </span>
        </div>
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
          <span className="text-[11px] text-stone-400 block font-medium">Pending Manager Requests</span>
          <span className="font-serif font-bold text-2xl text-amber-500 flex items-center gap-2">
            {pendingRequestsCount}
            {pendingRequestsCount > 0 && (
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 animate-pulse border border-amber-500/40">
                Action Needed
              </span>
            )}
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-5 py-2.5 rounded-2xl font-serif font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'bg-amber-400 text-stone-950 shadow-gold'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Temples Directory ({temples.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-2.5 rounded-2xl font-serif font-bold text-xs transition-all flex items-center gap-2 relative ${
            activeTab === 'requests'
              ? 'bg-amber-400 text-stone-950 shadow-gold'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Temple Governance Requests ({requests.length})</span>
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SHRINES DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-stone-400 text-xs bg-stone-950 rounded-3xl border border-stone-800">
              Loading temple directory from Supabase...
            </div>
          ) : temples.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs bg-stone-950 rounded-3xl border border-stone-800 space-y-3">
              <Building2 className="w-8 h-8 mx-auto text-amber-400/60" />
              <p className="font-bold text-stone-200">No temples found.</p>
              <Link
                href="/admin/super/temples/create"
                className="inline-block px-4 py-2 bg-amber-400 text-stone-950 font-bold rounded-xl text-xs"
              >
                Onboard First Temple
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {temples.map((temple) => (
                <div
                  key={temple.id}
                  className="bg-stone-950 p-6 rounded-3xl border-2 border-stone-800 hover:border-amber-400/80 shadow-xl transition-all space-y-4"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                          {temple.code}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {temple.city}, {temple.state}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-stone-100 mt-1.5">
                        {temple.name}
                      </h3>
                      <p className="text-xs text-amber-200/80 font-medium">
                        {temple.deity}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleVerification(temple)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 shrink-0 transition-all ${
                        temple.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                          : 'bg-red-950 text-red-300 border-red-500/40 hover:bg-red-900'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" /> {temple.verificationStatus}
                    </button>
                  </div>

                  {/* Dual Leadership Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Manager Assigned Card */}
                    <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-400 text-[10px]">
                        <span>Temple Manager:</span>
                        <span className="font-mono text-[9px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold">
                          MANAGER
                        </span>
                      </div>
                      <div className="flex flex-col pt-0.5">
                        <span className="font-bold text-stone-200 truncate">
                          {temple.managerName || 'Assigned Manager'}
                        </span>
                        <span className="font-mono text-amber-300 flex items-center gap-1 font-bold text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                          {temple.managerPhone || temple.contactPhone || 'No Phone'}
                        </span>
                      </div>
                    </div>

                    {/* Finance Admin Card */}
                    <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-400 text-[10px]">
                        <span>Finance Officer:</span>
                        <span className="font-mono text-[9px] bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                          FINANCE
                        </span>
                      </div>
                      <div className="flex flex-col pt-0.5">
                        <span className="font-bold text-stone-200 truncate">
                          {temple.financeAdminName || 'Assigned Finance Officer'}
                        </span>
                        <span className="font-mono text-emerald-300 flex items-center gap-1 font-bold text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                          {temple.financeAdminPhone || 'No Phone'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setResetModalTemple(temple);
                        setResetTargetRole('manager');
                        setNewPassword('');
                      }}
                      className="py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-400/30 font-semibold text-[11px] flex items-center justify-center gap-1 transition-all"
                      title="Reset Manager or Finance Admin password"
                    >
                      <KeyRound className="w-3 h-3" /> Reset Pass
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTempleFilter(temple.code);
                        setActiveTab('requests');
                      }}
                      className="py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 font-semibold text-[11px] flex items-center justify-center gap-1 transition-all"
                    >
                      <MessageSquare className="w-3 h-3 text-amber-400" /> Requests
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoginAsTempleAdmin(temple)}
                      className="py-2 px-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold text-[11px] flex items-center justify-center gap-1 transition-all"
                      title="Inspect Portal as Temple Manager"
                    >
                      <ExternalLink className="w-3 h-3" /> Manager Portal
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoginAsFinanceAdmin(temple)}
                      className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] flex items-center justify-center gap-1 transition-all"
                      title="Inspect Portal as Finance Admin"
                    >
                      <ShieldCheck className="w-3 h-3" /> Finance Portal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEMPLE GOVERNANCE & REQUESTS CHANNEL */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Shrine:</span>
                <select
                  value={selectedTempleFilter}
                  onChange={(e) => setSelectedTempleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-medium text-xs"
                >
                  <option value="ALL">All Temples ({temples.length})</option>
                  {temples.map((t) => (
                    <option key={t.id} value={t.code}>
                      {t.code} — {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Desk:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-medium text-xs"
                >
                  <option value="ALL">All Desks ({requests.length})</option>
                  <option value="TEMPLE_ADMIN">🛕 Temple Manager Desks ({requests.filter(r => (r.senderRole || 'TEMPLE_ADMIN') === 'TEMPLE_ADMIN').length})</option>
                  <option value="FINANCE_ADMIN">💰 Finance Admin Desks ({requests.filter(r => r.senderRole === 'FINANCE_ADMIN').length})</option>
                </select>
              </div>
            </div>

            <span className="text-[11px] text-stone-400 font-mono">
              Showing {filteredRequests.length} requests
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs bg-stone-950 rounded-3xl border border-stone-800 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-amber-400/40" />
              <p className="font-bold">No requests found for this filter.</p>
              <p className="text-[11px]">Temple managers and finance admins will send inquiries, quota requests, and notices here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-stone-950 p-6 rounded-3xl border-2 border-stone-800 space-y-4 shadow-lg hover:border-amber-400/60 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                          {req.templeCode}
                        </span>
                        <span className="font-bold text-xs text-stone-300">
                          {req.templeName}
                        </span>
                        {req.senderRole === 'FINANCE_ADMIN' ? (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            💰 FINANCE DESK
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            🛕 MANAGER DESK
                          </span>
                        )}
                        <span className="text-[11px] text-stone-400">
                          Sender: {req.managerName} ({req.managerPhone || 'N/A'})
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-amber-300 mt-1">
                        {req.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          req.status === 'APPROVED' || req.status === 'RESOLVED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : req.status === 'REJECTED'
                            ? 'bg-red-950 text-red-300 border-red-500/40'
                            : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {req.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setReplyText(req.superAdminReply || '');
                          setReplyStatus(req.status === 'PENDING' ? 'APPROVED' : (req.status as any));
                        }}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-bold text-xs transition-all shadow-sm"
                      >
                        {req.superAdminReply ? 'Edit Decision' : 'Review & Reply'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {req.description}
                  </p>

                  {/* Super Admin Existing Reply */}
                  {req.superAdminReply && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-400/40 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
                        <span>Official Reply from {req.repliedBy || 'Super Admin RAKESH'}:</span>
                        {req.repliedAt && (
                          <span className="text-stone-400 font-normal">
                            {new Date(req.repliedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-200 italic whitespace-pre-wrap">
                        "{req.superAdminReply}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: RESET ADMINISTRATIVE PASSWORD */}
      {resetModalTemple && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-950 border-2 border-amber-400/60 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base">
                <KeyRound className="w-5 h-5 text-devotional-saffron" />
                <span>Reset Administrative Password</span>
              </div>
              <button
                onClick={() => setResetModalTemple(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Target Role Selector */}
            <div className="grid grid-cols-2 gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800">
              <button
                type="button"
                onClick={() => setResetTargetRole('manager')}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  resetTargetRole === 'manager'
                    ? 'bg-amber-400 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🛕 Temple Manager
              </button>
              <button
                type="button"
                onClick={() => setResetTargetRole('finance')}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  resetTargetRole === 'finance'
                    ? 'bg-emerald-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                💰 Finance Admin
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 block">Target Temple Shrine:</span>
              <span className="font-bold text-stone-100">{resetModalTemple.name} ({resetModalTemple.code})</span>
              {resetTargetRole === 'manager' ? (
                <div className="pt-1 text-[11px]">
                  <span className="text-amber-400 font-bold block">Assigned Manager: {resetModalTemple.managerName || 'N/A'}</span>
                  <span className="text-stone-400 font-mono">Login Mobile: {resetModalTemple.managerPhone || resetModalTemple.contactPhone || 'N/A'}</span>
                </div>
              ) : (
                <div className="pt-1 text-[11px]">
                  <span className="text-emerald-400 font-bold block">Finance Officer: {resetModalTemple.financeAdminName || 'N/A'}</span>
                  <span className="text-stone-400 font-mono">Login Mobile: {resetModalTemple.financeAdminPhone || 'N/A'}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-300">New Password *</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateHighEntropyNumberPassword())}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalTemple(null)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {resettingPw ? 'Updating Password...' : `Save New ${resetTargetRole === 'manager' ? 'Manager' : 'Finance'} Password`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUPER ADMIN OFFICIAL REPLY */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-950 border-2 border-amber-400/60 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-devotional-saffron" />
                <span>Super Admin Official Decision</span>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
              <span className="font-mono text-[10px] text-amber-400 font-bold">
                {selectedRequest.templeCode} — {selectedRequest.templeName}
              </span>
              <h4 className="font-serif font-bold text-sm text-stone-100">{selectedRequest.title}</h4>
              <p className="text-stone-400 text-[11px] line-clamp-3">{selectedRequest.description}</p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Decision / Status *</label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                >
                  <option value="APPROVED">APPROVED — Grant request & authorize shrine changes</option>
                  <option value="RESOLVED">RESOLVED — Issue addressed successfully</option>
                  <option value="IN_REVIEW">IN REVIEW — Under evaluation / additional input needed</option>
                  <option value="REJECTED">REJECTED — Declined with explanation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Official Remarks / Directions to Manager *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State official directive, quota slot approval confirmation, or reason for decision..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold flex items-center gap-2 shadow-gold disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingReply ? 'Transmitting...' : 'Send Decision to Manager'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
