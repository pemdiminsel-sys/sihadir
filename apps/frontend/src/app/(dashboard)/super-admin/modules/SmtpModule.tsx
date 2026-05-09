'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, Server, Lock, Send, CheckCircle2, AlertTriangle, RefreshCw, Eye, EyeOff, Clock } from 'lucide-react';
import api from '@/services/api';

const TEMPLATES = [
  { id: 'registrasi_berhasil', label: 'Registrasi Berhasil', icon: '✅' },
  { id: 'persetujuan_peserta', label: 'Persetujuan Peserta', icon: '👍' },
  { id: 'penolakan_peserta', label: 'Penolakan Peserta', icon: '❌' },
  { id: 'reminder_kegiatan', label: 'Pengingat Kegiatan (H-1)', icon: '📅' },
  { id: 'qr_kehadiran', label: 'QR Kehadiran Dibuka', icon: '📱' },
  { id: 'sertifikat_selesai', label: 'Sertifikat Tersedia', icon: '🏆' },
];

export default function SmtpModule() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'config' | 'logs' | 'templates'>('config');
  const [showPass, setShowPass] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const [form, setForm] = useState({
    host: '', port: 587, username: '', password: '',
    encryption: 'TLS', senderName: 'SIHADIR MINSEL', senderEmail: '', replyTo: '',
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ['smtp-config'],
    queryFn: async () => {
      const r = await api.get('/smtp/config');
      if (r.data) setForm((f: any) => ({ ...f, ...r.data, password: '' }));
      return r.data;
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['smtp-logs'],
    queryFn: async () => (await api.get('/smtp/logs')).data,
    enabled: tab === 'logs',
  });

  const saveMut = useMutation({
    mutationFn: () => api.put('/smtp/config', form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['smtp-config'] }),
  });

  const testMut = useMutation({
    mutationFn: () => api.post('/smtp/test', { to: testEmail }),
    onSuccess: (r) => setTestResult({ ok: true, msg: r.data.message }),
    onError: (e: any) => setTestResult({ ok: false, msg: e.response?.data?.message || 'Koneksi gagal' }),
  });

  const inputCls = 'w-full h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-slate-500';
  const labelCls = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5';

  const statusOk = config?.lastTestOk;

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Status Koneksi', value: config ? (statusOk ? 'Terhubung' : 'Tidak Terhubung') : 'Belum Dikonfigurasi', icon: Server, color: statusOk ? '#10b981' : '#ef4444' },
          { label: 'Server SMTP', value: config?.host || '—', icon: Server, color: '#3b82f6' },
          { label: 'Terakhir Test', value: config?.lastTested ? new Date(config.lastTested).toLocaleDateString('id-ID') : '—', icon: Clock, color: '#f59e0b' },
          { label: 'Email Gagal (24j)', value: logs.filter((l: any) => l.status === 'FAILED').length || 0, icon: AlertTriangle, color: '#ef4444' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.08] transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}20`, border: `1px solid ${kpi.color}40` }}>
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{kpi.label}</p>
              <p className="text-sm font-black text-white mt-0.5 truncate">{String(kpi.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['config', 'logs', 'templates'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t === 'config' ? '⚙️ Konfigurasi SMTP' : t === 'logs' ? '📋 Log Pengiriman' : '📧 Template Email'}
          </button>
        ))}
      </div>

      {/* Config Tab */}
      {tab === 'config' && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengaturan Server SMTP</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>SMTP Host</label>
                <input className={inputCls} placeholder="smtp.gmail.com" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Port</label>
                <input type="number" className={inputCls} placeholder="587" value={form.port} onChange={e => setForm(f => ({ ...f, port: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Username</label>
                <input className={inputCls} placeholder="user@domain.com" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={inputCls + ' pr-10'} placeholder="••••••••"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Enkripsi</label>
              <div className="flex gap-2">
                {['TLS', 'SSL', 'NONE'].map(enc => (
                  <button key={enc} type="button" onClick={() => setForm(f => ({ ...f, encryption: enc }))}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${form.encryption === enc ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                    {enc}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Pengirim</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nama Pengirim</label>
                  <input className={inputCls} placeholder="SIHADIR MINSEL" value={form.senderName} onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Email Pengirim</label>
                  <input type="email" className={inputCls} placeholder="noreply@minsel.go.id" value={form.senderEmail} onChange={e => setForm(f => ({ ...f, senderEmail: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Reply-To Email (opsional)</label>
                <input type="email" className={inputCls} placeholder="admin@minsel.go.id" value={form.replyTo} onChange={e => setForm(f => ({ ...f, replyTo: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 disabled:opacity-60 flex items-center justify-center gap-2">
                {saveMut.isPending ? <><RefreshCw className="w-4 h-4 animate-spin" />Menyimpan…</> : <><CheckCircle2 className="w-4 h-4" />Simpan Konfigurasi</>}
              </button>
            </div>
          </div>

          {/* Test Email */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uji Coba Pengiriman</p>
            <div className="flex gap-3">
              <input className={inputCls} type="email" placeholder="Masukkan email tujuan uji coba..."
                value={testEmail} onChange={e => setTestEmail(e.target.value)} />
              <button onClick={() => { setTestResult(null); testMut.mutate(); }} disabled={testMut.isPending || !testEmail}
                className="px-5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50 flex items-center gap-2 shrink-0">
                {testMut.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Kirim Test
              </button>
            </div>
            {testResult && (
              <div className={`flex items-center gap-2 text-sm p-3 rounded-xl border ${testResult.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {testResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                {testResult.msg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {tab === 'logs' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 grid grid-cols-12 gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <span className="col-span-3">Tipe</span>
            <span className="col-span-5">Tujuan</span>
            <span className="col-span-2 text-center">Percobaan</span>
            <span className="col-span-2 text-right">Status</span>
          </div>
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">Belum ada log pengiriman email</div>
          ) : (
            <div className="divide-y divide-white/5">
              {logs.map((log: any) => (
                <div key={log.id} className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors">
                  <span className="col-span-3 text-xs font-mono text-slate-400">{log.type}</span>
                  <span className="col-span-5 text-xs text-slate-300 truncate">{JSON.stringify(log.payload).substring(0, 40)}…</span>
                  <span className="col-span-2 text-center text-xs text-slate-400">{log.attempts}</span>
                  <span className={`col-span-2 text-right text-[10px] font-black ${log.status === 'COMPLETED' ? 'text-emerald-400' : log.status === 'FAILED' ? 'text-red-400' : 'text-amber-400'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shrink-0">
                {t.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">{t.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Template Aktif · Bahasa Indonesia</p>
              </div>
              <button className="text-[10px] font-black px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
