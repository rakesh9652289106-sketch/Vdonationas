'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Send, Flame, ShieldCheck, Clock, CheckCircle2, AlertCircle, X, History, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  getActiveTempleProfile,
  getProfileChangeRequests,
  submitProfileChangeRequest,
  cancelProfileChangeRequest,
  ProfileChangeRequest,
} from '@/lib/temple-governance-store';
import { Temple } from '@/lib/types';

export default function TempleProfileEditPage() {
  const { t } = useLanguage();
  const [liveTemple, setLiveTemple] = useState<Temple>(() => getActiveTempleProfile());
  const [formData, setFormData] = useState<Temple>(() => getActiveTempleProfile());
  const [pendingRequest, setPendingRequest] = useState<ProfileChangeRequest | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const loadData = () => {
    const active = getActiveTempleProfile();
    setLiveTemple(active);
    const requests = getProfileChangeRequests();
    const activePending = requests.find((r) => r.status === 'PENDING_APPROVAL');
    setPendingRequest(activePending || null);

    if (activePending) {
      setFormData({
        ...active,
        name: activePending.proposedData.name,
        deity: activePending.proposedData.deity,
        trustName: activePending.proposedData.trustName,
        registrationNo: activePending.proposedData.registrationNo,
        timings: activePending.proposedData.timings,
        description: activePending.proposedData.description,
        address: activePending.proposedData.address || active.address,
        taxBenefitInfo: activePending.proposedData.taxBenefitInfo || active.taxBenefitInfo,
      });
    } else {
      setFormData(active);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('temple_profile_updated', loadData);
    window.addEventListener('temple_profile_requests_updated', loadData);
    return () => {
      window.removeEventListener('temple_profile_updated', loadData);
      window.removeEventListener('temple_profile_requests_updated', loadData);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Submit for Super Admin review
    const req = submitProfileChangeRequest(
      formData.id || 'tpl-vasavi-01',
      formData,
      'Srinivasa Rao (Penugonda Admin)',
      'Temple Admin updated shrine registration, deity attributes, and daily darshan timings.'
    );

    setPendingRequest(req);
    setStatusMessage({
      type: 'success',
      text: '✓ Shrine profile changes submitted to Super Admin for approval! Public pages will update once authorized.',
    });
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const handleCancelRequest = (requestId: string) => {
    cancelProfileChangeRequest(requestId);
    setStatusMessage({
      type: 'info',
      text: 'Pending profile change request has been withdrawn.',
    });
    loadData();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Compute fields that differ from live temple
  const hasChanges =
    formData.name !== liveTemple.name ||
    formData.deity !== liveTemple.deity ||
    formData.trustName !== liveTemple.trustName ||
    formData.registrationNo !== liveTemple.registrationNo ||
    formData.timings !== liveTemple.timings ||
    formData.description !== liveTemple.description;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarTempleProfile')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarTempleProfile')} & Governance
          </h1>
          <p className="text-amber-100/80 text-xs">
            Edit Penugonda Sri Vasavi Kanyaka Parameswari Matha Shrine Profile — Requires Super Admin Approval
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-1.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Super Admin Protected
          </span>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-200'
              : statusMessage.type === 'info'
              ? 'bg-stone-900 border-2 border-stone-700 text-stone-300'
              : 'bg-red-950/80 border-2 border-red-500/60 text-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* PENDING APPROVAL ALERT BANNER WITH DIFF PREVIEW */}
      {pendingRequest && (
        <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                    Profile Changes Awaiting Super Admin Approval
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-400/40">
                    Pending Review
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Submitted by <span className="text-amber-200 font-semibold">{pendingRequest.requestedBy}</span> on{' '}
                  <span className="font-mono">{pendingRequest.requestedAt}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCancelRequest(pendingRequest.id)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-center"
            >
              <X className="w-3.5 h-3.5" /> Cancel Request
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
              Proposed Changes vs Current Live Values:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {pendingRequest.proposedData.name !== liveTemple.name && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Temple Name</span>
                  <div className="text-stone-400 line-through text-[11px]">{liveTemple.name}</div>
                  <div className="text-amber-300 font-bold">{pendingRequest.proposedData.name}</div>
                </div>
              )}

              {pendingRequest.proposedData.deity !== liveTemple.deity && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Presiding Deity</span>
                  <div className="text-stone-400 line-through text-[11px]">{liveTemple.deity}</div>
                  <div className="text-amber-300 font-bold">{pendingRequest.proposedData.deity}</div>
                </div>
              )}

              {pendingRequest.proposedData.trustName !== liveTemple.trustName && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Registered Trust</span>
                  <div className="text-stone-400 line-through text-[11px]">{liveTemple.trustName}</div>
                  <div className="text-amber-300 font-bold">{pendingRequest.proposedData.trustName}</div>
                </div>
              )}

              {pendingRequest.proposedData.registrationNo !== liveTemple.registrationNo && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Registration No</span>
                  <div className="text-stone-400 line-through text-[11px] font-mono">{liveTemple.registrationNo}</div>
                  <div className="text-amber-300 font-bold font-mono">{pendingRequest.proposedData.registrationNo}</div>
                </div>
              )}

              {pendingRequest.proposedData.timings !== liveTemple.timings && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Darshan Timings</span>
                  <div className="text-stone-400 line-through text-[11px]">{liveTemple.timings}</div>
                  <div className="text-amber-300 font-bold">{pendingRequest.proposedData.timings}</div>
                </div>
              )}

              {pendingRequest.proposedData.description !== liveTemple.description && (
                <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-400/30 space-y-1 sm:col-span-2 lg:col-span-3">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Description / Overview</span>
                  <div className="text-stone-400 line-through text-[11px] line-clamp-1">{liveTemple.description}</div>
                  <div className="text-amber-300 font-bold line-clamp-2">{pendingRequest.proposedData.description}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D PROFILE FORM CARD WITH HOVER MOTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all text-xs"
      >
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Shrine Registration & Identity Information
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Any changes saved here will be submitted to the Super Admin approval queue before going live.
            </p>
          </div>
          {pendingRequest && (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-400/30 font-bold text-[10px] uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Modification In Progress
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Temple Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Presiding Deity *
            </label>
            <input
              type="text"
              required
              value={formData.deity}
              onChange={(e) => setFormData({ ...formData, deity: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Registered Trust Name *
            </label>
            <input
              type="text"
              required
              value={formData.trustName}
              onChange={(e) => setFormData({ ...formData, trustName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
              Registration Number *
            </label>
            <input
              type="text"
              required
              value={formData.registrationNo}
              onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Darshan Timings *
          </label>
          <input
            type="text"
            required
            value={formData.timings}
            onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
            Temple Overview & Sacred Description *
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-devotional-saffron shrink-0" />
            <span>All modifications undergo audit verification by Super Admin before updating live devotee views.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-900 text-amber-300 font-bold text-xs shadow-gold hover:brightness-110 transition-all border border-amber-400/40 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-devotional-saffron" />
            {pendingRequest ? 'Update Pending Approval Submission' : 'Submit Changes for Super Admin Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}
