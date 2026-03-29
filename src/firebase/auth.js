import { auth } from "./config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

function requireAuth() {
  if (!auth) {
    throw new Error("Firebase is not configured. Add your VITE_* values to a .env file.");
  }

  return auth;
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(requireAuth(), provider);
  } catch (error) {
    throw error;
  }
}

export async function signInWithEmail(email, password) {
  try {
    return await signInWithEmailAndPassword(requireAuth(), email, password);
  } catch (error) {
    throw error;
  }
}

export async function signUpWithEmail(email, password) {
  try {
    return await createUserWithEmailAndPassword(requireAuth(), email, password);
  } catch (error) {
    throw error;
  }
}

export async function logOut() {
  try {
    return await signOut(requireAuth());
  } catch (error) {
    throw error;
  }
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}
