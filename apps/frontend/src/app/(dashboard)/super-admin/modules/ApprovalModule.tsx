'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Search, Filter, UserCheck, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MOCK_REQUESTS = [
  { id: '1', name: 'Dr. James Riady', opd: 'Dinas Kesehatan', event: 'Sosialisasi SPBE 2026', time: '10 mins ago', status: 'pending', risk: 'low' },
  { id: '2', name: 'Sarah Wuwungan, M.Si', opd: 'BKPSDM', event: 'Rapat Koordinasi ASN', time: '25 mins ago', status: 'pending', risk: 'low' },
  { id: '3', name: 'Alex Tumuju', opd: 'Umum (Masyarakat)', event: 'Bimtek UMKM Digital', time: '1 hour ago', status: 'pending', risk: 'high' },
];

export default function ApprovalModule({ onAction }: { onAction: (action: string) => void }) {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleApprove = (id: string) => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
    // In real app, call API
  };

  const handleReject = (id: string) => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
    // In real app, call API
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Cari peserta..." 
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1.5 rounded-lg">
            <UserCheck className="w-3 h-3 mr-2" />
            {requests.length} Menunggu Verifikasi
          </Badge>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-12 flex flex-col items-center justify-center text-center">
            <Shield className="w-12 h-12 text-emerald-400 mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-white">Semua Bersih</h3>
            <p className="text-slate-400 text-sm mt-1">Tidak ada permintaan persetujuan yang tertunda.</p>
          </Card>
        ) : (
          requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 transition-colors">
                <div className="flex-1 flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 font-bold text-sm">{req.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{req.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-white/5">
                        {req.opd}
                      </span>
                      <span className="text-[10px] text-slate-500">{req.event}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500">{req.time}</span>
                    {req.risk === 'high' && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 mt-1 uppercase tracking-widest">
                        <AlertCircle className="w-3 h-3" /> External Identity
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                      title="Tolak"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                      title="Setujui"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
