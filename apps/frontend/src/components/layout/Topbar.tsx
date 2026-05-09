'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  CloudSun, 
  Wifi, 
  ChevronDown,
  User,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const [time, setTime] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300">
      
      {/* Left section: Global Search & Breadcrumbs */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative group w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Ketik '/' untuk mencari menu, laporan, atau peserta..." 
            className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-medium transition-all duration-300 placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block border border-slate-200 bg-white text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">CMD + K</kbd>
          </div>
        </div>
      </div>

      {/* Center: Live Indicators (Only visible on large screens) */}
      <div className="hidden lg:flex items-center justify-center gap-6 flex-1">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">System Online</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
          {format(time, 'dd MMM yyyy • HH:mm:ss', { locale: id })}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
          <CloudSun className="w-4 h-4" />
          <span>31°C</span>
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center justify-end gap-3 flex-1">
        
        {/* WebSocket Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">
          <Wifi className="w-4 h-4" />
          <span>Syncing</span>
        </div>

        {/* Notifications */}
        <button className="relative w-11 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse-fast"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-all duration-300"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{user?.role || 'Admin OPD'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 shadow-2xl shadow-blue-900/10 rounded-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors font-medium">
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <Link href="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors font-medium">
                    <Settings className="w-4 h-4" /> Pengaturan Sistem
                  </Link>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
                    <LogOut className="w-4 h-4" /> Keluar Aplikasi
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
