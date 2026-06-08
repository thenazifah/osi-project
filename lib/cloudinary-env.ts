export type CloudinaryEnvStatus = {
  cloudName: string | null;
  apiKeySet: boolean;
  uploadReady: boolean;
  displayReady: boolean;
  missing: string[];
};

export function getCloudinaryEnvStatus(): CloudinaryEnvStatus {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || null;
  const apiKeySet = Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim() ||
      process.env.CLOUDINARY_API_KEY?.trim()
  );
  const hasUploadAuth = Boolean(
    process.env.CLOUDINARY_API_SECRET?.trim() ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  );

  const missing: string[] = [];
  if (!cloudName) {
    missing.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  }
  if (!apiKeySet) {
    missing.push("NEXT_PUBLIC_CLOUDINARY_API_KEY");
  }
  if (cloudName && !hasUploadAuth) {
    missing.push("CLOUDINARY_API_SECRET or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
  }

  return {
    cloudName,
    apiKeySet,
    uploadReady: Boolean(cloudName && hasUploadAuth),
    displayReady: Boolean(cloudName),
    missing,
  };
}
