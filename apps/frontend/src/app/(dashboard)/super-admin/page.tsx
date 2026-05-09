'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Shield, Users, Zap, HardDrive, Flag, Award, Terminal,
  Activity, Clock, ChevronRight, Globe, AlertTriangle, CheckCircle2,
  Layers, Database, Brain
} from 'lucide-react';

import InfrastructureModule from './modules/InfrastructureModule';
import SecurityModule from './modules/SecurityModule';
import IdentityModule from './modules/IdentityModule';
import ApiModule from './modules/ApiModule';
import StorageModule from './modules/StorageModule';
import FeatureFlagsModule from './modules/FeatureFlagsModule';
import ComplianceModule from './modules/ComplianceModule';
import SmtpModule from './modules/SmtpModule';
import OpdManagementModule from './modules/OpdManagementModule';
import ComingSoonModal from '@/components/modals/ComingSoonModal';

/* ─── Nav Modules ─── */
const MODULES = [
  {
    id: 'infrastructure', label: 'Infrastructure', icon: Server,
    badge: 'LIVE', badgeColor: 'emerald',
    desc: 'Server, DB, Redis, MinIO',
    group: 'Platform Core',
  },
  {
    id: 'security', label: 'Security Center', icon: Shield,
    badge: 'SECURE', badgeColor: 'emerald',
    desc: 'Threats, SSL, Audit',
    group: 'Platform Core',
  },
  {
    id: 'identity', label: 'Identity & SSO', icon: Users,
    badge: '1 TENANT', badgeColor: 'blue',
    desc: 'Tenants, Roles, SSO',
    group: 'Platform Core',
  },
  {
    id: 'opd', label: 'OPD Management', icon: Building2,
    badge: null, badgeColor: 'blue',
    desc: 'Kelola Organisasi Perangkat Daerah',
    group: 'Platform Core',
  },
  {
    id: 'api', label: 'API Management', icon: Zap,
    badge: 'HEALTHY', badgeColor: 'emerald',
    desc: 'Endpoints, Integrations',
    group: 'Platform Core',
  },
  {
    id: 'smtp', label: 'SMTP & Email', icon: Server,
    badge: null, badgeColor: 'blue',
    desc: 'Konfigurasi, Template, Log',
    group: 'Platform Core',
  },
  {
    id: 'storage', label: 'Storage & Queue', icon: HardDrive,
    badge: null, badgeColor: 'amber',
    desc: 'MinIO, Backup, Bull',
    group: 'Operations',
  },
  {
    id: 'flags', label: 'Features & AI', icon: Brain,
    badge: null, badgeColor: 'violet',
    desc: 'Flags, AI, Regional',
    group: 'Operations',
  },
  {
    id: 'compliance', label: 'Compliance', icon: Award,
    badge: null, badgeColor: 'amber',
    desc: 'SPBE, Regulasi, Maintenance',
    group: 'Operations',
  },
];

const BADGE_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

const GLOW_COLORS: Record<string, string> = {
  emerald: 'shadow-emerald-500/20',
  red: 'shadow-red-500/20',
  amber: 'shadow-amber-500/20',
  blue: 'shadow-blue-500/20',
  violet: 'shadow-violet-500/20',
};

/* ─── Live Ticker Messages ─── */
const TICKER = [
  '🟢 Platform SIHADIR Minsel operational',
  '🛡️ Security center active — No threats detected',
  '📊 SPBE Score: 85.0% — Kabupaten Minahasa Selatan',
  '💾 Scheduled backup active (02:00 WITA)',
  '⚡ API Status: Healthy — within SLA',
  '👤 System initialized for production deployment',
  '🔐 SSL Certificate for sihadir.minsel.go.id is VALID',
];

