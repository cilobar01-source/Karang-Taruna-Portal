"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const particles = useRef([]);

  // ---- Partikel cahaya emas (canvas) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const createParticle = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.8 + 0.2,
    });

    particles.current = Array.from({ length: 80 }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,196,69,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // ---- Membuat dokumen user di Firestore ----
  const ensureUserDoc = async (uid, email) => {
    const uref = doc(db, "users", uid);
    const snap = await getDoc(uref);
    if (!snap.exists()) {
      await setDoc(
        uref,
        { email, role: "anggota", createdAt: serverTimestamp() },
        { merge: true }
      );
    }
  };

  // ---- Login, Register, Reset ----
  const doLogin = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(user.uid, user.email);
      toast.success("Berhasil masuk ✅");
      window.location.href = "/dashboard";
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async () => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(user.uid, user.email);
      toast.success("Pendaftaran berhasil 🎉");
      window.location.href = "/dashboard";
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const doReset = async () => {
    if (!email) return toast("Isi email dulu");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Link reset dikirim ke email 📧");
    } catch (e) {
      toast.error(e.message);
    }
  };

  // ---- Tampilan utama ----
  return (
    <main
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, rgba(246,196,69,0.15), rgba(11,19,43,1) 70%)",
      }}
    >
      {/* Canvas Partikel */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "transparent",
        }}
      ></canvas>

      {/* Card Login */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          zIndex: 1,
          width: "90%",
          maxWidth: "460px",
          padding: "2rem",
          borderRadius: "20px",
          background:
            "rgba(17,25,40,0.8) linear-gradient(145deg, rgba(246,196,69,0.05), rgba(11,19,43,0.95))",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          border: "1px solid rgba(246,196,69,0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            color: "var(--gold)",
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
          }}
        >
          Portal Karang Taruna
        </motion.h1>

        <p className="note" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          RT01 / RW08 - Cilosari Barat, Kemijen
        </p>

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Kata sandi"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <div
          className="row"
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button className="btn btn-primary" onClick={doLogin} disabled={loading}>
            {loading ? "⏳ ..." : "Masuk"}
          </button>
          <button className="btn btn-ghost" onClick={doRegister} disabled={loading}>
            Daftar
          </button>
        </div>

        <button
          className="btn btn-ghost"
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "rgba(255,255,255,0.06)",
          }}
          onClick={doReset}
          disabled={loading}
        >
          Lupa Password?
        </button>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginTop: "1.2rem",
            fontSize: "0.85rem",
          }}
        >
          © 2025 Karang Taruna Cilosari Barat
        </p>
      </motion.div>
    </main>
  );
}