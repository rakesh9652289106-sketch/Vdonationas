'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Heart, Lock, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-devotional-gold/30">
      {/* Top Trust Section */}
      <div className="border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-devotional-maroon/80 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t('verifiedDevasthanam')}</h4>
              <p className="text-xs text-stone-400">Official Devasthanam accounts</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-devotional-maroon/80 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Bank-Grade Security</h4>
              <p className="text-xs text-stone-400">256-bit SSL & instant receipts</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-devotional-maroon/80 flex items-center justify-center text-amber-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Traceable Devotion</h4>
              <p className="text-xs text-stone-400">Lifetime devotee dashboard</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-devotional-maroon/80 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Tax Exemptions</h4>
              <p className="text-xs text-stone-400">80G tax benefit receipts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-devotional-maroon flex items-center justify-center text-amber-400">
              🛕
            </div>
            <span className="text-lg font-serif font-bold text-amber-400">
              {t('templeName')}
            </span>
          </div>
          <p className="text-stone-400 leading-relaxed pr-4">
            {t('footerDesc')}
          </p>
          <div className="space-y-1.5 text-stone-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-devotional-saffron" />
              <span>{t('templeLocation')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-devotional-saffron" />
              <span>Toll-Free Helpline: 1800-425-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-devotional-saffron" />
              <span>support@srivasavimatha-penugonda.org</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">{t('footerQuickLinks')}</h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <Link href="/" className="hover:text-amber-400">
                {t('navHome')}
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-amber-400">
                {t('navDonate')}
              </Link>
            </li>
            <li>
              <Link href="/donate/recurring" className="hover:text-amber-400">
                {t('navAutopay')}
              </Link>
            </li>
            <li>
              <Link href="/festivals" className="hover:text-amber-400">
                {t('navFestivals')}
              </Link>
            </li>
            <li>
              <Link href="/verify-receipt" className="hover:text-amber-400">
                {t('navVerifyReceipt')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Temple Administration */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Administration</h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <Link href="/admin/super/dashboard" className="hover:text-amber-400">
                Super Admin Portal
              </Link>
            </li>
            <li>
              <Link href="/admin/temple/dashboard" className="hover:text-amber-400">
                Temple Admin Portal
              </Link>
            </li>
            <li>
              <Link href="/admin/finance/reconciliation" className="hover:text-amber-400">
                Finance Reconciliation
              </Link>
            </li>
            <li>
              <Link href="/admin/temple/qr-display" className="hover:text-amber-400">
                Counter QR TV Mode
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">{t('footerLegal')}</h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <Link href="/privacy" className="hover:text-amber-400">
                Privacy & Data Protection
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-amber-400">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/devotee/support" className="hover:text-amber-400">
                Devotee FAQ & Help
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="border-t border-stone-800 bg-stone-950 py-4 px-4 text-center text-[11px] text-stone-500">
        <p>
          © 2026 {t('footerRights')}
        </p>
      </div>
    </footer>
  );
}
