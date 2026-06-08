"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseClientConfigured } from "@/lib/firebase";

let auth: Auth | null = null;

function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function isFirebaseAuthAvailable(): boolean {
  return isFirebaseClientConfigured();
}

export function getClientAuth() {
  return getAuthInstance();
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getAuthInstance(), googleProvider);
  return result.user;
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<User> {
  const result = await signInWithEmailAndPassword(
    getAuthInstance(),
    email.trim(),
    password,
  );
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  await signOut(getAuthInstance());
}

/** @deprecated Use signOutFirebase */
export const signOutGoogle = signOutFirebase;
