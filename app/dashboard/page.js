"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
const ROLES=['super_admin','ketua','wakil_ketua','sekretaris','bendahara','koordinator_umkm','koordinator_kegiatan','anggota'];
export default function PanelAnggota(){
  const [me,setMe]=useState(null); const [role,setRole]=useState('anggota'); const [users,setUsers]=useState([]);
  useEffect(()=>{const unsub=onAuthStateChanged(auth,async u=>{if(!u){window.location.href='/login';return;}const snap=await getDoc(doc(db,'users',u.uid));const r=snap.exists()?(snap.data().role||'anggota'):'anggota';setMe(u);setRole(r);const list=await getDocs(collection(db,'users'));setUsers(list.docs.map(d=>({id:d.id,...d.data()})))});return ()=>unsub()},[]);
  const isSuper=role==='super_admin'; const saveRole=async(id,newRole)=>{if(!isSuper) return toast.error('Hanya Super Admin');await updateDoc(doc(db,'users',id),{role:newRole});toast.success('Role diperbarui')};
  if(!me) return <main className='container'><p className='note'>Memuat...</p></main>;
  return(<div className='dashboard'><Sidebar role={role}/><main className='container'><h1>👥 Manajemen Anggota</h1><p className='note'>Hanya Super Admin yang dapat mengubah role.</p><div className='grid grid-2'>{users.map(u=>(<div key={u.id} className='card'><b>{u.nama||'(Tanpa nama)'}</b><p>{u.email}</p><span className='badge'>{u.role||'anggota'}</span><div className='row'><select defaultValue={u.role} disabled={!isSuper} onChange={(e)=>saveRole(u.id,e.target.value)}>{ROLES.map(r=>(<option key={r} value={r}>{r}</option>))}</select></div></div>))}</div></main></div>);
}
