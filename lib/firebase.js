// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyCgJC8OQBG_wQt57tZHfNuVKPb2VVlAalI",
  authDomain: "karang-taruna-aadaf.firebaseapp.com",
  projectId: "karang-taruna-aadaf",
  storageBucket: "karang-taruna-aadaf.appspot.com", // ← perbaikan di sini
  messagingSenderId: "367208001887",
  appId: "1:367208001887:web:bce5982d99edefb7e746ea"
};

// === Inisialisasi Firebase ===
const app = initializeApp(firebaseConfig);

// === Ekspor modul utama ===
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
