import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/config';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', nama: '', no_hp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        onLoginSuccess(data.data);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-20 px-4">
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-slate-100">
        {/* Visual Side */}
        <div className="hidden lg:block relative p-12 bg-primary-deep overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-primary-deep/80 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span className="text-2xl font-black text-white">KostKu</span>
            </div>

            <div className="space-y-6">
               <h2 className="text-4xl text-white leading-tight">
                 Mulai petualangan baru di hunian yang <span className="text-secondary">nyaman</span>.
               </h2>
               <div className="flex items-center gap-4 text-white/60">
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-deep bg-slate-700"></div>
                   ))}
                 </div>
                 <p className="text-xs font-medium">Bergabung dengan 150+ penyewa lainnya.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-black text-primary mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-muted text-sm mb-10">
              {isLogin ? 'Silakan masukkan detail akun Anda.' : 'Lengkapi data untuk mulai mencari kost.'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6 flex items-center gap-3">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nama Lengkap</label>
                    <input
                      type="text" required
                      className="input-premium"
                      placeholder="Contoh: John Doe"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nomor HP</label>
                    <input
                      type="text" required
                      className="input-premium"
                      placeholder="0812xxxx"
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email" required
                  className="input-premium"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password" required
                  className="input-premium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-secondary w-full py-4 text-base mt-4 shadow-xl shadow-secondary/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  isLogin ? 'Masuk Sekarang' : 'Buat Akun'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted">
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-secondary font-bold ml-1.5 hover:underline"
                >
                  {isLogin ? 'Daftar Sekarang' : 'Masuk ke Akun'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
