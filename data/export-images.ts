/** Local export / logistics imagery (public/) */
export const EXPORT_IMAGES = {
  containers: "/images/export/containers.jpg",
  procurementShip: "/images/export/procurement-ship.png",
  cargoShip: "/images/export/containers.jpg",
  port: "/images/export/containers.jpg",
  shipSea: "/images/export/containers.jpg",
} as const;

export type ExportImageKey = keyof typeof EXPORT_IMAGES;
