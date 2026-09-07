'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function RootPage() {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (user && user.isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#12233D] text-white flex items-center justify-center font-bold text-sm animate-pulse">
          P
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Loading PredictIQ Churn Intelligence...
        </div>
      </div>
    </div>
  );
}
