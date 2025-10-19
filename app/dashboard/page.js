"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const CAN = role => ['super_admin','ketua','wakil_ketua','sekretaris'].includes(role);
export default function PengumumanPanel(){
  const [user,setUser]=useState(null);
  const [role,setRole]=useState('anggota');
  const [judul,setJudul]=useState(''); const [isi,setIsi]=useState('');
  const [tanggal,setTanggal]=useState(''); const [list,setList]=useState([]);
  const [editId,setEditId]=useState('');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{
    if(!u){window.location.href='/login';return;}
    setUser(u); const s=await getDoc(doc(db,'users',u.uid));
    setRole(s.exists()? (s.data().role||'anggota'):'anggota'); loadList();
  });return ()=>unsub()},[]);
  const loadList=async()=>{const s=await getDocs(query(collection(db,'pengumuman'),orderBy('createdAt','desc')));setList(s.docs.map(d=>({id:d.id,...d.data()})));};
  const reset=()=>{setJudul('');setIsi('');setTanggal('');setEditId('')};
  const save=async()=>{try{if(!CAN(role)) return toast.error('Akses ditolak');if(!judul||!isi) return toast('Lengkapi judul & isi');if(editId){await updateDoc(doc(db,'pengumuman',editId),{judul,isi,tanggal});toast.success('Diperbarui')}else{await addDoc(collection(db,'pengumuman'),{judul,isi,tanggal: tanggal||new Date().toISOString().slice(0,10),createdAt:serverTimestamp()});toast.success('Ditambahkan')}reset();loadList()}catch(e){toast.error(e.message)}};
  const hapus=async(id)=>{if(!CAN(role)) return toast.error('Akses ditolak');if(!confirm('Hapus pengumuman?'))return;await deleteDoc(doc(db,'pengumuman',id));toast.success('Terhapus');loadList()};
  const edit=(p)=>{setEditId(p.id);setJudul(p.judul||'');setIsi(p.isi||'');setTanggal(p.tanggal||'')};
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><div>
    <div className='card'>
      <h2>📢 Pengumuman</h2>
      <input placeholder='Judul' value={judul} onChange={e=>setJudul(e.target.value)} />
      <textarea rows={5} placeholder='Isi pengumuman' value={isi} onChange={e=>setIsi(e.target.value)} />
      <input type='date' value={tanggal} onChange={e=>setTanggal(e.target.value)} />
      <div className='row'><button className='btn btn-primary' onClick={save} disabled={!CAN(role)}>{editId?'Perbarui':'Simpan'}</button>{editId&&<button className='btn btn-ghost' onClick={reset}>Batal</button>}</div>
    </div>
    <div className='grid grid-2'>
      {list.map(p=>(<div key={p.id} className='card'><h3>{p.judul}</h3><p style={{whiteSpace:'pre-line'}}>{p.isi}</p><small className='note'>📅 {p.tanggal||''}</small><div className='row'><button className='btn btn-ghost' onClick={()=>edit(p)} disabled={!CAN(role)}>Edit</button><button className='btn btn-ghost' onClick={()=>hapus(p.id)} disabled={!CAN(role)}>Hapus</button></div></div>))}
      {list.length===0&&<p className='note'>Belum ada pengumuman.</p>}
    </div>
  </div></div>);
}
