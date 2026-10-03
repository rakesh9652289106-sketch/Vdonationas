import React from 'react';
import { Metadata } from 'next';
import AryaVysyaGotramExplorer from '@/components/heritage/AryaVysyaGotramExplorer';

export const metadata: Metadata = {
  title: '102 Arya Vysya Sacred Gotram & Rishi Lineage Explorer | Penugonda Devasthanam',
  description: 'Explore the complete 102 Arya Vysya Vedic Gotrams, sacred Rishi ancestors, unique Sankethanamams, and traditional Pravaras.',
};

export default function GotramsHeritagePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AryaVysyaGotramExplorer />
    </div>
  );
}
