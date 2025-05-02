import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYLrOPeyZTc19iTprwiyfLVsgHIohk8bA",
  authDomain: "xeno-ddbe4.firebaseapp.com",
  projectId: "xeno-ddbe4",
  storageBucket: "xeno-ddbe4.firebasestorage.app",
  messagingSenderId: "750097493512",
  appId: "1:750097493512:web:05aeac7c6fed121f3f2bbd",
  measurementId: "G-0ZSV7JDDW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};