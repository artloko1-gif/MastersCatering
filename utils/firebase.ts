import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACq_gD_aXsKMpjhnvfkCrkn1UEUzYJmEk",
  authDomain: "mcatering-b8548.firebaseapp.com",
  projectId: "mcatering-b8548",
  storageBucket: "mcatering-b8548.firebasestorage.app",
  messagingSenderId: "914015412240",
  appId: "1:914015412240:web:38c304e7e1772af8c7ea95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);