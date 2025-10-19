"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function DetailBerita(){
  const {id}=useParams();
  const [data,setData]=useState(null);
  useEffect(()=>{(async()=>{const snap=await getDoc(doc(db,'berita',id));if(snap.exists()) setData(snap.data())})()},[id]);
  if(!data) return <main className='container'><p className='note'>Memuat...</p></main>;
  return (<main className='container'>
    <div className='card'>
      <h1>{data.judul}</h1>
      {Array.isArray(data.foto)&&data.foto[0]&&<img className='thumb' src={data.foto[0]} alt={data.judul}/>}
      <div style={{whiteSpace:'pre-line',marginTop:'1rem'}}>{data.isi}</div>
      <Link className='btn btn-ghost' href='/' style={{marginTop:'1rem',display:'inline-block'}}>⬅ Kembali</Link>
    </div>
  </main>);
}
