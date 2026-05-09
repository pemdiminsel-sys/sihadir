'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, ShieldCheck, Globe, TrendingUp, CheckCircle2, Clock, AlertTriangle, Award, BookOpen } from 'lucide-react';

const SPBE_DOMAINS = [
  { domain: 'Kebijakan Internal', score: 4.2, max: 5, weight: 20, status: 'COMPLIANT' },
  { domain: 'Tata Kelola TIK', score: 3.8, max: 5, weight: 25, status: 'COMPLIANT' },
  { domain: 'Manajemen Layanan', score: 4.5, max: 5, weight: 20, status: 'COMPLIANT' },
  { domain: 'Manajemen SDM TIK', score: 3.2, max: 5, weight: 15, status: 'PARTIAL' },
  { domain: 'Penyelenggara SPBE', score: 2.8, max: 5, weight: 20, status: 'PARTIAL' },
];

const REGULATIONS = [
  { ref: 'Perpres No. 95/2018', title: 'SPBE Nasional', status: 'COMPLIANT', lastCheck: '01 May 2026' },
  { ref: 'PP No. 71/2019', title: 'Penyelenggaraan SPBE', status: 'COMPLIANT', lastCheck: '01 May 2026' },
  { ref: 'Permendagri No. 90/2019', title: 'Klasifikasi Urusan Pemda', status: 'PARTIAL', lastCheck: '15 Apr 2026' },
  { ref: 'UU No. 27/2022', title: 'Perlindungan Data Pribadi (PDP)', status: 'IN PROGRESS', lastCheck: '01 May 2026' },
  { ref: 'SNI ISO/IEC 27001:2022', title: 'Information Security Management', status: 'PARTIAL', lastCheck: '20 Apr 2026' },
];

const MAINTENANCE_SCHEDULE = [
  { task: 'Database Vacuum & Reindex', scheduled: '2026-05-10 02:00 WITA', duration: '~15 min', impact: 'None — online', status: 'SCHEDULED' },
  { task: 'SSL Certificate Renewal (MinIO)', scheduled: '2026-05-23 03:00 WITA', duration: '~5 min', impact: 'Brief storage unavailability', status: 'SCHEDULED' },
  { task: 'NestJS Dependency Updates', scheduled: '2026-05-15 01:00 WITA', duration: '~30 min', impact: 'API restart required', status: 'PENDING APPROVAL' },
  { task: 'Full System Backup', scheduled: 'Daily 02:00 WITA', duration: '~20 min', impact: 'None — background', status: 'RECURRING' },
];

const STATUS_COLORS: Record<string, string> = {
  COMPLIANT: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  PARTIAL: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'IN PROGRESS': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  SCHEDULED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'PENDING APPROVAL': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  RECURRING: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const overallScore = SPBE_DOMAINS.reduce((s, d) => s + (d.score / d.max) * d.weight, 0) / SPBE_DOMAINS.reduce((s, d) => s + d.weight, 0) * 100;

export default function ComplianceModule({ onAction }: { onAction: (name: string) => void }) {
  const [tab, setTab] = useState<'spbe' | 'regulations' | 'maintenance'>('spbe');

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'SPBE Score', value: `${overallScore.toFixed(1)}%`, icon: Award, color: '#f59e0b' },
          { label: 'Compliant Regs', value: `${REGULATIONS.filter(r=>r.status==='COMPLIANT').length}/${REGULATIONS.length}`, icon: CheckCircle2, color: '#10b981' },
          { label: 'Partial Compliance', value: REGULATIONS.filter(r=>r.status==='PARTIAL').length, icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Maintenance Pending', value: MAINTENANCE_SCHEDULE.filter(m=>m.status !== 'RECURRING').length, icon: Clock, color: '#3b82f6' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-all cursor-pointer"
            onClick={() => onAction(`Detail Compliance: ${kpi.label}`)}
          >
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

      <div className="flex gap-2 flex-wrap">
        {(['spbe', 'regulations', 'maintenance'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'spbe' ? '🏆 SPBE Scorecard' : t === 'regulations' ? '📜 Regulatory Compliance' : '🔧 System Maintenance'}
          </button>
        ))}
      </div>

      {tab === 'spbe' && (
        <div className="space-y-4">
          {/* Overall score card */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                <motion.circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="2.5"
                  strokeDasharray="100" initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - overallScore }} transition={{ duration: 1.5, ease: 'easeOut' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-amber-400">{overallScore.toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">SPBE Overall Score — Pemkab Minahasa Selatan</p>
              <p className="text-2xl font-black text-white mt-1">Indeks SPBE: <span className="text-amber-400">{(overallScore / 20).toFixed(2)}</span> / 5.00</p>
              <p className="text-xs text-slate-400 mt-1">Berdasarkan Perpres No. 95 Tahun 2018 · Evaluasi Terakhir: 01 Mei 2026</p>
            </div>
          </div>

          {/* Domain breakdown */}
          {SPBE_DOMAINS.map((d, i) => (
            <motion.div key={d.domain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onAction(`Domain SPBE: ${d.domain}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-black text-white">{d.domain}</p>
                  <span className="text-[9px] font-black text-slate-500">bobot {d.weight}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{d.score}</span>
                  <span className="text-slate-500">/ {d.max}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ml-2 ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: 0 }} animate={{ width: `${(d.score / d.max) * 100}%` }} transition={{ duration: 1, delay: i * 0.08 }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'regulations' && (
        <div className="space-y-3">
          {REGULATIONS.map((r, i) => (
            <motion.div key={r.ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onAction(`Regulasi: ${r.title}`)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${STATUS_COLORS[r.status]}`}>
                {r.status === 'COMPLIANT' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">{r.title}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{r.ref}</p>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{r.lastCheck}</p>
              </div>
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border shrink-0 ${STATUS_COLORS[r.status]}`}>{r.status}</span>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'maintenance' && (
        <div className="space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-300">Semua jadwal maintenance telah dikomunikasikan ke tim OPD. Window maintenance dijadwalkan di luar jam kerja (00:00–06:00 WITA).</p>
          </div>
          {MAINTENANCE_SCHEDULE.map((m, i) => (
            <motion.div key={m.task} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onAction(`Detail Maintenance ${m.task}`)}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">{m.task}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                  📅 {m.scheduled} · ⏱ {m.duration}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Impact: {m.impact}</p>
              </div>
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border shrink-0 ${STATUS_COLORS[m.status]}`}>{m.status}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
