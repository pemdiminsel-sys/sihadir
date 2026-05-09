'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, Users, Search, Filter, LayoutGrid, List, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT:     { label: 'Draf',       color: 'bg-slate-100 text-slate-600' },
  PUBLISHED: { label: 'Aktif',      color: 'bg-emerald-100 text-emerald-700' },
  ARCHIVED:  { label: 'Diarsipkan', color: 'bg-amber-100 text-amber-700' },
};

const FILTER_TABS = [
  { key: '', label: 'Semua Kegiatan' },
  { key: 'PUBLISHED', label: 'Aktif' },
  { key: 'DRAFT', label: 'Draf' },
  { key: 'ARCHIVED', label: 'Diarsipkan' },
];

const CATEGORY_ICONS: Record<string, string> = {
  RAPAT: '🤝', PELATIHAN: '📚', SEMINAR: '🎤', WORKSHOP: '🔧',
  SOSIALISASI: '📣', LAINNYA: '📋',
};

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => (await api.get('/events')).data,
  });

  const filtered = events.filter((e: any) => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase()) ||
      e.opd?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Daftar Kegiatan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola semua kegiatan pemerintah daerah Kabupaten Minahasa Selatan.</p>
        </div>
        <Link href="/events/create">
          <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl gap-2 h-11 px-6 font-bold">
            <Plus className="h-4 w-4" /> Buat Kegiatan Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Kegiatan', value: events.length, color: 'bg-slate-900 text-white' },
          { label: 'Kegiatan Aktif', value: events.filter((e: any) => e.status === 'PUBLISHED').length, color: 'bg-emerald-600 text-white' },
          { label: 'Draf', value: events.filter((e: any) => e.status === 'DRAFT').length, color: 'bg-amber-500 text-white' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`${s.color} rounded-2xl p-4 shadow-sm`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input placeholder="Cari kegiatan, lokasi, atau OPD..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
        </div>
        <div className="flex gap-2 items-center">
          {FILTER_TABS.map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${statusFilter === f.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {f.label}
            </button>
          ))}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
          {[1,2,3].map(i => <div key={i} className="h-56 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold">Tidak ada kegiatan ditemukan</p>
          <p className="text-sm mt-1">Buat kegiatan baru atau ubah filter pencarian</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event: any, i: number) => {
            const s = STATUS_LABELS[event.status] || STATUS_LABELS.DRAFT;
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/events/${event.id}`} className="block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                  <div className="h-28 bg-gradient-to-r from-slate-800 to-slate-700 relative flex items-center justify-center">
                    <span className="text-4xl">{CATEGORY_ICONS[event.category] || '📋'}</span>
                    {event.bannerUrl && <img src={event.bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />}
                    <span className={`absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-lg ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{format(new Date(event.startTime), 'dd MMM yyyy', { locale: id })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{event._count?.attendances || 0} Peserta Hadir</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{event.opd?.name}</span>
                      {event.requiresRegistration && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded border bg-blue-50 border-blue-200 text-blue-600">Registrasi</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-50">
            {filtered.map((event: any, i: number) => {
              const s = STATUS_LABELS[event.status] || STATUS_LABELS.DRAFT;
              return (
                <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/events/${event.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {CATEGORY_ICONS[event.category] || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{event.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(event.startTime), 'dd MMM yyyy', { locale: id })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500 hidden md:block">{event.opd?.name}</span>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${s.color}`}>{s.label}</span>
                      <span className="text-xs text-slate-400">{event._count?.attendances || 0} hadir</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
