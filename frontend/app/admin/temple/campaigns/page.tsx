'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Plus,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Send,
  Sparkles,
  Target,
  Image,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  getActiveCampaigns,
  getCampaignChangeRequests,
  submitCampaignChangeRequest,
  cancelCampaignChangeRequest,
  CampaignChangeRequest,
} from '@/lib/temple-governance-store';
import { Campaign } from '@/lib/types';

export default function TempleCampaignsAdminPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CampaignChangeRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Campaign | null>(null);

  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const loadData = () => {
    setCampaigns(getActiveCampaigns());
    setPendingRequests(getCampaignChangeRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campaigns_updated', loadData);
    window.addEventListener('campaign_requests_updated', loadData);
    return () => {
      window.removeEventListener('campaigns_updated', loadData);
      window.removeEventListener('campaign_requests_updated', loadData);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setTitle('');
    setGoal('');
    setDescription('Devotee-funded sanctum development and sacred pilgrim facility expansion project.');
    setStory('With growing divine footfall at Penugonda, this sacred project expands facilities to serve all devotees with grace.');
    setBannerUrl('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800');
    setShowModal(true);
  };

  const handleOpenEditModal = (c: Campaign) => {
    setEditingCampaign(c);
    setTitle(c.title);
    setGoal(c.goalAmount.toString());
    setDescription(c.description);
    setStory(c.story || '');
    setBannerUrl(c.bannerUrl);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goal) return;

    const parsedGoal = parseFloat(goal);

    if (editingCampaign) {
      const updatedCmp: Campaign = {
        ...editingCampaign,
        title: title.trim(),
        goalAmount: parsedGoal,
        description: description.trim(),
        story: story.trim(),
        bannerUrl: bannerUrl.trim() || editingCampaign.bannerUrl,
      };

      submitCampaignChangeRequest(
        'EDIT',
        updatedCmp,
        'Srinivasa Rao (Penugonda Admin)',
        editingCampaign,
        'Temple Admin updated fundraising target goal and project scope.'
      );

      setStatusMsg({
        type: 'success',
        text: `✓ Modification request for "${title}" submitted to Super Admin for approval!`,
      });
    } else {
      const newCmp: Campaign = {
        id: `cmp-${Date.now()}`,
        templeId: 'tpl-vasavi-01',
        title: title.trim(),
        description: description.trim(),
        story: story.trim(),
        bannerUrl: bannerUrl.trim() || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
        goalAmount: parsedGoal,
        currentRaised: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        minDonation: 101,
        status: 'PENDING_APPROVAL',
        isFeatured: true,
        updates: [],
      };

      submitCampaignChangeRequest(
        'CREATE',
        newCmp,
        'Srinivasa Rao (Penugonda Admin)',
        undefined,
        'Temple Admin initiated launch proposal for new sacred development campaign.'
      );

      setStatusMsg({
        type: 'success',
        text: `✓ Campaign proposal "${title}" submitted to Super Admin for authorization! It will be published live once accepted.`,
      });
    }

    setShowModal(false);
    loadData();
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleRequestDelete = (cmp: Campaign) => {
    submitCampaignChangeRequest(
      'DELETE',
      cmp,
      'Srinivasa Rao (Penugonda Admin)',
      cmp,
      'Temple Admin requested decommissioning of this fundraising campaign.'
    );
    setDeleteConfirmTarget(null);
    setStatusMsg({
      type: 'info',
      text: `✓ Decommissioning request for "${cmp.title}" submitted to Super Admin.`,
    });
    loadData();
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleCancelRequest = (requestId: string) => {
    cancelCampaignChangeRequest(requestId);
    setStatusMsg({
      type: 'info',
      text: 'Pending campaign request has been cancelled.',
    });
    loadData();
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const getPendingForCampaign = (cmpId: string) => {
    return pendingRequests.find((r) => r.status === 'PENDING_APPROVAL' && r.campaign.id === cmpId);
  };

  const pendingCreations = pendingRequests.filter(
    (r) => r.status === 'PENDING_APPROVAL' && r.action === 'CREATE'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarCampaigns')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarCampaigns')} Governance
          </h1>
          <p className="text-amber-100/80 text-xs">
            Penugonda Sri Vasavi Matha Development & Annadanam Fundraising Projects — Super Admin Authorization Required
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0"
          >
            <Plus className="w-4 h-4 text-devotional-maroon" /> Propose New Campaign
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-200'
              : 'bg-stone-900 border-2 border-stone-700 text-stone-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* PENDING CAMPAIGN CREATIONS (AWAITING SUPER ADMIN REVIEW) */}
      {pendingCreations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-400">
              New Campaign Proposals Pending Super Admin Approval ({pendingCreations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingCreations.map((req) => (
              <div
                key={req.id}
                className="bg-stone-900/90 border-2 border-dashed border-amber-400/80 p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-400/40 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 animate-spin" /> Pending Super Admin Authorization
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req.id)}
                    className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-all text-xs flex items-center gap-1"
                    title="Withdraw proposal"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={req.campaign.bannerUrl}
                    alt={req.campaign.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-amber-400/40 shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-stone-100">{req.campaign.title}</h3>
                    <p className="text-xs text-stone-400 line-clamp-2">{req.campaign.description}</p>
                    <div className="font-bold text-amber-400 text-xs">
                      Target Goal: ₹{req.campaign.goalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Requested: {req.requestedAt}</span>
                  <span className="text-amber-300 font-mono">Action: CREATE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE & ACTIVE CAMPAIGNS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Active Devasthanam Campaigns ({campaigns.length})
          </h2>
          <span className="text-xs text-stone-500">Live for devotee contributions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => {
            const pending = getPendingForCampaign(c.id);
            const percent = Math.round((c.currentRaised / c.goalAmount) * 100);

            return (
              <div
                key={c.id}
                className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 space-y-4 ${
                  pending
                    ? 'border-amber-400/80 ring-2 ring-amber-400/30'
                    : 'border-devotional-gold/40 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {pending ? (
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase border border-amber-400/40 flex items-center gap-1.5 w-fit">
                        <Clock className="w-3 h-3 animate-spin" /> {pending.action} Pending Super Admin Approval
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase border border-emerald-400/40">
                        ✓ ACTIVE DEVOTIONAL CAMPAIGN
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 pt-1">
                      {pending && pending.action === 'EDIT' ? pending.campaign.title : c.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {pending ? (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(pending.id)}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-semibold hover:bg-stone-200 transition-all"
                        title="Cancel pending request"
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(c)}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                          title="Propose Campaign Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(c)}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                          title="Propose Campaign Decommissioning"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {pending && pending.action === 'EDIT' ? pending.campaign.description : c.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-devotional-maroon dark:text-amber-400">
                      ₹{c.currentRaised.toLocaleString('en-IN')} Raised ({percent}%)
                    </span>
                    <span className="text-stone-500">
                      Goal: ₹
                      {(pending && pending.action === 'EDIT' ? pending.campaign.goalAmount : c.goalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200 dark:border-stone-700">
                    <div
                      className="h-full bg-gradient-to-r from-devotional-saffron to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
                {editingCampaign ? 'Edit Campaign Proposal' : 'Propose New Campaign'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-100 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              Note: Campaign launch requires Super Admin authorization before being published to devotee platforms.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gopuram Gold Plating"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
                  Target Goal Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1000000"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
                  Overview Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold flex items-center gap-1.5 border border-amber-400/40 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-devotional-saffron" />
                  {editingCampaign ? 'Submit Modification' : 'Submit for Launch Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-red-500/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-red-600 dark:text-red-400">
              Request Campaign Decommissioning
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to submit a request to decommission campaign{' '}
              <span className="font-bold text-stone-900 dark:text-stone-100">"{deleteConfirmTarget.title}"</span>?
              Super Admin authorization is required to remove this project from public donor listings.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRequestDelete(deleteConfirmTarget)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Submit Decommission Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
