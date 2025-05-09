// Firebase core ve servislerini içe aktar
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"  // <-- Firestore için gerekli

// Firebase yapılandırman
const firebaseConfig = {
  apiKey: "AIzaSyAwFANFNsvf7EdkoKBWJGj1tfB3S85JCR4",
  authDomain: "satis-otomasyon.firebaseapp.com",
  projectId: "satis-otomasyon",
  storageBucket: "satis-otomasyon.firebasestorage.app",
  messagingSenderId: "268059513332",
  appId: "1:268059513332:web:088dbf2f8d92597b05e9a1",
  measurementId: "G-4DMYNNFF3W"
}

// Uygulamayı başlat
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Firestore'u başlat ve dışa aktar
const db = getFirestore(app)

export { db }
