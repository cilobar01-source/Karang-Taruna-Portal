"use client";
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard(){
  const [user,setUser]=useState(null);
  const [role,setRole]=useState('anggota');
  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,async(u)=>{
      if(!u){window.location.href='/login';return;}
      setUser(u);
      const snap=await getDoc(doc(db,'users',u.uid));
      if(snap.exists()) setRole(snap.data().role||'anggota');
    });
    return ()=>unsub();
  },[]);
  if(!user) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'>
    <Sidebar role={role}/>
    <div>
      <div className='card'>
        <h2>Halo, {user.email}</h2>
        <p className='note'>Role: <span className='badge'>{role}</span></p>
        <div className='row'>
          <Link className='btn btn-primary' href='/dashboard/pengumuman'>Pengumuman</Link>
          <Link className='btn btn-primary' href='/dashboard/berita'>Berita</Link>
          <Link className='btn btn-primary' href='/dashboard/umkm'>UMKM</Link>
          <Link className='btn btn-primary' href='/dashboard/kas'>Kas</Link>
          <Link className='btn btn-primary' href='/dashboard/agenda'>Agenda</Link>
          {role==='super_admin'&&<Link className='btn btn-primary' href='/dashboard/anggota'>Anggota</Link>}
          <Link className='btn btn-primary' href='/dashboard/statistik'>Statistik</Link>
        </div>
      </div>
    </div>
  </div>);
}
