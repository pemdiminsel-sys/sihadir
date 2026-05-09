'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix for Leaflet default icon issues in Webpack/Next.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dynamic import of Leaflet components to avoid SSR errors
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false });

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

function LocationMarker({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) {
  // @ts-ignore - useMapEvents is dynamically loaded
  const map = useMapEvents({
    click(e: any) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    // @ts-ignore
    <Marker position={position} />
  ) : null;
}

export default function MapPickerModal({ isOpen, onClose, onSelect, initialLat, initialLng }: MapPickerModalProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat || 1.15, initialLng || 124.5]); // Default to Minsel area

  const handleConfirm = () => {
    onSelect(position[0], position[1]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Pilih Lokasi Presensi</h2>
                  <p className="text-xs text-slate-500 font-medium">Klik pada peta untuk menandai titik pusat geofencing.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* @ts-ignore */}
                    <MapContainer 
                        center={position} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        {/* @ts-ignore */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>

                {/* Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Latitude</span>
                                <span className="text-sm font-mono font-bold text-slate-900">{position[0].toFixed(6)}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Longitude</span>
                                <span className="text-sm font-mono font-bold text-slate-900">{position[1].toFixed(6)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button 
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 md:flex-none h-12 rounded-xl border-white bg-white/80 backdrop-blur-sm font-bold hover:bg-white"
                        >
                            Batal
                        </Button>
                        <Button 
                            onClick={handleConfirm}
                            className="flex-1 md:flex-none h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-xl shadow-blue-600/30"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Konfirmasi Titik
                        </Button>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
