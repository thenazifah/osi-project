import { list, put } from "@vercel/blob";

const SITE_IMAGES_PREFIX = "site-images/";

export function canUploadToVercelBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

export async function uploadSiteImageToBlob(
  buffer: Buffer,
  contentType: string,
  imageKey: string
): Promise<{ url?: string; error?: string }> {
  if (!canUploadToVercelBlob()) {
    return {
      error:
        "Connect Vercel Blob: Vercel Dashboard → Storage → Blob → Create store → Connect to this project, then redeploy.",
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
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      token: blobToken(),
    });

    return { url: blob.url };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Vercel Blob upload failed.";
    return { error: message };
  }
}

export async function listBlobSiteImages(): Promise<
  { url: string; label: string }[]
> {
  if (!canUploadToVercelBlob()) return [];

  try {
    const { blobs } = await list({
      prefix: SITE_IMAGES_PREFIX,
      token: blobToken(),
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
