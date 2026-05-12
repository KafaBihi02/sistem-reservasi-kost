import React, { useState, useEffect } from 'react';
import { API_BASE_URL, fetchWithAuth } from '../../api/config';
import TrashKamar from './TrashKamar';

export default function KelolaKamar() {
  const [kamar, setKamar] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [showTrash, setShowTrash] = useState(false);
  const [form, setForm] = useState({ nomor_kamar:'', tipe_id:'', lantai:'1', status:'tersedia', foto_kamar:'' });
  const [editId, setEditId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchWithAuth('/kamar').then(r=>r.json()),
      fetchWithAuth('/tipe-kamar').then(r=>r.json()),
    ]).then(([k,t])=>{
      if(k.success) setKamar(k.data);
      if(t.success) setTypes(t.data);
      setLoading(false);
    });
  };
  useEffect(()=>{ load(); },[]);

  const openAdd = () => { setForm({nomor_kamar:'',tipe_id:'',lantai:'1',status:'tersedia',foto_kamar:''}); setModal('add'); };
  const openEdit = (k) => { setForm({nomor_kamar:k.nomor_kamar,tipe_id:k.tipe_id,lantai:k.lantai,status:k.status,foto_kamar:k.foto_kamar||''}); setEditId(k.kamar_id); setModal('edit'); };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const url = modal==='add' ? '/kamar' : `/kamar/${editId}`;
    const method = modal==='add' ? 'POST' : 'PUT';
    const res = await fetchWithAuth(url,{method, body:JSON.stringify(form)});
    const data = await res.json();
    if(data.success){ setModal(null); load(); } else alert(data.message);
  };

  const handleDelete = async(id) => {
    if(!confirm('Pindahkan kamar ini ke trash?')) return;
    try {
      const res = await fetchWithAuth(`/kamar/${id}`,{method:'DELETE'});
      const data = await res.json();
      if(data.success) {
        load();
      } else {
        alert('Gagal menghapus: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  if (showTrash) return <TrashKamar onBack={() => { setShowTrash(false); load(); }} />;

  const statusColor = s => s==='tersedia'?'bg-emerald-100 text-emerald-700':s==='perbaikan'?'bg-amber-100 text-amber-700':'bg-rose-100 text-rose-700';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-primary">Kelola Kamar</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowTrash(true)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all" title="Lihat Trash">🗑️</button>
          <button onClick={openAdd} className="btn-secondary px-6 py-2.5 text-sm font-black">➕ Tambah Kamar</button>
        </div>
      </div>

      {loading ? <div className="py-20 text-center text-muted">Memuat...</div> : (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-50">
              {['Foto','Nomor','Tipe','Lantai','Status','Aksi'].map(h=>(
                <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {kamar.length === 0 ? (
                <tr><td colSpan="6" className="py-16 text-center text-muted italic">Belum ada data kamar aktif</td></tr>
              ) : kamar.map(k=>(
                <tr key={k.kamar_id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100">
                      {k.foto_kamar ? <img src={k.foto_kamar} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{k.nomor_kamar}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{k.nama_tipe}<br/><span className="text-xs text-muted font-bold">Rp {parseFloat(k.harga_bulan).toLocaleString('id-ID')}/bln</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600">Lantai {k.lantai}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(k.status)}`}>{k.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(k)} title="Edit" className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-sm">✏️</button>
                      <button onClick={()=>handleDelete(k.kamar_id)} title="Hapus ke Trash" className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-primary">{modal==='add'?'Tambah Kamar':'Edit Kamar'}</h3>
              <button onClick={()=>setModal(null)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              {[['Nomor Kamar','text','nomor_kamar','A-101'],['Lantai','number','lantai','1']].map(([label,type,key,ph])=>(
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                  <input type={type} required placeholder={ph} className="input-premium" value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipe Kamar</label>
                <select required className="input-premium" value={form.tipe_id} onChange={e=>setForm({...form,tipe_id:e.target.value})}>
                  <option value="">Pilih Tipe</option>
                  {types.map(t=><option key={t.tipe_id} value={t.tipe_id}>{t.nama_tipe}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                <select className="input-premium" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option value="tersedia">Tersedia</option>
                  <option value="perbaikan">Perbaikan</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">URL Foto</label>
                <input type="url" placeholder="https://..." className="input-premium" value={form.foto_kamar} onChange={e=>setForm({...form,foto_kamar:e.target.value})}/>
                {form.foto_kamar && <img src={form.foto_kamar} alt="preview" className="mt-2 w-full h-36 object-cover rounded-xl border border-slate-200" onError={e=>e.target.style.display='none'}/>}
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full btn-secondary py-3 font-black">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
