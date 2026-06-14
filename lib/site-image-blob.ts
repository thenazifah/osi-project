import { list, put } from "@vercel/blob";

const SITE_IMAGES_PREFIX = "site-images/";

function cleanEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^["']|["']$/g, "");
}

export function canUploadToVercelBlob(): boolean {
  return Boolean(cleanEnv(process.env.BLOB_READ_WRITE_TOKEN));
}

function blobPutOptions(contentType: string) {
  const token = cleanEnv(process.env.BLOB_READ_WRITE_TOKEN);
  const storeId = cleanEnv(process.env.BLOB_STORE_ID);

  return {
    access: "public" as const,
    contentType,
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

export async function uploadSiteImageToBlob(
  buffer: Buffer,
  contentType: string,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  if (!canUploadToVercelBlob()) {
    return {
      error:
        "Set BLOB_READ_WRITE_TOKEN in .env.local (Vercel Dashboard → Storage → Blob → Connect to project).",
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
    const { url } = await put(pathname, buffer, blobPutOptions(contentType));
    return { url };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Vercel Blob upload failed.";
    return { error: message };
  }
}

export async function listBlobSiteImages(): Promise<
  { url: string; label: string }[]
> {
  if (!canUploadToVercelBlob()) return [];

  const token = cleanEnv(process.env.BLOB_READ_WRITE_TOKEN);
  const storeId = cleanEnv(process.env.BLOB_STORE_ID);

  try {
    const { blobs } = await list({
      prefix: SITE_IMAGES_PREFIX,
      ...(token ? { token } : {}),
      ...(storeId ? { storeId } : {}),
    });

    return blobs.map((blob) => {
      const filename = blob.pathname.split("/").pop() ?? blob.pathname;
      return {
        url: blob.url,
        label: `site/${filename}`,
      };
    });
  } catch {
    return [];
  }
}
