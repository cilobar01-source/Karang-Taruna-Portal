"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const CAN = role => ['super_admin','ketua','koordinator_kegiatan','sekretaris'].includes(role);
export default function AgendaPanel(){
  const [user,setUser]=useState(null); const [role,setRole]=useState('anggota');
  const [judul,setJudul]=useState(''); const [tanggal,setTanggal]=useState('');
  const [lokasi,setLokasi]=useState(''); const [deskripsi,setDeskripsi]=useState('');
  const [list,setList]=useState([]); const [editId,setEditId]=useState('');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{if(!u){window.location.href='/login';return;}setUser(u);const s=await getDoc(doc(db,'users',u.uid));setRole(s.exists()? (s.data().role||'anggota'):'anggota');loadList();});return ()=>unsub()},[]);
  const loadList=async()=>{const s=await getDocs(query(collection(db,'agenda'),orderBy('createdAt','desc')));setList(s.docs.map(d=>({id:d.id,...d.data()})));};
  const reset=()=>{setJudul('');setTanggal('');setLokasi('');setDeskripsi('');setEditId('')};
  const save=async()=>{try{if(!CAN(role)) return toast.error('Akses ditolak');if(!judul) return toast('Isi judul');if(editId){await updateDoc(doc(db,'agenda',editId),{judul,tanggal: tanggal||new Date().toISOString().slice(0,10),lokasi,deskripsi});toast.success('Agenda diperbarui')}else{await addDoc(collection(db,'agenda'),{judul,tanggal: tanggal||new Date().toISOString().slice(0,10),lokasi,deskripsi,createdAt:serverTimestamp()});toast.success('Agenda ditambahkan')}reset();loadList()}catch(e){toast.error(e.message)}};
  const hapus=async(id)=>{if(!CAN(role)) return toast.error('Akses ditolak');if(!confirm('Hapus agenda?'))return;await deleteDoc(doc(db,'agenda',id));toast.success('Terhapus');loadList()};
  const edit=(a)=>{setEditId(a.id);setJudul(a.judul||'');setTanggal(a.tanggal||'');setLokasi(a.lokasi||'');setDeskripsi(a.deskripsi||'')};
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><div>
    <div className='card'>
      <h2>🗓️ Agenda</h2>
      <input placeholder='Judul' value={judul} onChange={e=>setJudul(e.target.value)} />
      <input type='date' value={tanggal} onChange={e=>setTanggal(e.target.value)} />
      <input placeholder='Lokasi' value={lokasi} onChange={e=>setLokasi(e.target.value)} />
      <textarea rows={3} placeholder='Deskripsi' value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
      <div className='row'><button className='btn btn-primary' onClick={save} disabled={!CAN(role)}>{editId?'Perbarui':'Simpan'}</button>{editId&&<button className='btn btn-ghost' onClick={reset}>Batal</button>}</div>
    </div>
    <div className='grid grid-2'>
      {list.map(a=>(<div key={a.id} className='card'><h3>{a.judul}</h3><p>📅 {a.tanggal||''} • 📍 {a.lokasi||''}</p><p style={{whiteSpace:'pre-line'}}>{a.deskripsi||''}</p>{CAN(role)&&(<><button className='btn btn-ghost' onClick={()=>edit(a)}>Edit</button><button className='btn btn-ghost' onClick={()=>hapus(a.id)}>Hapus</button></>)}</div>))}
      {list.length===0&&<p className='note'>Belum ada agenda.</p>}
    </div>
  </div></div>);
}
