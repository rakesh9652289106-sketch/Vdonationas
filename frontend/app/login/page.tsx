'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SacredDevoteeLoginPortal from '@/components/auth/SacredDevoteeLoginPortal';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, exploreAsGuest } = useAuth();

  const handleLoginSuccess = (userSession: any) => {
    login(userSession);
    // Smooth transition to the Homepage after login
    router.push('/');
  };

  const handleExploreAsGuest = () => {
    exploreAsGuest();
    // Smooth transition to the Homepage as Guest
    router.push('/');
  };

  return (
    <SacredDevoteeLoginPortal
      onLoginSuccess={handleLoginSuccess}
      onExploreAsGuest={handleExploreAsGuest}
    />
  );
}
