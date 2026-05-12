import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary text-white">
    {/* Main footer */}
    <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* Brand */}
      <div className="md:col-span-2">
        <Link to="/" className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="text-xl font-bold">Kost<span className="text-secondary">Ku</span></span>
        </Link>
        <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
          Platform reservasi kost terpercaya. Temukan hunian nyaman dengan mudah, aman, dan harga transparan.
        </p>
        {/* Social links */}
        <div className="flex gap-3">
          {['📘 Facebook', '📸 Instagram', '🐦 Twitter'].map(s => (
            <a key={s} href="#" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white transition-all">
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <h4 className="font-bold mb-5 text-sm uppercase tracking-widest text-white/50">Navigasi</h4>
        <ul className="flex flex-col gap-3">
          {[
            { to: '/', label: 'Beranda' },
            { to: '/rooms', label: 'Cari Kamar' },
            { to: '/login', label: 'Masuk' },
            { to: '/register', label: 'Daftar Gratis' },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="font-bold mb-5 text-sm uppercase tracking-widest text-white/50">Kontak</h4>
        <ul className="flex flex-col gap-3 text-sm text-white/50">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">📧</span>
            <span>info@kostku.id</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">📱</span>
            <span>+62 812 3456 7890</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">📍</span>
            <span>Jakarta, Indonesia</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">🕐</span>
            <span>Senin–Sabtu 08.00–20.00</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/10">
      <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
        <p>© 2024 KostKu. Hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/60 transition-colors">Syarat & Ketentuan</a>
          <a href="#" className="hover:text-white/60 transition-colors">Kebijakan Privasi</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
