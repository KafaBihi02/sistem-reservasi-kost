import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const { kamar_id, nomor_kamar, status, nama_tipe, harga_bulan, url_gambar, fasilitas } = room;
  const tersedia = status === 'tersedia';

  // Parse fasilitas if it's a string
  const facilitiesList = typeof fasilitas === 'string' ? fasilitas.split(',') : (fasilitas || []);

  return (
    <div className="card-premium group">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={url_gambar || `https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600`} 
          alt={`Kamar ${nomor_kamar}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-accent text-white badge-status border-none px-3 py-1.5 shadow-lg">
            {nama_tipe}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`badge-status ${
            tersedia 
              ? 'bg-success/10 text-success border-success/20 backdrop-blur-md' 
              : 'bg-danger/10 text-danger border-danger/20 backdrop-blur-md'
          } px-3 py-1.5`}>
            {tersedia ? '● Tersedia' : '● Terisi'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
              Kamar {nama_tipe} {nomor_kamar}
            </h3>
            <p className="text-xs text-muted font-medium mt-1">Lantai {room.lantai || '1'} • 3x4 m²</p>
          </div>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {facilitiesList.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
              {f.trim()}
            </span>
          ))}
          {facilitiesList.length > 3 && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
              +{facilitiesList.length - 3}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <p className="text-sm text-muted font-medium">Harga</p>
            <p className="text-lg font-black text-primary">
              Rp {parseInt(harga_bulan).toLocaleString('id-ID')}
              <span className="text-xs text-muted font-normal">/bulan</span>
            </p>
          </div>
          
          <Link
            to={`/rooms/${kamar_id}`}
            className={`btn-premium px-5 py-2.5 rounded-xl font-bold text-xs ${
              tersedia
                ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {tersedia ? 'Detail' : 'Penuh'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
