'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  X,
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  User,
  Pencil,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-violet-100 text-violet-700',
  ADMIN_OPD: 'bg-blue-100 text-blue-700',
  PANITIA: 'bg-amber-100 text-amber-700',
  PESERTA: 'bg-slate-100 text-slate-600',
};

function UserModal({
  onClose,
  editUser,
  opds,
  roles,
}: {
  onClose: () => void;
  editUser?: any;
  opds: any[];
  roles: any[];
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: editUser?.name || '',
    email: editUser?.email || '',
    password: '',
    roleId: editUser?.roleId || '',
    opdId: editUser?.opdId || '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editUser) {
        return api.patch(`/users/${editUser.id}`, data);
      }
      return api.post('/users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload: any = { name: form.name, roleId: form.roleId, opdId: form.opdId || null };
    if (!editUser) {
      payload.email = form.email;
      payload.password = form.password;
    }
    mutation.mutate(payload);
  };

  const selectedRole = roles.find((r) => r.id === form.roleId);
  const isAdminOPD = selectedRole?.name === 'ADMIN_OPD';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="bg-slate-900 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-xl">
              {editUser ? 'Edit Pengguna' : 'Tambah Admin OPD'}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {editUser ? 'Perbarui data dan akses pengguna' : 'Buat akun dan tetapkan instansi OPD'}
            </p>
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

          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10 rounded-xl"
                placeholder="Nama lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          {!editUser && (
            <>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className="pl-10 rounded-xl"
                    type="email"
                    placeholder="admin@opd.minsel.go.id"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password Awal</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    className="pl-10 rounded-xl"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Role / Jabatan Sistem</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                required
              >
                <option value="">-- Pilih Role --</option>
                {roles.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isAdminOPD && (
            <div className="space-y-2">
              <Label>Instansi OPD</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <select
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={form.opdId}
                  onChange={(e) => setForm({ ...form, opdId: e.target.value })}
                  required
                >
                  <option value="">-- Pilih OPD --</option>
                  {opds.map((o: any) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {mutation.isPending ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Buat Akun'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });

  const { data: opds = [] } = useQuery({
    queryKey: ['opds'],
    queryFn: async () => {
      const res = await api.get('/opd');
      return res.data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/users/roles');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setConfirmDelete(null);
    },
  });

  const filtered = users.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.opd?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    superAdmin: users.filter((u: any) => u.role?.name === 'SUPER_ADMIN').length,
    adminOpd: users.filter((u: any) => u.role?.name === 'ADMIN_OPD').length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1">
            Kelola akun admin dan tetapkan instansi OPD yang dikelola.
          </p>
        </div>
        <Button
          onClick={() => { setEditUser(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 px-6 gap-2 font-bold"
        >
          <Plus className="h-5 w-5" />
          Tambah Admin OPD
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Pengguna', value: stats.total, icon: Users, color: 'bg-slate-900 text-white' },
          { label: 'Super Admin', value: stats.superAdmin, icon: ShieldCheck, color: 'bg-violet-600 text-white' },
          { label: 'Admin OPD', value: stats.adminOpd, icon: Building2, color: 'bg-blue-600 text-white' },
        ].map((stat, i) => (
          <Card key={i} className={`${stat.color} border-none shadow-lg rounded-3xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold opacity-70 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black mt-1">{stat.value}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Table */}
      <Card className="border-none shadow-sm shadow-slate-200 rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-xl font-bold">Direktori Pengguna</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10 rounded-xl w-64 border-slate-200"
                placeholder="Cari nama, email, OPD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">Memuat data pengguna...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-y border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Pengguna</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Instansi OPD</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase">Bergabung</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <Badge
                          className={`${ROLE_COLORS[user.role?.name] || 'bg-slate-100 text-slate-600'} border-none rounded-lg text-xs font-bold`}
                        >
                          {user.role?.name || '–'}
                        </Badge>
                      </td>
                      <td className="px-8 py-4">
                        {user.opd ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                            <p className="text-sm text-slate-700 font-medium">{user.opd.name}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm italic">—</span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditUser(user); setShowModal(true); }}
                            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(user.id)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center text-slate-400">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <UserModal
            onClose={() => { setShowModal(false); setEditUser(null); }}
            editUser={editUser}
            opds={opds}
            roles={roles}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Pengguna?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Tindakan ini tidak dapat dibatalkan. Seluruh data pengguna akan dihapus permanen.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(confirmDelete)}
                  disabled={deleteMutation.isPending}
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
