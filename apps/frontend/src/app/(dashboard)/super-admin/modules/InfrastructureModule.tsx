'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Activity, Wifi, Database, Zap, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const genSeries = (n: number, base: number, variance: number) =>
  Array.from({ length: n }, (_, i) => ({
    t: `${i}:00`,
    v: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance)),
  }));

const METRICS = [
  { key: 'cpu', label: 'CPU Utilization', icon: Cpu, color: '#3b82f6', glow: 'shadow-blue-500/30', base: 24, variance: 30 },
  { key: 'ram', label: 'Memory Usage', icon: Activity, color: '#8b5cf6', glow: 'shadow-violet-500/30', base: 42, variance: 20 },
  { key: 'disk', label: 'Disk I/O', icon: HardDrive, color: '#f59e0b', glow: 'shadow-amber-500/30', base: 18, variance: 15 },
  { key: 'net', label: 'Network Throughput', icon: Wifi, color: '#10b981', glow: 'shadow-emerald-500/30', base: 55, variance: 40 },
];

const SERVICES = [
  { name: 'NestJS API Server', port: 3005, status: 'RUNNING', uptime: '14d 6h 22m', latency: '12ms', icon: Server },
  { name: 'PostgreSQL 15', port: 5433, status: 'RUNNING', uptime: '14d 6h 22m', latency: '2ms', icon: Database },
  { name: 'Redis Cache', port: 6379, status: 'RUNNING', uptime: '14d 6h 18m', latency: '0.4ms', icon: Zap },
  { name: 'MinIO Object Storage', port: 9000, status: 'RUNNING', uptime: '14d 5h 59m', latency: '8ms', icon: HardDrive },
  { name: 'Next.js Frontend', port: 3001, status: 'RUNNING', uptime: '2h 10m', latency: '—', icon: Activity },
  { name: 'Bull Queue Worker', port: null, status: 'RUNNING', uptime: '14d 6h 22m', latency: '—', icon: Wifi },
];

export default function InfrastructureModule({ onAction }: { onAction: (name: string) => void }) {
  const [series] = useState(() => METRICS.map(m => ({ key: m.key, data: genSeries(24, m.base, m.variance) })));
  const [live, setLive] = useState(() => METRICS.map(m => m.base));

  useEffect(() => {
    const t = setInterval(() => {
      setLive(prev => prev.map((v, i) => Math.max(5, Math.min(95, v + (Math.random() - 0.5) * 8))));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onAction(`Detail ${m.label}`)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: `inset 0 0 40px ${m.color}15` }} />
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}20`, border: `1px solid ${m.color}40` }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">LIVE</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{m.label}</p>
            <div className="text-3xl font-black text-white mt-1">{live[i].toFixed(1)}<span className="text-sm text-slate-400 font-bold ml-1">%</span></div>
            {/* Mini sparkline */}
            <div className="h-10 mt-3 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series[i].data}>
                  <defs>
                    <linearGradient id={`g-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={m.color} strokeWidth={1.5} fill={`url(#g-${m.key})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* usage bar */}
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: m.color }}
                animate={{ width: `${live[i]}%` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Service Health Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white tracking-wide uppercase">Service Registry</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            ALL SERVICES OPERATIONAL
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <svc.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{svc.name}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                  {svc.port ? `PORT :${svc.port}` : 'BACKGROUND WORKER'} • UPTIME {svc.uptime}
                </p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Latency</p>
                <p className="text-sm font-black text-white mt-0.5">{svc.latency}</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 tracking-widest">{svc.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
