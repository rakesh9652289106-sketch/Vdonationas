'use client';

import React, { useState } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DevaAIAssistantModal from '@/components/DevaAIAssistantModal';
import { LanguageProvider } from '@/lib/language-context';
import { Sparkles } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Sri Vasavi Kanyaka Parameswari Matha, Penugonda | Digital Seva Platform</title>
        <meta
          name="description"
          content="Official digital donation, UPI Autopay, 80G tax receipt, and devotional platform for Sri Vasavi Kanyaka Parameswari Matha, Penugonda."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-devotional-cream dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors">
        <LanguageProvider>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />

          {/* Floating DevaAI Assistant Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 border-2 border-amber-300 group"
            title="Open DevaAI Assistant"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold font-serif hidden sm:inline">Ask DevaAI</span>
          </button>

          {/* DevaAI Modal */}
          <DevaAIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </LanguageProvider>
      </body>
    </html>
  );
}
