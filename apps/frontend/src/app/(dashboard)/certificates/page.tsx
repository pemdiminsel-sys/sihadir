'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Download, Search, Filter, FileText, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      // In a real app, this might fetch from /certificates
      const response = await api.get('/events');
      // For demo, we'll map events to certificates
      return response.data;
    },
  });

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (attendanceId: string, title: string) => {
    setDownloading(attendanceId);
    try {
      const response = await api.get(`/reports/certificate/${attendanceId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Sertifikat-${title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengunduh sertifikat. Silakan coba lagi.');
    } finally {
      setDownloading(null);
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sertifikat Digital</h1>
        <p className="text-slate-500">Unduh sertifikat penghargaan atas partisipasi kegiatan Anda.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari sertifikat atau kegiatan..."
            className="pl-10 h-12 rounded-xl border-slate-200"
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl border-slate-200 gap-2 px-6">
          <Filter className="h-4 w-4" />
          Semua OPD
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
          ))
        ) : (
          certificates?.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-sm shadow-slate-200 rounded-3xl overflow-hidden group hover:shadow-md transition-all bg-white relative">
                <div className="p-8">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8" />
                  </div>

                  <Badge variant="outline" className="mb-3 bg-slate-50 text-slate-500 border-none rounded-lg">
                    {item.opd?.name}
                  </Badge>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight h-12">
                    Sertifikat {item.title}
                  </h3>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(item.startTime), 'dd MMMM yyyy', { locale: id })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>Terverifikasi Digital</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button
                      onClick={() => handleDownload(item.id, item.title)}
                      disabled={downloading === item.id}
                      className="flex-1 bg-slate-900 rounded-xl gap-2 h-11 disabled:opacity-60"
                    >
                      <Download className="h-4 w-4" />
                      {downloading === item.id ? 'Mengunduh...' : 'Unduh PDF'}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-slate-200">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
