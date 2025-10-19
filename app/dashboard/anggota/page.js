"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import "@/styles/dashboard.css";

export default function AnggotaPage() {
  const { user, role, loading } = useAuth();
  const [anggota, setAnggota] = useState([]);

  useEffect(() => {
    if (!loading && user) loadAnggota();
  }, [user, loading]);

  const loadAnggota = async () => {
    const q = query(collection(db, "users"), orderBy("email"));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setAnggota(data);
  };

  const updateRole = async (id, newRole) => {
    if (role !== "super_admin") {
      alert("❌ Hanya super admin yang bisa mengubah role!");
      return;
    }
    await updateDoc(doc(db, "users", id), { role: newRole });
    alert("✅ Role berhasil diperbarui!");
    loadAnggota();
  };

  if (loading) return <p>Memuat data pengguna...</p>;

  return (
    <div className="panel">
      <h2>👥 Manajemen Anggota</h2>

      <div className="anggota-grid">
        {anggota.map((a) => (
          <div key={a.id} className="card">
            <div className="anggota-info">
              <img
                src={a.foto || "/icons/icon-192x192.png"}
                alt={a.nama || a.email}
                className="anggota-foto"
              />
              <div>
                <strong>{a.nama || "(Tanpa Nama)"}</strong>
                <p>{a.email}</p>
              </div>
            </div>

            <p className="role-badge">🏷️ {a.role || "anggota"}</p>

            {role === "super_admin" && (
              <select
                defaultValue={a.role}
                onChange={(e) => updateRole(a.id, e.target.value)}
                className="role-select"
              >
                <option value="anggota">anggota</option>
                <option value="admin">admin</option>
                <option value="admin_pengumuman">admin_pengumuman</option>
                <option value="admin_berita">admin_berita</option>
                <option value="admin_umkm">admin_umkm</option>
                <option value="admin_keuangan">admin_keuangan</option>
                <option value="super_admin">super_admin</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}