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
  const isTransparent = isHomePage && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'glass shadow-lg'
    }`}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className={`text-xl font-bold ${isTransparent ? 'text-white' : 'text-primary'}`}>
            Kost<span className="text-secondary">Ku</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[{ path: '/', label: 'Beranda' }, { path: '/rooms', label: 'Kamar' }].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`font-medium text-sm transition-all duration-200 relative group ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-primary'
              } ${isActive(path) ? 'text-secondary font-bold' : ''}`}
            >
              {label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary rounded-full transition-all duration-300 ${isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors">
                  Dashboard Admin
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.nama?.charAt(0).toUpperCase()}
                </div>
                <span className={`text-sm font-medium ${isTransparent ? 'text-white' : 'text-slate-700'}`}>{user.nama}</span>
              </div>
              <button onClick={onLogout} className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary-light transition-colors shadow-sm">
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={`text-sm font-medium ${isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-primary'} transition-colors`}>
                Masuk
              </Link>
              <Link to="/register" className="bg-secondary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-secondary-light transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Daftar Gratis
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 mb-1 rounded transition-all ${isTransparent ? 'bg-white' : 'bg-primary'} ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-5 h-0.5 mb-1 rounded transition-all ${isTransparent ? 'bg-white' : 'bg-primary'} ${menuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-5 h-0.5 rounded transition-all ${isTransparent ? 'bg-white' : 'bg-primary'} ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/20 px-6 py-4 flex flex-col gap-4 animate-fade-in-up">
          <Link to="/" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link to="/rooms" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>Kamar</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="text-accent font-medium" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-left text-secondary font-medium">Keluar</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>Masuk</Link>
              <Link to="/register" className="bg-secondary text-white px-4 py-2 rounded-xl font-medium text-center" onClick={() => setMenuOpen(false)}>Daftar Gratis</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
