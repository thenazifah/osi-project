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

/** Bucket names to try — new Firebase projects use .firebasestorage.app. */
export function listFirebaseStorageBucketCandidates(
  serviceAccount?: ServiceAccount
): string[] {
  const projectId = resolveFirebaseProjectId(serviceAccount);
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  const candidates: string[] = [];
  if (fromEnv) candidates.push(fromEnv);

  if (projectId) {
    candidates.push(`${projectId}.firebasestorage.app`);
    candidates.push(`${projectId}.appspot.com`);
  }

  return [...new Set(candidates.filter(Boolean))];
}

export function resolveFirebaseStorageBucket(
  serviceAccount?: ServiceAccount
): string | null {
  return listFirebaseStorageBucketCandidates(serviceAccount)[0] ?? null;
}

export function firebaseStoragePublicUrl(
  bucketName: string,
  objectPath: string,
  token: string
): string {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}
