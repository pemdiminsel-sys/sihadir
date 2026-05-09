'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Award,
  BarChart3,
  Terminal,
  Zap,
  Globe,
  ClipboardList,
  ShieldCheck,
  Building2,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { useState } from 'react';
import ComingSoonModal from '../modals/ComingSoonModal';

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  premium?: boolean;
  isGlowing?: boolean;
  adminOnly?: boolean;
  badge?: string;
  comingSoon?: boolean;
}


const menuGroups: { group: string; items: MenuItem[] }[] = [
  {
    group: 'Operasional',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Globe, label: 'Command Center', href: '#', premium: true, isGlowing: true, comingSoon: true },
    ]
  },
  {
    group: 'Manajemen Kegiatan',
    items: [
      { icon: Calendar, label: 'Daftar Kegiatan', href: '/events' },
      { icon: ClipboardList, label: 'Persetujuan Peserta', href: '#', badge: '●', comingSoon: true },
      { icon: Users, label: 'Direktori Peserta', href: '/participants' },
      { icon: Award, label: 'Sertifikat Digital', href: '/certificates' },
    ]
  },
  {
    group: 'Analitik & Laporan',
    items: [
      { icon: Zap, label: 'Analitik SPBE', href: '#', comingSoon: true },
      { icon: BarChart3, label: 'Laporan Komprehensif', href: '/reports' },
      { icon: ShieldCheck, label: 'Audit Trail', href: '/audit-logs' },
    ]
  },
  {
    group: 'Administrasi Sistem',
    items: [
      { icon: Terminal, label: 'Super Admin Console', href: '/super-admin', adminOnly: true },
      { icon: UserCog, label: 'Manajemen Pengguna', href: '/super-admin/users', adminOnly: true },
      { icon: Settings, label: 'Pengaturan', href: '/settings' },
    ]
  }
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [comingSoon, setComingSoon] = useState<{ isOpen: boolean; name: string }>({ 
    isOpen: false, 
    name: '' 
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleMenuClick = (e: React.MouseEvent, item: MenuItem) => {
    if (item.comingSoon) {
      e.preventDefault();
      setComingSoon({ isOpen: true, name: item.label });
    }
  };

  return (
    <div className="w-80 h-screen bg-[#070b19] text-slate-400 flex flex-col border-r border-white/5 relative overflow-hidden">
      <ComingSoonModal 
        isOpen={comingSoon.isOpen} 
        onClose={() => setComingSoon({ ...comingSoon, isOpen: false })} 
        featureName={comingSoon.name} 
      />
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-64 bg-emerald-600/5 blur-[100px] pointer-events-none" />

      <div className="p-8 pb-4 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-4 text-white group">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shadow-blue-900/40 p-1.5 glow-border">
            <Image src="/logo-minsel.png" alt="Logo Minsel" width={40} height={40} className="object-contain drop-shadow-md" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all">SIHADIR</h1>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> GovTech Minsel
            </p>
          </div>
        </Link>
      </div>

      <div className="px-6 py-2 relative z-10">
        <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-300" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Tenant Aktif</p>
            <p className="text-sm text-white font-bold truncate">Pemkab Minahasa Selatan</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
        {menuGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => {
            const roleName = user?.role?.name?.toUpperCase();
            if (item.adminOnly && roleName !== 'SUPER_ADMIN') return false;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-3">
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{group.group}</h3>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleMenuClick(e, item)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                        isActive 
                          ? "bg-blue-600/15 text-blue-400" 
                          : "hover:bg-white/5 hover:text-slate-200",
                        item.isGlowing && !isActive ? "animate-pulse-fast text-blue-300 bg-blue-900/10" : ""
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-blue-500 glow-blue"
                        />
                      )}
                      
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-300", 
                        isActive ? "text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-slate-500 group-hover:text-slate-300",
                        item.isGlowing ? "text-blue-400" : ""
                      )} />
                      
                      <span className={cn(
                        "font-bold text-sm tracking-wide transition-colors",
                        isActive ? "text-white" : ""
                      )}>
                        {item.label}
                      </span>
                      
                      {item.premium && (
                         <span className="ml-auto text-[9px] bg-gradient-to-r from-blue-600 to-violet-600 text-white px-2 py-0.5 rounded-md font-black shadow-lg shadow-blue-900/50 border border-white/10">PRO</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-[#070b19] to-transparent">
        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-5 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg border border-slate-600 shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-black text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-blue-400 truncate font-bold uppercase tracking-widest mt-0.5">{user?.role?.name || 'System Role'}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl transition-all duration-300 border border-red-500/20 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              <LogOut className="h-4 w-4" />
              Tutup Akses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
