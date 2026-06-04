import type { ProductSpecs } from "@/data/products";

export type RfqStatus = "new" | "reviewing" | "quoted" | "closed";

export type RfqSubmission = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  country: string;
  quantityKg: number;
  productInterest: string[];
  message?: string;
  status: RfqStatus;
  createdAt: string | null;
};

export type LocaleCode = "en" | "ja" | "zh";

export type ProductRecord = {
  id: string;
  slug: string;
  category: "tilapia" | "carp" | "marine" | "custom";
  moqKg: number;
  specsUrl: string;
  images: string[];
  specs: ProductSpecs;
  active: boolean;
  order: number;
  names: Record<LocaleCode, string>;
  descriptions: Record<LocaleCode, string>;
};

export type SiteContent = {
  hero: {
    headline1: string;
    headline2: string;
    headline3: string;
    body: string;
    trustLine: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  trust: {
    title: string;
    subtitle: string;
  };
};

export type DashboardChartData = {
  rfqByStatus: { status: string; count: number }[];
  rfqByMonth: { month: string; count: number }[];
  productsByCategory: { category: string; count: number }[];
};
