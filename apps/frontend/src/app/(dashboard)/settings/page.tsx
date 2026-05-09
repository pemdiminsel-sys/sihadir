'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500">Kelola preferensi akun dan pengaturan sistem Anda.</p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="profil" className="rounded-lg px-6 font-bold">
            <User className="w-4 h-4 mr-2" />
            Profil Pengguna
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="rounded-lg px-6 font-bold">
            <Shield className="w-4 h-4 mr-2" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="notifikasi" className="rounded-lg px-6 font-bold">
            <Bell className="w-4 h-4 mr-2" />
            Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <Card className="border-slate-200 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Perbarui informasi dasar profil Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-slate-400">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <Button variant="outline" className="rounded-lg">Ubah Foto</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" defaultValue={user?.name || ''} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} className="rounded-xl" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={typeof user?.role === 'object' ? user?.role?.name : user?.role || ''} className="rounded-xl bg-slate-50 font-mono" disabled />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 rounded-xl px-8">Simpan Perubahan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keamanan">
          <Card className="border-slate-200 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
              <CardDescription>Pastikan akun Anda menggunakan password yang kuat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current">Password Saat Ini</Label>
                  <Input id="current" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Password Baru</Label>
                  <Input id="new" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Konfirmasi Password Baru</Label>
                  <Input id="confirm" type="password" className="rounded-xl" />
                </div>
              </div>
              <div className="flex justify-start pt-4">
                <Button className="bg-slate-900 rounded-xl px-8">Perbarui Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifikasi">
           <Card className="border-slate-200 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Pilih notifikasi apa saja yang ingin Anda terima.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Email Laporan Mingguan</p>
                    <p className="text-sm text-slate-500">Terima ringkasan presensi setiap akhir pekan.</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Peringatan Anomali Real-time</p>
                    <p className="text-sm text-slate-500">Dapatkan notifikasi langsung saat terdeteksi anomali kehadiran.</p>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"></label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 24px;
          border-color: #e2e8f0;
          transition: all 0.2s ease;
        }
        .toggle-label {
          background-color: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
