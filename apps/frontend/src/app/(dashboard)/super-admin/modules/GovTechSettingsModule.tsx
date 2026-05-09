'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Link as LinkIcon, Lock, Copy, RefreshCw, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GovTechSettingsModule({ onAction }: { onAction: (action: string) => void }) {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">GovTech 2.0 Configuration</h2>
        <p className="text-slate-400 mt-1">Kelola keamanan tingkat lanjut, integritas data, dan interoperabilitas SPBE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & MFA */}
        <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Trust Security</h3>
            <p className="text-sm text-slate-400 mb-6">
              Aktifkan Multi-Factor Authentication (MFA) untuk seluruh akun Administrator dan Operator menggunakan Google Authenticator atau TOTP lainnya.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-white/10">
            <div>
              <p className="text-sm font-bold text-white">Require MFA for Admins</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Status: {mfaEnabled ? 'Enforced' : 'Optional'}</p>
            </div>
            <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} className="data-[state=checked]:bg-blue-600" />
          </div>
        </Card>

        {/* Blockchain Audit Ledger */}
        <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Blockchain Audit Ledger</h3>
            <p className="text-sm text-slate-400 mb-6">
              Sistem akan merangkai log aktivitas menggunakan algoritma SHA-256 (Cryptographic Hashing), menjadikannya buku besar digital yang mustahil dimanipulasi.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
              <span className="text-slate-500">Latest Genesis Hash</span>
              <span className="text-emerald-400 flex items-center gap-1"><Lock className="w-3 h-3" /> SECURE</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs text-violet-300 bg-violet-500/10 px-2 py-1.5 rounded truncate flex-1 font-mono border border-violet-500/20">
                8f4e2...d91a7c
              </code>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-400 hover:text-white">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Open Government API */}
      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Open Government API (SPBE)</h3>
            <p className="text-sm text-slate-400">Buat kunci akses (API Keys) agar instansi lain dapat terintegrasi dengan data kehadiran SIHADIR.</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'BKPSDM Sync Portal', key: 'sk_live_9f8d...2jd8', created: '2026-04-15' },
            { name: 'Portal Minsel SuperApp', key: 'sk_live_38dn...f93l', created: '2026-05-01' },
          ].map((api, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-white/10">
              <div>
                <p className="text-sm font-bold text-white">{api.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Created: {api.created}</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-slate-300 bg-black px-3 py-2 rounded-lg font-mono border border-white/10 w-48 text-center">
                  {api.key}
                </code>
                <Button size="icon" variant="ghost" className="rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button 
            className="w-full h-12 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2"
            onClick={() => onAction('Generate API Key')}
          >
            <Key className="w-4 h-4" />
            Generate New API Key
          </Button>
        </div>
      </Card>
    </div>
  );
}
