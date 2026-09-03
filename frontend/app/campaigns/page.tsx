'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_CAMPAIGNS } from '@/lib/mock-data';
import { Flame, ArrowRight, Heart } from 'lucide-react';

export default function CampaignsListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase">
          <Flame className="w-4 h-4 text-devotional-saffron" /> SACRED INITIATIVES & CAMPAIGNS
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 tracking-tight">
          Active Temple Development & Seva Campaigns
        </h1>
        <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
          Support major temple construction projects, mega Annadanam halls, and goshala expansions with transparent goal progress.
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const percent = Math.round((campaign.currentRaised / campaign.goalAmount) * 100);
          return (
            <div
              key={campaign.id}
              className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg flex flex-col"
            >
              <div className="relative h-56 w-full">
                <img src={campaign.bannerUrl} alt={campaign.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-devotional-maroon text-amber-300 text-xs font-bold uppercase">
                  ACTIVE CAMPAIGN
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    {campaign.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
                    {campaign.story || campaign.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-devotional-maroon dark:text-amber-400">
                      ₹{campaign.currentRaised.toLocaleString('en-IN')} Raised
                    </span>
                    <span className="text-stone-500">Goal ₹{campaign.goalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-devotional-saffron to-amber-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-stone-500 font-semibold">{percent}% Funded</p>
                </div>

                <Link
                  href={`/donate?campaignId=${campaign.id}`}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs text-center shadow-gold hover:brightness-110 flex items-center justify-center gap-1"
                >
                  <Heart className="w-4 h-4 fill-current" /> Donate to This Campaign
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
