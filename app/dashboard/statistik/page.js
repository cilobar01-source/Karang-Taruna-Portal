"use client";
import { useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement,BarElement,CategoryScale,LinearScale,Tooltip,Legend);
export default function Statistik(){
  const pieRef=useRef(null); const barRef=useRef(null); const roleRef=useRef('anggota');
  useEffect(()=>{const unsub=onAuthStateChanged(auth, async (u)=>{
    if(!u){window.location.href='/login';return;}
    const s=await getDoc(doc(db,'users',u.uid)); roleRef.current=s.exists()?(s.data().role||'anggota'):'anggota';
    loadCharts();
  });return ()=>unsub()},[]);
  const loadCharts=async()=>{
    const ks=await getDocs(collection(db,'kas')); let masuk=0,keluar=0;
    ks.forEach(d=>{const k=d.data(); if(k.tipe==='masuk') masuk+=k.jumlah||0; else keluar+=k.jumlah||0;});
    if(pieRef.current){new Chart(pieRef.current,{type:'pie',data:{labels:['Masuk','Keluar'],datasets:[{data:[masuk,keluar]}]},options:{plugins:{legend:{position:'bottom'}}}})}
    if(barRef.current){new Chart(barRef.current,{type:'bar',data:{labels:['Saldo'],datasets:[{label:'Rp',data:[masuk-keluar]}]},options:{plugins:{legend:{display:false}}}})}
  };
  return(<div className='dashboard'><Sidebar role={roleRef.current}/><div><div className='card'><h2>📊 Statistik Keuangan</h2><div className='grid grid-2'><canvas ref={pieRef} height='220'></canvas><canvas ref={barRef} height='220'></canvas></div></div></div></div>);
}
