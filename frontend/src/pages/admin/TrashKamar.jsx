import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/config';

export default function TrashKamar({ onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchWithAuth('/kamar/trash').then(r => r.json()).then(d => {
      if (d.success) setData(d.data || []);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const handleRestore = async (id) => {
    const res = await fetchWithAuth(`/kamar/${id}/restore`, { method: 'PUT' });
    const d = await res.json();
    if (d.success) load(); else alert(d.message);
  };

  const handlePermanentDelete = async (id) => {
    if (!confirm('Hapus kamar ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) return;
    const res = await fetchWithAuth(`/kamar/${id}/permanent`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) load(); else alert(d.message);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-md transition-all">←</button>
          <h2 className="text-2xl font-black text-primary">Trash Kamar</h2>
        </div>
        <p className="text-sm text-muted font-bold uppercase tracking-widest">{data.length} Kamar Terhapus</p>
      </div>

      {loading ? <div className="py-20 text-center text-muted">Memuat...</div> : data.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-premium border border-slate-100">
          <div className="text-5xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-primary mb-2">Trash Kosong</h3>
          <p className="text-muted text-sm">Tidak ada kamar yang dihapus sementara.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-50">
              {['Foto', 'Nomor', 'Tipe', 'Lantai', 'Dihapus Pada', 'Aksi'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {data.map(k => (
                <tr key={k.kamar_id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100">
                      {k.foto_kamar ? <img src={k.foto_kamar} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{k.nomor_kamar}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{k.nama_tipe}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Lantai {k.lantai}</td>
                  <td className="px-6 py-4 text-sm text-rose-500 font-medium">
                    {new Date(k.deleted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleRestore(k.kamar_id)} title="Pulihkan" className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-sm">🔄</button>
                      <button onClick={() => handlePermanentDelete(k.kamar_id)} title="Hapus Permanen" className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-sm">🔥</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
