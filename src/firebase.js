import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCo1hODBhLJge74SdZ2C3UeKFOKzkreX7M",
  authDomain: "bugtrackr-project.firebaseapp.com",
  projectId: "bugtrackr-project",
  storageBucket: "bugtrackr-project.firebasestorage.app",
  messagingSenderId: "193748934853",
  appId: "1:193748934853:web:0d14b513f5586a76e550ac"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth, Firestore, and Functions
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
