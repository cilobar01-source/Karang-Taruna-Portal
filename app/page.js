"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";

export default function Home() {
  const [peng, setPeng] = useState([]);
  const [berita, setBerita] = useState([]);
  const [umkm, setUmkm] = useState([]);
  const [kasTotal, setKasTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const ps = await getDocs(
          query(collection(db, "pengumuman"), orderBy("createdAt", "desc"))
        );
        setPeng(ps.docs.map((d) => ({ id: d.id, ...d.data() })));

        const bs = await getDocs(
          query(collection(db, "berita"), orderBy("createdAt", "desc"))
        );
        setBerita(bs.docs.map((d) => ({ id: d.id, ...d.data() })));

        const us = await getDocs(
          query(collection(db, "umkm"), orderBy("createdAt", "desc"))
        );
        setUmkm(us.docs.map((d) => ({ id: d.id, ...d.data() })));

        const ks = await getDocs(collection(db, "kas"));
        let total = 0;
        ks.forEach((doc) => {
          const k = doc.data();
          total += (k.tipe === "masuk" ? 1 : -1) * (k.jumlah || 0);
        });
        setKasTotal(total);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />

      <main className="fade-in" style={{ marginBottom: "2rem" }}>
        <section className="container intro">
          <div className="card hero-card">
            <h1>Portal Karang Taruna</h1>
            <p className="note">
              RT01/RW08 Kelurahan Kemijen, Kecamatan Semarang Timur.
            </p>
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            ⏳ Memuat data...
          </p>
        ) : (
          <>
            {/* === Pengumuman === */}
            <section id="pengumuman" className="container">
              <h2 className="section-title">📢 Pengumuman</h2>
              <div className="grid grid-2">
                {peng.length > 0 ? (
                  peng.slice(0, 4).map((p) => (
                    <motion.div
                      whileHover={{ y: -4 }}
                      key={p.id}
                      className="card hover-card"
                    >
                      <h3>{p.judul || "(Tanpa judul)"}</h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {(p.isi || "").slice(0, 200)}...
                      </p>
                      <Link
                        className="btn btn-primary"
                        href={`/pengumuman/${p.id}`}
                      >
                        Lihat Selengkapnya
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="note">Belum ada pengumuman.</p>
                )}
              </div>
            </section>

            {/* === Berita === */}
            <section id="berita" className="container">
              <h2 className="section-title">📰 Berita</h2>
              <div className="grid grid-3">
                {berita.length > 0 ? (
                  berita.slice(0, 6).map((b) => (
                    <motion.div
                      whileHover={{ y: -4 }}
                      key={b.id}
                      className="card hover-card"
                    >
                      {Array.isArray(b.foto) && b.foto[0] && (
                        <img className="thumb" src={b.foto[0]} alt={b.judul} />
                      )}
                      <h3>{b.judul}</h3>
                      <p>{(b.isi || "").slice(0, 180)}...</p>
                      <Link
                        className="btn btn-primary"
                        href={`/berita/${b.id}`}
                      >
                        Selengkapnya
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="note">Belum ada berita.</p>
                )}
              </div>
            </section>

            {/* === UMKM === */}
            <section id="umkm" className="container">
              <h2 className="section-title">🏪 Produk UMKM</h2>
              <div className="grid grid-3">
                {umkm.length > 0 ? (
                  umkm.slice(0, 6).map((u) => (
                    <motion.div
                      whileHover={{ y: -4 }}
                      key={u.id}
                      className="card hover-card"
                    >
                      {Array.isArray(u.foto) && u.foto[0] && (
                        <img className="thumb" src={u.foto[0]} alt={u.produk} />
                      )}
                      <h3>{u.produk}</h3>
                      <p>
                        👤 {u.penjual || "Tanpa Nama"} • 💰 Rp{" "}
                        {(u.harga || 0).toLocaleString()}
                      </p>
                      {u.wa && (
                        <a
                          className="btn btn-ghost"
                          href={`https://wa.me/${u.wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Hubungi Penjual
                        </a>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="note">Belum ada produk.</p>
                )}
              </div>
            </section>

            {/* === Ringkasan Kas === */}
            <section id="kas" className="container">
              <h2 className="section-title">💰 Ringkasan Kas</h2>
              <div className="card center-card">
                <div className="badge">Total Kas</div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    marginTop: 6,
                  }}
                >
                  Rp {kasTotal.toLocaleString("id-ID")}
                </div>
                <p className="note">
                  Detail transaksi tersedia untuk anggota yang login di
                  Dashboard.
                </p>
              </div>
            </section>
          </>
        )}

        <footer style={{ textAlign: "center", marginTop: "2rem" }}>
          <p>© 2025 KARTEJI Cilosari Barat RT01/RW08 Semarang</p>
        </footer>
      </main>
    </>
  );
}