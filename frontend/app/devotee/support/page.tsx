'use client';

import React, { useState } from 'react';
import { LifeBuoy, Plus, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DevoteeSupportPage() {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-9901',
      subject: 'Money deducted but donation receipt pending',
      category: 'PAYMENT_MISSING',
      status: 'RESOLVED',
      date: '2026-08-20',
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    setTickets([
      {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject,
        category: 'PAYMENT_ISSUE',
        status: 'OPEN',
        date: new Date().toISOString().split('T')[0],
      },
      ...tickets,
    ]);
    setSubject('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarDonationSupport')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarDonationSupport')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            24/7 Seva Assistance & Support Desk for Sri Vasavi Matha Devotees
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 text-devotional-maroon" /> Raise Support Ticket
        </button>
      </div>

      {/* 3D TICKETS CONTAINER WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-4 hover:border-amber-400 transition-all text-xs">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-amber-400/30 flex justify-between items-center hover:-translate-y-1 transition-transform shadow-md"
          >
            <div>
              <span className="font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">{t.id}</span>
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base mt-0.5">{t.subject}</h4>
              <p className="text-stone-500 text-[11px] font-medium">Raised on {t.date}</p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-400/40">
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
              Raise Devotee Support Ticket
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Subject / Problem *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing receipt for UPI transaction"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Transaction Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention UTR / Transaction ID..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
