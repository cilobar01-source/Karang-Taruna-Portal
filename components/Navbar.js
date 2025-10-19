"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav
      className="navbar"
      style={{
        background: "linear-gradient(90deg, #0b132b, #182848)",
        color: "#f6c445",
        padding: "0.8rem 1rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="nav-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link href="/" className="nav-logo" style={{ fontWeight: 700 }}>
          KARTEJI
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="hamburger"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#f6c445",
            fontSize: "1.5rem",
            display: "block",
          }}
        >
          ☰
        </button>

        {/* Menu (Desktop) */}
        <div
          className="nav-links"
          style={{
            display: "none",
          }}
        >
          <Link href="/#pengumuman" className="nav-item">
            Pengumuman
          </Link>
          <Link href="/#berita" className="nav-item">
            Berita
          </Link>
          <Link href="/#umkm" className="nav-item">
            UMKM
          </Link>
          <Link href="/login" className="nav-item">
            Login
          </Link>
        </div>
      </div>

      {/* Menu (Mobile) */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#0b132b",
            padding: "1rem",
            textAlign: "center",
            borderTop: "1px solid rgba(246,196,69,0.3)",
          }}
        >
          <Link href="/#pengumuman" className="nav-item" onClick={toggleMenu}>
            📢 Pengumuman
          </Link>
          <br />
          <Link href="/#berita" className="nav-item" onClick={toggleMenu}>
            📰 Berita
          </Link>
          <br />
          <Link href="/#umkm" className="nav-item" onClick={toggleMenu}>
            🏪 UMKM
          </Link>
          <br />
          <Link href="/login" className="nav-item" onClick={toggleMenu}>
            🔑 Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
}