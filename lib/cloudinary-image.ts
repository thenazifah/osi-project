/** True when src should be delivered via Cloudinary (public ID or Cloudinary URL). */
export function isCloudinarySource(src: string): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName || !src.trim()) return false;

  if (src.includes("res.cloudinary.com")) return true;
  if (src.startsWith("/") || src.startsWith("data:")) return false;

  return true;
}

export function cloudinaryConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim());
}

export function cloudinaryUploadReady(): boolean {
  return cloudinaryConfigured();
}

export function siteImageFolder(key: string): string {
  return `osi/site/${key}`;
}
