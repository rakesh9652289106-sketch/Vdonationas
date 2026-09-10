import React from 'react';
import { Metadata } from 'next';
import SacredGotramSankalpamWizard from '@/components/sankalpam/SacredGotramSankalpamWizard';

export const metadata: Metadata = {
  title: 'Sacred Gotram & Sankethanamam Initiation | Penugonda Devasthanam',
  description: 'Select your 102 Arya Vysya Sacred Gotram and Unique Sankethanamam for Vasavi Matha divine blessings and seva sankalpams.',
};

export default function SacredGotramSankalpamPage() {
  return <SacredGotramSankalpamWizard />;
}
