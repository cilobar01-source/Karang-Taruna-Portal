// lib/auth.js
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

setPersistence(auth, browserLocalPersistence);

// === Register ===
export async function registerUser(email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "anggota",
        createdAt: new Date().toISOString(),
      });
    }
    return user;
  } catch (err) {
    alert("❌ Gagal daftar: " + err.message);
  }
}

// === Login ===
export async function loginUser(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (err) {
    alert("❌ Login gagal: " + err.message);
  }
}

// === Logout ===
export async function logoutUser() {
  await signOut(auth);
  console.log("✅ Logout sukses");
}

// === Listener ===
export function onAuth(callback) {
  onAuthStateChanged(auth, callback);
}
