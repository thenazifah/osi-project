import {
  PRODUCT_IMAGES,
  products as staticProducts,
  type Product,
  type ProductCategory,
  type ProductSpecs,
} from "@/data/products";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase-admin";
import type { LocaleCode, ProductRecord, SiteContent } from "@/lib/admin-types";
import {
  defaultSiteSettings,
  mergeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import zh from "@/messages/zh.json";

const MESSAGE_DEFAULTS = { en, ja, zh };

export type CatalogProduct = {
  id: string;
  slug: string;
  category: ProductCategory;
  moqKg: number;
  images: string[];
  specs: ProductSpecs;
  specsUrl?: string;
  name: string;
  description: string;
};

function mapRecord(record: ProductRecord, locale: LocaleCode): CatalogProduct {
  return {
    id: record.id,
    slug: record.slug,
    category: record.category,
    moqKg: record.moqKg,
    images: record.images?.length ? record.images : [...PRODUCT_IMAGES],
    specs: record.specs,
    specsUrl: record.specsUrl,
    name: record.names[locale] || record.names.en,
    description: record.descriptions[locale] || record.descriptions.en,
  };
}

function mapStatic(locale: LocaleCode): CatalogProduct[] {
  const messages = MESSAGE_DEFAULTS[locale].catalog;
  return staticProducts.map((p) => {
    const key = p.nameKey.replace(".name", "");
    const catalog = messages as Record<string, { name?: string; description?: string }>;
    return {
      id: p.id,
      slug: p.slug,
      category: p.category,
      moqKg: p.moqKg,
      images: p.images,
      specs: p.specs,
      specsUrl: p.specsUrl,
      name: catalog[key]?.name ?? key,
      description: catalog[key]?.description ?? "",
    };
  });
}

function parseRecord(id: string, data: Record<string, unknown>): ProductRecord {
  const specs = (data.specs as ProductSpecs | undefined) ?? {
    moisture: "",
    particleSize: "",
    microbiology: "",
    packaging: "",
  };
  return {
    id,
    slug: String(data.slug ?? ""),
    category: data.category as ProductRecord["category"],
    moqKg: Number(data.moqKg ?? 0),
    specsUrl: String(data.specsUrl ?? ""),
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    specs,
    active: Boolean(data.active ?? true),
    order: Number(data.order ?? 0),
    names: (data.names as ProductRecord["names"]) ?? { en: "", ja: "", zh: "" },
    descriptions: (data.descriptions as ProductRecord["descriptions"]) ?? {
      en: "",
      ja: "",
      zh: "",
    },
  };
}

export async function getCatalogProducts(
  locale: LocaleCode
): Promise<CatalogProduct[]> {
  if (!isAdminConfigured()) return mapStatic(locale);

  try {
    const db = getAdminDb();
    const snap = await db.collection("products").orderBy("order", "asc").get();
    if (snap.empty) return mapStatic(locale);

    const active = snap.docs
      .map((doc) => parseRecord(doc.id, doc.data()))
      .filter((p) => p.active && p.slug);

    return active.map((p) => mapRecord(p, locale));
  } catch {
    return mapStatic(locale);
  }
}

export async function getCatalogProductBySlug(
  locale: LocaleCode,
  slug: string
): Promise<CatalogProduct | undefined> {
  const products = await getCatalogProducts(locale);
  return products.find((p) => p.slug === slug);
}

function emptyContent(): SiteContent {
  return {
    hero: { headline1: "", headline2: "", headline3: "", body: "", trustLine: "" },
    about: { title: "", p1: "", p2: "", p3: "" },
    trust: { title: "", subtitle: "" },
  };
}

function defaultsFromMessages(locale: LocaleCode): SiteContent {
  const m = MESSAGE_DEFAULTS[locale];
  return {
    hero: {
      headline1: m.hero.headline1,
      headline2: m.hero.headline2,
      headline3: m.hero.headline3,
      body: m.hero.body,
      trustLine: m.hero.trustLine,
    },
    about: {
      title: m.about.title,
      p1: m.about.p1,
      p2: m.about.p2,
      p3: m.about.p3,
    },
    trust: {
      title: m.trust.title,
      subtitle: m.trust.subtitle,
    },
  };
}

function mergeContent(defaults: SiteContent, stored: Partial<SiteContent>): SiteContent {
  const pick = <T extends Record<string, string>>(base: T, patch?: Partial<T>): T => {
    if (!patch) return base;
    const out = { ...base };
    for (const [k, v] of Object.entries(patch)) {
      if (typeof v === "string" && v.trim()) {
        (out as Record<string, string>)[k] = v;
      }
    }
    return out;
  };
  return {
    hero: pick(defaults.hero, stored.hero),
    about: pick(defaults.about, stored.about),
    trust: pick(defaults.trust, stored.trust),
  };
}

export async function getPublicSiteContent(locale: LocaleCode): Promise<SiteContent> {
  const defaults = defaultsFromMessages(locale);
  if (!isAdminConfigured()) return defaults;

  try {
    const db = getAdminDb();
    const doc = await db.collection("site_content").doc(locale).get();
    if (!doc.exists) return defaults;
    return mergeContent(defaults, doc.data() as Partial<SiteContent>);
  } catch {
    return defaults;
  }
}

export async function getCatalogProductSlugs(): Promise<string[]> {
  if (!isAdminConfigured()) {
    return staticProducts.map((p) => p.slug);
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection("products").get();
    if (snap.empty) {
      return staticProducts.map((p) => p.slug);
    }

    const slugs = snap.docs
      .map((doc) => String(doc.data().slug ?? "").trim())
      .filter(Boolean);

    return slugs.length > 0 ? slugs : staticProducts.map((p) => p.slug);
  } catch {
    return staticProducts.map((p) => p.slug);
  }
}

export async function getPublicSiteSettings(): Promise<SiteSettings> {
  if (!isAdminConfigured()) return defaultSiteSettings();

  try {
    const db = getAdminDb();
    const doc = await db.collection("site_settings").doc("global").get();
    if (!doc.exists) return defaultSiteSettings();
    return mergeSiteSettings(doc.data() as Partial<SiteSettings>);
  } catch {
    return defaultSiteSettings();
  }
}

/** Map CMS product back to static Product shape for gallery helper */
export function toProductShape(item: CatalogProduct): Product {
  return {
    id: item.id,
    slug: item.slug,
    nameKey: `${item.slug}.name`,
    descriptionKey: `${item.slug}.description`,
    category: item.category,
    moqKg: item.moqKg,
    images: item.images,
    specsUrl: item.specsUrl,
    specs: item.specs,
  };
}
