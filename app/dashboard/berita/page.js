"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
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
import { onAuthStateChanged } from "firebase/auth";

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) return (window.location.href = "/");
      setUser(u);
    });
    loadBerita();
  }, []);

  async function loadBerita() {
    const snap = await getDocs(query(collection(db, "berita"), orderBy("createdAt", "desc")));
    setBerita(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function handleSave(e) {
    e.preventDefault();
    const file = e.target.foto.files[0];
    let foto = "";
    if (file) foto = await uploadToCloudinary(file);
    await addDoc(collection(db, "berita"), {
      judul: e.target.judul.value,
      isi: e.target.isi.value,
      foto,
      penulis: user?.email,
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadBerita();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus berita ini?")) return;
    await deleteDoc(doc(db, "berita", id));
    loadBerita();
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">📰 Berita</h1>

      <form onSubmit={handleSave} className="bg-white p-4 rounded-lg shadow mb-6">
        <input name="judul" placeholder="Judul Berita" className="border p-2 w-full mb-2" />
        <textarea name="isi" placeholder="Isi Berita" className="border p-2 w-full mb-2"></textarea>
        <input type="file" name="foto" accept="image/*" className="mb-2" />
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md">Simpan</button>
      </form>

      <div className="grid gap-3">
        {berita.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-lg shadow">
            {b.foto && <img src={b.foto} className="w-full rounded mb-2" />}
            <h3 className="font-bold">{b.judul}</h3>
            <p className="whitespace-pre-line">{b.isi}</p>
            <small className="text-gray-600">✍️ {b.penulis}</small>
            <button onClick={() => handleDelete(b.id)} className="text-red-600 ml-3">
              🗑️ Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}