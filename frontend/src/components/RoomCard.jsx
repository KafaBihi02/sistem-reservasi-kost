import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const { nomor_kamar, nama_tipe, harga_bulan, foto_kamar, fasilitas, status, kamar_id } = room;
  const tersedia = status === 'tersedia';

  const facilityIcons = {
    'AC': '❄️', 'WiFi': '📶', 'Kamar Mandi Dalam': '🚿', 'Parkir': '🅿️',
    'Laundry': '👕', 'Dapur': '🍳', 'TV': '📺', 'Lemari': '🗄️'
  };

  const getFacilityIcon = (f) => {
    const key = Object.keys(facilityIcons).find(k => f.toLowerCase().includes(k.toLowerCase()));
    return key ? facilityIcons[key] : '✓';
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-1.5 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={foto_kamar || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'}
          alt={`Kamar ${nomor_kamar}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            tersedia ? 'bg-success text-white' : 'bg-danger text-white'
          }`}>
            {tersedia ? '✓ Tersedia' : '✗ Penuh'}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md">
          <p className="text-secondary font-bold text-sm">Rp {parseInt(harga_bulan).toLocaleString('id-ID')}</p>
          <p className="text-slate-400 text-[10px] text-right">/ bulan</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">{nama_tipe}</p>
          <h3 className="text-lg font-bold text-primary">Kamar No. {nomor_kamar}</h3>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {fasilitas && fasilitas.split(',').slice(0, 4).map((f, i) => (
            <span key={i} className="text-xs bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">
              {getFacilityIcon(f)} {f.trim()}
            </span>
          ))}
        </div>

        <Link
          to={`/rooms/${kamar_id}`}
          className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            tersedia
              ? 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {tersedia ? 'Lihat Detail & Booking' : 'Kamar Penuh'}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
