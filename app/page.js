"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Home(){
  const [peng,setPeng]=useState([]);
  const [berita,setBerita]=useState([]);
  const [umkm,setUmkm]=useState([]);
  const [kasTotal,setKasTotal]=useState(0);

  useEffect(()=>{
    (async()=>{
      const ps=await getDocs(query(collection(db,'pengumuman'),orderBy('createdAt','desc')));
      setPeng(ps.docs.map(d=>({id:d.id,...d.data()})));
      const bs=await getDocs(query(collection(db,'berita'),orderBy('createdAt','desc')));
      setBerita(bs.docs.map(d=>({id:d.id,...d.data()})));
      const us=await getDocs(query(collection(db,'umkm'),orderBy('createdAt','desc')));
      setUmkm(us.docs.map(d=>({id:d.id,...d.data()})));
      const ks=await getDocs(collection(db,'kas'));let total=0;ks.forEach(doc=>{const k=doc.data();total+=(k.tipe==='masuk'?1:-1)*(k.jumlah||0)});setKasTotal(total);
    })();
  },[]);

  return (
    <main>
      <section className="container">
        <div className="card" style={{display:'grid',gap:'6px'}}>
          <h1 style={{margin:0}}>Portal Karang Taruna</h1>
          <p className="note">RT01/RW08 Kelurahan Kemijen, Kecamatan Semarang Timur.</p>
        </div>
      </section>

      <section id="pengumuman" className="container">
        <h2 className="section-title">📢 Pengumuman</h2>
        <div className="grid grid-2">
          {peng.slice(0,4).map(p=>(
            <motion.div whileHover={{y:-4}} key={p.id} className="card">
              <h3>{p.judul||'(Tanpa judul)'}</h3>
              <p style={{whiteSpace:'pre-line'}}>{(p.isi||'').slice(0,180)}...</p>
              <Link className="btn btn-primary" href={`/pengumuman/${p.id}`}>Lihat Selengkapnya</Link>
            </motion.div>
          ))}
          {peng.length===0 && <p className="note">Belum ada pengumuman.</p>}
        </div>
      </section>

      <section id="berita" className="container">
        <h2 className="section-title">📰 Berita</h2>
        <div className="grid grid-3">
          {berita.slice(0,6).map(b=>(
            <motion.div whileHover={{y:-4}} key={b.id} className="card">
              {Array.isArray(b.foto)&&b.foto[0]&&<img className="thumb" src={b.foto[0]} alt={b.judul}/>}
              <h3>{b.judul}</h3>
              <p>{(b.isi||'').slice(0,150)}...</p>
              <Link className="btn btn-primary" href={`/berita/${b.id}`}>Selengkapnya</Link>
            </motion.div>
          ))}
          {berita.length===0 && <p className="note">Belum ada berita.</p>}
        </div>
      </section>

      <section id="umkm" className="container">
        <h2 className="section-title">🏪 Produk</h2>
        <div className="grid grid-3">
          {umkm.slice(0,6).map(u=>(
            <motion.div whileHover={{y:-4}} key={u.id} className="card">
              {Array.isArray(u.foto)&&u.foto[0]&&<img className="thumb" src={u.foto[0]} alt={u.produk}/>}
              <h3>{u.produk}</h3>
              <p>👤 {u.penjual} • 💰 Rp{(u.harga||0).toLocaleString()}</p>
              {u.wa && <a className="btn btn-ghost" href={`https://wa.me/${u.wa}`} target="_blank">Hubungi</a>}
            </motion.div>
          ))}
          {umkm.length===0 && <p className="note">Belum ada produk.</p>}
        </div>
      </section>

      <section id="kas" className="container">
        <h2 className="section-title">💰 Ringkasan Kas</h2>
        <div className="card">
          <div className="badge">Total Kas</div>
          <div style={{fontSize:'1.6rem',marginTop:6}}>Rp {kasTotal.toLocaleString()}</div>
          <p className="note">Detail transaksi tersedia untuk anggota di Dashboard.</p>
        </div>
      </section>
    </main>
  );
}
