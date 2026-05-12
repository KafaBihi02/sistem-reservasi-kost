import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { API_BASE_URL } from '../api/config';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: 'all', search: '' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/kamar`)
      .then(r => r.json())
      .then(d => { if (d.success) setRooms(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesType = filter.type === 'all' || room.nama_tipe === filter.type;
    const matchesSearch = room.nomor_kamar.toLowerCase().includes(filter.search.toLowerCase()) || 
                          room.nama_tipe.toLowerCase().includes(filter.search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const types = ['all', ...new Set(rooms.map(r => r.nama_tipe))];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-3">Katalog Kamar</p>
          <h1 className="text-4xl font-extrabold text-primary mb-4">Temukan Kamar Sesuai Kebutuhanmu</h1>
          <p className="text-muted max-w-2xl mx-auto">Jelajahi berbagai pilihan kamar terbaik kami yang dirancang untuk kenyamanan dan produktivitas Anda.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-[var(--shadow-card)] p-6 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Cari nomor kamar atau tipe..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm"
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter({ ...filter, type })}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter.type === type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Semua Tipe' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
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
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, i) => (
              <div
                key={room.kamar_id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted text-lg font-medium">Kamar tidak ditemukan.</p>
            <p className="text-muted text-sm mt-1">Coba gunakan kata kunci pencarian lain.</p>
            <button
              onClick={() => setFilter({ type: 'all', search: '' })}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
