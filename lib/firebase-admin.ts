import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export type AdminConfigStatus = {
  ready: boolean;
  message?: string;
};

function parseServiceAccount(raw: string): ServiceAccount {
  return JSON.parse(raw) as ServiceAccount;
}

function loadServiceAccountJson(): string | null {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (inline) return inline;

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!filePath) return null;

  const absolute = resolve(process.cwd(), filePath);
  if (!existsSync(absolute)) return null;

  try {
    return readFileSync(absolute, "utf8");
  } catch {
    return null;
  }
}

export function getAdminConfigStatus(): AdminConfigStatus {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();

  if (inline) {
    try {
      parseServiceAccount(inline);
      return { ready: true };
    } catch {
      return {
        ready: false,
        message:
          "FIREBASE_SERVICE_ACCOUNT_KEY in .env.local is not valid JSON.",
      };
    }
  }

  if (filePath) {
    const absolute = resolve(process.cwd(), filePath);
    if (!existsSync(absolute)) {
      return {
        ready: false,
        message: `Service account file not found: ${absolute}. Download it from Firebase Console and save it there.`,
      };
    }
    try {
      parseServiceAccount(readFileSync(absolute, "utf8"));
      return { ready: true };
    } catch {
      return {
        ready: false,
        message: `Service account file is not valid JSON: ${absolute}`,
      };
    }
  }

  return {
    ready: false,
    message:
      "Add firebase-service-account.json in the project root and set FIREBASE_SERVICE_ACCOUNT_PATH in .env.local (or paste JSON into FIREBASE_SERVICE_ACCOUNT_KEY).",
  };
}

export function isAdminConfigured(): boolean {
  return getAdminConfigStatus().ready;
}

function initAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const status = getAdminConfigStatus();
  if (!status.ready) {
    throw new Error(status.message ?? "Firebase Admin is not configured.");
  }

  const raw = loadServiceAccountJson()!;
  const serviceAccount = parseServiceAccount(raw);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return initializeApp({
    credential: cert(serviceAccount),
    projectId:
      (typeof serviceAccount.projectId === "string"
        ? serviceAccount.projectId
        : undefined) ?? projectId,
  });
}

export function getAdminApp(): App {
  return initAdmin();
}

export function getAdminDb() {
  const app = getAdminApp();
  const databaseId =
    process.env.FIRESTORE_DATABASE_ID?.trim() || "(default)";
  return databaseId === "(default)"
    ? getFirestore(app)
    : getFirestore(app, databaseId);
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
