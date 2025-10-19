"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UploadButton from '../components/UploadButton';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const CAN = role => ['super_admin','ketua','sekretaris'].includes(role);
export default function BeritaPanel(){
  const [user,setUser]=useState(null); const [role,setRole]=useState('anggota');
  const [judul,setJudul]=useState(''); const [isi,setIsi]=useState(''); const [foto,setFoto]=useState([]);
  const [list,setList]=useState([]); const [editId,setEditId]=useState('');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{if(!u){window.location.href='/login';return;}setUser(u);const s=await getDoc(doc(db,'users',u.uid));setRole(s.exists()? (s.data().role||'anggota'):'anggota');loadList();});return ()=>unsub()},[]);
  const loadList=async()=>{const s=await getDocs(query(collection(db,'berita'),orderBy('createdAt','desc')));setList(s.docs.map(d=>({id:d.id,...d.data()})));};
  const reset=()=>{setJudul('');setIsi('');setFoto([]);setEditId('')};
  const save=async()=>{try{if(!CAN(role)) return toast.error('Akses ditolak');if(!judul||!isi) return toast('Lengkapi judul & isi');if(editId){await updateDoc(doc(db,'berita',editId),{judul,isi, ...(foto.length?{foto}:{})});toast.success('Diperbarui')}else{await addDoc(collection(db,'berita'),{judul,isi,foto,penulis:user?.email||'anonim',createdAt:serverTimestamp()});toast.success('Ditambahkan')}reset();loadList()}catch(e){toast.error(e.message)}};
  const hapus=async(id)=>{if(!CAN(role)) return toast.error('Akses ditolak');if(!confirm('Hapus berita?'))return;await deleteDoc(doc(db,'berita',id));toast.success('Terhapus');loadList()};
  const edit=(b)=>{setEditId(b.id);setJudul(b.judul||'');setIsi(b.isi||'');};
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><div>
    <div className='card'>
      <h2>📰 Berita</h2>
      <input placeholder='Judul' value={judul} onChange={e=>setJudul(e.target.value)} />
      <textarea rows={6} placeholder='Isi berita' value={isi} onChange={e=>setIsi(e.target.value)} />
      <UploadButton onUploaded={(urls)=>setFoto(urls)} />
      {foto.length>0&&<p className='note'>{foto.length} foto siap diunggah</p>}
      <div className='row'><button className='btn btn-primary' onClick={save} disabled={!CAN(role)}>{editId?'Perbarui':'Simpan'}</button>{editId&&<button className='btn btn-ghost' onClick={reset}>Batal</button>}</div>
    </div>
    <div className='grid grid-2'>
      {list.map(b=>(<div key={b.id} className='card'>{Array.isArray(b.foto)&&b.foto[0]&&<img className='thumb' src={b.foto[0]} alt={b.judul}/>}<h3>{b.judul}</h3><p>{(b.isi||'').slice(0,160)}...</p><a className='btn btn-ghost' href={`/berita/${b.id}`}>Selengkapnya</a>{CAN(role)&&(<><button className='btn btn-ghost' onClick={()=>edit(b)}>Edit</button><button className='btn btn-ghost' onClick={()=>hapus(b.id)}>Hapus</button></>)}</div>))}
      {list.length===0&&<p className='note'>Belum ada berita.</p>}
    </div>
  </div></div>);
}
