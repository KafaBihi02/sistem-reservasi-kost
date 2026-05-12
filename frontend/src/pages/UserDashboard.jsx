import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api/config';
import { Link } from 'react-router-dom';

const UserDashboard = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBayarModal, setShowBayarModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [bayarForm, setBayarForm] = useState({ metode_bayar: 'Transfer Bank' });

  const loadData = () => {
    setLoading(true);
    fetchWithAuth('/reservasi')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReservations(data.data || []);
        } else {
          setError(data.message || 'Gagal mengambil data reservasi');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Terjadi kesalahan koneksi.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBayarModal = (res) => {
    setSelectedRes(res);
    setShowBayarModal(true);
  };

  const handleBayarSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/pembayaran', {
        method: 'POST',
        body: JSON.stringify({
          reservasi_id: selectedRes.reservasi_id,
          jumlah_bayar: selectedRes.total_harga,
          metode_bayar: bayarForm.metode_bayar
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowBayarModal(false);
        loadData(); // Reload data
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Gagal mengirim bukti bayar');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'menunggu': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'dikonfirmasi': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'berjalan': return 'bg-green-100 text-green-700 border-green-200';
      case 'selesai': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="container max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-primary mb-2">Dashboard Saya</h1>
          <p className="text-muted">Halo {user?.nama}, berikut adalah riwayat pemesanan kamar Anda.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold border border-red-100 mb-6">
            ⚠️ {error}
          </div>
        )}

        {reservations.length === 0 && !error ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-premium border border-slate-100">
            <div className="text-6xl mb-4">🛏️</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Belum Ada Reservasi</h3>
            <p className="text-muted mb-8">Anda belum memiliki riwayat pemesanan kamar. Ayo cari kamar impian Anda sekarang!</p>
            <Link to="/rooms" className="btn-primary px-8 py-3">Cari Kamar</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map(res => (
              <div key={res.reservasi_id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-premium border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-2xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-black text-primary">Kamar {res.nomor_kamar}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(res.status)} uppercase tracking-widest`}>
                      {res.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tipe</p>
                      <p className="font-bold text-slate-700">{res.nama_tipe}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal Masuk</p>
                      <p className="font-bold text-slate-700">
                        {new Date(res.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal Keluar</p>
                      <p className="font-bold text-slate-700">
                        {new Date(res.tanggal_keluar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                      <p className="font-black text-secondary text-lg">Rp {parseInt(res.total_harga).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-6">
                  {res.status_pembayaran === 'pending' ? (
                    <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-xl border border-amber-100 font-bold text-center text-sm">
                      Menunggu Verifikasi
                    </div>
                  ) : (res.status === 'menunggu' || res.status === 'dikonfirmasi') ? (
                    <button 
                      onClick={() => openBayarModal(res)}
                      className="w-full md:w-auto bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                    >
                      Bayar Sekarang
                    </button>
                  ) : (
                    <Link to={`/rooms/${res.kamar_id}`} className="w-full md:w-auto bg-slate-50 text-primary font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-center">
                      Lihat Kamar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showBayarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-deep/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-primary">Konfirmasi Bayar</h3>
              <button onClick={() => setShowBayarModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleBayarSubmit} className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total yang harus dibayar</p>
                <p className="text-3xl font-black text-secondary">Rp {parseInt(selectedRes?.total_harga).toLocaleString('id-ID')}</p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted">Kamar</span>
                    <span className="font-bold text-primary">{selectedRes?.nomor_kamar} ({selectedRes?.nama_tipe})</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Metode Pembayaran</label>
                <select 
                  className="input-premium appearance-none"
                  value={bayarForm.metode_bayar}
                  onChange={(e) => setBayarForm({ ...bayarForm, metode_bayar: e.target.value })}
                >
                  <option value="Transfer Bank">Transfer Bank (BCA/Mandiri)</option>
                  <option value="E-Wallet">E-Wallet (Gopay/OVO/Dana)</option>
                  <option value="Tunai">Tunai ke Admin</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full btn-secondary py-4 text-lg font-black shadow-xl shadow-secondary/20">
                  Kirim Bukti Bayar
                </button>
                <p className="text-center text-[10px] text-muted mt-4 font-bold uppercase tracking-widest italic">
                  *Dengan mengklik tombol, Anda menyatakan telah melakukan pembayaran sesuai nominal di atas.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
