'use client';

import React, { useState } from 'react';
import { MOCK_CAMPAIGNS } from '@/lib/mock-data';
import { Flame, Plus, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TempleCampaignsAdminPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !goal) return;

    const newCmp = {
      id: `cmp-${Date.now()}`,
      templeId: 'tpl-penugonda-01',
      title,
      description: 'New temple development project',
      story: 'Funding development of sacred facilities.',
      bannerUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      goalAmount: parseFloat(goal),
      currentRaised: 0,
      startDate: '2026-08-22',
      endDate: '2026-12-31',
      minDonation: 101,
      status: 'ACTIVE' as const,
      isFeatured: true,
      updates: [],
    };

    setCampaigns([newCmp, ...campaigns]);
    setTitle('');
    setGoal('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarCampaigns')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarCampaigns')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Penugonda Sri Vasavi Matha Development & Annadanam Fundraising Projects
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 text-devotional-maroon" /> Launch New Campaign
        </button>
      </div>

      {/* 3D CAMPAIGN CARDS GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 space-y-4"
          >
            <div className="flex justify-between font-serif font-bold text-lg">
              <span className="text-stone-900 dark:text-stone-100">{c.title}</span>
              <span className="text-devotional-maroon dark:text-amber-400">
                ₹{c.currentRaised.toLocaleString('en-IN')} / ₹{c.goalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{c.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
              Create New Campaign
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gopuram Gold Plating"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Target Goal Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1000000"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-devotional-saffron text-white font-bold"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
