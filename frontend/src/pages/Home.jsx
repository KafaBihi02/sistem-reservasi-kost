import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { API_BASE_URL } from '../api/config';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [stats, setStats] = useState({ types: 6, activeUsers: 150, satisfaction: 99, support: '24/7' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/kamar`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedRooms(data.data.slice(0, 3));
        }
      })
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);

  const steps = [
    { id: '01', title: 'Daftar & Masuk', desc: 'Buat akun gratis dan masuk ke platform KostKu.', icon: '👤' },
    { id: '02', title: 'Pilih Kamar', desc: 'Jelajahi daftar kamar dan pilih yang sesuai kebutuhan.', icon: '🏠' },
    { id: '03', title: 'Isi Formulir Reservasi', desc: 'Lengkapi data diri dan tanggal check-in yang diinginkan.', icon: '📝' },
    { id: '04', title: 'Tunggu Konfirmasi', desc: 'Admin akan mereview dan mengonfirmasi reservasi Anda.', icon: '⏳' },
    { id: '05', title: 'Lakukan Pembayaran', desc: 'Upload bukti transfer setelah reservasi disetujui.', icon: '💳' },
    { id: '06', title: 'Selamat Datang!', desc: 'Reservasi aktif — nikmati kamar kost Anda.', icon: '🎉' },
  ];

  const features = [
    { title: 'Aman & Terpercaya', desc: 'Data dan transaksi Anda terlindungi dengan sistem keamanan berlapis.', icon: '🛡️' },
    { title: 'Proses Cepat', desc: 'Konfirmasi reservasi dalam waktu 1x24 jam oleh tim admin kami.', icon: '⚡' },
    { title: 'Pembayaran Fleksibel', desc: 'Dukung berbagai metode pembayaran termasuk transfer bank dan dompet digital.', icon: '💳' },
    { title: 'Fasilitas Lengkap', desc: 'Kamar dengan fasilitas modern yang sesuai kebutuhan Anda.', icon: '✨' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-primary-deep">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Platform Reservasi Kost Terpercaya #1</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-7xl text-white leading-[1.1]">
              Temukan Kost <span className="text-secondary drop-shadow-sm">Impian</span> Anda dengan Mudah
            </h1>
            
            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
              Reservasi kamar kost online tanpa ribet. Pilih, booking, bayar — semuanya dalam satu platform yang aman dan terpercaya.
            </p>

            <div className="relative max-w-md group">
              <input 
                type="text" 
                placeholder="Cari tipe kamar atau fasilitas..." 
                className="w-full bg-white px-6 py-5 rounded-2xl text-primary font-medium focus:ring-4 focus:ring-secondary/20 transition-all outline-none pr-32 shadow-2xl"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-secondary text-white px-8 rounded-xl font-bold hover:bg-secondary-dark transition-all active:scale-95">
                Cari
              </button>
            </div>

            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-3xl font-black text-white">5+</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Kamar Tersedia</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">150+</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Penyewa Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">4.9★</p>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Rating</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
             <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" 
                  alt="Premium Room" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-dark rounded-2xl border border-white/10">
                   <div className="flex justify-between items-center">
                      <div>
                        <span className="bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-black px-3 py-1 rounded-md uppercase mb-3 block w-fit">Premium</span>
                        <h3 className="text-white font-bold text-xl mb-1">Kamar Premium A-301</h3>
                        <p className="text-white/60 text-xs font-medium">5x6 m² • Lantai 3 • AC, WiFi, TV, Kulkas</p>
                      </div>
                      <div className="text-right">
                        <span className="text-success text-xs font-bold bg-success/10 border border-success/20 px-3 py-1 rounded-md">Tersedia</span>
                        <p className="text-white font-black text-2xl mt-3">Rp 2.5jt<span className="text-white/50 text-sm font-normal">/bulan</span></p>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Floating UI Elements */}
             <div className="absolute -top-6 -right-6 glass-dark p-4 rounded-2xl shadow-xl animate-float z-20 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 border border-success/30 rounded-full flex items-center justify-center text-success text-xl shadow-inner">✓</div>
                  <div>
                    <p className="text-xs font-black text-white tracking-wide">Reservasi Dikonfirmasi</p>
                    <p className="text-[10px] text-white/50 font-medium">2 menit lalu</p>
                  </div>
                </div>
             </div>
             
             <div className="absolute top-[35%] -left-12 glass-dark p-4 rounded-2xl shadow-xl animate-float z-20 border border-white/10" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center text-accent shadow-inner">👥</div>
                  <div>
                    <p className="text-xs font-black text-white tracking-wide">+12 Reservasi</p>
                    <p className="text-[10px] text-white/50 font-medium">Bulan ini</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary py-10 relative z-20">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: 'Tipe Kamar', value: stats.types + '+', icon: '🏠' },
             { label: 'Penyewa Aktif', value: stats.activeUsers + '+', icon: '👥' },
             { label: 'Kepuasan Pelanggan', value: stats.satisfaction + '%', icon: '⭐' },
             { label: 'Layanan Support', value: stats.support, icon: '📞' }
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center text-white border-r last:border-0 border-white/20">
                <span className="text-3xl mb-2">{stat.icon}</span>
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section id="listings" className="section-padding bg-surface">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-secondary font-black uppercase tracking-widest text-xs mb-3">Pilihan Terbaik</p>
              <h2 className="text-4xl text-primary">Kamar Unggulan</h2>
            </div>
            <Link to="/rooms" className="group flex items-center gap-2 text-primary font-bold border-2 border-primary/10 px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
              Lihat Semua
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map(room => (
              <RoomCard key={room.kamar_id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-padding bg-white relative">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-secondary font-black uppercase tracking-widest text-xs mb-3">Proses Mudah</p>
            <h2 className="text-4xl text-primary mb-6">Cara Reservasi</h2>
            <p className="text-muted">Hanya 6 langkah mudah untuk mendapatkan kamar kost impian Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-surface hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-premium transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-200 group-hover:text-accent/10 transition-colors">{step.id}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="section-padding bg-surface overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" 
                    alt="Comfortable Room" 
                    className="w-full h-[500px] object-cover"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 -right-6 glass p-6 rounded-3xl shadow-2xl max-w-[240px]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-2xl">⭐</div>
                    <div>
                       <p className="text-xl font-black text-primary">4.9/5.0</p>
                       <p className="text-xs text-muted">Rating dari 200+ penyewa</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="space-y-8">
              <div>
                <p className="text-secondary font-black uppercase tracking-widest text-xs mb-3">Mengapa KostKu?</p>
                <h2 className="text-4xl text-primary mb-6">Platform Terpercaya untuk Reservasi Kost</h2>
              </div>
              
              <div className="grid gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white shadow-sm border border-slate-50 hover:border-secondary/20 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-secondary/10 transition-colors">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary">{f.title}</h3>
                      <p className="text-xs text-muted mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="bg-primary-deep rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10 space-y-8">
                <h2 className="text-4xl lg:text-6xl text-white">Siap Menemukan Kamar Kost Impian?</h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">Bergabung dengan ratusan penyewa yang telah mempercayakan pencarian kost mereka kepada KostKu.</p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <Link to="/rooms" className="btn-secondary px-10 py-4 text-base">Cari Kamar Sekarang</Link>
                   <Link to="/register" className="btn-outline border-white/20 text-white hover:bg-white hover:text-primary px-10 py-4 text-base">Daftar Gratis</Link>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
