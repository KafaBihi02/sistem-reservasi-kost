import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isTransparent = isHomePage && !scrolled;

  if (isAuthPage) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`container mx-auto px-4 transition-all duration-500 ${
        scrolled ? 'max-w-5xl' : 'max-w-7xl'
      }`}>
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
          isTransparent 
            ? 'bg-transparent' 
            : 'glass shadow-premium'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className={`text-2xl font-black tracking-tight ${isTransparent ? 'text-white' : 'text-primary'}`}>
              Kost<span className="text-secondary">Ku</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { path: '/', label: 'Beranda' }, 
              { path: '/rooms', label: 'Cari Kamar' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-bold transition-all duration-300 relative group ${
                  isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-primary'
                } ${isActive(path) ? 'text-secondary!' : ''}`}
              >
                {label}
                <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 bg-secondary rounded-full transition-all duration-300 ${
                  isActive(path) ? 'w-4' : 'w-0 group-hover:w-4'
                }`}></span>
              </Link>
            ))}

            <div className="h-6 w-[1px] bg-slate-200/50"></div>

            {user ? (
              <div className="flex items-center gap-5">
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl hover:bg-accent/20 transition-all active:scale-95">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-xs font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-xl hover:bg-secondary/20 transition-all active:scale-95">
                    Dashboard Saya
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-bold leading-tight ${isTransparent ? 'text-white' : 'text-slate-900'}`}>{user.nama}</span>
                    <span className={`text-[10px] font-medium opacity-60 ${isTransparent ? 'text-white' : 'text-slate-500'}`}>{user.role}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-md border border-white/10 overflow-hidden">
                    {user.nama?.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    type="button"
                    onClick={onLogout}
                    className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group z-10"
                    title="Keluar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={`text-sm font-bold ${isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-primary'} transition-colors`}>
                  Masuk
                </Link>
                <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg active:scale-95 border border-white/10">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-5 h-0.5 mb-1 rounded transition-all bg-primary ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 mb-1 rounded transition-all bg-primary ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 rounded transition-all bg-primary ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mx-4 mt-3 p-6 glass rounded-3xl shadow-2xl flex flex-col gap-5 animate-slide-up">
          <Link to="/" className="text-slate-800 font-bold text-lg" onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link to="/rooms" className="text-slate-800 font-bold text-lg" onClick={() => setMenuOpen(false)}>Cari Kamar</Link>
          <hr className="border-slate-100" />
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-accent font-bold" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              ) : (
                <Link to="/dashboard" className="text-secondary font-bold" onClick={() => setMenuOpen(false)}>Dashboard Saya</Link>
              )}
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                    {user.nama?.charAt(0).toUpperCase()}
                 </div>
                 <span className="font-bold text-slate-800">{user.nama}</span>
              </div>
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold">Keluar</button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="w-full py-3 text-center text-slate-700 font-bold" onClick={() => setMenuOpen(false)}>Masuk</Link>
              <Link to="/register" className="w-full py-3 bg-primary text-white rounded-xl font-bold text-center" onClick={() => setMenuOpen(false)}>Daftar Sekarang</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
