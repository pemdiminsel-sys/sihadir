'use client';

import Image from 'next/image';

interface OfficialHeaderProps {
  opdName?: string;
  reportTitle?: string;
}

export default function OfficialHeader({ opdName = 'DINAS KOMUNIKASI DAN INFORMATIKA', reportTitle = 'LAPORAN REKAPITULASI KEHADIRAN PEGAWAI' }: OfficialHeaderProps) {
  return (
    <div className="w-full bg-white text-black p-6 border-b-4 border-double border-black mb-8 print:block">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="w-24 h-24 shrink-0 relative">
          <Image 
            src="/logo-minsel.png" 
            alt="Logo Minsel" 
            width={100} 
            height={100} 
            className="object-contain"
          />
        </div>

        {/* Text Center */}
        <div className="flex-1 text-center pr-24">
          <h2 className="text-xl font-bold uppercase leading-tight tracking-wide">
            Pemerintah Kabupaten Minahasa Selatan
          </h2>
          <h1 className="text-2xl font-black uppercase leading-tight tracking-wider mt-1">
            {opdName}
          </h1>
          <p className="text-[11px] font-medium mt-2 leading-relaxed">
            Alamat: Jl. Trans Sulawesi, Kompleks Perkantoran Pemerintah Kabupaten Minahasa Selatan <br />
            Amurang, Sulawesi Utara - Kode Pos 95954 <br />
            Situs Web: <span className="underline">www.minsel.go.id</span> · Email: <span className="underline">info@minsel.go.id</span>
          </p>
        </div>
      </div>
      
      {reportTitle && (
        <div className="mt-8 text-center">
            <h3 className="text-lg font-black underline uppercase">{reportTitle}</h3>
            <p className="text-xs font-bold mt-1 uppercase tracking-widest text-slate-600">Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
}
