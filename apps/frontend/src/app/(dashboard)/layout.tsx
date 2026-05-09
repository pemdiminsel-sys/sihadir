'use client';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import QuickActionDock from '@/components/layout/QuickActionDock';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!token || !user) {
    return null;
  }

  // Determine if we should use the dark premium background
  const isDark = pathname === '/command-center' || pathname.startsWith('/super-admin');
  const bgClass = isDark ? 'bg-[#050a18] text-slate-100' : 'bg-[#F4F7FB] text-slate-900';

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${bgClass}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar />
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`p-6 md:p-8 min-h-full ${isDark ? '' : 'max-w-7xl mx-auto'}`}
          >
            {children}
          </motion.div>
        </div>
        <QuickActionDock />
      </main>
    </div>
  );
}
