"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, setDoc
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("anggota");
  const [menu, setMenu] = useState("profil");

  // ==== DATA STATES ====
  const [profil, setProfil] = useState({ nama: "", foto: "" });
  const [berita, setBerita] = useState([]);
  const [umkm, setUmkm] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [kas, setKas] = useState([]);

  // ==== AUTH ====
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const uref = doc(db, "users", u.uid);
        const usnap = await getDoc(uref);
        const udata = usnap.exists() ? usnap.data() : {};
        setRole(udata.role || "anggota");
      } else {
        window.location.href = "/";
      }
    });
    return () => unsub();
  }, []);

  // ==== LOGOUT ====
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // ==== LOAD DATA ====
  useEffect(() => {
    if (role) {
      loadPengumuman();
      loadBerita();
      loadUmkm();
      loadKas();
    }
  }, [role]);

  const can = {
    super: () => role === "super_admin",
    pengumuman: () => ["super_admin", "admin", "admin_pengumuman"].includes(role),
    berita: () => ["super_admin", "admin", "admin_berita"].includes(role),
    umkm: () => ["super_admin", "admin", "admin_umkm"].includes(role),
    kas: () => ["super_admin", "admin", "admin_keuangan"].includes(role),
    anggota: () => ["super_admin", "admin"].includes(role),
  };

  // ==== PROFIL ====
  const handleSaveProfil = async (e) => {
    e.preventDefault();
    const file = e.target.foto.files[0];
    let foto = profil.foto;

    if (file) foto = await uploadToCloudinary(file);

    await setDoc(doc(db, "users", user.uid), {
      nama: e.target.nama.value,
      ...(foto && { foto }),
    }, { merge: true });

    alert("Profil diperbarui!");
  };

  // ==== CRUD PENGUMUMAN ====
  async function loadPengumuman() {
    const snap = await getDocs(query(collection(db, "pengumuman"), orderBy("createdAt", "desc")));
    setPengumuman(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  async function simpanPengumuman(e) {
    e.preventDefault();
    if (!can.pengumuman()) return alert("Akses ditolak!");
    const judul = e.target.judul.value;
    const isi = e.target.isi.value;
    await addDoc(collection(db, "pengumuman"), {
      judul,
      isi,
      tanggal: new Date().toLocaleDateString("id-ID"),
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadPengumuman();
  }
  async function hapusPengumuman(id) {
    if (!can.pengumuman()) return;
    if (!confirm("Hapus pengumuman ini?")) return;
    await deleteDoc(doc(db, "pengumuman", id));
    loadPengumuman();
  }

  // ==== CRUD BERITA ====
  async function loadBerita() {
    const snap = await getDocs(query(collection(db, "berita"), orderBy("createdAt", "desc")));
    setBerita(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  async function simpanBerita(e) {
    e.preventDefault();
    if (!can.berita()) return alert("Akses ditolak!");
    const file = e.target.foto.files[0];
    let foto = "";
    if (file) foto = await uploadToCloudinary(file);

    await addDoc(collection(db, "berita"), {
      judul: e.target.judul.value,
      isi: e.target.isi.value,
      foto,
      penulis: user?.email || "anonim",
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadBerita();
  }
  async function hapusBerita(id) {
    if (!can.berita()) return;
    if (!confirm("Hapus berita ini?")) return;
    await deleteDoc(doc(db, "berita", id));
    loadBerita();
  }

  // ==== CRUD UMKM ====
  async function loadUmkm() {
    const snap = await getDocs(query(collection(db, "umkm"), orderBy("createdAt", "desc")));
    setUmkm(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  async function simpanUmkm(e) {
    e.preventDefault();
    if (!can.umkm()) return alert("Akses ditolak!");
    const file = e.target.foto.files[0];
    let foto = "";
    if (file) foto = await uploadToCloudinary(file);

    await addDoc(collection(db, "umkm"), {
      produk: e.target.produk.value,
      penjual: e.target.penjual.value,
      harga: Number(e.target.harga.value || 0),
      wa: e.target.wa.value,
      deskripsi: e.target.deskripsi.value,
      foto,
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadUmkm();
  }
  async function hapusUmkm(id) {
    if (!can.umkm()) return;
    if (!confirm("Hapus produk ini?")) return;
    await deleteDoc(doc(db, "umkm", id));
    loadUmkm();
  }

  // ==== KAS ====
  async function loadKas() {
    const snap = await getDocs(query(collection(db, "kas"), orderBy("createdAt", "desc")));
    setKas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  async function simpanKas(e) {
    e.preventDefault();
    if (!can.kas()) return alert("Akses ditolak!");
    const jumlah = Number(e.target.jumlah.value || 0);
    await addDoc(collection(db, "kas"), {
      nama: e.target.nama.value,
      tanggal: e.target.tanggal.value || new Date().toISOString().split("T")[0],
      jumlah,
      tipe: e.target.tipe.value,
      keterangan: e.target.ket.value,
      dibuatOleh: user?.email,
      createdAt: serverTimestamp(),
    });
    e.target.reset();
    loadKas();
  }
  async function hapusKas(id) {
    if (!can.kas()) return;
    if (!confirm("Hapus transaksi kas ini?")) return;
    await deleteDoc(doc(db, "kas", id));
    loadKas();
  }

  // ==== UI ====
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <header className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-lg shadow">
        <h1 className="font-bold text-lg">Dashboard Karang Taruna</h1>
        <button onClick={handleLogout} className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-md font-semibold">
          Keluar
        </button>
      </header>

      <nav className="flex gap-2 mt-4 flex-wrap">
        {["profil", "pengumuman", "berita", "umkm", "kas"].map((m) => (
          <button
            key={m}
            onClick={() => setMenu(m)}
            className={`px-3 py-2 rounded-md font-semibold ${menu === m ? "bg-yellow-400 text-blue-900" : "bg-blue-800 text-white"}`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </nav>

      <section className="mt-6">
        {/* === PROFIL === */}
        {menu === "profil" && (
          <form onSubmit={handleSaveProfil} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-3">👤 Profil Saya</h2>
            <input name="nama" placeholder="Nama Lengkap" className="border p-2 w-full mb-2" />
            <input type="file" name="foto" accept="image/*" className="mb-2" />
            <button className="bg-blue-800 text-white px-4 py-2 rounded-md font-semibold">Simpan</button>
          </form>
        )}

        {/* === PENGUMUMAN === */}
        {menu === "pengumuman" && (
          <div>
            {can.pengumuman() && (
              <form onSubmit={simpanPengumuman} className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-bold mb-3">📢 Tambah Pengumuman</h2>
                <input name="judul" placeholder="Judul Pengumuman" className="border p-2 w-full mb-2" />
                <textarea name="isi" placeholder="Isi Pengumuman" className="border p-2 w-full mb-2"></textarea>
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md">Simpan</button>
              </form>
            )}
            <div className="grid gap-3">
              {pengumuman.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold">{p.judul}</h3>
                  <p className="whitespace-pre-line">{p.isi}</p>
                  <small className="text-gray-500">📅 {p.tanggal}</small>
                  {can.pengumuman() && (
                    <button onClick={() => hapusPengumuman(p.id)} className="text-red-600 ml-3">🗑️ Hapus</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BERITA === */}
        {menu === "berita" && (
          <div>
            {can.berita() && (
              <form onSubmit={simpanBerita} className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-bold mb-3">📰 Tambah Berita</h2>
                <input name="judul" placeholder="Judul" className="border p-2 w-full mb-2" />
                <textarea name="isi" placeholder="Isi Berita" className="border p-2 w-full mb-2"></textarea>
                <input type="file" name="foto" accept="image/*" className="mb-2" />
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md">Simpan</button>
              </form>
            )}
            <div className="grid gap-3">
              {berita.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-lg shadow">
                  {b.foto && <img src={b.foto} alt="" className="rounded mb-2" />}
                  <h3 className="font-bold">{b.judul}</h3>
                  <p className="whitespace-pre-line">{b.isi}</p>
                  {can.berita() && (
                    <button onClick={() => hapusBerita(b.id)} className="text-red-600 mt-2">🗑️ Hapus</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === UMKM === */}
        {menu === "umkm" && (
          <div>
            {can.umkm() && (
              <form onSubmit={simpanUmkm} className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-bold mb-3">🏪 Tambah Produk</h2>
                <input name="produk" placeholder="Nama Produk" className="border p-2 w-full mb-2" />
                <input name="penjual" placeholder="Nama Penjual" className="border p-2 w-full mb-2" />
                <input name="harga" type="number" placeholder="Harga (Rp)" className="border p-2 w-full mb-2" />
                <input name="wa" placeholder="Nomor WhatsApp" className="border p-2 w-full mb-2" />
                <textarea name="deskripsi" placeholder="Deskripsi" className="border p-2 w-full mb-2"></textarea>
                <input type="file" name="foto" accept="image/*" className="mb-2" />
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md">Simpan</button>
              </form>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {umkm.map((u) => (
                <div key={u.id} className="bg-white p-4 rounded-lg shadow">
                  {u.foto && <img src={u.foto} alt="" className="rounded mb-2" />}
                  <h3 className="font-bold">{u.produk}</h3>
                  <p>👤 {u.penjual}</p>
                  <p>💰 Rp{u.harga?.toLocaleString()}</p>
                  <p>{u.deskripsi}</p>
                  {can.umkm() && (
                    <button onClick={() => hapusUmkm(u.id)} className="text-red-600 mt-2">🗑️ Hapus</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === KAS === */}
        {menu === "kas" && (
          <div>
            {can.kas() && (
              <form onSubmit={simpanKas} className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-bold mb-3">💰 Tambah Kas</h2>
                <input name="nama" placeholder="Nama Pembayar" className="border p-2 w-full mb-2" />
                <input name="tanggal" type="date" className="border p-2 w-full mb-2" />
                <input name="jumlah" type="number" placeholder="Jumlah (Rp)" className="border p-2 w-full mb-2" />
                <select name="tipe" className="border p-2 w-full mb-2">
                  <option value="masuk">Pemasukan</option>
                  <option value="keluar">Pengeluaran</option>
                </select>
                <input name="ket" placeholder="Keterangan" className="border p-2 w-full mb-2" />
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md">Simpan</button>
              </form>
            )}
            <div className="grid gap-3">
              {kas.map((k) => (
                <div key={k.id} className="bg-white p-4 rounded-lg shadow">
                  <p><b>{k.tipe === "masuk" ? "🟢" : "🔴"} Rp{(k.jumlah || 0).toLocaleString()}</b></p>
                  <p>👤 {k.nama} • 📅 {k.tanggal}</p>
                  <p className="text-gray-600">{k.keterangan}</p>
                  {can.kas() && (
                    <button onClick={() => hapusKas(k.id)} className="text-red-600 mt-2">🗑️ Hapus</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}