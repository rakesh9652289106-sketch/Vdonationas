'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_QR_CODES } from '@/lib/mock-data';
import { QRCodeItem } from '@/lib/types';
import { QrCode, Plus, ShieldCheck, Download, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function QRManagementPage() {
  const { t } = useLanguage();
  const [qrList, setQrList] = useState<QRCodeItem[]>(MOCK_QR_CODES);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newUpiId, setNewUpiId] = useState('');

  const handleAddQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName || !newUpiId) return;

    const newItem: QRCodeItem = {
      id: `qr-item-${Date.now()}`,
      qrCodeId: `QR-00${qrList.length + 1}`,
      templeId: 'tpl-penugonda-01',
      provider: 'UPI_DIRECT',
      upiId: newUpiId,
      displayName: newDisplayName,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${newUpiId}&pn=${encodeURIComponent(
        newDisplayName
      )}&cu=INR`,
      status: 'ACTIVE',
      isDefault: false,
      startDate: new Date().toISOString().split('T')[0],
    };

    setQrList([newItem, ...qrList]);
    setNewDisplayName('');
    setNewUpiId('');
    setShowNewModal(false);
  };

  const handleToggleStatus = (id: string) => {
    setQrList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: q.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : q))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarQRManagement')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarQRManagement')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Generate, assign, and audit high-resolution payment QR codes for Penugonda Matha counters.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <Link
            href="/admin/temple/qr-display"
            className="px-4 py-2.5 rounded-xl border border-amber-400/40 text-amber-300 font-bold text-xs hover:bg-amber-400/20 transition-colors"
          >
            Launch Full-Screen Counter TV
          </Link>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300"
          >
            <Plus className="w-4 h-4 text-devotional-maroon" /> Add / Upload New QR
          </button>
        </div>
      </div>

      {/* 3D QR LIST GRID WITH HOVER MOTION & AMBIENT GLOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qrList.map((qr) => (
          <div
            key={qr.id}
            className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 transform hover:border-amber-400 hover:ring-2 hover:ring-amber-300/40 flex flex-col sm:flex-row gap-6 items-center"
          >
            {/* QR Image Box */}
            <div className="bg-stone-100 dark:bg-stone-950 p-4 rounded-2xl border-2 border-amber-400/40 shrink-0 text-center shadow-inner">
              <img src={qr.qrImageUrl} alt={qr.displayName} className="w-36 h-36 object-contain rounded-lg" />
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold mt-2 block">
                ID: {qr.qrCodeId}
              </span>
            </div>

            {/* QR Details */}
            <div className="flex-1 space-y-3 text-xs w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                    {qr.displayName}
                  </h3>
                  <p className="font-mono text-amber-700 dark:text-amber-400 font-bold">{qr.upiId}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    qr.status === 'ACTIVE'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400/40'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-400/40'
                  }`}
                >
                  {qr.status}
                </span>
              </div>

              <div className="space-y-1 text-stone-600 dark:text-stone-400">
                <p className="font-semibold">Provider: {qr.provider}</p>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300/40">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Payment Destination
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(qr.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {qr.status === 'ACTIVE' ? 'Disable QR' : 'Activate QR'}
                </button>
                <a
                  href={qr.qrImageUrl}
                  target="_blank"
                  download
                  className="px-3.5 py-1.5 rounded-xl bg-devotional-maroon text-amber-300 font-bold flex items-center gap-1.5 hover:brightness-110"
                >
                  <Download className="w-3.5 h-3.5 text-devotional-saffron" /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
              Configure New Counter QR Code
            </h3>
            <form onSubmit={handleAddQr} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Counter Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Penugonda Annadanam Counter #2 QR"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  UPI VPA Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vasavimathadevasthanam@upi"
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-devotional-saffron text-white font-bold"
                >
                  Save & Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
