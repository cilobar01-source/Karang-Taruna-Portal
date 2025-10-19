"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <nav
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
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.2rem" }}>
          KARTEJI
        </Link>

        {/* Hamburger */}
        <button
          onClick={toggleMenu}
          style={{
            background: "none",
            border: "none",
            color: "#f6c445",
            fontSize: "1.6rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
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
          <Link href="/#pengumuman" onClick={toggleMenu}>
            📢 Pengumuman
          </Link>
          <br />
          <Link href="/#berita" onClick={toggleMenu}>
            📰 Berita
          </Link>
          <br />
          <Link href="/#umkm" onClick={toggleMenu}>
            🏪 UMKM
          </Link>
          <br />
          <Link href="/login" onClick={toggleMenu}>
            🔑 Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
