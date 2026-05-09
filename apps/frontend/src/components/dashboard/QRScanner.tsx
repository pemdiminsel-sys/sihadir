'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { Camera, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export default function QRScanner({ eventId, participantId }: { eventId: string; participantId: string }) {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      scanner.clear();
      setScanning(false);
      handleAttendance(decodedText);
    }

    function onScanFailure(error: any) {
      // quiet fail
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const handleAttendance = async (qrToken: string) => {
    setLoading(true);
    try {
      // Get Geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const response = await api.post('/attendance/submit', {
        eventId,
        participantId,
        qrToken,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        deviceInfo: navigator.userAgent,
      });

      setStatus('success');
      setMessage('Kehadiran Anda telah berhasil dicatat!');
      toast({
        title: 'Presensi Berhasil',
        description: 'Data kehadiran telah dikirim ke sistem.',
      });
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Gagal melakukan presensi');
      toast({
        variant: 'destructive',
        title: 'Presensi Gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {scanning ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Scan QR Code</h2>
            <p className="text-slate-500 text-sm">Arahkan kamera ke QR Code kegiatan</p>
          </div>
          
          <div id="reader" className="overflow-hidden rounded-2xl border-4 border-slate-900"></div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            <span>Pastikan GPS aktif dan izin lokasi diberikan</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center"
        >
          {loading ? (
            <div className="py-12">
              <Loader2 className="h-16 w-16 animate-spin text-slate-900 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900">Memproses Kehadiran...</p>
              <p className="text-slate-500 text-sm">Mohon tunggu sebentar</p>
            </div>
          ) : status === 'success' ? (
            <div>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Presensi Berhasil!</h2>
              <p className="text-slate-500 mb-8">{message}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-900 rounded-xl h-12"
              >
                Kembali ke Beranda
              </Button>
            </div>
          ) : (
            <div>
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Gagal!</h2>
              <p className="text-slate-500 mb-8">{message}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full rounded-xl h-12 border-slate-200"
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
