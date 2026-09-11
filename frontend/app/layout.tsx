'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DevaAIAssistantModal from '@/components/DevaAIAssistantModal';
import MobileTopBar from '@/components/mobile/MobileTopBar';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import MobileAppDrawer from '@/components/mobile/MobileAppDrawer';
import MobileNotificationSheet from '@/components/mobile/MobileNotificationSheet';
import { LanguageProvider } from '@/lib/language-context';
import { ConfirmAlertProvider } from '@/lib/confirm-alert-context';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { MOCK_USERS } from '@/lib/mock-data';
import { UserRoleType } from '@/lib/types';
import { isSuperAdminUser, isTempleAdminUser, isFinanceAdminUser } from '@/lib/rbac';
import { Sparkles } from 'lucide-react';

function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuth();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[3]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // Sync authenticated user with layout state
  useEffect(() => {
    if (user) {
      setCurrentUser((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile,
      }));
    }
  }, [user]);

  // Strict route locking: "nothing should be opened untill the new sankalpam steps completed"
  useEffect(() => {
    if (!isHydrated) return;

    // Never redirect away if user is already on /login, /auth, or /sankalpam!
    if (pathname === '/login' || pathname.startsWith('/auth') || pathname.startsWith('/sankalpam')) {
      return;
    }

    if (!isAuthenticated) {
      const hasPendingSankalpam = typeof window !== 'undefined' && !!localStorage.getItem('vdonations_pending_sankalpam');
      if (hasPendingSankalpam) {
        // If devotee was in the middle of New Sankalpam and tried opening another site page (e.g. /donate)
        router.replace('/sankalpam/gotram');
      } else {
        // Otherwise direct to login
        router.replace('/login');
      }
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      } else {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    }
  };

  const handleSwitchUser = (role: UserRoleType) => {
    if (role === 'SUPER_ADMIN' && !isSuperAdminUser(user?.mobile, user?.email)) {
      return;
    }
    if (role === 'TEMPLE_ADMIN' && !isTempleAdminUser(user?.role, user?.mobile, user?.email)) {
      return;
    }
    if (role === 'FINANCE_ADMIN' && !isFinanceAdminUser(user?.role, user?.mobile, user?.email)) {
      return;
    }
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Pure isolated gateway check: Hide all navbar, header, footer, and drawer functions on:
  // - /login
  // - /sankalpam routes (e.g. /sankalpam/gotram)
  // - /auth routes (e.g. /auth/callback)
  const isSankalpamRoute = pathname.startsWith('/sankalpam');
  const isAuthRoute = pathname === '/login' || pathname.startsWith('/auth') || isSankalpamRoute;
  const isAuthGate = isAuthRoute;

  if (isAuthGate) {
    return (
      <main className="min-h-screen w-full bg-stone-950 overflow-x-hidden">
        {children}
      </main>
    );
  }

  return (
    <>
      {/* Mobile Native Top Header (Visible on < md) */}
      <MobileTopBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        currentUser={currentUser}
      />

      {/* Desktop Full Navigation Bar (Visible on >= md) */}
      <Navbar />

      {/* Main Application Viewport with Bottom Padding for Mobile Nav Bar */}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      {/* Desktop Footer (Visible on >= md) */}
      <Footer />

      {/* Native Mobile Bottom Navigation Bar (Fixed at bottom on < md) */}
      <MobileBottomNav />

      {/* Native Slide-Over App Drawer */}
      <MobileAppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Native Slide-Up Notification Sheet */}
      <MobileNotificationSheet
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Floating DevaAI Assistant Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:p-3.5 bg-gradient-to-r from-devotional-maroon via-devotional-saffron to-amber-600 text-white rounded-full shadow-2xl hover:scale-105 active-press transition-all flex items-center gap-2 border-2 border-amber-300 group cursor-pointer"
        title="Open DevaAI Assistant"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-serif hidden sm:inline">Ask DevaAI</span>
      </button>

      {/* DevaAI Modal */}
      <DevaAIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Sri Vasavi Kanyaka Parameswari Matha, Penugonda | Digital Seva Platform</title>
        <meta
          name="description"
          content="Official digital donation, UPI Autopay, 80G tax receipt, and devotional platform for Sri Vasavi Kanyaka Parameswari Matha, Penugonda."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" content="#6B1D2F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vasavi Seva" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-devotional-cream dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors antialiased">
        <LanguageProvider>
          <ConfirmAlertProvider>
            <AuthProvider>
              <LayoutShell>{children}</LayoutShell>
            </AuthProvider>
          </ConfirmAlertProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
