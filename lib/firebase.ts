import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/*
Firebase web app (osi-project-da298) — same values as firebaseConfig in .env.local:

Firebase Console → Authentication → Sign-in method:
  - Enable Google
  - Enable Email/Password (create users for allowlisted emails)

Authorized domains: localhost, your production domain, and *.firebaseapp.com
*/

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };

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
  }
}

Admin writes use Firebase Admin SDK (server) with FIREBASE_SERVICE_ACCOUNT_KEY.
*/
