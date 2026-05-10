'use client';

import ApprovalModule from '../super-admin/modules/ApprovalModule';

export default function ApprovalsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Persetujuan Peserta</h1>
        <p className="text-slate-500 font-medium">Manajemen Verifikasi & Approval Peserta Kegiatan</p>
      </div>
      
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white overflow-hidden shadow-2xl">
        <ApprovalModule onAction={(action) => console.log(action)} />
      </div>
    </div>
  );
}
