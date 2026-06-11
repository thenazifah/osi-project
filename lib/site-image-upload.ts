import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

const SITE_IMAGES_DIR = join(process.cwd(), "public", "images", "site");

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

  const safeKey = imageKey.replace(/[^a-zA-Z0-9_-]/g, "") || "image";
  const filename = `${safeKey}-${Date.now()}.${ext}`;
  const filepath = join(SITE_IMAGES_DIR, filename);
  const publicUrl = `/images/site/${filename}`;

  try {
    await mkdir(SITE_IMAGES_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    return { url: publicUrl };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Image upload failed.";
    if (message.includes("EROFS") || message.includes("read-only")) {
      return {
        error:
          "Cannot save images on this host (read-only filesystem). Run the dashboard locally with npm run dev to upload images.",
      };
    }
    return { error: message };
  }
}
