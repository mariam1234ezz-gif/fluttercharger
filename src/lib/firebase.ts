
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWQaJK-hx20Y-IYM39Z4Fjdu3mb3SSNIU",
  authDomain: "fluttercharger.firebaseapp.com",
  projectId: "fluttercharger",
  storageBucket: "fluttercharger.firebasestorage.app",
  messagingSenderId: "732743519710",
  appId: "1:732743519710:web:2b077e5b0f5f651cfae14f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);