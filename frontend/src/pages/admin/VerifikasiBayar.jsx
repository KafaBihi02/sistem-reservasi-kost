import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/config';

const STATUS = {
  pending: 'bg-amber-50 text-amber-600',
  berhasil: 'bg-emerald-50 text-emerald-600',
  gagal: 'bg-rose-50 text-rose-600',
};

export default function VerifikasiBayar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchWithAuth('/pembayaran').then(r => r.json()).then(d => {
      if (d.success) setData(d.data || []);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    const res = await fetchWithAuth(`/pembayaran/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    const d = await res.json();
    if (d.success) load(); else alert(d.message);
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-primary mb-6">Verifikasi Pembayaran</h2>

      {loading ? <div className="py-20 text-center text-muted">Memuat...</div> : data.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-premium border border-slate-100">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Pembayaran</h3>
          <p className="text-muted text-sm">Data pembayaran akan muncul setelah penyewa mengirim bukti bayar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50">
                {['ID', 'Penyewa', 'Kamar', 'Jumlah', 'Metode', 'Tanggal', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {data.map(p => (
                  <tr key={p.pembayaran_id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">#{p.pembayaran_id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{p.nama_penyewa || 'Penyewa'}</p>
                      <p className="text-[10px] text-muted">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.nomor_kamar} ({p.nama_tipe})</td>
                    <td className="px-6 py-4 font-black text-primary text-sm">Rp {parseFloat(p.jumlah_bayar).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.metode_bayar || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{new Date(p.tanggal_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${STATUS[p.status] || 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => updateStatus(p.pembayaran_id, 'berhasil')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all text-sm" title="Terima">✓</button>
                          <button onClick={() => updateStatus(p.pembayaran_id, 'gagal')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-sm" title="Tolak">✗</button>
                        </div>
                      )}
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
