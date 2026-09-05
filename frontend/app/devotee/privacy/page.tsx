'use client';

import React, { useState } from 'react';
import { Lock, Download, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function DevoteePrivacyPage() {
  const { t } = useLanguage();
  const { showAlert } = useConfirmAlert();
  const [isAnon, setIsAnon] = useState(false);

  const handleAnonToggle = (checked: boolean) => {
    setIsAnon(checked);
    showAlert({
      type: 'change',
      title: 'Anonymous Setting Updated',
      message: checked
        ? 'Your name will now be hidden from public temple donor rolls.'
        : 'Your name will be visible on public donor rolls.',
    });
  };

  const handleDownloadArchive = () => {
    showAlert({
      type: 'info',
      title: 'Archive Exported',
      message: 'Downloading GDPR JSON personal data archive.',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarPrivacyControls')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarPrivacyControls')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Anonymous Seva Settings, Public Donor Visibility & Data Portability Controls
          </p>
        </div>
      </div>

      {/* 3D PRIVACY CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-devotional-gold/40 shadow-2xl space-y-6 hover:border-amber-400 transition-all text-xs">
        <div className="flex justify-between items-center pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">Default Anonymous Offering</h3>
            <p className="text-stone-500 mt-0.5">Hide your identity on public temple campaign supporter walls by default.</p>
          </div>
          <input
            type="checkbox"
            checked={isAnon}
            onChange={(e) => handleAnonToggle(e.target.checked)}
            className="w-6 h-6 rounded-lg accent-devotional-saffron cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">Download Personal Data Archive</h3>
            <p className="text-stone-500 mt-0.5">Export verified JSON archive of your devotional contributions and tax statements.</p>
          </div>
          <button
            onClick={handleDownloadArchive}
            className="px-5 py-2.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all border border-amber-400/40"
          >
            <Download className="w-4 h-4 text-devotional-saffron" /> Download Archive (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
