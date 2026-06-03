import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
Firestore security rules (deploy via Firebase Console):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rfq_submissions/{document} {
      allow write: if true;
      allow read: if false;
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
*/
