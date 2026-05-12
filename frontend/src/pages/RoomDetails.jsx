import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { API_BASE_URL, fetchWithAuth } from '../api/config';

const RoomDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({ tanggal_masuk: '', tanggal_keluar: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = [
    room?.foto_kamar || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/kamar/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setRoom(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const calcDuration = () => {
    if (!bookingData.tanggal_masuk || !bookingData.tanggal_keluar) return 1;
    const diff = new Date(bookingData.tanggal_keluar) - new Date(bookingData.tanggal_masuk);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30)));
  };

  const totalPrice = room ? parseInt(room.harga_bulan) * calcDuration() : 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBookingLoading(true);
    try {
      const res = await fetchWithAuth('/reservasi', {
        method: 'POST',
        body: JSON.stringify({ kamar_id: id, ...bookingData, total_harga: totalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Reservasi berhasil! Admin akan menghubungi Anda segera.');
        navigate('/');
      } else {
        alert(data.message || 'Gagal melakukan reservasi.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Memuat detail kamar...</p>
      </div>
    </div>
  );

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center pt-20 text-center px-4">
      <div>
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-primary mb-2">Kamar Tidak Ditemukan</h2>
        <p className="text-muted mb-6">Kamar yang kamu cari tidak tersedia atau sudah tidak ada.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-light transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );

  const fasilitas = room.fasilitas ? room.fasilitas.split(',').map(f => f.trim()) : [];
  const tersedia = room.status === 'tersedia';

  const facilityIcons = {
    'AC': '❄️', 'WiFi': '📶', 'Kamar Mandi': '🚿', 'Parkir': '🅿️',
    'Laundry': '👕', 'Dapur': '🍳', 'TV': '📺', 'Lemari': '🗄️', 'Meja': '🪑'
  };
  const getIcon = (f) => {
    const k = Object.keys(facilityIcons).find(k => f.toLowerCase().includes(k.toLowerCase()));
    return k ? facilityIcons[k] : '✓';
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="container mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span>/</span>
          <Link to="/" className="hover:text-primary transition-colors">Kamar</Link>
          <span>/</span>
          <span className="text-primary font-medium">No. {room.nomor_kamar}</span>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:w-7/12">
            {/* Gallery */}
            <div className="mb-4 rounded-3xl overflow-hidden shadow-xl h-[380px] relative group">
              <img
                src={images[activeImg]}
                alt={`Kamar ${room.nomor_kamar}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Status overlay */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${tersedia ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                  {tersedia ? '✓ Tersedia' : '✗ Tidak Tersedia'}
                </span>
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 mb-8">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div>
                  <span className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    {room.nama_tipe}
                  </span>
                  <h1 className="text-3xl font-extrabold text-primary">Kamar No. {room.nomor_kamar}</h1>
                  <p className="text-muted mt-2 flex items-center gap-1.5 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    Lantai {room.lantai} · Lokasi Strategis
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-extrabold text-secondary">Rp {parseInt(room.harga_bulan).toLocaleString('id-ID')}</p>
                  <p className="text-muted text-sm">per bulan</p>
                </div>
              </div>

              <hr className="border-slate-100 mb-6" />

              {/* Facilities */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-primary mb-4">🛋️ Fasilitas Kamar</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {fasilitas.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium">
                      <span>{getIcon(f)}</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">📋 Deskripsi</h3>
                <p className="text-muted leading-relaxed text-sm">
                  Kamar ini menawarkan kenyamanan ekstra dengan desain modern dan pencahayaan alami yang baik.
                  Dilengkapi berbagai fasilitas penunjang yang akan membuat Anda merasa betah. Lingkungan yang
                  tenang dan bersih sangat cocok untuk mahasiswa maupun profesional muda.
                </p>
              </div>

              {/* Rules */}
              <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <h4 className="font-bold text-amber-800 mb-2 text-sm">📌 Peraturan Kost</h4>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Jam malam: 23.00 WIB</li>
                  <li>• Dilarang membawa tamu menginap</li>
                  <li>• Menjaga kebersihan kamar dan area bersama</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN - Booking Form ===== */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-28">
              <h3 className="text-2xl font-extrabold text-primary mb-1">Booking Sekarang</h3>
              <p className="text-muted text-sm mb-6">Isi form di bawah untuk memesan kamar ini</p>

              {!tersedia ? (
                <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-4xl mb-3">😔</div>
                  <p className="font-bold text-red-600 mb-1">Kamar Tidak Tersedia</p>
                  <p className="text-sm text-red-400">Kamar ini sedang ditempati. Lihat kamar lain.</p>
                  <Link to="/" className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-xl font-semibold text-sm hover:bg-primary-light transition-colors">
                    Cari Kamar Lain
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                        <span className="text-secondary text-lg">📅</span> Tanggal Masuk
                      </label>
                      <input
                        type="date" required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingData.tanggal_masuk}
                        onChange={(e) => setBookingData({ ...bookingData, tanggal_masuk: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-sm font-medium"
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                        <span className="text-secondary text-lg">📅</span> Tanggal Keluar (Estimasi)
                      </label>
                      <input
                        type="date" required
                        min={bookingData.tanggal_masuk || new Date().toISOString().split('T')[0]}
                        value={bookingData.tanggal_keluar}
                        onChange={(e) => setBookingData({ ...bookingData, tanggal_keluar: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Harga per bulan</span>
                      <span className="font-semibold">Rp {parseInt(room.harga_bulan).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Durasi</span>
                      <span className="font-semibold">{calcDuration()} bulan</span>
                    </div>
                    <hr className="border-slate-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">Total Estimasi</span>
                      <span className="text-xl font-extrabold text-secondary">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={bookingLoading}
                    className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-secondary-light transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : '🏠 Konfirmasi Booking'}
                  </button>

                  {!user && (
                    <p className="text-xs text-center text-muted">
                      Belum punya akun?{' '}
                      <Link to="/register" className="text-accent font-bold hover:underline">Daftar gratis</Link>
                    </p>
                  )}

                  <p className="text-xs text-center text-muted">
                    * Admin akan menghubungi Anda via WhatsApp setelah konfirmasi
                  </p>
                </form>
              )}

              {/* Trust badges */}
              <div className="mt-6 flex justify-center gap-6 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Aman & Terpercaya
                </div>
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Konfirmasi Cepat
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
