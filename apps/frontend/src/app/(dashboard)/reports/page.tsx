'use client';

import { useState } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const mockGeneralReports = [
  { id: 1, opd: 'Dinas Komunikasi dan Informatika', totalPegawai: 45, hadir: 42, persentase: '93.3%', status: 'Baik' },
  { id: 2, opd: 'Dinas Pendidikan', totalPegawai: 120, hadir: 115, persentase: '95.8%', status: 'Sangat Baik' },
  { id: 3, opd: 'Dinas Kesehatan', totalPegawai: 200, hadir: 180, persentase: '90.0%', status: 'Baik' },
  { id: 4, opd: 'Badan Kepegawaian Daerah', totalPegawai: 35, hadir: 34, persentase: '97.1%', status: 'Sangat Baik' },
  { id: 5, opd: 'Dinas Pekerjaan Umum', totalPegawai: 80, hadir: 65, persentase: '81.2%', status: 'Cukup' },
];

const mockAnomalyReports = [
  { id: 1, name: 'Budi Santoso', nip: '198001012005011001', opd: 'Dinas Pendidikan', event: 'Rakor Stunting', anomaly: 'Mock Location Terdeteksi', date: '2023-10-25 08:15', risk: 'Tinggi' },
  { id: 2, name: 'Siti Aminah', nip: '198502022010012002', opd: 'Dinas Kesehatan', event: 'Sosialisasi SPBE', anomaly: 'Radius Jauh (>1km)', date: '2023-10-25 09:02', risk: 'Sedang' },
  { id: 3, name: 'Ahmad Yani', nip: '199003032015011003', opd: 'Dinas PU', event: 'Rapat Paripurna', anomaly: 'Multiple Device Login', date: '2023-10-24 14:30', risk: 'Tinggi' },
  { id: 4, name: 'Rina Wati', nip: '198204042008012004', opd: 'Dinas Kominfo', event: 'Rakor Stunting', anomaly: 'Presensi Terlalu Cepat (<2dtk)', date: '2023-10-25 08:01', risk: 'Rendah' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Laporan & Analitik</h1>
          <p className="text-slate-500">Unduh dan analisis data kehadiran secara menyeluruh.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2 h-12 px-6 shadow-lg shadow-emerald-600/20"
            onClick={() => toast.success('Memproses Export Rekapitulasi ke Excel...')}
          >
            <FileSpreadsheet className="h-5 w-5" />
            Export Rekapitulasi (Excel)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="umum" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-14">
          <TabsTrigger value="umum" className="rounded-lg h-12 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Laporan Umum
          </TabsTrigger>
          <TabsTrigger value="anomali" className="rounded-lg h-12 px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Laporan Anomali
          </TabsTrigger>
        </TabsList>

        <TabsContent value="umum" className="space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Rekap Kehadiran per Instansi</CardTitle>
                  <CardDescription>Bulan ini (Oktober 2023)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Cari Instansi..." className="pl-9 w-[250px] rounded-lg border-slate-200 h-10" />
                  </div>
                  <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-slate-200">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-bold text-slate-900">Instansi / OPD</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Total Pegawai</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Hadir Aktif</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Persentase</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGeneralReports.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-slate-700">{row.opd}</TableCell>
                      <TableCell className="text-center">{row.totalPegawai}</TableCell>
                      <TableCell className="text-center text-blue-600 font-bold">{row.hadir}</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-slate-100 px-3 py-1 rounded-md font-mono text-sm font-bold">
                          {row.persentase}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={
                            row.status === 'Sangat Baik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            row.status === 'Baik' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">Detail</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomali" className="space-y-6">
           <Card className="border-red-200 shadow-sm shadow-red-100 rounded-3xl overflow-hidden">
            <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Deteksi Anomali Kehadiran
                  </CardTitle>
                  <CardDescription className="text-red-900/60">Log percobaan kecurangan atau masalah lokasi GPS.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50">
                    <Download className="h-4 w-4 mr-2" /> Export Log
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-bold text-slate-900">Nama & NIP</TableHead>
                    <TableHead className="font-bold text-slate-900">Instansi</TableHead>
                    <TableHead className="font-bold text-slate-900">Kegiatan</TableHead>
                    <TableHead className="font-bold text-slate-900">Jenis Anomali</TableHead>
                    <TableHead className="font-bold text-slate-900">Waktu Deteksi</TableHead>
                    <TableHead className="text-center font-bold text-slate-900">Risiko</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnomalyReports.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">{row.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{row.nip}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{row.opd}</TableCell>
                      <TableCell className="text-sm text-slate-600">{row.event}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.anomaly.includes('Mock Location') || row.anomaly.includes('Radius') ? (
                            <MapPin className="h-4 w-4 text-amber-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium text-slate-800">{row.anomaly}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-slate-600">{row.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={
                            row.risk === 'Tinggi' ? 'bg-red-100 text-red-800 border-red-200' : 
                            row.risk === 'Sedang' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                            'bg-slate-100 text-slate-800 border-slate-200'
                          }
                        >
                          {row.risk}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
