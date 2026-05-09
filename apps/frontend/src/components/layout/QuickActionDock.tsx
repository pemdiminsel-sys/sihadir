'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  QrCode, 
  FileSpreadsheet, 
  Globe, 
  Send 
} from 'lucide-react';
import Link from 'next/link';

export default function QuickActionDock() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Globe, label: 'Command Center', href: '/command-center', color: 'bg-blue-600 text-white shadow-blue-500/50' },
    { icon: Plus, label: 'Buat Kegiatan', href: '/events/create', color: 'bg-white text-slate-700 hover:bg-slate-50' },
    { icon: QrCode, label: 'Generate QR', href: '/events', color: 'bg-white text-slate-700 hover:bg-slate-50' },
    { icon: FileSpreadsheet, label: 'Export Laporan', href: '/reports', color: 'bg-white text-slate-700 hover:bg-slate-50' },
    { icon: Send, label: 'Kirim Notifikasi', href: '/settings', color: 'bg-white text-slate-700 hover:bg-slate-50' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
            className="flex flex-col gap-3"
          >
            {actions.map((action, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: (actions.length - i) * 0.05 }}
              >
                <Link 
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-slate-200/50 transition-all duration-300 hover:scale-105 group ${action.color}`}
                >
                  <span className="text-sm font-bold order-1 group-hover:pr-2 transition-all">{action.label}</span>
                  <div className="p-1.5 rounded-full bg-black/5 order-2">
                    <action.icon className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 ${isOpen ? 'bg-red-500 rotate-45 shadow-red-500/50' : 'bg-slate-900 shadow-slate-900/50 glow-border'}`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
