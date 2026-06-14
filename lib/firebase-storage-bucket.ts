import type { ServiceAccount } from "firebase-admin/app";

export function resolveFirebaseProjectId(
  serviceAccount?: ServiceAccount
): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (fromEnv) return fromEnv;

  if (serviceAccount && typeof serviceAccount.projectId === "string") {
    const id = serviceAccount.projectId.trim();
    if (id) return id;
  }

  return null;
}

export function resolveFirebaseStorageBucket(
  serviceAccount?: ServiceAccount
): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (fromEnv) return fromEnv;

  const projectId = resolveFirebaseProjectId(serviceAccount);
  if (!projectId) return null;

  return `${projectId}.appspot.com`;
}
