'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, ShieldCheck, Key, UserPlus, ToggleLeft, ToggleRight, Globe } from 'lucide-react';

const TENANTS = [
  { id: 'T-001', name: 'Pemkab Minahasa Selatan', slug: 'minsel', users: 842, plan: 'ENTERPRISE', status: 'ACTIVE', region: 'Sulawesi Utara' },
  { id: 'T-002', name: 'Dinas Kominfo Minsel', slug: 'kominfo-minsel', users: 48, plan: 'PROFESSIONAL', status: 'ACTIVE', region: 'Sulawesi Utara' },
  { id: 'T-003', name: 'BKPSDM Minsel', slug: 'bkpsdm-minsel', users: 124, plan: 'PROFESSIONAL', status: 'ACTIVE', region: 'Sulawesi Utara' },
  { id: 'T-004', name: 'Dinas Kesehatan Minsel', slug: 'dinkes-minsel', users: 210, plan: 'STANDARD', status: 'SUSPENDED', region: 'Sulawesi Utara' },
];

const ROLES = [
  { name: 'SUPER_ADMIN', desc: 'Full system access — unrestricted', users: 2, color: '#ef4444' },
  { name: 'ADMIN_OPD', desc: 'OPD-scoped admin with event management', users: 18, color: '#f59e0b' },
  { name: 'OPERATOR', desc: 'Event creation & attendance oversight', users: 94, color: '#3b82f6' },
  { name: 'PESERTA', desc: 'Attendance submission only', users: 728, color: '#10b981' },
];

const SSO_PROVIDERS = [
  { name: 'SIASN BKN Integration', type: 'OAuth 2.0', status: 'CONNECTED', icon: '🏛' },
  { name: 'Google Workspace', type: 'OIDC', status: 'CONNECTED', icon: '🟡' },
  { name: 'LDAP / Active Directory', type: 'LDAP v3', status: 'DISABLED', icon: '🔷' },
];

const PLAN_COLORS: Record<string, string> = {
  ENTERPRISE: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
  PROFESSIONAL: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  STANDARD: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
};

export default function IdentityModule() {
  const [tab, setTab] = useState<'tenants' | 'roles' | 'sso'>('tenants');

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '842', icon: Users, color: '#3b82f6' },
          { label: 'Active Tenants', value: '3', icon: Building2, color: '#10b981' },
          { label: 'Active Sessions', value: '38', icon: Globe, color: '#8b5cf6' },
          { label: 'MFA Adoption', value: '87%', icon: ShieldCheck, color: '#f59e0b' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}20`, border: `1px solid ${kpi.color}40` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['tenants', 'roles', 'sso'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'tenants' ? '🏢 Tenant Management' : t === 'roles' ? '🔐 Role Matrix' : '🔑 SSO Providers'}
          </button>
        ))}
      </div>

      {tab === 'tenants' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30">
              <UserPlus className="w-3.5 h-3.5" /> Provision Tenant
            </button>
          </div>
          {TENANTS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-xl">🏛</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-black text-white">{t.name}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${PLAN_COLORS[t.plan]}`}>{t.plan}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.slug}.sihadir.go.id · {t.region}</p>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <p className="text-lg font-black text-white">{t.users}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">users</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black border shrink-0 flex items-center gap-1.5 ${t.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                {t.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'roles' && (
        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="w-3 h-12 rounded-full shrink-0" style={{ background: r.color }} />
              <div className="flex-1">
                <p className="text-sm font-black text-white">{r.name}</p>
                <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-white">{r.users}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">assigned</p>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all shrink-0">
                <Key className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'sso' && (
        <div className="space-y-3">
          {SSO_PROVIDERS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="text-2xl shrink-0">{p.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">{p.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{p.type}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black border shrink-0 ${p.status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 border-slate-600/30 text-slate-500'}`}>
                {p.status === 'CONNECTED' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {p.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
