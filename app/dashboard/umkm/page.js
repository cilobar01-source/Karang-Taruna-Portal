"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UploadButton from '../components/UploadButton';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const CAN = role => ['super_admin','koordinator_umkm','ketua'].includes(role);
export default function UmkmPanel(){
  const [user,setUser]=useState(null); const [role,setRole]=useState('anggota');
  const [produk,setProduk]=useState(''); const [penjual,setPenjual]=useState(''); const [harga,setHarga]=useState(0);
  const [wa,setWa]=useState(''); const [deskripsi,setDeskripsi]=useState(''); const [foto,setFoto]=useState([]);
  const [list,setList]=useState([]); const [editId,setEditId]=useState('');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{if(!u){window.location.href='/login';return;}setUser(u);const s=await getDoc(doc(db,'users',u.uid));setRole(s.exists()? (s.data().role||'anggota'):'anggota');loadList();});return ()=>unsub()},[]);
  const loadList=async()=>{const s=await getDocs(query(collection(db,'umkm'),orderBy('createdAt','desc')));setList(s.docs.map(d=>({id:d.id,...d.data()})));};
  const reset=()=>{setProduk('');setPenjual('');setHarga(0);setWa('');setDeskripsi('');setFoto([]);setEditId('')};
  const save=async()=>{try{if(!CAN(role)) return toast.error('Akses ditolak');if(!produk||!penjual) return toast('Lengkapi produk & penjual');if(editId){await updateDoc(doc(db,'umkm',editId),{produk,penjual,harga:Number(harga||0),wa,deskripsi, ...(foto.length?{foto}:{})});toast.success('Produk diperbarui')}else{await addDoc(collection(db,'umkm'),{produk,penjual,harga:Number(harga||0),wa,deskripsi,foto,createdAt:serverTimestamp()});toast.success('Produk disimpan')}reset();loadList()}catch(e){toast.error(e.message)}};
  const hapus=async(id)=>{if(!CAN(role)) return toast.error('Akses ditolak');if(!confirm('Hapus produk?'))return;await deleteDoc(doc(db,'umkm',id));toast.success('Terhapus');loadList()};
  const edit=(u)=>{setEditId(u.id);setProduk(u.produk||'');setPenjual(u.penjual||'');setHarga(u.harga||0);setWa(u.wa||'');setDeskripsi(u.deskripsi||'')};
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><div>
    <div className='card'>
      <h2>🏪 Produk</h2>
      <input placeholder='Nama produk' value={produk} onChange={e=>setProduk(e.target.value)} />
      <input placeholder='Nama penjual' value={penjual} onChange={e=>setPenjual(e.target.value)} />
      <input type='number' placeholder='Harga (Rp)' value={harga} onChange={e=>setHarga(e.target.value)} />
      <input placeholder='Nomor WhatsApp (628xxxx)' value={wa} onChange={e=>setWa(e.target.value)} />
      <textarea rows={3} placeholder='Deskripsi' value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
      <UploadButton onUploaded={(urls)=>setFoto(urls)} />
      {foto.length>0&&<p className='note'>{foto.length} foto terpilih</p>}
      <div className='row'><button className='btn btn-primary' onClick={save} disabled={!CAN(role)}>{editId?'Perbarui':'Simpan'}</button>{editId&&<button className='btn btn-ghost' onClick={reset}>Batal</button>}</div>
    </div>
    <div className='grid grid-2'>
      {list.map(u=>(<div key={u.id} className='card'>
        {Array.isArray(u.foto)&&u.foto[0]&&<img className='thumb' src={u.foto[0]} alt={u.produk}/>}
        <h3>{u.produk}</h3><p>👤 {u.penjual} • 💰 Rp{(u.harga||0).toLocaleString()}</p>
        {u.wa&&<a className='btn btn-ghost' href={`https://wa.me/${u.wa}`} target='_blank'>Hubungi</a>}
        {CAN(role)&&(<><button className='btn btn-ghost' onClick={()=>edit(u)}>Edit</button><button className='btn btn-ghost' onClick={()=>hapus(u.id)}>Hapus</button></>)}
      </div>))}
      {list.length===0&&<p className='note'>Belum ada produk.</p>}
    </div>
  </div></div>);
}
