import React, { useState, useEffect } from 'react';
import { API_BASE_URL, fetchWithAuth } from '../api/config';
import KelolaKamar from './admin/KelolaKamar';
import ReservasiMasuk from './admin/ReservasiMasuk';
import VerifikasiBayar from './admin/VerifikasiBayar';
import Laporan from './admin/Laporan';

const MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'kamar', label: 'Kelola Kamar', icon: '🏠' },
  { key: 'reservasi', label: 'Reservasi Masuk', icon: '📋' },
  { key: 'bayar', label: 'Verifikasi Bayar', icon: '💳' },
  { key: 'laporan', label: 'Laporan', icon: '📈' },
];

const AdminDashboard = () => {
  const [page, setPage] = useState('dashboard');
  const [stats, setStats] = useState({ total_users: 0, total_reservasi: 0, total_pendapatan: 0, kamar_tersedia: 0 });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchWithAuth('/dashboard').then(r => r.json()),
      fetchWithAuth('/reservasi').then(r => r.json()),
    ]).then(([s, r]) => {
      if (s.success) setStats(s.data);
      if (r.success) setReservations(r.data);
      setLoading(false);
    }).catch((err) => {
      console.error('Fetch error:', err);
      setLoading(false);
    });
  }, []);

  const recent = reservations.slice(0, 5);

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-black text-primary mb-6">Overview</h2>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Penyewa', value: stats.total_users, icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'Total Reservasi', value: stats.total_reservasi, icon: '📋', color: 'from-orange-500 to-orange-600' },
          { label: 'Pendapatan', value: `Rp ${parseFloat(stats.total_pendapatan || 0).toLocaleString('id-ID')}`, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Kamar Tersedia', value: stats.kamar_tersedia, icon: '🏠', color: 'from-indigo-500 to-indigo-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 group hover:border-secondary/20 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl text-white shadow-lg mb-3`}>{c.icon}</div>
            <p className="text-2xl font-black text-primary">{c.value}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-black text-primary">Reservasi Terbaru</h3>
            <button onClick={() => setPage('reservasi')} className="text-xs font-bold text-secondary hover:underline">Lihat Semua →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? <div className="p-8 text-center text-muted">Memuat...</div> : recent.length === 0 ? (
              <div className="p-8 text-center text-muted italic">Belum ada reservasi</div>
            ) : recent.map(r => (
              <div key={r.reservasi_id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">{r.nama_penyewa?.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.nama_penyewa}</p>
                    <p className="text-xs text-muted">Kamar {r.nomor_kamar}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                  r.status === 'menunggu' ? 'bg-amber-50 text-amber-600' :
                  r.status === 'dikonfirmasi' ? 'bg-emerald-50 text-emerald-600' :
                  r.status === 'ditolak' ? 'bg-rose-50 text-rose-600' :
                  'bg-slate-100 text-slate-600'
                }`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6">
          <h3 className="text-lg font-black text-primary mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            {[
              { label: 'Review Reservasi', icon: '📋', badge: reservations.filter(r => r.status === 'menunggu').length, action: 'reservasi' },
              { label: 'Verifikasi Bayar', icon: '💳', badge: 0, action: 'bayar' },
              { label: 'Kelola Kamar', icon: '🏠', badge: stats.kamar_tersedia, action: 'kamar' },
              { label: 'Lihat Laporan', icon: '📈', badge: null, action: 'laporan' },
            ].map(a => (
              <button key={a.label} onClick={() => setPage(a.action)} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <span className="font-bold text-slate-700 text-sm">{a.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {a.badge !== null && a.badge > 0 && (
                    <span className="bg-secondary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">{a.badge}</span>
                  )}
                  <span className="text-slate-400 group-hover:text-secondary transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (page) {
      case 'kamar': return <KelolaKamar />;
      case 'reservasi': return <ReservasiMasuk />;
      case 'bayar': return <VerifikasiBayar />;
      case 'laporan': return <Laporan />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-28 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary">
        ☰
      </button>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-24 left-0 bottom-0 w-64 bg-white border-r border-slate-100 shadow-lg z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-primary">KostKu</h2>
          <p className="text-xs text-muted font-medium">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {MENU.map(m => (
            <button
              key={m.key}
              onClick={() => { setPage(m.key === 'dashboard' ? 'dashboard' : m.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                (page === m.key || (m.key === 'dashboard' && page === 'dashboard'))
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 pb-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
