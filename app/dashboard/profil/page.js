"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const [profil, setProfil] = useState({ nama: "", foto: "" });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return (window.location.href = "/");
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setProfil(snap.data());
    });
    return () => unsub();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    const file = e.target.foto.files[0];
    let foto = profil.foto;

    if (file) foto = await uploadToCloudinary(file);

    await setDoc(
      doc(db, "users", user.uid),
      { nama: e.target.nama.value, ...(foto && { foto }) },
      { merge: true }
    );
    alert("✅ Profil disimpan!");
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">👤 Profil Saya</h1>
      <form onSubmit={handleSave} className="bg-white p-4 rounded-lg shadow">
        <input
          name="nama"
          placeholder="Nama Lengkap"
          defaultValue={profil.nama}
          className="border p-2 w-full mb-2"
        />
        <input type="file" name="foto" accept="image/*" className="mb-2" />
        {profil.foto && (
          <img src={profil.foto} className="w-32 h-32 rounded-full object-cover mb-3" />
        )}
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md">
          Simpan Profil
        </button>
      </form>
    </div>
  );
}
