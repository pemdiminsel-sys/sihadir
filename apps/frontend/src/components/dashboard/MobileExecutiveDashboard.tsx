'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const kpis = [
  { label: 'Kehadiran Hari Ini', value: '4,281', trend: '+12%', icon: Users, color: 'bg-blue-500' },
  { label: 'Kegiatan Aktif', value: '24', trend: 'Stabil', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'Indeks SPBE', value: '3.8', trend: '+0.2', icon: Zap, color: 'bg-amber-500' },
  { label: 'Sertifikat Terbit', value: '1.2k', trend: '+85', icon: Award, color: 'bg-violet-500' },
];

export default function MobileExecutiveDashboard() {
  return (
    <div className="md:hidden space-y-6 pb-20">
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900">Executive Monitor</h2>
        <p className="text-slate-500 text-sm">Ringkasan operasional realtime.</p>
      </div>

      {/* Horizontal Swipeable Cards */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="shrink-0 w-64"
          >
            <Card className="p-6 border-none shadow-md shadow-slate-200 rounded-[2.5rem] bg-white relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.color} opacity-5 -mr-8 -mt-8 rounded-full`} />
               <div className={`w-12 h-12 rounded-2xl ${kpi.color} text-white flex items-center justify-center mb-4`}>
                 <kpi.icon className="h-6 w-6" />
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
               <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
               <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <TrendingUp className="h-3 w-3" /> {kpi.trend} vs Sesi Lalu
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Events List */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Kegiatan Utama</h3>
          <button className="text-xs font-bold text-blue-600">LIHAT SEMUA</button>
        </div>
        
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 border-none shadow-sm shadow-slate-100 rounded-3xl bg-white flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
               <Activity className="h-6 w-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Rapat Koordinasi Strategis {i}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Aula Bupati
                </span>
                <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] h-4 rounded-md">142 HADIR</Badge>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300" />
          </Card>
        ))}
      </div>

      {/* Quick Action Floating Menu (Optional implementation for dashboard) */}
    </div>
  );
}
