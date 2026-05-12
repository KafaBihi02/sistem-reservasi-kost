import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL, fetchWithAuth } from '../api/config';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nama: '', email: '', password: '', no_hp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.data);
        navigate('/');
      } else {
        setError(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-8 px-4 pt-28">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up min-h-[580px]">
          {/* Left - Brand Panel */}
          <div className="md:w-5/12 bg-primary p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/20 rounded-full" />
            <div className="absolute top-1/2 right-8 w-24 h-24 bg-accent/20 rounded-full" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-10">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">Kost<span className="text-secondary">Ku</span></span>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
                {isLogin ? <>Selamat Datang <br/>Kembali! 👋</> : <>Bergabung <br/>Bersama Kami! 🎉</>}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {isLogin
                  ? 'Masuk untuk mengakses reservasi dan penawaran eksklusif kost terbaik.'
                  : 'Daftar gratis dan temukan hunian impianmu dalam hitungan menit.'}
              </p>
            </div>

            {/* Testimonial */}
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <p className="text-white/80 text-sm italic mb-4">
                  "KostKu bikin cari kost jadi super gampang. Booking online, konfirmasi cepat, kamarnya bersih dan nyaman!"
                </p>
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/100?img=32" alt="User" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">Budi Santoso</p>
                    <p className="text-white/50 text-xs">Mahasiswa UI, Jakarta</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#E65100"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
                <span className="text-white/60 text-xs ml-1">5.0 dari 200+ ulasan</span>
              </div>
            </div>
          </div>

          {/* Right - Form Panel */}
          <div className="md:w-7/12 p-10 md:p-12 flex flex-col justify-center">
            {/* Toggle tabs */}
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
              {['Masuk', 'Daftar'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    (isLogin && i === 0) || (!isLogin && i === 1)
                      ? 'bg-white text-primary shadow-md'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
                <svg width="18" height="18" className="mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text" name="nama" required value={formData.nama} onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">No. WhatsApp</label>
                    <input
                      type="tel" name="no_hp" required value={formData.no_hp} onChange={handleChange}
                      placeholder="08123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  {isLogin && <a href="#" className="text-xs text-accent hover:underline">Lupa password?</a>}
                </div>
                <input
                  type="password" name="password" required value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-primary-light transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : isLogin ? '🚀 Masuk Sekarang' : '✨ Buat Akun Gratis'}
              </button>
            </form>

            <p className="text-xs text-center text-muted mt-6 leading-relaxed">
              Dengan melanjutkan, Anda menyetujui{' '}
              <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> dan{' '}
              <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a> KostKu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
