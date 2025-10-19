"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function UmkmPage() {
  const [umkm, setUmkm] = useState([]);

  useEffect(() => {
    loadUmkm();
  }, []);

  async function loadUmkm() {
    const snap = await getDocs(query(collection(db, "umkm"), orderBy("createdAt", "desc")));
    setUmkm(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function handleSave(e) {
    e.preventDefault();
    const file = e.target.foto.files[0];
    let foto = "";
    if (file) foto = await uploadToCloudinary(file);

    await addDoc(collection(db, "umkm"), {
      produk: e.target.produk.value,
      penjual: e.target.penjual.value,
      harga: Number(e.target.harga.value),
      deskripsi: e.target.deskripsi.value,
      wa: e.target.wa.value,
      foto,
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadUmkm();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus produk ini?")) return;
    await deleteDoc(doc(db, "umkm", id));
    loadUmkm();
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">🏪 Produk UMKM</h1>

      <form onSubmit={handleSave} className="bg-white p-4 rounded-lg shadow mb-6">
        <input name="produk" placeholder="Nama Produk" className="border p-2 w-full mb-2" />
        <input name="penjual" placeholder="Nama Penjual" className="border p-2 w-full mb-2" />
        <input name="harga" type="number" placeholder="Harga (Rp)" className="border p-2 w-full mb-2" />
        <input name="wa" placeholder="Nomor WhatsApp" className="border p-2 w-full mb-2" />
        <textarea name="deskripsi" placeholder="Deskripsi Produk" className="border p-2 w-full mb-2"></textarea>
        <input type="file" name="foto" accept="image/*" className="mb-2" />
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md">Simpan</button>
      </form>

      <div className="grid md:grid-cols-2 gap-3">
        {umkm.map((u) => (
          <div key={u.id} className="bg-white p-4 rounded-lg shadow">
            {u.foto && <img src={u.foto} className="w-full rounded mb-2" />}
            <h3 className="font-bold">{u.produk}</h3>
            <p>👤 {u.penjual}</p>
            <p>💰 Rp{(u.harga || 0).toLocaleString()}</p>
            <p>{u.deskripsi}</p>
            {u.wa && <a href={`https://wa.me/${u.wa}`} className="text-green-700" target="_blank">📱 Hubungi</a>}
            <button onClick={() => handleDelete(u.id)} className="text-red-600 ml-3">🗑️ Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}