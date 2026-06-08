import { signCloudinaryParams } from "@/lib/cloudinary-sign";

export type CloudinaryUploadResult =
  | { ok: true; publicId: string; secureUrl: string }
  | { ok: false; error: string };

function cloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey =
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim() ||
    process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  return { cloudName, apiKey, apiSecret, uploadPreset };
}

export function cloudinaryDirectUploadReady(): {
  ready: boolean;
  message: string;
} {
  const { cloudName, apiSecret, uploadPreset } = cloudinaryConfig();

  if (!cloudName) {
    return {
      ready: false,
      message: "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local (Cloudinary Console → Dashboard).",
    };
  }

  if (uploadPreset) {
    return { ready: true, message: "Unsigned upload preset configured." };
  }

  if (apiSecret) {
    return { ready: true, message: "Signed uploads configured with CLOUDINARY_API_SECRET." };
  }

  return {
    ready: false,
    message:
      "Set CLOUDINARY_API_SECRET or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.",
  };
}

export async function uploadFileToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret, uploadPreset } = cloudinaryConfig();

  if (!cloudName) {
    return { ok: false, error: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set." };
  }

  if (!file || file.size === 0) {
    return { ok: false, error: "No image file selected." };
  }

  const body = new FormData();
  body.append("file", file);

  if (uploadPreset) {
    body.append("upload_preset", uploadPreset);
    if (folder) body.append("folder", folder);
  } else if (apiKey && apiSecret) {
    const timestamp = Math.round(Date.now() / 1000);
    const params: Record<string, string | number> = { timestamp };
    if (folder) params.folder = folder;

    body.append("api_key", apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signCloudinaryParams(params, apiSecret));
    if (folder) body.append("folder", folder);
  } else {
    return {
      ok: false,
      error: "Add CLOUDINARY_API_SECRET or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local.",
    };
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body }
  );

  const data = (await response.json()) as {
    public_id?: string;
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.public_id) {
    return {
      ok: false,
      error: data.error?.message ?? `Cloudinary upload failed (${response.status}).`,
    };
  }

  return {
    ok: true,
    publicId: data.public_id,
    secureUrl: data.secure_url ?? "",
  };
}
