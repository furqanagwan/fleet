'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: 'ADMIN' | 'DRIVER';
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (requireRole && user.role !== requireRole) {
      router.replace('/');
    } else {
      setLoading(false);
    }
  }, [user, router, requireRole]);

  if (loading) {
    return <p className="text-center mt-10">Checking access...</p>;
  }

  return <>{children}</>;
}
