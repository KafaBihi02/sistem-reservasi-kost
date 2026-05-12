import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/config';

export default function Laporan() {
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchWithAuth('/reservasi').then(r => r.json()),
      fetchWithAuth('/pembayaran').then(r => r.json())
    ]).then(([resData, payData]) => {
      if (resData.success) setReservations(resData.data || []);
      if (payData.success) setPayments(payData.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Filter payments with status 'berhasil'
  const successfulPayments = payments.filter(p => p.status === 'berhasil');
  const totalPendapatan = successfulPayments.reduce((s, p) => s + parseFloat(p.jumlah_bayar || 0), 0);
  
  const totalSelesai = reservations.filter(r => r.status === 'selesai').length;
  const totalAktif = reservations.filter(r => ['dikonfirmasi', 'berjalan'].includes(r.status)).length;
  const totalDitolak = reservations.filter(r => ['ditolak', 'dibatalkan'].includes(r.status)).length;

  // Group payments by month
  const byMonth = {};
  successfulPayments.forEach(p => {
    const d = new Date(p.tanggal_bayar);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = { count: 0, total: 0 };
    // count number of unique reservations in this month
    // (optional: or just count number of payments)
    byMonth[key].count++;
    byMonth[key].total += parseFloat(p.jumlah_bayar || 0);
  });
  const months = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]));

  if (loading) return <div className="py-20 text-center text-muted">Memuat...</div>;

  return (
    <div>
      <h2 className="text-2xl font-black text-primary mb-6">Laporan Keuangan</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Reservasi Aktif', value: totalAktif, icon: '📋', color: 'from-blue-500 to-blue-600' },
          { label: 'Selesai', value: totalSelesai, icon: '✅', color: 'from-slate-500 to-slate-600' },
          { label: 'Ditolak/Batal', value: totalDitolak, icon: '❌', color: 'from-rose-500 to-rose-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg text-white shadow-md mb-3`}>{c.icon}</div>
            <p className="text-xl font-black text-primary">{c.value}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-black text-primary">Pendapatan per Bulan</h3>
        </div>
        {months.length === 0 ? (
          <div className="p-12 text-center text-muted italic">Belum ada data pendapatan.</div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-slate-50">
              {['Bulan', 'Jumlah Transaksi', 'Total Pendapatan'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {months.map(([key, val]) => {
                const [y, m] = key.split('-');
                const monthName = new Date(y, m - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                return (
                  <tr key={key} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">{monthName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{val.count} transaksi</td>
                    <td className="px-6 py-4 font-black text-emerald-600">Rp {val.total.toLocaleString('id-ID')}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="px-6 py-4 font-black text-primary">TOTAL</td>
                <td className="px-6 py-4 font-bold text-slate-700">{successfulPayments.length} transaksi</td>
                <td className="px-6 py-4 font-black text-emerald-600 text-lg">Rp {totalPendapatan.toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
