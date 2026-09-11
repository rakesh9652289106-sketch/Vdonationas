'use client';

import React, { useState } from 'react';
import { Shield, ShieldCheck, Key, Smartphone, LogOut, Flame, Lock, Download, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function DevoteeSecurityAndPrivacyPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [is2FA, setIs2FA] = useState(true);
  const [isAnon, setIsAnon] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleToggle2FA = async () => {
    const nextState = !is2FA;
    const confirmed = await confirmAction({
      title: nextState ? 'Enable Two-Factor Authentication?' : 'Disable Two-Factor Authentication?',
      message: nextState
        ? 'Enabling 2FA adds extra verification protection before accessing tax certificates and changing bank details.'
        : 'Disabling 2FA will reduce account security. Are you sure you want to proceed?',
      confirmText: nextState ? 'Enable 2FA' : 'Disable 2FA',
      variant: nextState ? 'change' : 'warning',
    });
    if (!confirmed) return;

    setIs2FA(nextState);
    showAlert({
      type: nextState ? 'change' : 'warning',
      title: '2FA Setting Updated',
      message: `Two-Factor Authentication is now ${nextState ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleTerminateOtherSessions = async () => {
    const confirmed = await confirmAction({
      title: 'Terminate All Other Sessions?',
      message: 'Are you sure you want to sign out all secondary phones, tablets, and computers currently logged into your devotee account?',
      confirmText: 'Yes, Sign Out Others',
      variant: 'danger',
    });
    if (!confirmed) return;

    showAlert({
      type: 'danger',
      title: 'Secondary Sessions Terminated',
      message: 'All other active devices have been securely signed out.',
    });
  };

  const handleToggleAnon = (checked: boolean) => {
    setIsAnon(checked);
    showAlert({
      type: 'change',
      title: 'Privacy Setting Saved',
      message: checked
        ? 'Your name will now be hidden from public temple donor rolls.'
        : 'Your name will be visible on public donor rolls and live screens.',
    });
  };

  const handleDownloadArchive = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
    const dataStr = JSON.stringify(
      {
        devotee: 'Radha Krishna',
        email: 'devotee@gmail.com',
        exportDate: new Date().toISOString(),
        taxExemption80G: 'Active',
        privacyPreference: isAnon ? 'Anonymous Default' : 'Public Name',
        security2FA: is2FA ? 'Enabled' : 'Disabled',
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vasavi_devotee_data_archive_${Date.now()}.json`;
    a.click();
    showAlert({
      type: 'info',
      title: 'Archive Exported',
      message: 'Devotee records archive downloaded in JSON format.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarSecurityPrivacy')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarSecurityPrivacy')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Two-Factor Authentication, Multi-Device Sessions, Anonymous Giving &amp; Data Portability
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. SECURITY & 2FA CARD */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-5 hover:border-amber-400 transition-all text-xs">
          <div className="flex items-center gap-2 text-devotional-maroon dark:text-amber-400 font-serif font-bold text-base border-b border-stone-200 dark:border-stone-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-devotional-saffron" />
            <span>Account Security &amp; 2FA</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800/60">
            <div className="pr-4 space-y-0.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Two-Factor Authentication</h4>
              <p className="text-stone-500 text-[11px]">Enhanced verification security to protect your sensitive tax receipts and profile data.</p>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 font-bold rounded-xl text-xs transition-all shadow-sm shrink-0 ${
                is2FA
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              {is2FA ? '✓ 2FA Enabled' : 'Enable 2FA'}
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-0.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Active Login Sessions</h4>
              <p className="text-stone-500 text-[11px]">Currently logged in on Chrome / Windows 11 (Penugonda Devotee Portal).</p>
            </div>
            <button
              onClick={handleTerminateOtherSessions}
              className="w-full py-2.5 border border-rose-300 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Terminate Other Sessions
            </button>
          </div>
        </div>

        {/* 2. PRIVACY CONTROLS CARD */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-5 hover:border-amber-400 transition-all text-xs">
          <div className="flex items-center gap-2 text-devotional-maroon dark:text-amber-400 font-serif font-bold text-base border-b border-stone-200 dark:border-stone-800 pb-3">
            <Lock className="w-5 h-5 text-devotional-saffron" />
            <span>Devotee Privacy Controls</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-stone-100 dark:border-stone-800/60">
            <div className="pr-4 space-y-0.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Default Anonymous Seva</h4>
              <p className="text-stone-500 text-[11px]">Hide name on public donor rolls and live TV screen broadcasts by default.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAnon}
                onChange={(e) => handleToggleAnon(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-devotional-saffron"></div>
            </label>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-0.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Download Data Archive</h4>
              <p className="text-stone-500 text-[11px]">Export a verified JSON archive of your devotional contributions and tax statements.</p>
            </div>
            <button
              onClick={handleDownloadArchive}
              className="w-full py-2.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all border border-amber-400/40"
            >
              <Download className="w-4 h-4 text-devotional-saffron" /> Export Personal Data Archive
            </button>
            {downloadSuccess && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Data archive downloaded successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
