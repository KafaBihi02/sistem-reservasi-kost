import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-deep text-white pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Kost<span className="text-secondary">Ku</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Platform reservasi kost terpercaya. Temukan kamar impian Anda dengan mudah, cepat, dan aman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Menu</h4>
            <ul className="space-y-4">
              {['Beranda', 'Cari Kamar', 'Cara Reservasi', 'FAQ'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-white/50 hover:text-secondary transition-colors text-sm font-medium">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <span className="text-secondary">📞</span> (021) 1234-5678
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <span className="text-secondary">✉️</span> info@kostku.id
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <span className="text-secondary">📍</span> Jakarta, Indonesia
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="text-lg font-bold mb-6">Ikuti Kami</h4>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'YT'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all group">
                  <span className="text-xs font-bold text-white group-hover:scale-110 transition-transform">{social}</span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-white/40">Dapatkan update terbaru dari kami.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-medium">
            © {new Date().getFullYear()} KostKu. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">Kebijakan Privasi</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
