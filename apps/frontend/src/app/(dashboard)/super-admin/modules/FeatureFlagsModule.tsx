'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Brain, Sliders, Cpu, MessageSquare, Zap, Globe, CheckCircle2 } from 'lucide-react';

/* ─── Feature Flags ─── */
const FLAGS = [
  { key: 'FACIAL_RECOGNITION', label: 'Facial Recognition Attendance', desc: 'AI-powered face verification untuk kehadiran', enabled: false, env: 'PRODUCTION', risk: 'HIGH' },
  { key: 'QR_DYNAMIC', label: 'Dynamic QR Codes', desc: 'QR berubah setiap 30 detik untuk anti-manipulasi', enabled: true, env: 'ALL', risk: 'LOW' },
  { key: 'WHATSAPP_NOTIF', label: 'WhatsApp Notifications', desc: 'Kirim notifikasi kehadiran via WhatsApp Business', enabled: true, env: 'ALL', risk: 'LOW' },
  { key: 'GPS_GEOFENCING', label: 'GPS Geofencing Validation', desc: 'Validasi lokasi wajib dalam radius 100m venue', enabled: true, env: 'ALL', risk: 'MEDIUM' },
  { key: 'AI_ANOMALY', label: 'AI Anomaly Detection', desc: 'Deteksi kecurangan presensi otomatis dengan ML', enabled: false, env: 'STAGING', risk: 'MEDIUM' },
  { key: 'SPBE_SYNC', label: 'Real-time SPBE Sync', desc: 'Sinkronisasi data langsung ke dashboard SPBE nasional', enabled: false, env: 'PRODUCTION', risk: 'HIGH' },
  { key: 'MULTI_TENANT', label: 'Multi-Tenant Mode', desc: 'Aktifkan isolasi data antar OPD', enabled: true, env: 'ALL', risk: 'LOW' },
  { key: 'BACKUP_AUTO', label: 'Automated Daily Backups', desc: 'Backup database otomatis setiap 02:00 WIB', enabled: true, env: 'ALL', risk: 'LOW' },
];

/* ─── AI Config ─── */
const AI_MODELS = [
  { name: 'Anomaly Detection Engine', model: 'Custom ML v2.1', provider: 'Internal', status: 'ACTIVE', calls24h: 0 },
  { name: 'GPS Fraud Classifier', model: 'XGBoost + Rule Engine', provider: 'Internal', status: 'ACTIVE', calls24h: 0 },
  { name: 'NLP Report Generator', model: 'GPT-4o', provider: 'OpenAI', status: 'STANDBY', calls24h: 0 },
  { name: 'Face Verification', model: 'FaceNet v1.0', provider: 'Internal', status: 'DISABLED', calls24h: 0 },
];

const RISK_COLORS: Record<string, string> = {
  HIGH: 'text-red-400 bg-red-500/10 border-red-500/20',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function FeatureFlagsModule({ onAction }: { onAction: (name: string) => void }) {
  const [flags, setFlags] = useState(FLAGS);
  const [tab, setTab] = useState<'flags' | 'ai' | 'regional'>('flags');

  const toggle = (key: string) => setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Enabled Flags', value: flags.filter(f => f.enabled).length, icon: CheckCircle2, color: '#10b981' },
          { label: 'Disabled Flags', value: flags.filter(f => !f.enabled).length, icon: ToggleLeft, color: '#64748b' },
          { label: 'AI Models Active', value: AI_MODELS.filter(m => m.status === 'ACTIVE').length, icon: Brain, color: '#8b5cf6' },
          { label: 'High Risk Flags', value: flags.filter(f => f.risk === 'HIGH').length, icon: Zap, color: '#ef4444' },
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

      <div className="flex gap-2 flex-wrap">
        {(['flags', 'ai', 'regional'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'flags' ? '🚩 Feature Flags' : t === 'ai' ? '🤖 AI Configuration' : '🗺 Regional Config'}
          </button>
        ))}
      </div>

      {tab === 'flags' && (
        <div className="space-y-3">
          {flags.map((flag, i) => (
            <motion.div key={flag.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className={`bg-white/5 border rounded-2xl p-5 transition-all ${flag.enabled ? 'border-blue-500/20 hover:border-blue-500/40' : 'border-white/10 hover:border-white/20'}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-white">{flag.label}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${RISK_COLORS[flag.risk]}`}>{flag.risk} RISK</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded border bg-slate-700/50 border-slate-600/30 text-slate-400">{flag.env}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{flag.desc}</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1.5 uppercase tracking-widest">{flag.key}</p>
                </div>
                <button onClick={() => toggle(flag.key)}
                  className={`shrink-0 w-12 h-6 rounded-full transition-all duration-300 relative ${flag.enabled ? 'bg-blue-600' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${flag.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 flex items-start gap-4">
            <Brain className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-white">AI Inference Engine</p>
              <p className="text-xs text-slate-400 mt-1">SIHADIR menggunakan ensemble model untuk deteksi anomali kehadiran, validasi GPS, dan generasi laporan otomatis. Semua model berjalan on-premise kecuali NLP Generator.</p>
            </div>
          </div>
          {AI_MODELS.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.status === 'ACTIVE' ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-white/5 border border-white/10'}`}>
                <Cpu className={`w-5 h-5 ${m.status === 'ACTIVE' ? 'text-violet-400' : 'text-slate-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">{m.name}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{m.model} · {m.provider}</p>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <p className="text-sm font-black text-white">{m.calls24h.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">inferences/24h</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black border shrink-0 ${m.status === 'ACTIVE' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : m.status === 'STANDBY' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-700/30 border-slate-600/20 text-slate-500'}`}>
                {m.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'regional' && (
        <div className="space-y-4">
          {[
            { section: 'Identitas Daerah', items: [
              { label: 'Nama Daerah', value: 'Kabupaten Minahasa Selatan', editable: false },
              { label: 'Kode Wilayah (Kemendagri)', value: '71.05', editable: false },
              { label: 'Zona Waktu', value: 'Asia/Makassar (WITA, UTC+8)', editable: true },
              { label: 'Bahasa Default', value: 'Bahasa Indonesia', editable: true },
            ]},
            { section: 'Konfigurasi Presensi', items: [
              { label: 'Radius Geofencing Default', value: '100 meter', editable: true },
              { label: 'Toleransi Keterlambatan', value: '15 menit', editable: true },
              { label: 'Format NIP ASN', value: '18 digit numeric', editable: false },
              { label: 'Instansi Default', value: 'Pemkab Minahasa Selatan', editable: false },
            ]},
          ].map((sec, si) => (
            <div key={sec.section} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-3 border-b border-white/10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{sec.section}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {sec.items.map((item, ii) => (
                  <div key={item.label} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <p className="text-xs text-slate-400 font-bold">{item.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-white text-right">{item.value}</p>
                      {item.editable && (
                        <button 
                          onClick={() => onAction(`Pengaturan ${item.label}`)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <Sliders className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
