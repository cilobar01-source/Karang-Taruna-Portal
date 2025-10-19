"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const CAN = role => ['super_admin','bendahara','ketua'].includes(role);
export default function KasPanel(){
  const [user,setUser]=useState(null);const [role,setRole]=useState('anggota');
  const [nama,setNama]=useState('');const [tanggal,setTanggal]=useState('');const [jumlah,setJumlah]=useState(0);
  const [tipe,setTipe]=useState('masuk');const [keterangan,setKeterangan]=useState('');
  const [list,setList]=useState([]);const [total,setTotal]=useState(0);const [editId,setEditId]=useState('');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{if(!u){window.location.href='/login';return;}setUser(u);const s=await getDoc(doc(db,'users',u.uid));setRole(s.exists()? (s.data().role||'anggota'):'anggota');loadList();});return ()=>unsub()},[]);
  const loadList=async()=>{const s=await getDocs(query(collection(db,'kas'),orderBy('createdAt','desc')));const arr=s.docs.map(d=>({id:d.id,...d.data()}));setList(arr);let t=0;arr.forEach(k=>{t+=(k.tipe==='masuk'?1:-1)*(k.jumlah||0)});setTotal(t)};
  const reset=()=>{setNama('');setTanggal('');setJumlah(0);setTipe('masuk');setKeterangan('');setEditId('')};
  const save=async()=>{try{if(!CAN(role)) return toast.error('Akses ditolak');if(!nama||!jumlah) return toast('Lengkapi nama & jumlah');if(editId){await updateDoc(doc(db,'kas',editId),{nama,tanggal: tanggal||new Date().toISOString().slice(0,10),jumlah:Number(jumlah||0),tipe,keterangan});toast.success('Transaksi diperbarui')}else{await addDoc(collection(db,'kas'),{nama,tanggal: tanggal||new Date().toISOString().slice(0,10),jumlah:Number(jumlah||0),tipe,keterangan,createdAt:serverTimestamp()});toast.success('Transaksi disimpan')}reset();loadList()}catch(e){toast.error(e.message)}};
  const hapus=async(id)=>{if(!CAN(role)) return toast.error('Akses ditolak');if(!confirm('Hapus transaksi?'))return;await deleteDoc(doc(db,'kas',id));toast.success('Terhapus');loadList()};
  const edit=(k)=>{setEditId(k.id);setNama(k.nama||'');setTanggal(k.tanggal||'');setJumlah(k.jumlah||0);setTipe(k.tipe||'masuk');setKeterangan(k.keterangan||'')};
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><div>
    <div className='card'>
      <h2>💰 Keuangan (Kas)</h2>
      <input placeholder='Nama Pembayar' value={nama} onChange={e=>setNama(e.target.value)} />
      <input type='date' value={tanggal} onChange={e=>setTanggal(e.target.value)} />
      <input type='number' placeholder='Jumlah (Rp)' value={jumlah} onChange={e=>setJumlah(e.target.value)} />
      <select value={tipe} onChange={e=>setTipe(e.target.value)}><option value='masuk'>Pemasukan</option><option value='keluar'>Pengeluaran</option></select>
      <input placeholder='Keterangan' value={keterangan} onChange={e=>setKeterangan(e.target.value)} />
      <div className='row'><button className='btn btn-primary' onClick={save} disabled={!CAN(role)}>{editId?'Perbarui':'Simpan'}</button>{editId&&<button className='btn btn-ghost' onClick={reset}>Batal</button>}</div>
      <p className='note'>Total kas saat ini: <span className='badge'>Rp {total.toLocaleString()}</span></p>
    </div>
    <div className='grid grid-2'>
      {list.map(k=>(<div key={k.id} className='card'><b>{k.tipe==='masuk'?'🟢 Pemasukan':'🔴 Pengeluaran'} Rp {(k.jumlah||0).toLocaleString()}</b><p>👤 {k.nama||'-'} • 📅 {k.tanggal||''}</p><small className='note'>{k.keterangan||''}</small><br/>{CAN(role)&&(<><button className='btn btn-ghost' onClick={()=>edit(k)}>Edit</button><button className='btn btn-ghost' onClick={()=>hapus(k.id)}>Hapus</button></>)}</div>))}
      {list.length===0&&<p className='note'>Belum ada transaksi.</p>}
    </div>
  </div></div>);
}
