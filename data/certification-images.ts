/** Official certification logo assets (public/certifications/) */
export const CERTIFICATION_LOGOS = {
  iso9001: "/certifications/iso9001.png",
} as const;

export type CertificationLogoId = keyof typeof CERTIFICATION_LOGOS;
