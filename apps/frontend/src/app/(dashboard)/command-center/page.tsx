'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Map as MapIcon, 
  Users, 
  AlertTriangle, 
  Globe, 
  Shield, 
  TrendingUp,
  Maximize2,
  Minimize2,
  Clock,
  ChevronRight,
  Zap,
  Server,
  Wifi
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip 
} from 'recharts';

const chartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  count: Math.floor(Math.random() * 500) + 200,
}));

export default function CommandCenterPage() {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-mono flex flex-col gap-6 relative z-0 selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617] -z-10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 -z-10 pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-blue-500/20 pb-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] border border-blue-400/50 glow-border">
            <Shield className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-emerald-400 text-glow">
              SIHADIR COMMAND CENTER
            </h1>
            <div className="flex items-center gap-3 text-xs text-blue-400/80 mt-1 uppercase font-bold tracking-widest">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> GLOBAL MONITOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse glow-emerald"></span>
              <span>LIVE SYSTEM</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-right hidden md:block">
            <div className="text-4xl font-black text-blue-400 tracking-tighter text-glow">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm text-blue-500/50 mt-1 uppercase font-bold tracking-widest">
              {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <Button 
            onClick={toggleFullscreen}
            variant="outline" 
            size="icon" 
            className="rounded-xl border-blue-500/30 text-blue-400 hover:bg-blue-900/50 hover:text-white bg-blue-950/30 glow-border"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Intelligence Stats */}
        <div className="md:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <Card className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
              <Users className="h-16 w-16 text-blue-400" />
            </div>
            <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Activity className="h-3 w-3" /> Total Presensi Harian
            </p>
            <div className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">4,281</div>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit glow-emerald">
              <TrendingUp className="h-4 w-4" /> +12.4% vs MINGGU LALU
            </div>
          </Card>

          <Card className="glass-card p-6 border-emerald-500/20">
             <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mb-1 flex items-center gap-2">
               <Server className="h-3 w-3" /> Kegiatan Aktif Realtime
             </p>
             <div className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">24</div>
             <div className="mt-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between border-l-2 border-emerald-500/50 pl-4 py-1 hover:bg-white/5 transition-colors cursor-pointer rounded-r-lg group">
                    <div>
                      <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">Rapat Koordinasi SPBE {i}</p>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">DINAS KOMINFO • <span className="text-emerald-400">142 LIVE</span></p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-emerald-500/30 group-hover:text-emerald-400 transition-colors" />
                  </div>
                ))}
             </div>
          </Card>

          <Card className="glass-card p-6 border-amber-500/20">
             <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Shield className="h-3 w-3" /> Peringatan Keamanan
             </p>
             <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex gap-3 glow-border shadow-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 animate-pulse" />
                  <p className="text-[11px] font-bold text-red-200 leading-tight">Terdeteksi upaya manipulasi GPS di Kegiatan Rakor Stunting (2 User)</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex gap-3">
                  <Activity className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] font-bold text-amber-200 leading-tight">Lonjakan kehadiran di Dinas Pendidikan terdeteksi (Normal Spike)</p>
                </div>
             </div>
          </Card>
        </div>

        {/* Center Column: Tactical Map & Global Analytics */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <Card className="flex-1 glass-card border-blue-500/30 p-0 rounded-3xl relative overflow-hidden group">
            
            {/* Radar Sweep Effect */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10 shadow-[inset_0_0_100px_rgba(59,130,246,0.1)] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10 shadow-[inset_0_0_100px_rgba(59,130,246,0.1)] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20 pointer-events-none"></div>
            
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,1)] z-10 animate-[scan_4s_linear_infinite]"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-full max-w-lg h-[400px]">
                  {/* Glowing Points representing active regions */}
                  <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse glow-emerald"></div>
                    <span className="text-[8px] font-bold text-emerald-400 mt-2 bg-black/50 px-2 py-0.5 rounded border border-emerald-500/30">AMURANG</span>
                  </div>
                  <div className="absolute top-1/2 right-1/3 flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse glow-blue" style={{animationDelay: '1s'}}></div>
                    <span className="text-[8px] font-bold text-blue-400 mt-2 bg-black/50 px-2 py-0.5 rounded border border-blue-500/30">TUMPAAN</span>
                  </div>
                  <div className="absolute bottom-1/3 left-1/3 flex flex-col items-center">
                    <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse glow-border shadow-red-500/50" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute w-12 h-12 border border-red-500/50 rounded-full animate-ping"></div>
                    <span className="text-[8px] font-bold text-red-400 mt-2 bg-black/50 px-2 py-0.5 rounded border border-red-500/30">ANOMALY DETECTED</span>
                  </div>
               </div>
            </div>

            <div className="absolute top-6 left-6 flex items-center gap-3">
              <Badge className="bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg font-black px-3 py-1.5 text-[10px] tracking-widest backdrop-blur-md">GEOSPATIAL RADAR</Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-black px-3 py-1.5 text-[10px] tracking-widest backdrop-blur-md flex items-center gap-1">
                <Wifi className="w-3 h-3" /> ONLINE
              </Badge>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-[#020617]/80 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/20 shadow-2xl">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 glow-blue"></div>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Normal Ops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 glow-emerald"></div>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">High Density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Alerts</span>
                  </div>
               </div>
            </div>
          </Card>

          <Card className="h-[250px] glass-card border-blue-500/20 p-6">
             <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest">Traffic Volume & Server Load (24H)</p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-500/20 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full glow-blue"></div> 12.4K REQ/MIN
                  </span>
                </div>
             </div>
             <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="commandChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Area 
                      type="step" 
                      dataKey="count" 
                      stroke="#60a5fa" 
                      strokeWidth={2} 
                      fill="url(#commandChart)" 
                      animationDuration={3000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
        </div>

        {/* Right Column: Live Data Feed */}
        <div className="md:col-span-3 flex flex-col gap-6 overflow-hidden">
          <Card className="flex-1 glass-card border-blue-500/20 p-6 flex flex-col overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
             
             <div className="flex items-center justify-between mb-6 shrink-0">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Activity Stream</p>
                <div className="flex gap-1">
                  <div className="w-1.5 h-4 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
                  <div className="w-1.5 h-4 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite_0.2s]"></div>
                  <div className="w-1.5 h-4 bg-blue-500 animate-[pulse_1s_ease-in-out_infinite_0.4s]"></div>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="group border border-transparent hover:border-blue-500/30 bg-blue-900/10 p-3 rounded-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/40 transition-colors">
                        <Zap className="h-4 w-4 text-blue-300" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-200 leading-snug">
                          <span className="text-blue-400 font-bold">ASN_{i * 842}</span> presensi di <span className="font-bold text-white">Rakor SPBE {i}</span>
                        </p>
                        <p className="text-[9px] text-emerald-400 mt-1.5 flex items-center gap-1.5 font-bold tracking-widest">
                          <Clock className="h-3 w-3" /> BARU SAJA • <span className="px-1 bg-emerald-500/20 rounded">VALID</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </Card>

          <Card className="h-[150px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#020617] to-[#020617] border border-emerald-500/30 p-6 flex flex-col justify-center text-center shadow-[inset_0_0_50px_rgba(16,185,129,0.1)] glow-emerald">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">System Health</p>
              <div className="text-5xl font-black text-white italic drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">99.9%</div>
              <p className="text-[9px] text-slate-400 mt-3 font-bold tracking-widest">ALL SERVICES FULLY OPERATIONAL</p>
          </Card>
        </div>
      </div>

      {/* Footer Ticker */}
      <footer className="h-12 bg-[#020617] border-t border-blue-500/30 overflow-hidden flex items-center relative z-20">
         <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none"></div>
         
         <div className="bg-blue-600 h-full px-8 flex items-center text-[11px] font-black tracking-[0.2em] text-white shrink-0 z-20 shadow-[10px_0_20px_rgba(37,99,235,0.5)]">
           LIVE INTEL
         </div>
         <div className="flex-1 overflow-hidden ml-4">
            <div className="flex animate-marquee whitespace-nowrap gap-16 text-xs font-bold text-blue-300">
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> PENGUMUMAN: RAKOR STUNTING DIMULAI DALAM 15 MENIT</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> DATA: 4281 ASN TELAH MELAKUKAN PRESENSI HARI INI</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> ALERTA: TERDETEKSI 2 UPAYA MANIPULASI LOKASI</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> STATUS: DINAS KOMINFO MENCAPAI PARTISIPASI 100%</span>
            </div>
         </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee { animation: marquee 35s linear infinite; }
        
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
