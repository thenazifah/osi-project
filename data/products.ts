export type ProductCategory = "tilapia" | "carp" | "marine" | "custom";

/** Fish scale product photography (public/images/products/) */
export const PRODUCT_IMAGES = [
  "/images/products/scales-hand.png",
  "/images/products/scales-pile.png",
] as const;

export interface ProductSpecs {
  moisture: string;
  particleSize: string;
  microbiology: string;
  packaging: string;
}

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: ProductCategory;
  moqKg: number;
  /** Optional external PDF URL; otherwise specs open in a panel */
  specsUrl?: string;
  /** Public paths under /public for the product gallery */
  images: string[];
  specs: ProductSpecs;
}

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "tilapia-dried-pharma",
    nameKey: "tilapiaDriedPharma.name",
    descriptionKey: "tilapiaDriedPharma.description",
    category: "tilapia",
    moqKg: 500,
    images: [...PRODUCT_IMAGES],
    specs: {
      moisture: "≤ 12%",
      particleSize: "2 to 8 mm",
      microbiology: "TVC < 10³ CFU/g; pathogens absent",
      packaging: "25 kg export-lined fiber drums",
    },
  },
  {
    id: "prod-002",
    slug: "tilapia-wet-collagen",
    nameKey: "tilapiaWetCollagen.name",
    descriptionKey: "tilapiaWetCollagen.description",
    category: "tilapia",
    moqKg: 500,
    images: [
      "/images/export/procurement-ship.png",
      "/images/export/containers.jpg",
      "/hero-bg.png",
    ],
    specs: {
      moisture: "18 to 22%",
      particleSize: "Whole scale, sorted",
      microbiology: "TVC < 10⁴ CFU/g; coliforms within export limits",
      packaging: "Food-grade PE-lined crates, chilled chain",
    },
  },
  {
    id: "prod-003",
    slug: "carp-food-grade",
    nameKey: "carpFoodGrade.name",
    descriptionKey: "carpFoodGrade.description",
    category: "carp",
    moqKg: 500,
    images: [...PRODUCT_IMAGES],
    specs: {
      moisture: "≤ 14%",
      particleSize: "3 to 10 mm",
      microbiology: "HACCP-aligned; Salmonella absent",
      packaging: "25 kg food-grade woven bags",
    },
  },
  {
    id: "prod-004",
    slug: "carp-cosmetic-grade",
    nameKey: "carpCosmeticGrade.name",
    descriptionKey: "carpCosmeticGrade.description",
    category: "carp",
    moqKg: 500,
    images: [...PRODUCT_IMAGES],
    specs: {
      moisture: "≤ 10%",
      particleSize: "0.5 to 3 mm milled",
      microbiology: "TVC < 10³ CFU/g; heavy metals within cosmetic limits",
      packaging: "20 kg sealed kraft drums",
    },
  },
  {
    id: "prod-005",
    slug: "marine-industrial",
    nameKey: "marineIndustrial.name",
    descriptionKey: "marineIndustrial.description",
    category: "marine",
    moqKg: 1000,
    images: [
      "/images/export/procurement-ship.png",
      "/hero-bg.png",
      "/images/export/containers.jpg",
    ],
    specs: {
      moisture: "≤ 15%",
      particleSize: "5 to 15 mm mixed",
      microbiology: "Industrial grade release per lot COA",
      packaging: "50 kg bulk export sacks",
    },
  },
  {
    id: "prod-006",
    slug: "custom-client-spec",
    nameKey: "customClientSpec.name",
    descriptionKey: "customClientSpec.description",
    category: "custom",
    moqKg: 250,
    images: [...PRODUCT_IMAGES],
    specs: {
      moisture: "Per client specification",
      particleSize: "Custom milling profile",
      microbiology: "Third-party lab per program",
      packaging: "Client-approved export packaging",
    },
  },
];

export const CATALOG_REVALIDATE = 3600;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductNameKey(nameKey: string): string {
  const parts = nameKey.split(".");
  return parts[0] ?? nameKey;
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];

  const sameCategory = products.filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = products.filter(
    (p) => p.slug !== slug && p.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function getProductGalleryImages(
  product: Product,
  productName: string
): { src: string; alt: string }[] {
  return product.images.map((src, index) => ({
    src,
    alt: `${productName} (${index + 1}/${product.images.length})`,
  }));
}
