import { auth, firebaseSetupMessage } from "./config.js";
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
    throw new Error(firebaseSetupMessage);
  }

  return auth;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(requireAuth(), provider);
}

export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(requireAuth(), email, password);
}

export async function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(requireAuth(), email, password);
}

export async function logOut() {
  return signOut(requireAuth());
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}
