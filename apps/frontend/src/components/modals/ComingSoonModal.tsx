'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Rocket, Bell, ShieldCheck, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-blue-900/20 overflow-hidden relative"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -ml-32 -mb-32 rounded-full" />

            <div className="p-8 md:p-12 text-center relative z-10">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-600/30 mb-8 relative">
                <Rocket className="w-12 h-12 text-white animate-bounce" />
                <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg border-2 border-white shadow-lg uppercase">Next Gen</div>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                Fasilitas <span className="text-blue-600">{featureName}</span> <br /> 
                Sedang Dipersiapkan
              </h2>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Kami sedang membangun algoritma <span className="text-slate-900 font-bold italic">GovTech 2.0</span> untuk memberikan pengalaman terbaik di Minahasa Selatan. Fitur ini akan segera tersedia dalam update mendatang.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                  <Zap className="w-6 h-6 text-blue-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kecepatan</span>
                  <span className="text-xs font-bold text-slate-700">Real-time Data</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 flex flex-col items-center text-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keamanan</span>
                  <span className="text-xs font-bold text-slate-700">Audit Berlapis</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg active:scale-95"
                >
                  Dimengerti
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-slate-200 gap-2 font-bold hover:bg-slate-50 transition-all active:scale-95"
                  onClick={() => alert('Terima kasih! Kami akan memberi tahu Anda.')}
                >
                  <Bell className="w-4 h-4" />
                  Beri Tahu Saya
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                <Bot className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Minsel AI Engine</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
