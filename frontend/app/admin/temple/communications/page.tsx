'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Flame,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { templeService } from '@/lib/supabase-service';
import { TempleManagementRequest } from '@/lib/types';

export default function TempleManagerCommunicationsPage() {
  const [templeId, setTempleId] = useState<string>('');
  const [templeCode, setTempleCode] = useState<string>('TPL-VASAVI-001');
  const [templeName, setTempleName] = useState<string>('Sri Vasavi Kanyaka Parameswari Matha');
  const [managerName, setManagerName] = useState<string>('Temple Manager');
  const [managerPhone, setManagerPhone] = useState<string>('');

  const [requests, setRequests] = useState<TempleManagementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [requestType, setRequestType] = useState<TempleManagementRequest['requestType']>('SEVA_QUOTA');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<TempleManagementRequest['urgency']>('NORMAL');

  const loadRequests = async (tId?: string) => {
    try {
      setLoading(true);
      const data = await templeService.fetchTempleManagementRequests(tId || undefined);
      setRequests(data);
    } catch (err: any) {
      console.error('Error fetching temple requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('vdonations_temple_id') || '';
      const storedCode = localStorage.getItem('vdonations_temple_code') || 'TPL-VASAVI-001';
      const storedName = localStorage.getItem('vdonations_temple_name') || 'Sri Vasavi Kanyaka Parameswari Matha';
      const storedManager = localStorage.getItem('vdonations_devotee_name') || 'Temple Manager';
      const storedPhone = localStorage.getItem('vdonations_devotee_mobile') || '';

      setTempleId(storedId);
      setTempleCode(storedCode);
      setTempleName(storedName);
      setManagerName(storedManager);
      setManagerPhone(storedPhone);

      loadRequests(storedId);
    }
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter both subject and description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await templeService.createTempleManagementRequest({
        templeId: templeId || 'a0000000-0000-0000-0000-000000000001',
        templeCode,
        templeName,
        managerName,
        managerPhone,
        requestType,
        title: title.trim(),
        description: description.trim(),
        urgency,
      });

      setSuccessMsg('✓ Sacred request transmitted directly to Super Admin RAKESH! You will be notified when reviewed.');
      setTitle('');
      setDescription('');
      loadRequests(templeId);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit temple request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: TempleManagementRequest['status']) => {
    switch (status) {
      case 'APPROVED':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" /> Approved by Super Admin
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[10px] font-bold">
            <Clock className="w-3 h-3" /> Under Super Admin Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] font-bold">
            <AlertCircle className="w-3 h-3" /> Declined / Feedback Provided
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
            <Clock className="w-3 h-3" /> Pending Super Admin Action
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-devotional-saffron" /> Direct Super Admin Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Temple Management & Governance Channel
          </h1>
          <p className="text-amber-100/80 text-xs">
            Direct communication link between {templeName} ({templeCode}) and Super Admin RAKESH
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 bg-black/40 px-4 py-2.5 rounded-2xl border border-amber-400/30 text-xs text-amber-200">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Restricted to {templeCode}</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submit New Request to Super Admin */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-950 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Submit Request to Super Admin
              </h2>
              <p className="text-[11px] text-stone-500">Fast-track reviews, approvals & shrine changes</p>
            </div>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Category / Intent *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
              >
                <option value="SEVA_QUOTA">Seva Quota & Devotee Slot Expansion</option>
                <option value="FESTIVAL_EVENT">Special Festival / Brahmotsavam Event</option>
                <option value="PROFILE_UPDATE">Shrine Profile, Deity or Timings Update</option>
                <option value="FINANCIAL_QR">Bank Account / UPI QR Setup</option>
                <option value="GENERAL_INQUIRY">General Administrative Query / Support</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Subject / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Request 50 additional slots for Navaratri Homam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                      urgency === lvl
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                        : 'border-stone-300 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Detailed Description & Context *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide detailed breakdown, proposed dates, devotee estimates, or rationale..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Transmitting...' : 'Send Request to Super Admin'}
            </button>
          </form>
        </div>

        {/* Right Column: Communication History & Super Admin Responses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-500" /> Requests & Super Admin Responses
            </h2>
            <button
              onClick={() => loadRequests(templeId)}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              Refresh Status
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-stone-400 text-xs bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800">
              Loading requests and governance log...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center space-y-2 bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
              <HelpCircle className="w-8 h-8 mx-auto text-amber-400/60" />
              <p className="font-bold">No requests submitted yet.</p>
              <p className="text-[11px]">
                Use the form to request Seva Quotas, Festival schedules, or administrative changes from Super Admin RAKESH.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-stone-950 p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-md space-y-4 hover:border-amber-400/60 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                          {req.requestType.replace('_', ' ')}
                        </span>
                        {req.urgency !== 'NORMAL' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/30">
                            {req.urgency} PRIORITY
                          </span>
                        )}
                        <span className="text-[11px] text-stone-400">
                          {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mt-1">
                        {req.title}
                      </h3>
                    </div>

                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                    {req.description}
                  </p>

                  {/* Super Admin Reply Card */}
                  {req.superAdminReply ? (
                    <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-400/40 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          Official Response from {req.repliedBy || 'Super Admin RAKESH'}
                        </span>
                        {req.repliedAt && (
                          <span className="text-stone-400 text-[10px]">
                            {new Date(req.repliedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 italic whitespace-pre-wrap">
                        "{req.superAdminReply}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-400 italic flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      Awaiting Super Admin RAKESH review & remarks...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
