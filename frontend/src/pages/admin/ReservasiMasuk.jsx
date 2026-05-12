import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/config';

const STATUS = {
  menunggu: 'bg-amber-50 text-amber-600 border-amber-100',
  dikonfirmasi: 'bg-blue-50 text-blue-600 border-blue-100',
  berjalan: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  selesai: 'bg-slate-100 text-slate-600 border-slate-200',
  ditolak: 'bg-rose-50 text-rose-600 border-rose-100',
  dibatalkan: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function ReservasiMasuk() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const load = () => {
    setLoading(true);
    fetchWithAuth('/reservasi').then(r=>r.json()).then(d=>{
      if(d.success) setData(d.data);
      setLoading(false);
    });
  };
  useEffect(()=>{ load(); },[]);

  const updateStatus = async(id, status) => {
    const res = await fetchWithAuth(`/reservasi/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});
    const d = await res.json();
    if(d.success) load(); else alert(d.message);
  };

  const filtered = tab==='all' ? data : data.filter(r=>r.status===tab);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-black text-primary">Reservasi Masuk</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          {['all','menunggu','dikonfirmasi','berjalan','selesai','ditolak'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${tab===t?'bg-white text-primary shadow-sm':'text-slate-400 hover:text-slate-600'}`}>
              {t==='all'?'Semua':t}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="py-20 text-center text-muted">Memuat...</div> : (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['Penyewa','Kamar','Check-in','Check-out','Total','Status','Aksi'].map(h=>(
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length===0 ? (
                  <tr><td colSpan="7" className="py-16 text-center text-muted italic">Tidak ada data</td></tr>
                ) : filtered.map(r=>(
                  <tr key={r.reservasi_id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">{r.nama_penyewa?.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{r.nama_penyewa}</p>
                          <p className="text-xs text-muted">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">No. {r.nomor_kamar}</p>
                      <p className="text-xs text-muted">{r.nama_tipe}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{new Date(r.tanggal_masuk).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{new Date(r.tanggal_keluar).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td className="px-6 py-4 font-black text-primary text-sm whitespace-nowrap">Rp {parseFloat(r.total_harga).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase ${STATUS[r.status]||'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {r.status==='menunggu' && <>
                          <button onClick={()=>updateStatus(r.reservasi_id,'dikonfirmasi')} title="Konfirmasi" className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-sm">✓</button>
                          <button onClick={()=>updateStatus(r.reservasi_id,'ditolak')} title="Tolak" className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-sm">✗</button>
                        </>}
                        {r.status==='dikonfirmasi' && (
                          <button onClick={()=>updateStatus(r.reservasi_id,'berjalan')} title="Tandai Berjalan" className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs">▶</button>
                        )}
                        {r.status==='berjalan' && (
                          <button onClick={()=>updateStatus(r.reservasi_id,'selesai')} title="Tandai Selesai" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white transition-all text-xs">✔</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
