import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (raw) {
    const serviceAccount = JSON.parse(raw) as ServiceAccount;
    return initializeApp({
      credential: cert(serviceAccount),
      projectId:
        (typeof serviceAccount.projectId === "string"
          ? serviceAccount.projectId
          : undefined) ?? projectId,
    });
  }

  if (projectId) {
    return initializeApp({ projectId });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local."
  );
}

export function getAdminDb() {
  const app = initAdmin();
  return getFirestore(app);
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}
