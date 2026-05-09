'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Lock, Eye, Globe, Ban, CheckCircle2, Clock, Activity } from 'lucide-react';

const THREATS = [
  { id: 'T-001', type: 'BRUTE FORCE', severity: 'CRITICAL', source: '203.194.112.8', target: '/auth/login', time: '2m ago', blocked: true },
  { id: 'T-002', type: 'SQL INJECTION', severity: 'HIGH', source: '45.33.32.156', target: '/api/users', time: '14m ago', blocked: true },
  { id: 'T-003', type: 'TOKEN REPLAY', severity: 'MEDIUM', source: '192.168.1.44', target: '/auth/refresh', time: '1h ago', blocked: false },
  { id: 'T-004', type: 'RATE LIMIT', severity: 'LOW', source: '103.24.77.99', target: '/events', time: '2h ago', blocked: true },
];

const CERTS = [
  { domain: 'sihadir.minsel.go.id', issuer: 'Let\'s Encrypt', expires: '2026-08-15', daysLeft: 98, status: 'VALID' },
  { domain: 'api.sihadir.minsel.go.id', issuer: 'Let\'s Encrypt', expires: '2026-08-15', daysLeft: 98, status: 'VALID' },
  { domain: 'minio.sihadir.minsel.go.id', issuer: 'Self-Signed', expires: '2026-05-23', daysLeft: 14, status: 'EXPIRING' },
];

const AUDIT = [
  { action: 'ROLE_CHANGE', actor: 'super.admin', target: 'user#142', detail: 'Promoted to ADMIN_OPD', time: '10m ago', severity: 'blue' },
  { action: 'PERMISSION_EDIT', actor: 'super.admin', target: 'EventsModule', detail: 'Added DELETE permission', time: '1h ago', severity: 'amber' },
  { action: 'CONFIG_CHANGE', actor: 'super.admin', target: 'JWT_SECRET', detail: 'Secret rotated', time: '3h ago', severity: 'emerald' },
  { action: 'USER_DELETE', actor: 'admin.kominfo', target: 'user#88', detail: 'Account deactivated', time: '6h ago', severity: 'red' },
];

const SEV_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

export default function SecurityModule() {
  const [tab, setTab] = useState<'threats' | 'certs' | 'audit'>('threats');

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Threats Blocked', value: '1,247', icon: Ban, color: '#ef4444' },
          { label: 'Active Sessions', value: '38', icon: Eye, color: '#3b82f6' },
          { label: 'Auth Failures (24h)', value: '14', icon: Lock, color: '#f59e0b' },
          { label: 'Security Score', value: '94/100', icon: ShieldCheck, color: '#10b981' },
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

      {/* Tab nav */}
      <div className="flex gap-2">
        {(['threats', 'certs', 'audit'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'threats' ? '🛡 Threat Detection' : t === 'certs' ? '🔐 SSL Certificates' : '📋 Audit Trail'}
          </button>
        ))}
      </div>

      {tab === 'threats' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Active Threat Intelligence Feed
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {THREATS.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <span className="text-[10px] font-black text-slate-500 w-16 shrink-0">{t.id}</span>
                <div className={`px-2 py-1 rounded-lg border text-[9px] font-black w-28 text-center shrink-0 ${SEV_COLORS[t.severity]}`}>{t.type}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{t.source}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.target}</p>
                </div>
                <span className="text-[10px] text-slate-500 hidden md:block">{t.time}</span>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 shrink-0 ${t.blocked ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
                  {t.blocked ? <><Ban className="w-3 h-3" /> BLOCKED</> : <><Activity className="w-3 h-3" /> MONITORED</>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certs' && (
        <div className="space-y-3">
          {CERTS.map((c, i) => (
            <motion.div key={c.domain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.daysLeft < 30 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'}`}>
                <Lock className={`w-5 h-5 ${c.daysLeft < 30 ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">{c.domain}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Issuer: {c.issuer} · Expires: {c.expires}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-2xl font-black ${c.daysLeft < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{c.daysLeft}d</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">remaining</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black border shrink-0 ${c.status === 'VALID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'}`}>
                {c.status === 'VALID' ? <><CheckCircle2 className="w-3 h-3 inline mr-1" />VALID</> : <><AlertTriangle className="w-3 h-3 inline mr-1" />EXPIRING</>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {AUDIT.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="px-6 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.severity === 'red' ? 'bg-red-400' : a.severity === 'amber' ? 'bg-amber-400' : a.severity === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${a.severity === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400' : a.severity === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : a.severity === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>{a.action}</span>
                    <span className="text-xs text-slate-300 font-bold">{a.actor}</span>
                    <span className="text-xs text-slate-500">→</span>
                    <span className="text-xs text-slate-300">{a.target}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{a.detail}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 shrink-0">
                  <Clock className="w-3 h-3" />{a.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
