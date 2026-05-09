'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Plus, Search, Pencil, Trash2, 
  MapPin, Users, Globe, CheckCircle2, X, AlertCircle
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OpdManagementModule({ onAction }: { onAction: (name: string) => void }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOpd, setEditOpd] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: opds = [], isLoading } = useQuery({
    queryKey: ['opds-full'],
    queryFn: async () => (await api.get('/opd')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/opd/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opds-full'] });
      setConfirmDelete(null);
    },
  });

  const filtered = opds.filter((o: any) => 
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total OPD', value: opds.length, icon: Building2, color: '#3b82f6' },
          { label: 'OPD Aktif', value: opds.length, icon: CheckCircle2, color: '#10b981' },
          { label: 'Wilayah Kerja', value: '1', icon: Globe, color: '#8b5cf6' },
          { label: 'Sync Status', value: 'LIVE', icon: Users, color: '#f59e0b' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}20`, border: `1px solid ${kpi.color}40` }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500/30"
            placeholder="Cari nama atau kode OPD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditOpd(null); setShowModal(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah OPD
        </button>
      </div>

      {/* OPD Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Memuat data OPD...</div>
        ) : filtered.map((opd: any, i: number) => (
          <motion.div 
            key={opd.id} 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all group relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shadow-inner">
                🏢
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditOpd(opd); setShowModal(true); }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setConfirmDelete(opd.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <h3 className="font-black text-white text-sm line-clamp-2 min-h-[2.5rem]">{opd.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">KODE: {opd.code || '—'}</p>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <MapPin className="w-3 h-3" /> Amurang, Minsel
              </div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black tracking-widest">
                AKTIF
              </div>
            </div>
          </motion.div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 bg-white/5 border border-white/10 rounded-3xl">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-bold">Tidak ada OPD ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal & Delete Dialog */}
      <AnimatePresence>
        {showModal && (
          <OpdModal 
            onClose={() => { setShowModal(false); setEditOpd(null); }} 
            editOpd={editOpd}
            onSuccess={() => queryClient.invalidateQueries({ queryKey: ['opds-full'] })}
          />
        )}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1d] border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hapus OPD?</h3>
              <p className="text-slate-400 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Seluruh data terkait OPD ini mungkin akan terpengaruh.</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">Batal</Button>
                <Button onClick={() => deleteMutation.mutate(confirmDelete)} disabled={deleteMutation.isPending}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OpdModal({ onClose, editOpd, onSuccess }: { onClose: () => void; editOpd?: any; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: editOpd?.name || '',
    code: editOpd?.code || '',
    address: editOpd?.address || '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editOpd) return api.patch(`/opd/${editOpd.id}`, data);
      return api.post('/opd', data);
    },
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return setError('Nama OPD wajib diisi');
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-white font-black text-xl">{editOpd ? 'Edit OPD' : 'Tambah OPD Baru'}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{editOpd ? 'Perbarui informasi instansi' : 'Daftarkan instansi OPD baru ke sistem'}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300 font-bold ml-1">Nama Instansi / OPD</Label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <Input 
                className="h-12 pl-11 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-blue-500/30 transition-all"
                placeholder="Contoh: Dinas Komunikasi dan Informatika"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-bold ml-1">Kode OPD</Label>
            <div className="relative">
              <Globe className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <Input 
                className="h-12 pl-11 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-blue-500/30 transition-all"
                placeholder="Contoh: DISKOMINFO"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-bold ml-1">Alamat Kantor</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <Input 
                className="h-12 pl-11 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-blue-500/30 transition-all"
                placeholder="Alamat lengkap instansi"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5">
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending}
              className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-600/30"
            >
              {mutation.isPending ? 'Menyimpan...' : editOpd ? 'Simpan Perubahan' : 'Daftarkan OPD'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
