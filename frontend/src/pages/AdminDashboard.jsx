import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/config';

const STAT_CARDS = [
  { key: 'total_users', label: 'Total Penyewa', icon: '👥', color: 'bg-accent/10 text-accent', border: 'border-accent/20' },
  { key: 'total_reservasi', label: 'Total Reservasi', icon: '📋', color: 'bg-secondary/10 text-secondary', border: 'border-secondary/20' },
  { key: 'total_pendapatan', label: 'Pendapatan', icon: '💰', color: 'bg-success/10 text-success', border: 'border-success/20', isCurrency: true },
  { key: 'kamar_tersedia', label: 'Kamar Tersedia', icon: '🏠', color: 'bg-primary/10 text-primary', border: 'border-primary/20' },
];

const STATUS_CONFIG = {
  dikonfirmasi: { class: 'bg-success/10 text-success border-success/20', label: 'Dikonfirmasi' },
  menunggu: { class: 'bg-warning/10 text-warning border-warning/20', label: 'Menunggu' },
  ditolak: { class: 'bg-danger/10 text-danger border-danger/20', label: 'Ditolak' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_reservasi: 0, total_pendapatan: 0, kamar_tersedia: 0 });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoom, setNewRoom] = useState({ nomor_kamar: '', tipe_id: '', lantai: '1', status: 'tersedia' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/dashboard`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE_URL}/reservasi`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE_URL}/tipe-kamar`).then(r => r.json()),
    ]).then(([statsData, resData, typeData]) => {
      if (statsData.success) setStats(statsData.data);
      if (resData.success) setReservations(resData.data);
      if (typeData.success) setRoomTypes(typeData.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/kamar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewRoom({ nomor_kamar: '', tipe_id: '', lantai: '1', status: 'tersedia' });
        fetchData();
      } else {
        alert(data.message || 'Gagal menambah kamar');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservasi/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || 'Gagal memperbarui status');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  const filtered = activeTab === 'all' ? reservations : reservations.filter(r => r.status === activeTab);

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-2">Manajemen</p>
            <h1 className="text-3xl font-extrabold text-primary">Dashboard Admin</h1>
            <p className="text-muted text-sm mt-1">Kelola hunian dan reservasi penyewa Anda</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-border text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-primary/30 transition-colors shadow-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Laporan
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-md flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Kamar
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {STAT_CARDS.map((card) => (
            <div key={card.key} className={`bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] border ${card.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
                <span className="text-xs text-success font-semibold bg-success/10 px-2 py-1 rounded-lg">+12%</span>
              </div>
              <p className="text-2xl font-extrabold text-primary">
                {card.isCurrency
                  ? `Rp ${parseInt(stats[card.key] || 0).toLocaleString('id-ID')}`
                  : stats[card.key]}
              </p>
              <p className="text-xs text-muted font-medium mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] overflow-hidden">
          {/* Table header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-primary">Daftar Reservasi</h3>
              {/* Filter tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                {['all', 'menunggu', 'dikonfirmasi', 'ditolak'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                      activeTab === tab
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'all' ? 'Semua' : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted text-sm">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Penyewa', 'Kamar', 'Tanggal Masuk', 'Total', 'Status', 'Aksi'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((res, i) => {
                    const s = STATUS_CONFIG[res.status] || { class: 'bg-slate-100 text-slate-400', label: res.status };
                    return (
                      <tr key={res.reservasi_id} className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {(res.nama_penyewa || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-slate-800">{res.nama_penyewa || 'Tanpa Nama'}</p>
                              <p className="text-xs text-muted">{res.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-sm">No. {res.nomor_kamar}</p>
                          <p className="text-xs text-muted">{res.nama_tipe}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {new Date(res.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sm text-primary">Rp {parseInt(res.total_harga).toLocaleString('id-ID')}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${s.class}`}>{s.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs font-bold text-accent hover:bg-accent/10 px-2.5 py-1.5 rounded-lg transition-colors">Detail</button>
                            {res.status === 'menunggu' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(res.reservasi_id, 'dikonfirmasi')}
                                  className="text-xs font-bold text-success hover:bg-success/10 px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                  ✓ Konfirmasi
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(res.reservasi_id, 'ditolak')}
                                  className="text-xs font-bold text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                  ✗ Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" className="py-16 text-center">
                        <div className="text-4xl mb-3">📋</div>
                        <p className="text-muted font-medium">Tidak ada data reservasi</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-primary">Tambah Kamar Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Kamar</label>
                <input
                  type="text" required
                  placeholder="Contoh: A-101"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                  value={newRoom.nomor_kamar}
                  onChange={(e) => setNewRoom({ ...newRoom, nomor_kamar: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe Kamar</label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                  value={newRoom.tipe_id}
                  onChange={(e) => setNewRoom({ ...newRoom, tipe_id: e.target.value })}
                >
                  <option value="">Pilih Tipe</option>
                  {roomTypes.map(t => (
                    <option key={t.tipe_id} value={t.tipe_id}>{t.nama_tipe}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lantai</label>
                  <input
                    type="number" required min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                    value={newRoom.lantai}
                    onChange={(e) => setNewRoom({ ...newRoom, lantai: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                    value={newRoom.status}
                    onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="penuh">Penuh</option>
                    <option value="perbaikan">Perbaikan</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-light transition-all active:scale-95">
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
