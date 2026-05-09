'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Building2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Map as MapIcon,
  Zap,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MobileExecutiveDashboard from '@/components/dashboard/MobileExecutiveDashboard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const stats = [
  { label: 'Kegiatan Aktif', value: '0', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', trend: '0%', up: true, pulse: false },
  { label: 'Peserta Hadir', value: '0', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: '0%', up: true, pulse: false },
  { label: 'Tingkat Kehadiran', value: '0%', icon: CheckCircle2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', trend: '0%', up: true, pulse: false },
  { label: 'OPD Aktif', value: '1', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', trend: 'Initial', up: true, pulse: false },
];

const chartData = [
  { name: '08:00', value: 0 },
  { name: '10:00', value: 0 },
  { name: '12:00', value: 0 },
  { name: '14:00', value: 0 },
  { name: '16:00', value: 0 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Mobile View */}
      <MobileExecutiveDashboard />

      {/* Desktop View */}
      <div className="hidden md:block space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pusat Komando Operasional</h1>
            <p className="text-slate-500 font-medium mt-1">Pantau kegiatan dan kehadiran Kabupaten Minahasa Selatan secara real-time.</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Sinkronisasi Aktif</span>
          </div>
        </div>

        {/* Hero KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative overflow-hidden border ${stat.border} shadow-lg hover:shadow-xl transition-all duration-500 group bg-white`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bg} blur-3xl -mr-10 -mt-10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} group-hover:scale-110 transition-transform relative`}>
                      {stat.pulse && <div className={`absolute inset-0 rounded-2xl ${stat.bg} animate-ping opacity-75`}></div>}
                      <stat.icon className="h-6 w-6 relative z-10" />
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Analytics Chart */}
          <Card className="lg:col-span-2 border border-slate-200 shadow-xl shadow-slate-200/50 p-6 bg-white rounded-[2rem]">
            <CardHeader className="px-0 pt-0 mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Volume Kehadiran Real-time
                </CardTitle>
                <p className="text-sm text-slate-500 font-medium mt-1">Pantau partisipasi peserta di semua kegiatan yang sedang berlangsung.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg">Hari Ini</button>
                <button className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors">Minggu Ini</button>
              </div>
            </CardHeader>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorBlue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Realtime Feed & AI Insights */}
          <div className="space-y-8">
            
            {/* AI Insights Widget */}
            <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot className="w-24 h-24 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 text-white rounded-xl glow-blue">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-blue-900 text-lg">Wawasan AI</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 backdrop-blur-sm border border-white p-3 rounded-xl flex gap-3 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">Partisipasi meningkat <span className="text-emerald-600">12%</span> dibanding rata-rata minggu lalu.</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white p-3 rounded-xl flex gap-3 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">Anomali terdeteksi: 3 peserta memvalidasi GPS di luar radius 100m.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Realtime Activity Feed */}
            <Card className="border border-slate-200 shadow-lg p-6 bg-white rounded-[2rem] flex-1">
              <CardHeader className="px-0 pt-0 mb-6 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-400" />
                    Aktivitas Terkini
                  </div>
                  <span className="animate-pulse flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-6 h-[220px] overflow-hidden relative">
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                <motion.div 
                  className="space-y-5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  { [].length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Clock className="w-8 h-8 text-slate-200 mb-2" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas hari ini</p>
                    </div>
                  ) : [].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="relative">
                        <div className={`w-2 h-2 mt-1.5 rounded-full ${item.valid ? 'bg-emerald-500' : 'bg-amber-500'} ring-4 ring-slate-50`}></div>
                        {idx !== 3 && <div className="absolute top-4 left-1 w-0.5 h-8 bg-slate-100"></div>}
                      </div>
                      <div>
                        <p className="text-sm text-slate-900 font-medium">
                          <span className="font-bold">{item.name}</span> {item.action}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </Card>

          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <Card className="border border-slate-200 shadow-xl p-0 bg-slate-900 rounded-[2rem] overflow-hidden relative min-h-[400px]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          
          <div className="absolute top-8 left-8 z-10 max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                <MapIcon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-white">Geospatial Intelligence</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Live visualization of event hotspots and attendance density across Minahasa Selatan districts.</p>
          </div>

          {/* Map Nodes Simulation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 relative">
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full border-2 border-white glow-blue"></div>
            
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white glow-emerald"></div>

            <div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-red-500 rounded-full border-2 border-white glow-border"></div>

            {/* Connecting lines simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
               <path d="M 220 64 Q 300 100, 440 128" fill="transparent" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
               <path d="M 440 128 Q 380 160, 330 192" fill="transparent" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-3 z-10">
            <div className="glass px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 glow-blue"></span> Amurang (High)
            </div>
            <div className="glass px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 glow-emerald"></span> Tumpaan (Medium)
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
