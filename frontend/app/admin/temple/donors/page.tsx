'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DonorCRMPage() {
  const { t } = useLanguage();
  const [selectedSegment, setSelectedSegment] = useState('ALL');

  const donors = [
    {
      id: 'dnr-101',
      name: 'Radha Krishna',
      email: 'devotee@gmail.com',
      phone: '+91 9123456789',
      totalDonated: 125500,
      frequency: '18 Donations',
      lastDonation: '2026-08-22',
      favoriteCategory: 'Nitya Annadanam',
      segment: 'HIGH_VALUE',
    },
    {
      id: 'dnr-102',
      name: 'Subba Rao',
      email: 'subbarao@gmail.com',
      phone: '+91 9887766554',
      totalDonated: 10000,
      frequency: '1 Donation (Cash)',
      lastDonation: '2026-08-22',
      favoriteCategory: 'Temple Development',
      segment: 'HIGH_VALUE',
    },
    {
      id: 'dnr-103',
      name: 'Kavitha Reddy',
      email: 'kavitha@gmail.com',
      phone: '+91 9443322110',
      totalDonated: 501,
      frequency: '1 Donation',
      lastDonation: '2026-08-15',
      favoriteCategory: 'Daily Pooja',
      segment: 'FIRST_TIME',
    },
  ];

  const filteredDonors = donors.filter(
    (d) => selectedSegment === 'ALL' || d.segment === selectedSegment
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarDonorCRM')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarDonorCRM')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Analyze Devotee Engagement & Lifetime Seva Contributions to Penugonda Matha
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-bold focus:ring-2 focus:ring-amber-400"
          >
            <option value="ALL">All Segments</option>
            <option value="HIGH_VALUE">High-Value Donors (₹1,000+)</option>
            <option value="FIRST_TIME">First-Time Donors</option>
            <option value="REGULAR">Regular / Monthly Donors</option>
          </select>
        </div>
      </div>

      {/* 3D CRM TABLE CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-2xl space-y-4 hover:border-amber-400 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Devotee Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Total Donated to Shrine</th>
                <th className="p-3.5">Frequency</th>
                <th className="p-3.5">Last Offering</th>
                <th className="p-3.5">Preferred Cause</th>
                <th className="p-3.5">Segment Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredDonors.map((dnr) => (
                <tr key={dnr.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{dnr.name}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">
                    <p className="flex items-center gap-1 font-medium">
                      <Mail className="w-3.5 h-3.5 text-amber-500" /> {dnr.email}
                    </p>
                    <p className="flex items-center gap-1 font-mono text-[11px] text-stone-500">
                      <Phone className="w-3.5 h-3.5 text-amber-500" /> {dnr.phone}
                    </p>
                  </td>
                  <td className="p-3.5 font-serif font-bold text-devotional-maroon dark:text-amber-400 text-base">
                    ₹{dnr.totalDonated.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-semibold">{dnr.frequency}</td>
                  <td className="p-3.5 text-stone-500">{dnr.lastDonation}</td>
                  <td className="p-3.5 font-semibold text-amber-700 dark:text-amber-400">{dnr.favoriteCategory}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold border border-amber-400/40">
                      {dnr.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