export default function SuperAdminConsolePage() {
  const [active, setActive] = useState('infrastructure');
  const [time, setTime] = useState(new Date());
  const [tickerIdx, setTickerIdx] = useState(0);
  const [comingSoon, setComingSoon] = useState({ isOpen: false, name: '' });

  const handleAction = (name: string) => {
    setComingSoon({ isOpen: true, name });
  };

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER.length), 4000);
    return () => clearInterval(t);
  }, []);

  const activeModule = MODULES.find(m => m.id === active)!;
  const groups = Array.from(new Set(MODULES.map(m => m.group)));

  return (
    <div className="min-h-screen bg-[#050a18] text-slate-100 relative overflow-hidden -m-6 md:-m-8">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-1/2" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22 width=%2240%22 height=%2240%22 fill=%22none%22 stroke=%22rgb(255 255 255 / 0.02)%22%3E%3Cpath d=%22M0 .5H39.5V40%22/%3E%3C/svg%3E')] opacity-100" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <ComingSoonModal 
          isOpen={comingSoon.isOpen} 
          onClose={() => setComingSoon({ ...comingSoon, isOpen: false })} 
          featureName={comingSoon.name} 
        />

        {/* ── HEADER ── */}
        <header className="shrink-0 border-b border-white/[0.06] bg-[#050a18]/80 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/20">
                <Terminal className="w-5 h-5 text-white drop-shadow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                    SIHADIR SUPER ADMIN CONSOLE
                  </h1>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded border bg-violet-500/10 border-violet-500/20 text-violet-400 tracking-widest">v2.0</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                  GovTech Platform · Pemkab Minahasa Selatan · SPBE Infrastructure Control
                </p>
              </div>
            </div>

            {/* Status + Clock */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">All Systems Go</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-black text-red-400 tracking-widest uppercase">2 Threats</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-blue-400 tracking-tighter tabular-nums">
                  {time.toLocaleTimeString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} · WITA
                </div>
              </div>
            </div>
          </div>

          {/* Live Ticker */}
          <div className="border-t border-white/[0.04] flex items-center h-8 overflow-hidden">
            <div className="bg-blue-600 h-full px-4 flex items-center text-[9px] font-black text-white tracking-[0.2em] shrink-0 z-10">
              SYS INTEL
            </div>
            <div className="flex-1 px-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tickerIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] font-bold text-slate-400 whitespace-nowrap"
                >
                  {TICKER[tickerIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT NAV ── */}
          <nav className="w-64 shrink-0 border-r border-white/[0.06] bg-[#050a18]/60 backdrop-blur-xl overflow-y-auto custom-scrollbar p-4 space-y-6">
            {groups.map(group => (
              <div key={group}>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] px-3 mb-2">{group}</p>
                <div className="space-y-1">
                  {MODULES.filter(m => m.group === group).map(mod => {
                    const isActive = mod.id === active;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => setActive(mod.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 text-left group relative ${
                          isActive
                            ? 'bg-blue-600/15 border border-blue-500/20 shadow-lg shadow-blue-600/10'
                            : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                        }`}
                      >
                        {isActive && (
                          <motion.div layoutId="nav-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-500"
                            style={{ boxShadow: '0 0 10px rgba(59,130,246,0.6)' }} />
                        )}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-blue-600/30 border border-blue-500/30' : 'bg-white/5 border border-white/5 group-hover:bg-white/10'}`}>
                          <mod.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black truncate ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{mod.label}</p>
                          <p className="text-[9px] text-slate-600 truncate mt-0.5">{mod.desc}</p>
                        </div>
                        {mod.badge && (
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border shrink-0 ${BADGE_COLORS[mod.badgeColor]}`}>
                            {mod.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] px-3 mb-2">Quick Links</p>
              {[
                { label: 'Users Management', icon: Users },
                { label: 'Audit Trail', icon: Layers },
                { label: 'Command Center', icon: Globe },
              ].map(link => (
                <button key={link.label} onClick={() => handleAction(link.label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all group text-left">
                  <link.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold">{link.label}</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </nav>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Module Header */}
            <div className="sticky top-0 z-20 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/[0.06] px-8 py-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg ${BADGE_COLORS[activeModule.badgeColor]} ${GLOW_COLORS[activeModule.badgeColor]}`}>
                  <activeModule.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">{activeModule.label}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{activeModule.desc}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {activeModule.badge && (
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${BADGE_COLORS[activeModule.badgeColor]}`}>
                      {activeModule.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Activity className="w-3 h-3" />
                    <span className="font-bold uppercase tracking-wider">Last refreshed: just now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {active === 'infrastructure' && <InfrastructureModule onAction={handleAction} />}
                  {active === 'security' && <SecurityModule onAction={handleAction} />}
                  {active === 'identity' && <IdentityModule onAction={handleAction} />}
                  {active === 'api' && <ApiModule onAction={handleAction} />}
                  {active === 'smtp' && <SmtpModule onAction={handleAction} />}
                  {active === 'storage' && <StorageModule onAction={handleAction} />}
                  {active === 'flags' && <FeatureFlagsModule onAction={handleAction} />}
                  {active === 'compliance' && <ComplianceModule onAction={handleAction} />}
                  {active === 'opd' && <OpdManagementModule onAction={handleAction} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.4); }
      `}</style>
    </div>
  );
}
