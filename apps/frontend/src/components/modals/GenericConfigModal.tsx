'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, CheckCircle2, Save, Server, Globe, Shield, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GenericConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function GenericConfigModal({ isOpen, onClose, featureName }: GenericConfigModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1500);
  };

  const isIntegration = featureName.includes('Integrasi') || featureName.includes('API') || featureName.includes('Gateway') || featureName.includes('Satelit Feed');
  const isBucket = featureName.includes('Bucket');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden relative"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -ml-32 -mb-32 rounded-full pointer-events-none" />

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-800 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  {isIntegration ? <Globe className="w-6 h-6 text-blue-400" /> : isBucket ? <Server className="w-6 h-6 text-blue-400" /> : <Settings className="w-6 h-6 text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight leading-tight">Konfigurasi Modul</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">GovTech Engine</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 relative z-10 space-y-6">
              
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-start gap-4">
                <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{featureName}</h3>
                  <p className="text-xs text-slate-500 mt-1">Status: <span className="text-emerald-400 font-bold">Tersedia</span>. Silakan atur konfigurasi di bawah untuk mengaktifkan fasilitas ini.</p>
                </div>
              </div>

              <div className="space-y-4">
                {isIntegration ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1">Endpoint URL / Target</label>
                      <Input className="h-11 bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" defaultValue="https://api.minsel.go.id/v1/" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1">API Key / Token (Opsional)</label>
                      <Input type="password" placeholder="••••••••••••••••" className="h-11 bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                  </>
                ) : isBucket ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1">Nama Bucket / Direktori</label>
                      <Input className="h-11 bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" defaultValue={featureName.split(' ').pop()} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1">Kapasitas Maksimal (GB)</label>
                      <Input type="number" defaultValue={50} className="h-11 bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 ml-1">Nilai Konfigurasi / Kebijakan</label>
                      <Input className="h-11 bg-slate-900 border-slate-800 text-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" defaultValue="Default Value" />
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl mt-4">
                   <div className="text-sm font-bold text-slate-300">Aktifkan {isIntegration ? 'Integrasi' : 'Modul'} ini</div>
                   <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" id="toggleStatus" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-slate-200 border-4 appearance-none cursor-pointer border-slate-800 right-0 border-blue-500" defaultChecked />
                    <label htmlFor="toggleStatus" className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"></label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
                  className={`flex-1 h-12 rounded-xl font-bold transition-all ${
                    isSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSaving ? (
                    <><RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                  ) : isSaved ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Tersimpan</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Simpan Konfigurasi</>
                  )}
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: #3b82f6; }
        .toggle-checkbox:checked + .toggle-label { background-color: #3b82f6; }
        .toggle-checkbox { right: 24px; transition: all 0.2s ease; border-color: #1e293b; background-color: #94a3b8; }
        .toggle-label { background-color: #1e293b; }
      `}</style>
    </AnimatePresence>
  );
}
