import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/*
Firebase web app (osi-project-da298) — same values as firebaseConfig in .env.local:

Firebase Console → Authentication → Sign-in method:
  - Enable Google
  - Enable Email/Password (create users for allowlisted emails)

Authorized domains: localhost, your production domain, and *.firebaseapp.com
*/

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey?.trim() &&
      firebaseConfig.authDomain?.trim() &&
      firebaseConfig.projectId?.trim() &&
      firebaseConfig.appId?.trim()
  );
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error(
      "Firebase client is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables and redeploy.",
    );
  }

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return app;
}

let db: Firestore | null = null;

export function getClientDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

let storage: FirebaseStorage | null = null;

export function getClientStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}

/*
Firestore security rules (Firebase Console → Firestore → Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rfq_submissions/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /products/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /site_content/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /site_settings/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}

Admin writes use Firebase Admin SDK (server) with FIREBASE_SERVICE_ACCOUNT_KEY.
*/
