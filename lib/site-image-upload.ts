import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  canUploadToFirebaseStorage,
  uploadSiteImageToFirebaseStorage,
} from "@/lib/site-image-storage";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

const SITE_IMAGES_DIR = join(process.cwd(), "public", "images", "site");

function isServerlessHost(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function uploadSiteImageToLocal(
  buffer: Buffer,
  imageKey: string,
  ext: string
): Promise<{ url?: string; error?: string }> {
  const safeKey = imageKey.replace(/[^a-zA-Z0-9_-]/g, "") || "image";
  const filename = `${safeKey}-${Date.now()}.${ext}`;
  const filepath = join(SITE_IMAGES_DIR, filename);
  const publicUrl = `/images/site/${filename}`;

  await mkdir(SITE_IMAGES_DIR, { recursive: true });
  await writeFile(filepath, buffer);
  return { url: publicUrl };
}

export async function uploadSiteImage(
  file: File,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  if (!file || file.size === 0) {
    return { error: "No image file selected." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use PNG, JPEG, WebP, or GIF." };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isServerlessHost() || canUploadToFirebaseStorage()) {
    const cloud = await uploadSiteImageToFirebaseStorage(
      buffer,
      file.type,
      imageKey
    );
    if (cloud.url || cloud.error || isServerlessHost()) {
      return cloud;
    }
  }

  try {
    return await uploadSiteImageToLocal(buffer, imageKey, ext);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Image upload failed.";
    if (message.includes("EROFS") || message.includes("read-only")) {
      if (canUploadToFirebaseStorage()) {
        return uploadSiteImageToFirebaseStorage(buffer, file.type, imageKey);
      }
      return {
        error:
          "Cannot save images on this host. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET and FIREBASE_SERVICE_ACCOUNT_KEY on Vercel.",
      };
    }
    return { error: message };
  }
}
