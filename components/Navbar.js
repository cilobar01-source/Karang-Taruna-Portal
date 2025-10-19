"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar(){
  const [user,setUser]=useState(null);
  const [role,setRole]=useState('');
  const [clock,setClock]=useState('');
  const [wx,setWx]=useState(null);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u||null);
      if(u){
        const s=await getDoc(doc(db,'users',u.uid));
        setRole(s.exists()? (s.data().role||'anggota') : 'anggota');
      }
    });
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{
      const now=new Date();
      setClock(now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    },1000);
    return ()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    // Open-Meteo free, koordinat Semarang
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.9932&longitude=110.4203&current=temperature_2m')
      .then(r=>r.json()).then(d=>setWx(d.current)).catch(()=>{});
  },[]);

  return (
    <header className="navbar">
      <div className="logo">Karang Taruna Cilosari Barat <span className="badge">Dark-Gold</span></div>
      <nav className="menu">
        <Link href="/#pengumuman">Pengumuman</Link>
        <Link href="/#berita">Berita</Link>
        <Link href="/#umkm">UMKM</Link>
        <Link href="/#kas">Ringkasan Kas</Link>
        <span className="clock">{clock}</span>
        {wx && <span className="badge">{Math.round(wx.temperature_2m)}°C</span>}
        {user && <Link href="/dashboard">Dashboard</Link>}
        {user
          ? <button onClick={()=>signOut(auth)}>Keluar</button>
          : <Link href="/login">Masuk / Daftar</Link>}
      </nav>
    </header>
  );
}
