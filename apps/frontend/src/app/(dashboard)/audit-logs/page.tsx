'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  User, 
  Clock, 
  Globe,
  Database,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AuditLogsPage() {
  const router = useRouter();
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await api.get('/audit-logs');
      return response.data;
    },
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'POST': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PATCH': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELETE': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-slate-500">Rekam jejak aktivitas sistem yang tidak dapat diubah (immutable).</p>
        </div>
        <div className="flex gap-3">
           <Button 
             variant="outline" 
             className="rounded-xl border-slate-200 gap-2 h-12 px-6"
             onClick={() => toast.success('Memproses Export Audit Log ke CSV...')}
           >
            <Download className="h-5 w-5" />
            Ekspor CSV
          </Button>
          <Button 
            className="bg-slate-900 rounded-xl gap-2 h-12 px-6"
            onClick={() => router.push('/reports')}
          >
            <ShieldAlert className="h-5 w-5" />
            Laporan Anomali
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative flex-1 md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari berdasarkan user, entitas, atau aksi..." 
            className="pl-10 h-12 rounded-xl border-slate-200 shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl border-slate-200 gap-2 px-6 shadow-sm">
          <Filter className="h-4 w-4" />
          Semua Entitas
        </Button>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200 rounded-3xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User / Aktor</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Aksi</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Entitas</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Waktu & IP</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                 [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10"><div className="h-8 bg-slate-100 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : (
                logs?.map((log: any, i: number) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    key={log.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{log.user?.name || 'System'}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{log.user?.role || 'SYSTEM'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <Badge className={`${getActionColor(log.action)} border rounded-lg px-2 py-1 text-[10px] font-bold`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <Database className="h-4 w-4 text-slate-300" />
                         <span className="text-sm font-medium text-slate-700 capitalize">{log.entity}</span>
                         <span className="text-[10px] text-slate-400 font-mono">#{log.entityId?.substring(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <Globe className="h-3 w-3" />
                          {log.ipAddress || '127.0.0.1'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                        <Eye className="h-4 w-4 text-slate-400" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
