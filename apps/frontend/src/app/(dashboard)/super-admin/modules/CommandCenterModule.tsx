'use client';

import { motion } from 'framer-motion';
import { Globe, Users, Activity, MapPin, Zap, AlertTriangle, Crosshair } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CommandCenterModule({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Events', value: '14', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Live Attendees', value: '2,845', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'System Load', value: '24%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Anomalies', value: '3', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 p-6 flex items-center gap-4 hover:bg-white/10 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Map and Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900 border-white/10 overflow-hidden relative min-h-[400px] flex items-center justify-center">
          {/* Radar Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 opacity=%220.05%22%3E%3Cpath d=%22M0 0h40v40H0z%22 fill=%22none%22 stroke=%22%23fff%22/%3E%3C/svg%3E')]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-blue-500/20" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-500/30" />
            <div className="absolute w-[100px] h-[100px] rounded-full border border-blue-500/40 bg-blue-500/5" />
            <div className="absolute w-full h-[1px] bg-blue-500/20" />
            <div className="absolute h-full w-[1px] bg-blue-500/20" />
          </div>
          
          <Globe className="w-16 h-16 text-blue-500/50 absolute top-6 right-6" />
          
          <div className="relative z-10 text-center">
            <Crosshair className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-black text-white tracking-widest">GEOSPATIAL ENGINE</h3>
            <p className="text-slate-400 text-sm mt-2">Menunggu koneksi feed satelit Minsel...</p>
            <button 
              onClick={() => onAction('Satelit Feed')}
              className="mt-6 px-6 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600/40 transition-colors"
            >
              Aktifkan Modul Peta
            </button>
          </div>
        </Card>

        {/* Live Feed */}
        <Card className="bg-white/5 border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-300 tracking-widest uppercase">Live Surveilance</h3>
            <span className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { time: '10:42:01', msg: 'Check-in: Rapat Paripurna DPRD', type: 'info' },
              { time: '10:41:45', msg: 'GPS Anomali terdeteksi di Tompaso Baru', type: 'warn' },
              { time: '10:40:12', msg: 'Event "Sosialisasi SPBE" dimulai', type: 'success' },
              { time: '10:35:00', msg: '124 Peserta berhasil verifikasi wajah', type: 'info' },
              { time: '10:30:22', msg: 'Gagal verifikasi e-Sign BSRE', type: 'error' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 text-sm border-b border-white/5 pb-3">
                <span className="text-slate-500 font-mono text-[10px] shrink-0 mt-0.5">{log.time}</span>
                <span className={`text-xs ${log.type === 'warn' ? 'text-amber-400' : log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
