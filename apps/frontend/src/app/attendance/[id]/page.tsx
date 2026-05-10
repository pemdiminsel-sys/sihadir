'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, CheckCircle2, AlertCircle, 
  Shield, Camera, User, ArrowRight, RefreshCw as Loader
} from 'lucide-react';
import api from '@/services/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'verify' | 'form' | 'success'>('verify');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [form, setForm] = useState({
    participantId: '',
    selfieUrl: '',
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

  if (!mounted || isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <Loader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  if (isError || (!isLoading && !event)) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-xl font-bold text-white">Kegiatan Tidak Ditemukan</h1>
        <p className="text-slate-400">Pastikan link yang Anda gunakan benar atau kegiatan telah aktif.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
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
                <p className="text-slate-400 text-sm">{event.title}</p>
              </div>

              <div className="space-y-4 bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lokasi</p>
                    <p className="text-sm font-bold text-white">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu</p>
                    <p className="text-sm font-bold text-white">
                      {event.startTime && event.endTime ? (
                        <>
                          {format(new Date(event.startTime), 'HH:mm', { locale: localeId })} – {format(new Date(event.endTime), 'HH:mm WITA', { locale: localeId })}
                        </>
                      ) : 'Waktu tidak tersedia'}
                    </p>
                  </div>
                </div>
              </div>

              {locError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{locError}</p>
                </div>
              ) : event.requireGps && !location ? (
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Memverifikasi lokasi GPS Anda...</p>
                </div>
              ) : (
                <button 
                  onClick={() => setStep('form')}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                  Mulai Absensi <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <h2 className="text-xl font-bold text-white text-center">Identitas Peserta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ID / NIP / NIK</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Masukkan ID Peserta"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      value={form.participantId}
                      onChange={e => setForm({...form, participantId: e.target.value})}
                    />
                  </div>
                </div>

                {event.requireSelfie && (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 text-center space-y-3 cursor-pointer hover:bg-white/[0.07] transition-all">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Ambil Foto Selfie di Lokasi</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => submitMut.mutate({
                  eventId: id,
                  participantId: form.participantId,
                  latitude: location?.lat,
                  longitude: location?.lng,
                  selfieUrl: 'mock-url',
                })}
                disabled={!form.participantId || submitMut.isPending}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 transition-all"
              >
                {submitMut.isPending ? <Loader className="w-5 h-5 animate-spin" /> : 'Kirim Kehadiran'}
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Berhasil Terabsen!</h2>
                <p className="text-slate-400 text-sm">Terima kasih atas kehadiran Anda dalam kegiatan ini.</p>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="w-full h-12 text-slate-400 hover:text-white font-bold transition-all"
              >
                Tutup Halaman
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
