import { randomUUID } from "crypto";
import { extname } from "path";
import type { Bucket } from "@google-cloud/storage";
import {
  getAdminStorage,
  isAdminConfigured,
} from "@/lib/firebase-admin";
import {
  firebaseStoragePublicUrl,
  listFirebaseStorageBucketCandidates,
} from "@/lib/firebase-storage-bucket";

const SITE_IMAGES_PREFIX = "site-images/";

export { firebaseStoragePublicUrl };

export function canUploadToFirebaseStorage(): boolean {
  return (
    isAdminConfigured() && listFirebaseStorageBucketCandidates().length > 0
  );
}

function isBucketNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: number; message?: string };
  if (err.code === 404) return true;
  const message = String(err.message ?? "");
  return /bucket does not exist|specified bucket does not exist|notFound/i.test(
    message
  );
}

async function withFirebaseBucket<T>(
  fn: (bucket: Bucket) => Promise<T>
): Promise<T> {
  const candidates = listFirebaseStorageBucketCandidates();
  if (candidates.length === 0) {
    throw new Error(
      "Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in environment variables (Firebase Console → Project settings → Your apps)."
    );
  }

  const storage = getAdminStorage();

  for (const bucketName of candidates) {
    try {
      return await fn(storage.bucket(bucketName));
    } catch (error) {
      if (!isBucketNotFoundError(error)) throw error;
    }
  }

  const tried = candidates.join(", ");
  throw new Error(
    `Firebase Storage bucket not found. Tried: ${tried}. Open Firebase Console → Build → Storage → Get started, then set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to the bucket shown in Project settings.`
  );
}

export async function uploadSiteImageToFirebaseStorage(
  buffer: Buffer,
  contentType: string,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  const ext =
    contentType === "image/png"
      ? "png"
      : contentType === "image/webp"
        ? "webp"
        : contentType === "image/gif"
          ? "gif"
          : "jpg";

  const safeKey = imageKey.replace(/[^a-zA-Z0-9_-]/g, "") || "image";
  const objectPath = `${SITE_IMAGES_PREFIX}${safeKey}-${Date.now()}.${ext}`;
  const token = randomUUID();

  try {
    return await withFirebaseBucket(async (bucket) => {
      const fileRef = bucket.file(objectPath);
      await fileRef.save(buffer, {
        metadata: {
          contentType,
          metadata: { firebaseStorageDownloadTokens: token },
        },
      });

      return {
        url: firebaseStoragePublicUrl(bucket.name, objectPath, token),
      };
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Firebase Storage upload failed.";
    if (/storage.*not enabled|permission|denied/i.test(message)) {
      return {
        error:
          "Firebase Storage is not ready. In Firebase Console open Build → Storage → Get started, then retry.",
      };
    }
    return { error: message };
  }
}

export async function listFirebaseSiteImages(): Promise<
  { url: string; label: string }[]
> {
  if (!canUploadToFirebaseStorage()) return [];

  const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

  try {
    return await withFirebaseBucket(async (bucket) => {
      const [files] = await bucket.getFiles({ prefix: SITE_IMAGES_PREFIX });
      const results: { url: string; label: string }[] = [];

      for (const file of files) {
        const name = file.name;
        if (!imageExt.has(extname(name).toLowerCase())) continue;

        const [metadata] = await file.getMetadata();
        const token = metadata.metadata?.firebaseStorageDownloadTokens;
        if (typeof token !== "string" || !token.trim()) continue;

        const filename = name.split("/").pop() ?? name;
        results.push({
          url: firebaseStoragePublicUrl(bucket.name, name, token),
          label: `site/${filename}`,
        });
      }

      return results;
    });
  } catch {
    return [];
  }
}
