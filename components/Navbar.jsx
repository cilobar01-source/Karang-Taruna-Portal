"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Deteksi scroll → ubah bayangan dan transparansi
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setOpen(!open);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: scrolled
          ? "rgba(11,19,43,0.95)"
          : "linear-gradient(90deg, rgba(11,19,43,0.85), rgba(24,40,72,0.85))",
        boxShadow: scrolled
          ? "0 2px 12px rgba(246,196,69,0.2)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(246,196,69,0.15)",
        color: "#f6c445",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.7rem 1.2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* === LOGO KARTEJI === */}
        <motion.div
          whileHover={{ scale: 1.05, rotateZ: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              letterSpacing: "1px",
              background:
                "linear-gradient(90deg, #f6c445 10%, #4da8da 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 0 10px rgba(246,196,69,0.5), 0 0 20px rgba(77,168,218,0.3)",
            }}
          >
            KARTEJI
          </Link>
        </motion.div>

        {/* === DESKTOP MENU === */}
        <div
          className="menu-desktop"
          style={{
            display: "flex",
            gap: "1.4rem",
            alignItems: "center",
          }}
        >
          <Link href="/#pengumuman" className="nav-link">
            📢 Pengumuman
          </Link>
          <Link href="/#berita" className="nav-link">
            📰 Berita
          </Link>
          <Link href="/#umkm" className="nav-link">
            🏪 Produk
          </Link>
          <Link href="/login" className="nav-link">
            🔑 Masuk
          </Link>
        </div>

        {/* === HAMBURGER === */}
        <button
          onClick={toggleMenu}
          style={{
            background: "none",
            border: "none",
            color: "#f6c445",
            fontSize: "1.8rem",
            cursor: "pointer",
            display: "none",
          }}
          className="menu-btn"
        >
          ☰
        </button>
      </div>

      {/* === MOBILE MENU === */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "rgba(11,19,43,0.98)",
            borderTop: "1px solid rgba(246,196,69,0.2)",
            textAlign: "center",
            padding: "1rem 0",
          }}
        >
          <Link href="/#pengumuman" onClick={toggleMenu} className="nav-item">
            📢 Pengumuman
          </Link>
          <br />
          <Link href="/#berita" onClick={toggleMenu} className="nav-item">
            📰 Berita
          </Link>
          <br />
          <Link href="/#umkm" onClick={toggleMenu} className="nav-item">
            🏪 Produk
          </Link>
          <br />
          <Link href="/login" onClick={toggleMenu} className="nav-item">
            🔑 Masuk
          </Link>
        </motion.div>
      )}

      {/* === RESPONSIVE STYLING === */}
      <style jsx>{`
        @media (max-width: 768px) {
          .menu-desktop {
            display: none;
          }
          .menu-btn {
            display: block !important;
          }
        }
        .nav-link {
          color: #f6c445;
          font-weight: 500;
          transition: all 0.25s;
        }
        .nav-link:hover {
          text-shadow: 0 0 8px rgba(246, 196, 69, 0.8);
        }
      `}</style>
    </motion.nav>
  );
}
