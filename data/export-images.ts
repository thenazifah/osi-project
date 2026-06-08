/** Local export / logistics imagery (public/) */
export const EXPORT_IMAGES = {
  heroPort: "/images/export/hero-port.png",
  containers: "/images/export/hero-port.png",
  procurementShip: "/images/export/hero-port.png",
  cargoShip: "/images/export/hero-port.png",
  port: "/images/export/hero-port.png",
  shipSea: "/images/export/hero-port.png",
} as const;

export type ExportImageKey = keyof typeof EXPORT_IMAGES;

/** Paths that were bundled before hero-port.png existed */
const LEGACY_BROKEN_IMAGE_PATHS = new Set([
  "/images/export/containers.jpg",
  "/images/export/procurement-ship.png",
  "/images/export/cargo-ship.jpg",
  "containers",
  "containers.jpg",
  "procurement-ship.png",
]);

export function resolveExportImageSrc(
  value: string | undefined,
  fallback: ExportImageKey = "heroPort"
): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || LEGACY_BROKEN_IMAGE_PATHS.has(trimmed)) {
    return EXPORT_IMAGES[fallback];
  }
  return trimmed;
}
