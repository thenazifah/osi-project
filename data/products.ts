export type ProductCategory = "tilapia" | "carp" | "marine" | "custom";

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: ProductCategory;
  moqKg: number;
  specsUrl: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "tilapia-dried-pharma",
    nameKey: "tilapiaDriedPharma.name",
    descriptionKey: "tilapiaDriedPharma.description",
    category: "tilapia",
    moqKg: 500,
    specsUrl: "#specs-tilapia-dried-pharma",
  },
  {
    id: "prod-002",
    slug: "tilapia-wet-collagen",
    nameKey: "tilapiaWetCollagen.name",
    descriptionKey: "tilapiaWetCollagen.description",
    category: "tilapia",
    moqKg: 500,
    specsUrl: "#specs-tilapia-wet-collagen",
  },
  {
    id: "prod-003",
    slug: "carp-food-grade",
    nameKey: "carpFoodGrade.name",
    descriptionKey: "carpFoodGrade.description",
    category: "carp",
    moqKg: 500,
    specsUrl: "#specs-carp-food-grade",
  },
  {
    id: "prod-004",
    slug: "carp-cosmetic-grade",
    nameKey: "carpCosmeticGrade.name",
    descriptionKey: "carpCosmeticGrade.description",
    category: "carp",
    moqKg: 500,
    specsUrl: "#specs-carp-cosmetic-grade",
  },
  {
    id: "prod-005",
    slug: "marine-industrial",
    nameKey: "marineIndustrial.name",
    descriptionKey: "marineIndustrial.description",
    category: "marine",
    moqKg: 1000,
    specsUrl: "#specs-marine-industrial",
  },
  {
    id: "prod-006",
    slug: "custom-client-spec",
    nameKey: "customClientSpec.name",
    descriptionKey: "customClientSpec.description",
    category: "custom",
    moqKg: 250,
    specsUrl: "#specs-custom-client-spec",
  },
];

export const CATALOG_REVALIDATE = 3600;
