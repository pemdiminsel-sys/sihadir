'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, CheckCircle2, XCircle, Clock, BarChart2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const ENDPOINTS = [
  { method: 'POST', path: '/auth/login', calls: 14280, p95: '48ms', p99: '112ms', errors: 14, status: 'OK' },
  { method: 'GET', path: '/events', calls: 8420, p95: '22ms', p99: '45ms', errors: 0, status: 'OK' },
  { method: 'POST', path: '/attendance', calls: 6840, p95: '35ms', p99: '88ms', errors: 2, status: 'OK' },
  { method: 'GET', path: '/participants', calls: 4210, p95: '18ms', p99: '32ms', errors: 0, status: 'OK' },
  { method: 'POST', path: '/files/upload', calls: 842, p95: '340ms', p99: '680ms', errors: 8, status: 'DEGRADED' },
  { method: 'GET', path: '/reports/certificate/:id', calls: 2100, p95: '210ms', p99: '420ms', errors: 0, status: 'OK' },
];

const TRAFFIC_DATA = Array.from({ length: 12 }, (_, i) => ({
  h: `${i * 2}h`,
  calls: Math.floor(Math.random() * 8000) + 2000,
  errors: Math.floor(Math.random() * 80),
}));

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  POST: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  PATCH: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  DELETE: 'bg-red-500/10 border-red-500/30 text-red-400',
};

const INTEGRATIONS = [
  { name: 'SIASN BKN API', desc: 'ASN data sync & NIP validation', status: 'HEALTHY', calls24h: 1240, lastSync: '2m ago' },
  { name: 'WhatsApp Business API', desc: 'Notification delivery engine', status: 'HEALTHY', calls24h: 3840, lastSync: '1m ago' },
  { name: 'MinIO S3 Gateway', desc: 'Document & certificate storage', status: 'HEALTHY', calls24h: 842, lastSync: '5s ago' },
  { name: 'SPBE Dashboard Gov', desc: 'Compliance reporting endpoint', status: 'DEGRADED', calls24h: 12, lastSync: '2h ago' },
];

export default function ApiModule() {
  const [tab, setTab] = useState<'endpoints' | 'integrations' | 'traffic'>('endpoints');

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests (24h)', value: '36.5K', icon: Zap, color: '#3b82f6' },
          { label: 'Avg Latency', value: '28ms', icon: Activity, color: '#10b981' },
          { label: 'Error Rate', value: '0.07%', icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Uptime SLA', value: '99.97%', icon: CheckCircle2, color: '#8b5cf6' },
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
      <div className="flex gap-2 flex-wrap">
        {(['endpoints', 'integrations', 'traffic'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'endpoints' ? '⚡ API Endpoints' : t === 'integrations' ? '🔗 Integration Hub' : '📊 Traffic Analytics'}
          </button>
        ))}
      </div>

      {tab === 'endpoints' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 grid grid-cols-12 gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <span className="col-span-1">Method</span>
            <span className="col-span-4">Endpoint</span>
            <span className="col-span-2 text-right">Calls/24h</span>
            <span className="col-span-1 text-right">P95</span>
            <span className="col-span-1 text-right">P99</span>
            <span className="col-span-1 text-right">Errors</span>
            <span className="col-span-2 text-right">Status</span>
          </div>
          <div className="divide-y divide-white/5">
            {ENDPOINTS.map((ep, i) => (
              <motion.div key={ep.path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors">
                <div className="col-span-1">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${METHOD_COLORS[ep.method] || ''}`}>{ep.method}</span>
                </div>
                <span className="col-span-4 text-xs font-mono text-slate-300">{ep.path}</span>
                <span className="col-span-2 text-right text-xs font-bold text-white">{ep.calls.toLocaleString()}</span>
                <span className="col-span-1 text-right text-xs font-mono text-emerald-400">{ep.p95}</span>
                <span className="col-span-1 text-right text-xs font-mono text-amber-400">{ep.p99}</span>
                <span className={`col-span-1 text-right text-xs font-bold ${ep.errors > 0 ? 'text-red-400' : 'text-slate-500'}`}>{ep.errors}</span>
                <div className="col-span-2 flex justify-end">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${ep.status === 'OK' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                    {ep.status === 'OK' ? <><CheckCircle2 className="w-3 h-3 inline mr-1" />OK</> : <><AlertTriangle className="w-3 h-3 inline mr-1" />DEGRADED</>}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="space-y-3">
          {INTEGRATIONS.map((int, i) => (
            <motion.div key={int.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className={`w-3 h-12 rounded-full shrink-0 ${int.status === 'HEALTHY' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">{int.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{int.desc}</p>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <p className="text-sm font-black text-white">{int.calls24h.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">calls/24h</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{int.lastSync}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black border flex items-center gap-1.5 shrink-0 ${int.status === 'HEALTHY' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                {int.status === 'HEALTHY' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}{int.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'traffic' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wide">API Traffic Volume — Last 24 Hours</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRAFFIC_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9' }} />
                <Bar dataKey="calls" fill="#3b82f6" opacity={0.8} radius={[4, 4, 0, 0]} />
                <Bar dataKey="errors" fill="#ef4444" opacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-xs text-slate-400">Total Calls</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-xs text-slate-400">Errors</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
