"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ===================== 🔐 CONTEXT ===================== */
const AuthContext = createContext();

/**
 * Provider global untuk seluruh app — menangani user, role, dan status login
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("anggota");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        // Buat data user baru jika belum ada di Firestore
        if (!snap.exists()) {
          await setDoc(ref, {
            email: u.email,
            role: "anggota",
            createdAt: new Date().toISOString(),
          });
          setRole("anggota");
        } else {
          setRole(snap.data().role || "anggota");
        }
      } else {
        setUser(null);
        setRole("anggota");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ===================== 🎯 HOOK ===================== */
export function useAuth() {
  return useContext(AuthContext);
}

/* ===================== 🧩 FUNGSI LOGIN/REGISTER ===================== */
export async function registerUser(email, password) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "anggota",
    createdAt: new Date().toISOString(),
  });
  return user;
}

export async function loginUser(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
  alert("📧 Email reset password telah dikirim!");
}
