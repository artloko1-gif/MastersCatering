import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACq_gD_aXsKMpjhnvfkCrkn1UEUzYJmEk",
  authDomain: "mcatering-b8548.firebaseapp.com",
  projectId: "mcatering-b8548",
  storageBucket: "mcatering-b8548.firebasestorage.app",
  messagingSenderId: "914015412240",
  appId: "1:914015412240:web:38c304e7e1772af8c7ea95"
};

// Initialize Firebase only if it hasn't been initialized already to prevent "App already exists" errors
let app;
try {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
} catch (e) {
    console.error("Firebase initialization error:", e);
}

// Export db safely
export const db = app ? getFirestore(app) : null;
// Export storage safely
export const storage = app ? getStorage(app) : null;