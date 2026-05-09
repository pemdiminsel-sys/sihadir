'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building2,
  MoreHorizontal,
  UserPlus,
  DownloadCloud,
  X,
  User,
  CreditCard,
  BadgeCheck,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICIPANT_TYPES = [
  { value: 'ASN', label: 'ASN (Aparatur Sipil Negara)', color: 'bg-blue-100 text-blue-700' },
  { value: 'MASYARAKAT', label: 'Masyarakat Umum', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'INSTITUSI_LAIN', label: 'Institusi Lain', color: 'bg-amber-100 text-amber-700' },
];

const ASN_TYPES = [
  { value: 'PNS', label: 'PNS (Pegawai Negeri Sipil)' },
  { value: 'CPNS', label: 'CPNS (Calon PNS)' },
  { value: 'PPPK', label: 'PPPK (Pegawai Pemerintah dengan Perjanjian Kerja)' },
  { value: 'PPPK_PW', label: 'PPPK Paruh Waktu (PPPK PW)' },
];

const BADGE_COLORS: Record<string, string> = {
  ASN: 'bg-blue-100 text-blue-700',
  MASYARAKAT: 'bg-emerald-100 text-emerald-700',
  INSTITUSI_LAIN: 'bg-amber-100 text-amber-700',
};

// ─── Add Participant Modal ────────────────────────────────────────────────────
function AddParticipantModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    position: '',
    participantType: 'ASN',
    asnType: 'PNS',
    identityNumber: '',
    ktpNumber: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/participants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload: any = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      institution: form.institution || undefined,
      position: form.position || undefined,
      participantType: form.participantType,
    };
    if (form.participantType === 'ASN') {
      payload.asnType = form.asnType;
      payload.identityNumber = form.identityNumber;
    } else if (form.participantType === 'MASYARAKAT') {
      payload.ktpNumber = form.ktpNumber;
    } else {
      payload.identityNumber = form.identityNumber;
    }
    mutation.mutate(payload);
  };

  const pType = form.participantType;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-4"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-xl">Tambah Peserta Baru</h2>
            <p className="text-slate-400 text-sm mt-0.5">Isi data dan tipe peserta dengan lengkap</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Jenis Peserta ── */}
          <div className="space-y-2">
            <Label className="font-bold">Jenis Peserta</Label>
            <div className="grid grid-cols-3 gap-2">
              {PARTICIPANT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setForm({ ...form, participantType: pt.value, identityNumber: '', ktpNumber: '', asnType: 'PNS' })}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    form.participantType === pt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className={`text-xs font-black ${form.participantType === pt.value ? 'text-blue-600' : 'text-slate-700'}`}>
                    {pt.value === 'ASN' ? 'ASN' : pt.value === 'MASYARAKAT' ? 'Masyarakat' : 'Institusi Lain'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {pt.value === 'ASN' ? 'PNS / CPNS / PPPK' : pt.value === 'MASYARAKAT' ? 'Warga / Umum' : 'TNI / Polri / Swasta'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Khusus ASN: Sub-tipe ── */}
          <AnimatePresence mode="wait">
            {pType === 'ASN' && (
              <motion.div
                key="asn"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label className="font-bold flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                  Status Kepegawaian ASN
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ASN_TYPES.map((at) => (
                    <button
                      key={at.value}
                      type="button"
                      onClick={() => setForm({ ...form, asnType: at.value })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.asnType === at.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <p className={`text-xs font-black ${form.asnType === at.value ? 'text-blue-600' : 'text-slate-700'}`}>
                        {at.value.replace('_', ' ')}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <Label htmlFor="nip" className="font-bold flex items-center gap-1.5">
                    <Hash className="h-4 w-4 text-slate-400" />
                    NIP (Nomor Induk Pegawai)
                  </Label>
                  <Input
                    id="nip"
                    className="h-12 rounded-xl font-mono tracking-wider"
                    placeholder="Contoh: 198901012010011001"
                    maxLength={18}
                    value={form.identityNumber}
                    onChange={(e) => setForm({ ...form, identityNumber: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </motion.div>
            )}

            {pType === 'MASYARAKAT' && (
              <motion.div
                key="masyarakat"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="ktp" className="font-bold flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  Nomor KTP (NIK)
                </Label>
                <Input
                  id="ktp"
                  className="h-12 rounded-xl font-mono tracking-wider"
                  placeholder="Contoh: 7108011234560001"
                  maxLength={16}
                  value={form.ktpNumber}
                  onChange={(e) => setForm({ ...form, ktpNumber: e.target.value.replace(/\D/g, '') })}
                />
              </motion.div>
            )}

            {pType === 'INSTITUSI_LAIN' && (
              <motion.div
                key="institusi"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="memberNo" className="font-bold flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-amber-500" />
                  Nomor Identitas / Anggota
                  <span className="text-slate-400 font-normal text-xs">(NRP, NTA, Nomor Karyawan, dll.)</span>
                </Label>
                <Input
                  id="memberNo"
                  className="h-12 rounded-xl font-mono tracking-wider"
                  placeholder="Contoh: NRP-001234 / NTA-567890"
                  value={form.identityNumber}
                  onChange={(e) => setForm({ ...form, identityNumber: e.target.value })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Data Umum ── */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Umum</p>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                className="h-12 rounded-xl"
                placeholder="Nama lengkap sesuai KTP / dokumen resmi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-12 rounded-xl"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold">No. Telepon</Label>
                <Input
                  id="phone"
                  className="h-12 rounded-xl"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution" className="font-bold">Instansi / OPD</Label>
                <Input
                  id="institution"
                  className="h-12 rounded-xl"
                  placeholder="Dinas / Badan / Instansi"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="font-bold">Jabatan</Label>
                <Input
                  id="position"
                  className="h-12 rounded-xl"
                  placeholder="Jabatan atau posisi"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Batal
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold"
            >
              {mutation.isPending ? 'Menyimpan...' : 'Simpan Peserta'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParticipantsPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const response = await api.get('/participants');
      return response.data;
    },
  });

  const filtered = participants.filter((p: any) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.institution?.toLowerCase().includes(search.toLowerCase()) ||
      p.identityNumber?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || p.participantType === filterType;
    return matchSearch && matchType;
  });

  const getIdentityDisplay = (p: any) => {
    if (p.participantType === 'MASYARAKAT') return p.ktpNumber ? `KTP: ${p.ktpNumber}` : null;
    if (p.identityNumber) return p.participantType === 'ASN' ? `NIP: ${p.identityNumber}` : `ID: ${p.identityNumber}`;
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Peserta</h1>
          <p className="text-slate-500">Kelola database peserta kegiatan dan delegasi OPD.</p>
        </div>
        <div className="flex gap-3">
          {/* Import Excel */}
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-12 px-6">
            <DownloadCloud className="h-5 w-5" />
            Import Excel
          </Button>
          {/* Tambah Peserta */}
          <Button
            onClick={() => setShowModal(true)}
            className="bg-slate-900 hover:bg-slate-800 rounded-xl gap-2 h-12 px-6 font-bold"
          >
            <UserPlus className="h-5 w-5" />
            Tambah Peserta
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Peserta', value: participants.length, color: 'bg-slate-900 text-white' },
          { label: 'ASN', value: participants.filter((p: any) => p.participantType === 'ASN').length, color: 'bg-blue-600 text-white' },
          { label: 'Masyarakat', value: participants.filter((p: any) => p.participantType === 'MASYARAKAT').length, color: 'bg-emerald-600 text-white' },
          { label: 'Institusi Lain', value: participants.filter((p: any) => p.participantType === 'INSTITUSI_LAIN').length, color: 'bg-amber-500 text-white' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-5 shadow-sm`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{stat.label}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama, email, NIP, KTP, atau instansi..."
            className="pl-10 h-12 rounded-xl border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ASN', 'MASYARAKAT', 'INSTITUSI_LAIN'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterType === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {type === 'ALL' ? 'Semua' : type === 'INSTITUSI_LAIN' ? 'Institusi Lain' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-none shadow-sm shadow-slate-200 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Peserta</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis / Nomor ID</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instansi</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-4">
                      <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400">
                    <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    Tidak ada peserta ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((participant: any) => {
                  const identityDisplay = getIdentityDisplay(participant);
                  return (
                    <tr key={participant.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold shrink-0">
                            {participant.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-slate-900">{participant.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${BADGE_COLORS[participant.participantType] || 'bg-slate-100 text-slate-600'} border-none rounded-lg text-[10px] font-bold`}
                            >
                              {participant.asnType || participant.participantType}
                            </Badge>
                          </div>
                          {identityDisplay && (
                            <p className="text-[11px] text-slate-500 font-mono">{identityDisplay}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="space-y-1">
                          {participant.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail className="h-3 w-3" />
                              {participant.email}
                            </div>
                          )}
                          {participant.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Phone className="h-3 w-3" />
                              {participant.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        {participant.institution && (
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            {participant.institution}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-none rounded-lg">
                          {participant.position || '—'}
                        </Badge>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
                            <DropdownMenuItem className="rounded-lg">Edit Profil</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">Lihat Riwayat</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg text-red-600">Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <AddParticipantModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
