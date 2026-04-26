import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB73Ea2Z_xU8UXCppFgFCOh3mPe4LRFXGs",
  authDomain: "landhotel-169ae.firebaseapp.com",
  databaseURL: "https://landhotel-169ae-default-rtdb.firebaseio.com",
  projectId: "landhotel-169ae",
  storageBucket: "landhotel-169ae.firebasestorage.app",
  messagingSenderId: "813505147424",
  appId: "1:813505147424:web:e43e9d4097277400974245",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
 