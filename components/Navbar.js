"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="fade-in">
      <div className="nav-container">
        <h1>KARTEJI</h1>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>

        {/* NAVIGATION */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link href="/">Beranda</Link>
          <Link href="/berita">Berita</Link>
          <Link href="/umkm">UMKM</Link>
          <Link href="/agenda">Agenda</Link>
          <Link href="/pengumuman">Pengumuman</Link>

          {user ? (
            <>
              <Link href="/profil">Profil</Link>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={logout} className="btn-outline">
                Keluar
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary">
              Masuk / Daftar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}