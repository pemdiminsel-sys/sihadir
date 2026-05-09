'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  Zap, 
  FileCheck, 
  TrendingUp, 
  Building2,
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Cell,
  Pie
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const spbeData = [
  { name: 'Jan', index: 2.8 },
  { name: 'Feb', index: 3.0 },
  { name: 'Mar', index: 3.2 },
  { name: 'Apr', index: 3.5 },
  { name: 'Mei', index: 3.8 },
];

const opdParticipation = [
  { name: 'DISKOMINFO', value: 98 },
  { name: 'DIKPORA', value: 85 },
  { name: 'DINKES', value: 92 },
  { name: 'BAPELITBANG', value: 78 },
  { name: 'DPMPTSP', value: 88 },
];

export default function SPBEAnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Indikator SPBE Minsel</h1>
        <p className="text-slate-500">Monitoring metrik digitalisasi dan efisiensi birokrasi daerah.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Indeks Digitalisasi', value: '3.8/5.0', icon: Target, color: 'text-blue-500' },
          { label: 'Paperless Ratio', value: '94%', icon: Zap, color: 'text-amber-500' },
          { label: 'Efisiensi Waktu', value: '72%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Partisipasi ASN', value: '8,421', icon: Building2, color: 'text-violet-500' },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm shadow-slate-200 p-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-slate-50 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm shadow-slate-200 p-8 rounded-3xl">
           <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-bold">Tren Kematangan Digital (SPBE Index)</CardTitle>
           </CardHeader>
           <div className="h-[300px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spbeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="index" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200 p-8 rounded-3xl">
           <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg font-bold">Partisipasi Per Sektor</CardTitle>
           </CardHeader>
           <div className="h-[250px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opdParticipation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {opdParticipation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 space-y-2">
              {opdParticipation.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="font-medium text-slate-600">{item.name}</span>
                   </div>
                   <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
           </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200 p-8 rounded-3xl bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Info className="h-32 w-32" />
         </div>
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
               <h3 className="text-xl font-bold">Analisis Efisiensi Biaya (Paperless)</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Dengan implementasi SIHADIR MINSEL, penghematan anggaran untuk ATK dan pencetakan dokumen fisik absensi di seluruh OPD diperkirakan mencapai <strong>Rp 142.000.000,-</strong> per kuartal.
               </p>
               <div className="pt-4 flex gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kertas Hemat</p>
                    <p className="text-xl font-bold">128 Rim</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Waktu Hemat</p>
                    <p className="text-xl font-bold">2.4k Jam</p>
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-center">
               <div className="w-32 h-32 rounded-full border-8 border-blue-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-8 border-blue-500 rounded-full border-t-transparent animate-spin-slow"></div>
                  <span className="text-2xl font-black italic">ROI</span>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
}
