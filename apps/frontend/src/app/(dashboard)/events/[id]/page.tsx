'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import api from '@/services/api';
import {
  Calendar, MapPin, Users, QrCode, Activity, Settings, ChevronLeft,
  Check, Clock, Shield, UserCheck, UserX, MoreHorizontal, RefreshCw,
  Download, AlertTriangle, CheckCircle2, Hourglass, List, LayoutGrid, Send,
  Pencil, Trash2, X, Info, Settings2, QrCode as QrIcon, Bell, MapPin as PinIcon
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const TABS = [
  { id: 'ringkasan', label: 'Ringkasan', icon: Activity },
  { id: 'peserta', label: 'Peserta & Registrasi', icon: Users },
  { id: 'kehadiran', label: 'Data Kehadiran', icon: Check },
  { id: 'qr', label: 'QR Live', icon: QrCode },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT:     { label: 'Draf',      color: 'bg-slate-100 text-slate-600' },
  PUBLISHED: { label: 'Aktif',     color: 'bg-emerald-100 text-emerald-700' },
  ARCHIVED:  { label: 'Diarsipkan', color: 'bg-amber-100 text-amber-700' },
};

const REG_STATUS: Record<string, { label: string; color: string; icon: any }> = {
  MENUNGGU:     { label: 'Menunggu',    color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: Hourglass },
  DISETUJUI:    { label: 'Disetujui',   color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: UserCheck },
  DITOLAK:      { label: 'Ditolak',     color: 'bg-red-100 text-red-700 border-red-200',         icon: UserX },
  WAITING_LIST: { label: 'Waiting List', color: 'bg-blue-100 text-blue-700 border-blue-200',     icon: List },
  HADIR:        { label: 'Hadir',       color: 'bg-violet-100 text-violet-700 border-violet-200', icon: CheckCircle2 },
};

function QRLivePanel({ eventId, event }: { eventId: string; event: any }) {
  const [qr, setQr] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const interval = event?.qrRefreshInterval || 60;

  const fetchQR = useCallback(async () => {
    try {
      const res = await api.post(`/events/${eventId}/generate-qr`);
      setQr(res.data);
      setCountdown(interval);
    } catch {}
  }, [eventId, interval]);

  useEffect(() => { fetchQR(); }, [fetchQR]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { fetchQR(); return interval; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [countdown, interval, fetchQR]);

  const pct = ((interval - countdown) / interval) * 100;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        {event?.dynamicQr ? `QR Dinamis — refresh setiap ${interval} detik` : 'QR Statis'}
      </div>

      {qr ? (
        <div className="relative">
          <div className="w-64 h-64 bg-white border-4 border-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl p-6">
            <div className="bg-white p-2 rounded-2xl">
              <QRCodeCanvas
                value={`https://sihadir-minsel.vercel.app/attendance/${id}`}
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo-minsel.png",
                  x: undefined,
                  y: undefined,
                  height: 45,
                  width: 45,
                  excavate: true,
                }}
              />
            </div>
          </div>
          {event?.dynamicQr && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {countdown}s
            </div>
          )}
        </div>
      ) : (
        <div className="w-56 h-56 bg-slate-100 rounded-2xl animate-pulse" />
      )}

      {event?.dynamicQr && (
        <div className="w-56 space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-bold">
            <span>Refresh dalam {countdown}s</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-blue-600 rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      )}

      {qr && (
        <div className="text-center">
          <p className="text-xs text-slate-400 font-mono break-all max-w-xs">{qr.token?.substring(0, 16)}…</p>
          <button onClick={fetchQR} className="mt-3 flex items-center gap-2 text-xs text-blue-600 font-bold hover:underline mx-auto">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Manual
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState('ringkasan');
  const [regFilter, setRegFilter] = useState('');

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => (await api.get(`/events/${id}`)).data,
  });

  const { data: regs = [], isLoading: regsLoading } = useQuery({
    queryKey: ['event-regs', id, regFilter],
    queryFn: async () => (await api.get(`/events/${id}/registrations${regFilter ? `?status=${regFilter}` : ''}`)).data,
    enabled: tab === 'peserta',
  });

  const { data: stats } = useQuery({
    queryKey: ['event-reg-stats', id],
    queryFn: async () => (await api.get(`/events/${id}/registrations/stats`)).data,
    enabled: !!id,
  });

  const approveMut = useMutation({
    mutationFn: ({ regId, status }: any) => api.patch(`/events/${id}/registrations/${regId}`, { status, approvedBy: 'Admin' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['event-regs', id] }),
  });

  const bulkApproveMut = useMutation({
    mutationFn: () => api.post(`/events/${id}/registrations/bulk-approve`, { approvedBy: 'Admin' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['event-regs', id] }),
  });

  const publishMut = useMutation({
    mutationFn: (status: 'PUBLISHED' | 'ARCHIVED') => api.patch(`/events/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['event', id] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateMut = useMutation({
    mutationFn: (data: any) => api.patch(`/events/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['event', id] });
      setShowEditModal(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      router.push('/events');
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}</div>;
  if (!event) return <div className="text-center py-16 text-slate-400">Kegiatan tidak ditemukan</div>;

  const s = STATUS_MAP[event.status] || STATUS_MAP.DRAFT;

  return (
    <div className="space-y-6 pb-12">
      {/* Back */}
      <button onClick={() => router.push('/events')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Kegiatan
      </button>

      {/* Hero */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-700 relative">
          {event.bannerUrl && <img src={event.bannerUrl} className="w-full h-full object-cover opacity-40" alt="" />}
          <div className="absolute inset-0 p-6 flex items-end">
            <span className={`text-xs font-black px-3 py-1 rounded-lg ${s.color}`}>{s.label}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-black text-slate-900">{event.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{event.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {event.status === 'DRAFT' && (
                <button 
                  onClick={() => publishMut.mutate('PUBLISHED')}
                  disabled={publishMut.isPending}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> 
                  {publishMut.isPending ? 'Memproses...' : 'Aktifkan Kegiatan'}
                </button>
              )}
              <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Laporan
              </button>
              <button 
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Edit Kegiatan"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                title="Hapus Kegiatan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: Calendar, label: 'Tanggal', val: format(new Date(event.startTime), 'dd MMM yyyy', { locale: localeId }) },
              { icon: Clock, label: 'Waktu', val: `${format(new Date(event.startTime), 'HH:mm')} – ${format(new Date(event.endTime), 'HH:mm')} WITA` },
              { icon: MapPin, label: 'Lokasi', val: event.venue },
              { icon: Users, label: 'Kehadiran', val: `${event.attendances?.length || 0}${event.maxParticipants ? ` / ${event.maxParticipants}` : ''} peserta` },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <item.icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Menunggu', v: stats.MENUNGGU, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { label: 'Disetujui', v: stats.DISETUJUI, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'Ditolak', v: stats.DITOLAK, color: 'text-red-600 bg-red-50 border-red-200' },
            { label: 'Waiting List', v: stats.WAITING_LIST, color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { label: 'Hadir', v: stats.HADIR, color: 'text-violet-600 bg-violet-50 border-violet-200' },
            { label: 'Total', v: stats.total, color: 'text-slate-600 bg-slate-50 border-slate-200' },
          ].map(st => (
            <div key={st.label} className={`border rounded-xl p-3 text-center ${st.color}`}>
              <p className="text-xl font-black">{st.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{st.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {/* Ringkasan */}
          {tab === 'ringkasan' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-black text-slate-900">Konfigurasi Kegiatan</h3>
              {[
                { l: 'Kategori', v: event.category || 'Tidak ditentukan' },
                { l: 'OPD Penyelenggara', v: event.opd?.name || '—' },
                { l: 'Tipe QR', v: event.dynamicQr ? `Dinamis (refresh ${event.qrRefreshInterval}s)` : 'Statis' },
                { l: 'Validasi GPS', v: event.requireGps ? `Aktif (radius ${event.radiusMeter}m)` : 'Tidak aktif' },
                { l: 'Toleransi Keterlambatan', v: `${event.lateTolerance} menit` },
                { l: 'Registrasi Diperlukan', v: event.requiresRegistration ? 'Ya' : 'Tidak' },
                { l: 'Persetujuan Admin', v: event.requiresApproval ? 'Ya' : 'Tidak' },
                { l: 'Kegiatan Publik', v: event.isPublic ? 'Ya' : 'Hanya undangan' },
                { l: 'Kuota Peserta', v: event.maxParticipants ? `${event.maxParticipants} orang` : 'Tidak dibatasi' },
                { l: 'Wajib Foto Selfie', v: event.requireSelfie ? 'Ya' : 'Tidak' },
              ].map(r => (
                <div key={r.l} className="flex justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500">{r.l}</span>
                  <span className="font-bold text-slate-900">{r.v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Peserta & Registrasi */}
          {tab === 'peserta' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                  {['', 'MENUNGGU', 'DISETUJUI', 'DITOLAK', 'WAITING_LIST'].map(st => (
                    <button key={st} onClick={() => setRegFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${regFilter === st ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                      {st || 'Semua'}
                    </button>
                  ))}
                </div>
                {stats?.MENUNGGU > 0 && (
                  <button onClick={() => bulkApproveMut.mutate()} disabled={bulkApproveMut.isPending}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-sm disabled:opacity-60">
                    <UserCheck className="w-3.5 h-3.5" />
                    {bulkApproveMut.isPending ? 'Memproses...' : `Setujui Semua (${stats.MENUNGGU})`}
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {regsLoading ? (
                  <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
                ) : regs.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Belum ada peserta terdaftar
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {regs.map((r: any) => {
                      const rs = REG_STATUS[r.status] || REG_STATUS.MENUNGGU;
                      return (
                        <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                            {r.participant?.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{r.participant?.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{r.participant?.institution} · {r.participant?.participantType}</p>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shrink-0 ${rs.color}`}>
                            <rs.icon className="w-3 h-3" />{rs.label}
                          </span>
                          {r.status === 'MENUNGGU' && (
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => approveMut.mutate({ regId: r.id, status: 'DISETUJUI' })}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors" title="Setujui">
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button onClick={() => approveMut.mutate({ regId: r.id, status: 'DITOLAK' })}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors" title="Tolak">
                                <UserX className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kehadiran */}
          {tab === 'kehadiran' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {event.attendances?.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Check className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Belum ada data kehadiran
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {event.attendances?.map((a: any) => (
                    <div key={a.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {a.participant?.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{a.participant?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Check-in: {format(new Date(a.checkIn), 'HH:mm, dd MMM yyyy', { locale: localeId })}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                        a.isLate ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}>
                        {a.isLate ? `Terlambat ${a.minutesLate}m` : 'Tepat Waktu'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QR Live */}
          {tab === 'qr' && (
            <div className="bg-white border border-slate-200 rounded-2xl">
              <QRLivePanel eventId={id} event={event} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditEventModal 
            event={event} 
            onClose={() => setShowEditModal(false)} 
            onSave={(data: any) => updateMut.mutate(data)}
            isSaving={updateMut.isPending}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hapus Kegiatan?</h3>
              <p className="text-slate-400 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Seluruh data registrasi dan kehadiran akan ikut terhapus.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold transition-all">Batal</button>
                <button onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}
                  className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
                >
                  {deleteMut.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditEventModal({ event, onClose, onSave, isSaving }: any) {
  const [form, setForm] = useState({
    title: event.title,
    description: event.description || '',
    venue: event.venue,
    startTime: format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"),
    hasCertificate: event.hasCertificate,
    requiresRegistration: event.requiresRegistration,
    requiresApproval: event.requiresApproval,
    isPublic: event.isPublic,
  });

  const inputCls = "w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";
  const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-white font-black text-xl">Edit Detail Kegiatan</h2>
            <p className="text-slate-400 text-sm mt-0.5">Perbarui informasi dasar dan kebijakan kegiatan</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { 
          e.preventDefault(); 
          const payload = {
            ...form,
            startTime: new Date(form.startTime).toISOString(),
            endTime: new Date(form.endTime).toISOString(),
          };
          onSave(payload); 
        }} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Judul Kegiatan</label>
              <input className={inputCls} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className={labelCls}>Deskripsi</label>
              <textarea className={`${inputCls} h-24 py-3 resize-none`} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label className={labelCls}>Lokasi / Venue</label>
              <input className={inputCls} value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Waktu Mulai</label>
                <input type="datetime-local" className={inputCls} value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>Waktu Selesai</label>
                <input type="datetime-local" className={inputCls} value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Sertifikat Digital</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sediakan sertifikat otomatis</p>
              </div>
              <button type="button" onClick={() => setForm({...form, hasCertificate: !form.hasCertificate})}
                className={`w-10 h-5 rounded-full relative transition-colors ${form.hasCertificate ? 'bg-blue-600' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.hasCertificate ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Wajib Registrasi</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Peserta harus daftar dulu</p>
              </div>
              <button type="button" onClick={() => setForm({...form, requiresRegistration: !form.requiresRegistration})}
                className={`w-10 h-5 rounded-full relative transition-colors ${form.requiresRegistration ? 'bg-blue-600' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.requiresRegistration ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 font-bold transition-all">
              Batal
            </button>
            <button type="submit" disabled={isSaving}
              className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
