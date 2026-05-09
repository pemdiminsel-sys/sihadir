import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Info, Settings2, Clock, QrCode, Bell, Send,
  ChevronRight, ChevronLeft, Check, MapPin, Calendar,
  Users, ToggleLeft, ToggleRight, AlertCircle, Globe, Video
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Informasi Kegiatan', icon: Info },
  { id: 2, label: 'Kebijakan Registrasi', icon: Settings2 },
  { id: 3, label: 'Pengaturan Kehadiran', icon: Clock },
  { id: 4, label: 'QR & Keamanan', icon: QrCode },
  { id: 5, label: 'Notifikasi', icon: Bell },
  { id: 6, label: 'Publikasi', icon: Send },
];

const CATEGORIES = ['RAPAT', 'PELATIHAN', 'SEMINAR', 'WORKSHOP', 'SOSIALISASI', 'LAINNYA'];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

function FieldRow({ label, desc, enabled, onToggle }: { label: string; desc: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [locationMode, setLocationMode] = useState<'MANUAL' | 'MAPS'>('MANUAL');

  const [form, setForm] = useState({
    // Step 1
    title: '', description: '', organizerId: '', venue: '',
    latitude: '', longitude: '',
    startTime: '', endTime: '', category: 'RAPAT', bannerUrl: '',
    attendanceMode: 'OFFLINE' as 'OFFLINE' | 'ONLINE' | 'HYBRID',
    onlineUrl: '',
    // Step 2
    requiresRegistration: false, requiresApproval: false, isPublic: true,
    maxParticipants: '', hasWaitingList: false, invitationOnly: false, multiSession: false,
    // Step 3
    requireGps: true, radiusMeter: 100, lateTolerance: 15,
    timeBoundAttendance: false,
    registrationOpenAt: '', registrationCloseAt: '',
    attendanceOpenAt: '', attendanceCloseAt: '',
    // Step 4
    qrType: 'DYNAMIC', dynamicQr: true, requireSelfie: false, qrRefreshInterval: 60,
    // Step 5
    notifyEmail: true, notifyWa: false, notifyApp: true,
  });

  const isAdminOPD = user?.role?.name === 'ADMIN_OPD';

  useEffect(() => {
    if (isAdminOPD && user?.opdId) {
      setForm(f => ({ ...f, organizerId: user.opdId! }));
    }
  }, [isAdminOPD, user]);

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
  const tog = (key: string) => setForm(f => ({ ...f, [key]: !(f as any)[key] }));

  const { data: opds = [] } = useQuery({
    queryKey: ['opds'],
    queryFn: async () => (await api.get('/opd')).data,
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post('/events', payload),
    onSuccess: (res) => router.push(`/events/${res.data.id}`),
    onError: (e: any) => setError(e.response?.data?.message || 'Terjadi kesalahan'),
  });

  const handlePublish = (status: 'PUBLISHED' | 'DRAFT') => {
    setError('');
    if (!form.title || !form.organizerId || (!form.venue && form.attendanceMode !== 'ONLINE') || !form.startTime || !form.endTime) {
      setError('Lengkapi informasi kegiatan terlebih dahulu (Langkah 1)');
      setStep(1); return;
    }
    
    mutation.mutate({
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
      radiusMeter: Number(form.radiusMeter),
      lateTolerance: Number(form.lateTolerance),
      qrRefreshInterval: Number(form.qrRefreshInterval),
      registrationOpenAt: form.registrationOpenAt ? new Date(form.registrationOpenAt).toISOString() : undefined,
      registrationCloseAt: form.registrationCloseAt ? new Date(form.registrationCloseAt).toISOString() : undefined,
      attendanceOpenAt: form.attendanceOpenAt ? new Date(form.attendanceOpenAt).toISOString() : undefined,
      attendanceCloseAt: form.attendanceCloseAt ? new Date(form.attendanceCloseAt).toISOString() : undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      status,
    });
  };

  const inputCls = 'w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all';
  const labelCls = 'block text-sm font-bold text-slate-700 mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Buat Kegiatan Baru</h1>
        <p className="text-slate-500 text-sm mt-1">Wizard pembuatan kegiatan enterprise — 6 langkah</p>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {STEPS.map((s, i) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <button onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : done ? 'bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-400'}`}>
                  {done ? <Check className="w-3.5 h-3.5 shrink-0" /> : <s.icon className="w-3.5 h-3.5 shrink-0" />}
                  <span className="hidden sm:block">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="bg-slate-900 px-8 py-5 flex items-center gap-3">
            {(() => { const S = STEPS[step-1]; return <S.icon className="w-5 h-5 text-blue-400" />; })()}
            <div>
              <h2 className="text-white font-black">{STEPS[step-1].label}</h2>
              <p className="text-slate-400 text-xs mt-0.5">Langkah {step} dari {STEPS.length}</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* ── STEP 1 ── */}
            {step === 1 && <>
              <div>
                <label className={labelCls}>Judul Kegiatan <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="Contoh: Rapat Koordinasi SPBE Triwulan II"
                  value={form.title} onChange={e => set('title', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>OPD Penyelenggara <span className="text-red-500">*</span></label>
                  <select 
                    className={`${inputCls} ${isAdminOPD ? 'bg-slate-50 cursor-not-allowed' : ''}`} 
                    value={form.organizerId} 
                    onChange={e => !isAdminOPD && set('organizerId', e.target.value)}
                    disabled={isAdminOPD}
                  >
                    <option value="">-- Pilih OPD --</option>
                    {opds.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  {isAdminOPD && <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-widest">Terkunci ke instansi Anda</p>}
                </div>
                <div>
                  <label className={labelCls}>Kategori Kegiatan</label>
                  <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Tipe Kehadiran</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: 'OFFLINE', l: 'Offline', i: MapPin },
                    { v: 'ONLINE', l: 'Online', i: Globe },
                    { v: 'HYBRID', l: 'Hybrid', i: Video },
                  ].map(opt => (
                    <button key={opt.v} type="button" onClick={() => set('attendanceMode', opt.v)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${form.attendanceMode === opt.v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}>
                      <opt.i className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold uppercase tracking-widest">{opt.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(form.attendanceMode === 'OFFLINE' || form.attendanceMode === 'HYBRID') && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}><MapPin className="w-3.5 h-3.5 inline mr-1" />Lokasi / Venue <span className="text-red-500">*</span></label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       <button onClick={() => setLocationMode('MANUAL')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${locationMode === 'MANUAL' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Manual</button>
                       <button onClick={() => setLocationMode('MAPS')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${locationMode === 'MAPS' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Maps</button>
                    </div>
                  </div>
                  
                  {locationMode === 'MANUAL' ? (
                    <input className={inputCls} placeholder="Nama gedung, alamat lengkap"
                      value={form.venue} onChange={e => set('venue', e.target.value)} />
                  ) : (
                    <div className="space-y-3">
                       <div className="h-40 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 group hover:border-blue-300 transition-all cursor-pointer"
                        onClick={() => alert('Map Picker Modal — Integration with Google Maps / Leaflet')}>
                          <MapPin className="w-8 h-8 text-slate-300 group-hover:text-blue-400 mb-2" />
                          <p className="text-xs font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">Pilih dari Peta</p>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <input className={inputCls} placeholder="Latitude" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
                          <input className={inputCls} placeholder="Longitude" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
                       </div>
                       <input className={inputCls} placeholder="Label Lokasi (Contoh: Kantor Bupati)" value={form.venue} onChange={e => set('venue', e.target.value)} />
                    </div>
                  )}
                </div>
              )}

              {(form.attendanceMode === 'ONLINE' || form.attendanceMode === 'HYBRID') && (
                <div>
                  <label className={labelCls}><Globe className="w-3.5 h-3.5 inline mr-1" />Tautan Meeting (Zoom/YT/Lainnya) <span className="text-red-500">*</span></label>
                  <input className={inputCls} placeholder="https://zoom.us/j/..."
                    value={form.onlineUrl} onChange={e => set('onlineUrl', e.target.value)} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Waktu Mulai <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className={inputCls}
                    value={form.startTime} onChange={e => set('startTime', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}><Calendar className="w-3.5 h-3.5 inline mr-1" />Waktu Selesai <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className={inputCls}
                    value={form.endTime} onChange={e => set('endTime', e.target.value)} />
                </div>
              </div>
            </>}

            {/* ── STEP 2 ── */}
            {step === 2 && <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 flex gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Konfigurasi kebijakan registrasi peserta untuk kegiatan ini.
              </div>
              <div className="divide-y divide-slate-100">
                <FieldRow label="Registrasi Diperlukan" desc="Peserta wajib mendaftar sebelum hadir" enabled={form.requiresRegistration} onToggle={() => tog('requiresRegistration')} />
                <FieldRow label="Persetujuan Admin" desc="Registrasi memerlukan persetujuan admin" enabled={form.requiresApproval} onToggle={() => tog('requiresApproval')} />
                <FieldRow label="Kegiatan Publik" desc="Dapat dilihat tanpa login oleh publik" enabled={form.isPublic} onToggle={() => tog('isPublic')} />
                <FieldRow label="Sistem Waiting List" desc="Peserta masuk waiting list saat kuota penuh" enabled={form.hasWaitingList} onToggle={() => tog('hasWaitingList')} />
                <FieldRow label="Hanya Undangan" desc="Hanya peserta dengan token undangan yang bisa daftar" enabled={form.invitationOnly} onToggle={() => tog('invitationOnly')} />
                <FieldRow label="Multi Sesi" desc="Kegiatan dibagi menjadi beberapa sesi" enabled={form.multiSession} onToggle={() => tog('multiSession')} />
              </div>
              <div>
                <label className={labelCls}><Users className="w-3.5 h-3.5 inline mr-1" />Kuota Maksimal Peserta</label>
                <input type="number" className={inputCls} placeholder="Kosongkan jika tidak dibatasi"
                  value={form.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} />
              </div>
            </>}

            {/* ── STEP 3 ── */}
            {step === 3 && <>
              <div className="divide-y divide-slate-100">
                <FieldRow label="Validasi GPS" desc="Peserta harus berada di sekitar lokasi kegiatan (Hanya Offline/Hybrid)" enabled={form.requireGps && form.attendanceMode !== 'ONLINE'} onToggle={() => form.attendanceMode !== 'ONLINE' && tog('requireGps')} />
                <FieldRow label="Kehadiran Berbasis Waktu" desc="QR hanya aktif di jam kehadiran yang ditentukan" enabled={form.timeBoundAttendance} onToggle={() => tog('timeBoundAttendance')} />
              </div>
              
              {form.attendanceMode === 'ONLINE' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[10px] font-bold text-amber-700 uppercase tracking-widest flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Validasi GPS dinonaktifkan otomatis untuk kegiatan Full Online.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Radius GPS (meter)</label>
                  <input type="number" className={`${inputCls} ${form.attendanceMode === 'ONLINE' ? 'bg-slate-50 cursor-not-allowed' : ''}`} 
                    disabled={form.attendanceMode === 'ONLINE'}
                    value={form.radiusMeter} onChange={e => set('radiusMeter', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Toleransi Keterlambatan (menit)</label>
                  <input type="number" className={inputCls} value={form.lateTolerance} onChange={e => set('lateTolerance', e.target.value)} />
                </div>
              </div>
            </>}

            {/* ── STEP 4 ── */}
            {step === 4 && <>
              <div>
                <label className={labelCls}>Tipe QR Code</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: 'DYNAMIC', l: 'QR Dinamis', d: 'Berubah setiap interval waktu (anti-screenshot)' },
                    { v: 'STATIC', l: 'QR Statis', d: 'QR tetap dari awal hingga akhir kegiatan' }].map(opt => (
                    <button key={opt.v} type="button" onClick={() => { set('qrType', opt.v); set('dynamicQr', opt.v === 'DYNAMIC'); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${form.qrType === opt.v ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <p className={`text-sm font-black ${form.qrType === opt.v ? 'text-blue-700' : 'text-slate-700'}`}>{opt.l}</p>
                      <p className="text-xs text-slate-500 mt-1">{opt.d}</p>
                    </button>
                  ))}
                </div>
              </div>
              {form.dynamicQr && (
                <div>
                  <label className={labelCls}>Interval Refresh QR (detik)</label>
                  <input type="number" className={inputCls} value={form.qrRefreshInterval} onChange={e => set('qrRefreshInterval', e.target.value)} />
                  <p className="text-xs text-slate-400 mt-1">Disarankan: 30–120 detik</p>
                </div>
              )}
              <div className="divide-y divide-slate-100">
                <FieldRow label="Wajib Foto Selfie" desc="Peserta harus mengunggah selfie saat check-in" enabled={form.requireSelfie} onToggle={() => tog('requireSelfie')} />
              </div>
            </>}

            {/* ── STEP 5 ── */}
            {step === 5 && <>
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg"><Bell className="w-4 h-4 text-white" /></div>
                  <h3 className="font-black text-white text-sm uppercase tracking-widest">Saluran Notifikasi</h3>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-bold text-white">Notifikasi Email</p>
                      <p className="text-[10px] text-slate-500">Kirim email otomatis ke peserta</p>
                    </div>
                    <Toggle enabled={form.notifyEmail} onToggle={() => tog('notifyEmail')} />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-bold text-white">Notifikasi WhatsApp</p>
                      <p className="text-[10px] text-slate-500">Kirim WA via WhatsApp Business API</p>
                    </div>
                    <Toggle enabled={form.notifyWa} onToggle={() => tog('notifyWa')} />
                  </div>
                </div>
              </div>
            </>}

            {/* ── STEP 6 ── */}
            {step === 6 && <>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Ringkasan Kegiatan</p>
                  {[
                    { l: 'Judul', v: form.title || '—' },
                    { l: 'Penyelenggara', v: opds.find((o:any) => o.id === form.organizerId)?.name || '—' },
                    { l: 'Mode', v: form.attendanceMode },
                    { l: 'Lokasi/Link', v: form.attendanceMode === 'ONLINE' ? form.onlineUrl : form.venue || '—' },
                    { l: 'Validasi GPS', v: (form.requireGps && form.attendanceMode !== 'ONLINE') ? `Ya (${form.radiusMeter}m)` : 'Tidak' },
                    { l: 'Mulai', v: form.startTime ? new Date(form.startTime).toLocaleString('id-ID') : '—' },
                    { l: 'Selesai', v: form.endTime ? new Date(form.endTime).toLocaleString('id-ID') : '—' },
                  ].map(r => (
                    <div key={r.l} className="flex items-start justify-between gap-4 text-sm py-1 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500 font-medium">{r.l}</span>
                      <span className="text-slate-900 font-bold text-right">{r.v}</span>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button type="button" onClick={() => handlePublish('DRAFT')} disabled={mutation.isPending}
                    className="h-12 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50">
                    💾 Simpan sebagai Draf
                  </button>
                  <button type="button" onClick={() => handlePublish('PUBLISHED')} disabled={mutation.isPending}
                    className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50">
                    {mutation.isPending ? 'Memproses...' : '🚀 Publikasikan Kegiatan'}
                  </button>
                </div>
              </div>
            </>}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 6 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <span className="text-xs text-slate-400 font-bold">{step} / {STEPS.length}</span>
          <button onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
