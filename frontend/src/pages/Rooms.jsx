import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { API_BASE_URL } from '../api/config';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', search: '' });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/kamar`).then(res => res.json()),
      fetch(`${API_BASE_URL}/tipe-kamar`).then(res => res.json())
    ]).then(([roomData, typeData]) => {
      if (roomData.success) setRooms(roomData.data);
      if (typeData.success) setTypes(typeData.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesType = filter.type === '' || room.tipe_id === parseInt(filter.type);
    const matchesSearch = room.nomor_kamar.toLowerCase().includes(filter.search.toLowerCase()) ||
                          room.nama_tipe.toLowerCase().includes(filter.search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="container">
        {/* Header Section */}
        <div className="max-w-3xl mb-12 animate-fade-in">
          <p className="text-secondary font-black uppercase tracking-widest text-xs mb-3">Eksplorasi Hunian</p>
          <h1 className="text-4xl lg:text-5xl text-primary mb-6">Temukan Kamar yang Sesuai dengan Gaya Hidup Anda</h1>
          <p className="text-muted text-lg">Pilih dari berbagai pilihan tipe kamar yang nyaman dan strategis.</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-premium border border-slate-100 flex flex-col lg:flex-row gap-4 mb-12 items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto items-center">
            <div className="relative w-full lg:w-80 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors text-lg">🔍</span>
              <input 
                type="text" 
                placeholder="Cari nomor atau tipe kamar..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all text-sm font-medium"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 w-full lg:w-auto scrollbar-hide">
              <button 
                onClick={() => setFilter({ ...filter, type: '' })}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                  filter.type === '' 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Semua Tipe
              </button>
              {types.map(t => (
                <button 
                  key={t.tipe_id}
                  onClick={() => setFilter({ ...filter, type: t.tipe_id.toString() })}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                    filter.type === t.tipe_id.toString() 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {t.nama_tipe}
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block text-xs font-bold text-muted px-4">
             Menampilkan <span className="text-primary">{filteredRooms.length}</span> Kamar
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted font-bold">Mencari kamar terbaik untukmu...</p>
          </div>
        ) : (
          <>
            {filteredRooms.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map(room => (
                  <RoomCard key={room.kamar_id} room={room} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-premium border border-slate-100">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-black text-primary mb-2">Tidak Menemukan Kamar</h3>
                <p className="text-muted max-w-sm mx-auto">Coba ubah kata kunci pencarian atau filter tipe kamar Anda.</p>
                <button 
                  onClick={() => setFilter({ type: '', search: '' })}
                  className="mt-8 btn-secondary px-8 py-3"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;
