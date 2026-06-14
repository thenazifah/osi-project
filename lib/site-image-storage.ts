import { randomUUID } from "crypto";
import { extname } from "path";
import {
  getAdminStorage,
  getAdminStorageBucketName,
  isAdminConfigured,
} from "@/lib/firebase-admin";
import { resolveFirebaseStorageBucket } from "@/lib/firebase-storage-bucket";

const SITE_IMAGES_PREFIX = "site-images/";

export function firebaseStoragePublicUrl(
  bucketName: string,
  objectPath: string,
  token: string
): string {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

export function canUploadToFirebaseStorage(): boolean {
  return isAdminConfigured() && Boolean(resolveFirebaseStorageBucket());
}

export async function uploadSiteImageToFirebaseStorage(
  buffer: Buffer,
  contentType: string,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  const bucketName = getAdminStorageBucketName();
  if (!bucketName) {
    return {
      error:
        "Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in environment variables (Firebase Console → Project settings).",
    };
  }

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
    const bucket = getAdminStorage().bucket(bucketName);
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Firebase Storage upload failed.";
    if (/storage.*not enabled|bucket.*not found/i.test(message)) {
      return {
        error:
          "Enable Firebase Storage in Firebase Console → Build → Storage, then retry.",
      };
    }
    return { error: message };
  }
}

export async function listFirebaseSiteImages(): Promise<
  { url: string; label: string }[]
> {
  if (!canUploadToFirebaseStorage()) return [];

  const bucketName = getAdminStorageBucketName();
  if (!bucketName) return [];

  const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

  try {
    const bucket = getAdminStorage().bucket(bucketName);
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
  } catch {
    return [];
  }
}
