'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DevoteeAnalyticsAndStatementPage from '../analytics/page';

export default function DevoteeAnnualStatementPage() {
  const router = useRouter();

  useEffect(() => {
    // Sync URL cleanly while rendering unified page
    router.replace('/devotee/analytics');
  }, [router]);

  return <DevoteeAnalyticsAndStatementPage />;
}
