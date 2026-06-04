"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { app } from "@/lib/firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export function getClientAuth() {
  return auth;
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

/** @deprecated Use signOutFirebase */
export const signOutGoogle = signOutFirebase;
