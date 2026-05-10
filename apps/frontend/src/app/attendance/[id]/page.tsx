'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, CheckCircle2, AlertCircle, 
  Shield, Camera, User, ArrowRight, RefreshCw as Loader,
  Briefcase, Building2, PencilLine, Trash2
} from 'lucide-react';
import api from '@/services/api';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'verify' | 'form' | 'success'>('verify');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    participantType: 'ASN',
    identityNumber: '',
    position: '',
    institution: '',
    participantId: '',
    selfieUrl: '',
    signatureUrl: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event-public', id],
    queryFn: async () => (await api.get(`/events/${id}`)).data,
    enabled: !!id,
    retry: 1,
  });

  const submitMut = useMutation({
    mutationFn: (data: any) => api.post('/attendance', data),
    onSuccess: () => setStep('success'),
  });

  useEffect(() => {
    if (event?.requireGps) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => setLocError('Izin lokasi diperlukan untuk melakukan absensi ini.')
        );
      } else {
        setLocError('Browser Anda tidak mendukung geolokasi.');
      }
    }
  }, [event]);

  // Signature Canvas Logic
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    if (e.touches) e.preventDefault();
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    if (e.touches) e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setForm({ ...form, signatureUrl: '' });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setForm({ ...form, signatureUrl: canvas.toDataURL() });
    }
  };

  if (!mounted || isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-blue-500">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );

  if (isError || (!isLoading && !event)) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-sm">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto opacity-50" />
        <h1 className="text-2xl font-black text-white">Kegiatan Tidak Ditemukan</h1>
        <p className="text-slate-400">Pastikan link yang Anda gunakan benar atau kegiatan telah aktif.</p>
        <button onClick={() => window.location.reload()} className="text-blue-500 font-bold hover:underline">Coba Lagi</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 'verify' && (
            <motion.div 
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Presensi Digital</h1>
                <p className="text-slate-400 text-sm font-medium">{event.title}</p>
              </div>

              <div className="space-y-4 bg-white/5 rounded-3xl p-6 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Lokasi Kegiatan</p>
                    <p className="text-sm font-bold text-white">{event.venue || 'Lokasi tidak ditentukan'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Waktu Pelaksanaan</p>
                    <p className="text-sm font-bold text-white">
                      {event.startTime ? (
                        <>
                          {new Date(event.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} – 
                          {event.endTime ? ` ${new Date(event.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA` : ' Selesai'}
                        </>
                      ) : 'Waktu tidak tersedia'}
                    </p>
                  </div>
                </div>
              </div>

              {locError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-400 font-bold">{locError}</p>
                </div>
              ) : event.requireGps && !location ? (
                <div className="text-center py-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-bold tracking-tight">Memverifikasi lokasi GPS Anda...</p>
                </div>
              ) : (
                <button 
                  onClick={() => setStep('form')}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                >
                  Lanjut ke Form Absensi <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white">Identitas Anda</h2>
                <p className="text-xs text-slate-500">Lengkapi data diri Anda untuk keperluan administrasi.</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori Peserta</label>
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                      {[
                        { id: 'ASN', label: 'ASN' },
                        { id: 'LAIN', label: 'Instansi Lain' },
                        { id: 'MASYARAKAT', label: 'Masyarakat' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setForm({ ...form, participantType: cat.id, identityNumber: '' })}
                          className={`flex-1 h-10 rounded-xl text-[10px] font-black transition-all ${
                            form.participantType === cat.id 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="Nama Lengkap & Gelar"
                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        {form.participantType === 'ASN' ? 'NIP' : form.participantType === 'LAIN' ? 'Nomor Pegawai' : 'No KTP (NIK)'}
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="text"
                          placeholder={`Masukkan ${form.participantType === 'ASN' ? 'NIP' : form.participantType === 'LAIN' ? 'Nomor Pegawai' : 'NIK'}`}
                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                          value={form.identityNumber}
                          onChange={e => setForm({...form, identityNumber: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jabatan</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="Contoh: Staff"
                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                          value={form.position}
                          onChange={e => setForm({...form, position: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Instansi / OPD</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="Contoh: Diskominfo"
                          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                          value={form.institution}
                          onChange={e => setForm({...form, institution: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tanda Tangan Manual</label>
                    <button onClick={clearCanvas} className="text-[10px] text-red-500 font-black uppercase flex items-center gap-1 hover:opacity-70">
                      <Trash2 className="w-3 h-3" /> Bersihkan
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden border-2 border-white/5 shadow-inner">
                    <canvas 
                      ref={canvasRef}
                      width={400}
                      height={180}
                      className="w-full bg-white cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
                      onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                      onTouchEnd={(e) => { e.preventDefault(); stopDrawing(); }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 italic text-center">Silakan bubuhkan tanda tangan Anda pada area putih di atas.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setStep('verify')}
                  className="flex-1 h-16 bg-white/5 text-slate-400 font-black rounded-2xl hover:bg-white/10 transition-all"
                >
                  Kembali
                </button>
                <button 
                  onClick={() => {
                    const signature = canvasRef.current?.toDataURL();
                    submitMut.mutate({
                      eventId: id,
                      name: form.name,
                      participantType: form.participantType,
                      identityNumber: form.identityNumber,
                      position: form.position,
                      institution: form.institution,
                      signatureUrl: signature,
                      latitude: location?.lat,
                      longitude: location?.lng,
                      deviceInfo: navigator.userAgent,
                    });
                  }}
                  disabled={!form.name || submitMut.isPending}
                  className="flex-[2] h-16 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 transition-all"
                >
                  {submitMut.isPending ? <Loader className="w-5 h-5 animate-spin" /> : 'Kirim Kehadiran'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-12 shadow-2xl text-center space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Presensi Berhasil!</h2>
                <p className="text-slate-400 text-sm">Terima kasih, data kehadiran dan tanda tangan Anda telah tercatat secara resmi di sistem SIHADIR.</p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={() => router.push('/')}
                  className="w-full h-14 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
