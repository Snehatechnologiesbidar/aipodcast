'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/firebase/services/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/create-podcast';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        router.replace(redirectTo);
      }
    });

    return () => unsubscribe();
  }, [router, redirectTo]);

  return <>{children}</>;
}