'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Archive, Clock, CheckCircle2, AlertTriangle, RefreshCw, Download, Trash2, Database } from 'lucide-react';

/* ─── Storage ─── */
const BUCKETS = [
  { name: 'sihadir-documents', type: 'Sertifikat & Dokumen', size: '0 GB', objects: 0, access: 'PRIVATE' },
  { name: 'sihadir-photos', type: 'Foto Peserta & KTP', size: '0 GB', objects: 0, access: 'PRIVATE' },
  { name: 'sihadir-qr-codes', type: 'QR Code Cache', size: '0 GB', objects: 0, access: 'PUBLIC-READ' },
  { name: 'sihadir-exports', type: 'Laporan & Ekspor', size: '0 GB', objects: 0, access: 'PRIVATE' },
];
const TOTAL_USED = 0.0;
const TOTAL_CAP = 100;

/* ─── Backup ─── */
const BACKUPS: any[] = [];

/* ─── Queue ─── */
const QUEUES = [
  { name: 'notification:whatsapp', pending: 0, completed: 0, failed: 0, workers: 3, rate: '0/min' },
  { name: 'notification:email', pending: 0, completed: 0, failed: 0, workers: 2, rate: '0/min' },
  { name: 'attendance:sync', pending: 0, completed: 0, failed: 0, workers: 1, rate: '0/min' },
  { name: 'export:pdf', pending: 0, completed: 0, failed: 0, workers: 2, rate: '0/min' },
  { name: 'backup:database', pending: 0, completed: 0, failed: 0, workers: 1, rate: 'Scheduled' },
];

export default function StorageModule({ onAction }: { onAction: (name: string) => void }) {
  const [tab, setTab] = useState<'storage' | 'backup' | 'queue'>('storage');
  const [restoring, setRestoring] = useState<string | null>(null);

  const startRestore = (id: string) => {
    setRestoring(id);
    setTimeout(() => setRestoring(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Storage Used', value: `${TOTAL_USED} GB`, sub: `of ${TOTAL_CAP} GB`, icon: HardDrive, color: '#3b82f6' },
          { label: 'Total Backups', value: BACKUPS.length, sub: `${BACKUPS.filter(b=>b.status==='VERIFIED').length} verified`, icon: Archive, color: '#10b981' },
          { label: 'Queue Pending', value: QUEUES.reduce((s,q)=>s+q.pending,0), sub: 'across all queues', icon: Clock, color: '#f59e0b' },
          { label: 'Queue Failed', value: QUEUES.reduce((s,q)=>s+q.failed,0), sub: 'last 24h', icon: AlertTriangle, color: '#ef4444' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-all cursor-pointer"
            onClick={() => onAction(`Detail Storage: ${kpi.label}`)}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}20`, border: `1px solid ${kpi.color}40` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{kpi.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['storage', 'backup', 'queue'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'storage' ? '💾 Storage Management' : t === 'backup' ? '🗄 Backup & Recovery' : '📬 Queue Monitor'}
          </button>
        ))}
      </div>

      {tab === 'storage' && (
        <div className="space-y-4">
          {/* Usage bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Storage Utilization</p>
                <p className="text-3xl font-black text-white mt-1">{TOTAL_USED} <span className="text-sm text-slate-400">/ {TOTAL_CAP} GB</span></p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-400">{((TOTAL_USED/TOTAL_CAP)*100).toFixed(1)}%</p>
                <p className="text-[10px] text-slate-500 uppercase">utilization</p>
              </div>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                initial={{ width: 0 }} animate={{ width: `${(TOTAL_USED/TOTAL_CAP)*100}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
            </div>
          </div>

          {/* Buckets */}
          {BUCKETS.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onAction(`Bucket ${b.name}`)}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white font-mono">{b.name}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{b.type} · {b.objects.toLocaleString()} objects</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-white">{b.size}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded border shrink-0 ${b.access === 'PRIVATE' ? 'bg-slate-700/50 border-slate-600/30 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>{b.access}</span>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'backup' && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => onAction('Run Backup Now')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/30"
            >
              <Archive className="w-3.5 h-3.5" /> Run Backup Now
            </button>
          </div>
          {BACKUPS.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <Archive className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Belum ada backup tersedia</p>
              <p className="text-[10px] text-slate-600 mt-1">Backup otomatis dijadwalkan setiap hari pukul 02:00 WITA</p>
            </div>
          ) : BACKUPS.map((bk, i) => (
            <motion.div key={bk.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className={`bg-white/5 border rounded-2xl p-5 flex items-center gap-4 transition-all ${bk.status === 'CORRUPTED' ? 'border-red-500/20' : 'border-white/10 hover:border-white/20'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bk.status === 'VERIFIED' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                {bk.status === 'VERIFIED' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-white">{bk.label}</p>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded border bg-slate-700/50 border-slate-600/30 text-slate-400">{bk.type}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{bk.id} · {bk.created}</p>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <p className="text-sm font-black text-white">{bk.size}</p>
              </div>
              {bk.status === 'VERIFIED' ? (
                <button onClick={() => onAction('Restore Backup')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest transition-all shrink-0">
                  <Download className="w-3 h-3" />Restore
                </button>
              ) : (
                <span className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-3 h-3" />CORRUPTED
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'queue' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 grid grid-cols-12 gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <span className="col-span-4">Queue Name</span>
            <span className="col-span-1 text-right">Pending</span>
            <span className="col-span-2 text-right">Completed</span>
            <span className="col-span-1 text-right">Failed</span>
            <span className="col-span-2 text-right">Rate</span>
            <span className="col-span-2 text-right">Workers</span>
          </div>
          <div className="divide-y divide-white/5">
            {QUEUES.map((q, i) => (
              <motion.div key={q.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors">
                <div className="col-span-4 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-xs font-mono text-slate-300 truncate">{q.name}</span>
                </div>
                <span className={`col-span-1 text-right text-xs font-black ${q.pending > 0 ? 'text-amber-400' : 'text-slate-500'}`}>{q.pending}</span>
                <span className="col-span-2 text-right text-xs font-bold text-emerald-400">{q.completed.toLocaleString()}</span>
                <span className={`col-span-1 text-right text-xs font-black ${q.failed > 0 ? 'text-red-400' : 'text-slate-500'}`}>{q.failed}</span>
                <span className="col-span-2 text-right text-xs font-mono text-blue-400">{q.rate}</span>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {Array.from({length: q.workers}).map((_,wi) => (
                    <div key={wi} className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay:`${wi*0.3}s`}} />
                  ))}
                  <span className="text-[10px] text-slate-500 ml-1">{q.workers}x</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
