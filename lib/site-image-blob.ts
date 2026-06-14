import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { get, list, put } from "@vercel/blob";

const SITE_IMAGES_PREFIX = "site-images/";

function cleanEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^["']|["']$/g, "");
}

function readEnvLocal(key: string): string | undefined {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return undefined;

  try {
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const name = trimmed.slice(0, eq).trim();
      if (name !== key) continue;
      return cleanEnv(trimmed.slice(eq + 1));
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function envValue(key: string): string | undefined {
  return cleanEnv(process.env[key]) ?? readEnvLocal(key);
}

export function getBlobConfig() {
  return {
    token: envValue("BLOB_READ_WRITE_TOKEN"),
    storeId: envValue("BLOB_STORE_ID"),
  };
}

export function canUploadToVercelBlob(): boolean {
  return Boolean(getBlobConfig().token);
}

/** Same-origin URL that serves a private blob through /api/site-images. */
export function siteImagePublicUrl(pathname: string): string {
  const encoded = pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/api/site-images/${encoded}`;
}

function blobPutOptions(contentType: string) {
  const { token } = getBlobConfig();

  return {
    access: "private" as const,
    contentType,
    token: token!,
  };
}

export async function uploadSiteImageToBlob(
  buffer: Buffer,
  contentType: string,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  const { token } = getBlobConfig();

  if (!token) {
    return {
      error:
        "Set BLOB_READ_WRITE_TOKEN in .env.local or Vercel project environment variables.",
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
  const pathname = `${SITE_IMAGES_PREFIX}${safeKey}-${Date.now()}.${ext}`;

  try {
    await put(pathname, buffer, blobPutOptions(contentType));
    return { url: siteImagePublicUrl(pathname) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Vercel Blob upload failed.";
    return { error: message };
  }
}

export async function listBlobSiteImages(): Promise<
  { url: string; label: string }[]
> {
  const { token } = getBlobConfig();
  if (!token) return [];

  try {
    const { blobs } = await list({
      prefix: SITE_IMAGES_PREFIX,
      token,
    });

    return blobs.map((blob) => {
      const filename = blob.pathname.split("/").pop() ?? blob.pathname;
      return {
        url: siteImagePublicUrl(blob.pathname),
        label: `site/${filename}`,
      };
    });
  } catch {
    return [];
  }
}
