"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar({role}){
  const map={
    super_admin:['profil','anggota','pengumuman','berita','umkm','kas','agenda','statistik'],
    ketua:['profil','pengumuman','berita','kas','agenda','statistik'],
    wakil_ketua:['profil','pengumuman','agenda'],
    sekretaris:['profil','pengumuman','berita'],
    bendahara:['profil','kas','statistik'],
    koordinator_umkm:['profil','umkm'],
    koordinator_kegiatan:['profil','agenda'],
    anggota:['profil']
  };
  const list=map[role]||['profil'];
  const [open,setOpen]=useState(true);
  return (
    <aside className="sidebar">
      <button className="btn btn-ghost" onClick={()=>setOpen(!open)}>{open?'Sembunyikan Menu':'Tampilkan Menu'}</button>
      {open && list.map(id=>(<Link key={id} href={`/dashboard/${id}`} className="side-item">{id.toUpperCase()}</Link>))}
    </aside>
  );
}
