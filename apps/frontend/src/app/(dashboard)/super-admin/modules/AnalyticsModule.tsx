'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingUp, BarChart3, PieChart, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AnalyticsModule({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="space-y-6">
      {/* SPBE Header */}
      <Card className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 border-violet-500/30 p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Kematangan SPBE Kabupaten Minahasa Selatan</h3>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed">
              Indeks Sistem Pemerintahan Berbasis Elektronik (SPBE) mengukur tingkat adopsi digital, tata kelola keamanan informasi, dan integrasi data antar OPD di lingkungan pemerintahan.
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="w-32 h-32 rounded-full border-4 border-violet-500/30 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/5" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset="75" className="text-violet-500" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">3.8</span>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mt-1">Sangat Baik</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Adopsi Identitas Digital', value: '92%', icon: ShieldCheck, color: 'emerald' },
          { title: 'Interoperabilitas Data', value: '78%', icon: Activity, color: 'blue' },
          { title: 'Efisiensi Layanan', value: '+45%', icon: TrendingUp, color: 'amber' },
        ].map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-${metric.color}-500/10 text-${metric.color}-400 flex items-center justify-center mb-4`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{metric.title}</p>
              <p className={`text-3xl font-black text-white`}>{metric.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* OPD Ranking Mockup */}
      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-300 tracking-widest uppercase flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            Top 5 OPD Digital Adopters
          </h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300">View Full Report</button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: 'Dinas Komunikasi dan Informatika', score: 98, color: 'bg-violet-500' },
            { name: 'BKPSDM', score: 92, color: 'bg-blue-500' },
            { name: 'Dinas Kesehatan', score: 85, color: 'bg-emerald-500' },
            { name: 'Dinas Pendidikan', score: 78, color: 'bg-amber-500' },
            { name: 'Badan Keuangan Daerah', score: 75, color: 'bg-slate-500' },
          ].map((opd) => (
            <div key={opd.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{opd.name}</span>
                <span className="text-white font-bold">{opd.score} / 100</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${opd.color} rounded-full`} style={{ width: `${opd.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
