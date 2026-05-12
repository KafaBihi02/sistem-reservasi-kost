import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL, fetchWithAuth } from '../api/config';

const RoomDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({ tanggal_masuk: '', tanggal_keluar: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const hitungBulan = () => {
    if (!bookingData.tanggal_masuk || !bookingData.tanggal_keluar) return { bulan: 0, total: 0 };
    const masuk = new Date(bookingData.tanggal_masuk);
    const keluar = new Date(bookingData.tanggal_keluar);
    const hari = Math.ceil((keluar - masuk) / (1000 * 60 * 60 * 24));
    if (hari < 30) return { bulan: 0, total: 0, error: 'Minimal 30 hari' };
    const bulan = Math.ceil(hari / 30);
    const total = bulan * parseFloat(room?.harga_bulan || 0);
    return { bulan, total };
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/kamar/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRoom(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetchWithAuth('/reservasi', {
        method: 'POST',
        body: JSON.stringify({
          kamar_id: room.kamar_id,
          ...bookingData
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Reservasi berhasil! Menunggu konfirmasi admin.' });
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!room) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <h1 className="text-4xl font-black text-primary mb-4">404</h1>
         <p className="text-muted mb-8">Kamar tidak ditemukan</p>
         <button onClick={() => navigate('/rooms')} className="btn-primary">Kembali ke Daftar Kamar</button>
       </div>
    </div>
  );

  const tersedia = room.status === 'tersedia';
  const facilitiesList = typeof room.fasilitas === 'string' ? room.fasilitas.split(',') : (room.fasilitas || []);

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-muted mb-8 uppercase tracking-widest">
           <Link to="/" className="hover:text-secondary transition-colors">Beranda</Link>
           <span>/</span>
           <Link to="/rooms" className="hover:text-secondary transition-colors">Katalog Kamar</Link>
           <span>/</span>
           <span className="text-primary">{room.nomor_kamar}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
               <img 
                 src={room.url_gambar || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200`} 
                 alt={room.nomor_kamar}
                 className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute top-6 left-6">
                 <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-primary font-black text-xs uppercase shadow-lg">
                   {room.nama_tipe}
                 </span>
               </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-slate-100">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl lg:text-4xl text-primary mb-2">Kamar {room.nomor_kamar}</h1>
                    <div className="flex items-center gap-4 text-sm font-bold text-muted">
                       <span className="flex items-center gap-1.5"><span className="text-secondary text-lg">📏</span> 3x4 m²</span>
                       <span className="flex items-center gap-1.5"><span className="text-secondary text-lg">🏢</span> Lantai {room.lantai}</span>
                       <span className={`flex items-center gap-1.5 ${tersedia ? 'text-success' : 'text-danger'}`}>
                         <span className="text-lg">●</span> {tersedia ? 'Tersedia Sekarang' : 'Sedang Terisi'}
                       </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted uppercase mb-1">Harga Sewa</p>
                    <p className="text-3xl font-black text-primary">Rp {parseInt(room.harga_bulan).toLocaleString('id-ID')}<span className="text-sm font-normal text-muted">/bln</span></p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                       <div className="w-1 h-6 bg-secondary rounded-full"></div>
                       Fasilitas Kamar
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {facilitiesList.map((f, i) => (
                         <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:border-secondary/20 transition-all group">
                            <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                            <span className="text-sm font-bold text-slate-700">{f.trim()}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3">
                       <div className="w-1 h-6 bg-secondary rounded-full"></div>
                       Deskripsi
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Nikmati hunian nyaman dengan fasilitas lengkap di lokasi strategis. Kamar ini didesain khusus untuk memberikan kenyamanan maksimal bagi para penghuni. Kebersihan dan keamanan terjaga 24 jam untuk ketenangan Anda.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Booking */}
          <aside className="sticky top-32">
            <div className="bg-primary-deep text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
               {/* Decoration */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
               
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-6">Booking Kamar</h3>
                 
                 {message.text && (
                   <div className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 ${
                     message.type === 'success' ? 'bg-success/20 text-success border border-success/30' : 'bg-danger/20 text-danger border border-danger/30'
                   }`}>
                     {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                   </div>
                 )}

                 {!tersedia ? (
                   <div className="bg-white/10 p-6 rounded-2xl text-center">
                     <p className="text-white/60 font-bold mb-2 uppercase tracking-widest text-[10px]">Status</p>
                     <p className="text-xl font-bold">Kamar Tidak Tersedia</p>
                     <p className="text-xs text-white/40 mt-3 italic">Kamar ini sedang dalam masa sewa atau sedang dalam perbaikan.</p>
                   </div>
                 ) : user?.role === 'admin' ? (
                    <div className="bg-white/10 p-6 rounded-2xl text-center">
                      <p className="text-3xl mb-3">🛡️</p>
                      <p className="text-white font-bold mb-1">Akun Admin</p>
                      <p className="text-xs text-white/50">Admin tidak dapat melakukan pemesanan kamar.</p>
                    </div>
                 ) : (
                   <form onSubmit={handleBooking} className="space-y-6">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Tanggal Masuk</label>
                           <input 
                             type="date" required
                             className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-white focus:border-secondary focus:bg-white/10 transition-all outline-none"
                             value={bookingData.tanggal_masuk}
                             onChange={(e) => setBookingData({ ...bookingData, tanggal_masuk: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Tanggal Keluar (Est)</label>
                           <input 
                             type="date" required
                             className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-white focus:border-secondary focus:bg-white/10 transition-all outline-none"
                             value={bookingData.tanggal_keluar}
                             onChange={(e) => setBookingData({ ...bookingData, tanggal_keluar: e.target.value })}
                           />
                        </div>
                     </div>

                      {(() => {
                        const { bulan, total, error } = hitungBulan();
                        return (
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                            {error ? (
                              <p className="text-xs text-danger font-bold text-center">⚠️ {error}</p>
                            ) : bulan > 0 ? (
                              <>
                                <div className="flex justify-between text-xs text-white/60 font-bold">
                                  <span>Durasi Sewa</span>
                                  <span className="text-white">{bulan} bulan</span>
                                </div>
                                <div className="flex justify-between text-xs text-white/60 font-bold">
                                  <span>Harga / Bulan</span>
                                  <span className="text-white">Rp {parseInt(room.harga_bulan).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between text-lg font-black text-secondary">
                                  <span>Total Bayar</span>
                                  <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-white/40 font-bold text-center">Pilih tanggal untuk melihat estimasi harga</p>
                            )}
                          </div>
                        );
                      })()}

                     <button type="submit" className="w-full btn-secondary py-5 text-lg shadow-xl shadow-secondary/20 font-black">
                       Booking Sekarang
                     </button>
                     <p className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest">Aman • Cepat • Terpercaya</p>
                   </form>
                 )}
               </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
               <div className="flex flex-col items-center gap-1">
                 <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">🛡️</div>
                 <span className="text-[10px] font-bold text-muted uppercase">Safe Payment</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                 <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">⚡</div>
                 <span className="text-[10px] font-bold text-muted uppercase">Fast Confirm</span>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
