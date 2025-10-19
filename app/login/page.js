"use client";
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  // Membuat dokumen user di Firestore jika belum ada
  const ensureUserDoc = async (uid, email) => {
    const uref = doc(db, 'users', uid);
    const snap = await getDoc(uref);
    if (!snap.exists()) {
      await setDoc(
        uref,
        {
          email,
          role: 'anggota', // default role
          createdAt: serverTimestamp()
        },
        { merge: true }
      );
    }
  };

  // Login
  const doLogin = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(user.uid, user.email);
      toast.success('Berhasil masuk ✅');
      window.location.href = '/dashboard';
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Daftar
  const doRegister = async () => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await ensureUserDoc(user.uid, user.email);
      toast.success('Pendaftaran berhasil 🎉');
      window.location.href = '/dashboard';
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const doReset = async () => {
    if (!email) return toast('Isi email dulu');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Link reset telah dikirim ke email 📧');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--gold)', textAlign: 'center' }}>Masuk ke Portal</h1>
        <p className="note" style={{ textAlign: 'center' }}>
          Portal Karang Taruna Cilosari Barat RT01/RW08
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

        <div className="row" style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={doLogin}
            disabled={loading}
          >
            Masuk
          </button>
          <button
            className="btn btn-ghost"
            onClick={doRegister}
            disabled={loading}
          >
            Daftar
          </button>
        </div>

        <button
          className="btn btn-ghost"
          style={{
            width: '100%',
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.06)'
          }}
          onClick={doReset}
          disabled={loading}
        >
          Lupa Password?
        </button>
      </div>
    </main>
  );
}
