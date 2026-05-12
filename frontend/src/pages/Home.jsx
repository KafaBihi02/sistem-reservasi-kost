import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';

import { API_BASE_URL } from '../api/config';

const STATS = [
  { value: '50+', label: 'Kamar Pilihan', icon: '🏠' },
  { value: '200+', label: 'Penyewa Aktif', icon: '👥' },
  { value: '5+', label: 'Lokasi Strategis', icon: '📍' },
  { value: '4.9★', label: 'Rating Kepuasan', icon: '⭐' },
];

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    bg: 'bg-primary',
    title: 'Keamanan 24 Jam',
    desc: 'CCTV terpasang di setiap sudut dengan sistem keamanan berlapis untuk ketenangan Anda.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    bg: 'bg-secondary',
    title: 'Lokasi Strategis',
    desc: 'Dekat dengan kampus, perkantoran, mall, dan fasilitas umum lainnya yang mudah dijangkau.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    bg: 'bg-accent',
    title: 'Fasilitas Premium',
    desc: 'AC, WiFi super cepat, laundry harian, dan cleaning service sudah termasuk dalam harga.'
  },
];

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/kamar`)
      .then(r => r.json())
      .then(d => { if (d.success) setRooms(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true }));
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=90"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
          {/* Animated orbs */}
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>🏡 Platform Kost #1 di Indonesia</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Hunian Nyaman,<br />
              <span className="text-secondary">Harga Bersahabat.</span>
            </h1>

            <p className="text-lg text-white/75 mb-10 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Temukan kost impianmu dengan fasilitas lengkap di lokasi strategis. 
              Booking online mudah, cepat, dan tanpa ribet.
            </p>

            <div className="flex flex-wrap gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <a
                href="#listings"
                className="bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-secondary-light transition-all shadow-xl hover:shadow-secondary/40 hover:-translate-y-1 flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Cari Kost Sekarang
              </a>
              <a
                href="#why-us"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-bold text-base border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs animate-bounce">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 -mt-8">
        <div className="container">
          <div className="bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl mb-1">{s.icon}</div>
                <p className="text-3xl font-extrabold text-primary mb-1">{s.value}</p>
                <p className="text-sm text-muted font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROOM LISTINGS ===== */}
      <section id="listings" className="py-24">
        <div className="container">
          <div className="flex justify-between items-end mb-12" data-id="listings-header">
            <div>
              <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-3">Pilihan Terbaik</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary">Kamar Tersedia Untukmu</h2>
              <p className="text-muted mt-2">Pilih dari berbagai tipe kamar dengan fasilitas lengkap</p>
            </div>
            <a href="/rooms" className="hidden md:flex items-center gap-1.5 text-accent font-bold hover:gap-3 transition-all text-sm">
              Lihat Semua
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
                  <div className="h-52 bg-slate-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-1/3" />
                    <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-2/3" />
                    <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, i) => (
                <div
                  key={room.kamar_id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-muted text-lg font-medium">Belum ada kamar tersedia saat ini.</p>
              <p className="text-muted text-sm mt-1">Coba lagi nanti atau hubungi kami.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section id="why-us" className="py-24 bg-primary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-3">Keunggulan Kami</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Mengapa Memilih KostKu?</h2>
            <p className="text-white/60 max-w-xl mx-auto">Kami berkomitmen memberikan layanan terbaik untuk kenyamanan dan keamanan hunian Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group">
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{f.title}</h4>
                <p className="text-white/60 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-surface">
        <div className="container">
          <div className="bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
              Siap Menemukan Kost Impianmu?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Bergabung dengan ribuan penyewa yang telah mempercayakan pencarian kost kepada kami.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#listings" className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold hover:bg-secondary-light transition-all shadow-lg hover:-translate-y-0.5">
                🔍 Cari Kost Sekarang
              </a>
              <a href="/register" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold border border-border hover:border-primary/30 transition-all hover:-translate-y-0.5 shadow-sm">
                Daftar Gratis →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
