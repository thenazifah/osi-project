"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { PRODUCT_IMAGES, products as staticProducts } from "@/data/products";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import zh from "@/messages/zh.json";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";
import {
  clearAdminSession,
  getAdminSessionEmail,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/admin-auth";
import { revalidateAdminAndSite } from "@/lib/admin-revalidate";
import { uploadFileToCloudinary } from "@/lib/cloudinary-upload-server";
import { listSiteImageLibrary } from "@/lib/site-image-library";
import { uploadSiteImage } from "@/lib/site-image-upload";
import { formatFirestoreError } from "@/lib/firestore-errors";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase-admin";
import { verifyFirebaseIdToken } from "@/lib/verify-firebase-id-token";
import type {
  DashboardChartData,
  LocaleCode,
  ProductRecord,
  RfqStatus,
  RfqSubmission,
  SiteContent,
  SiteSettings,
} from "@/lib/admin-types";
import { listAuditLogs, writeAuditLog } from "@/lib/audit-log";
import {
  activeSocialLinks,
  defaultSiteSettings,
  mergeSiteSettings,
  normalizeSiteSettingsForSave,
  SITE_SETTINGS_DOC,
} from "@/lib/site-settings";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  if (!isAdminConfigured()) {
    throw new Error("Firebase Admin is not configured.");
  }
}

async function withFirestore<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
}

function timestampToIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export async function loginAdminWithFirebase(
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!idToken?.trim()) {
    return { success: false, error: "Missing sign-in token." };
  }

  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()) {
    return {
      success: false,
      error: "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY to .env.local.",
    };
  }

  try {
    const user = await verifyFirebaseIdToken(idToken);
    if (!user) {
      return { success: false, error: "Sign-in failed. Try again." };
    }

    if (!isAllowedAdminEmail(user.email)) {
      return {
        success: false,
        error: "This account is not authorized for admin access.",
      };
    }

    await setAdminSession(user.email);
    await writeAuditLog({
      action: "auth.login",
      category: "auth",
      summary: "Signed in to admin dashboard",
      actor: user.email,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Sign-in failed. Try again." };
  }
}

export async function logoutAdmin(): Promise<void> {
  const email = await getAdminSessionEmail();
  await writeAuditLog({
    action: "auth.logout",
    category: "auth",
    summary: "Signed out of admin dashboard",
    actor: email,
  });
  await clearAdminSession();
  revalidateAdminAndSite();
}

export async function getAdminNavCounts(): Promise<{
  rfqNew: number;
  rfqTotal: number;
  productCount: number;
  contentLocales: number;
}> {
  if (!(await isAdminAuthenticated()) || !isAdminConfigured()) {
    return { rfqNew: 0, rfqTotal: 0, productCount: 0, contentLocales: 0 };
  }

  const stats = await getDashboardStats();
  return {
    rfqNew: stats.rfqNew,
    rfqTotal: stats.rfqTotal,
    productCount: stats.productCount,
    contentLocales: stats.contentLocales,
  };
}

export async function getDashboardStats(): Promise<{
  rfqTotal: number;
  rfqNew: number;
  productCount: number;
  contentLocales: number;
  socialLinks: number;
  siteImages: number;
}> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();

  const [rfqSnap, productsSnap, contentSnap, siteSettings] = await Promise.all([
    db.collection("rfq_submissions").get(),
    db.collection("products").get(),
    db.collection("site_content").get(),
    getSiteSettings(),
  ]);

  const rfqNew = rfqSnap.docs.filter(
    (doc) => (doc.data().status as string | undefined) === "new"
  ).length;

  const socialLinks = activeSocialLinks(siteSettings).length;
  const siteImages = Object.values(siteSettings.images).filter((v) => v.trim()).length;

  return {
    rfqTotal: rfqSnap.size,
    rfqNew,
    productCount: productsSnap.size,
    contentLocales: contentSnap.size,
    socialLinks,
    siteImages,
  };
  });
}

export async function getDashboardChartData(): Promise<DashboardChartData> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();

  const [rfqSnap, productsSnap] = await Promise.all([
    db.collection("rfq_submissions").get(),
    db.collection("products").get(),
  ]);

  const statusCounts: Record<string, number> = {
    new: 0,
    reviewing: 0,
    quoted: 0,
    closed: 0,
  };
  const monthCounts = new Map<string, number>();
  const categoryCounts: Record<string, number> = {
    tilapia: 0,
    carp: 0,
    marine: 0,
    custom: 0,
  };

  rfqSnap.docs.forEach((doc) => {
    const data = doc.data();
    const status = (data.status as string) ?? "new";
    statusCounts[status] = (statusCounts[status] ?? 0) + 1;

    const created = timestampToIso(data.createdAt);
    if (created) {
      const month = created.slice(0, 7);
      monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
    }
  });

  productsSnap.docs.forEach((doc) => {
    const cat = String(doc.data().category ?? "custom");
    if (cat in categoryCounts) {
      categoryCounts[cat as keyof typeof categoryCounts] += 1;
    }
  });

  const rfqByMonth = [...monthCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month,
      count,
    }));

  return {
    rfqByStatus: Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    })),
    rfqByMonth,
    productsByCategory: Object.entries(categoryCounts).map(
      ([category, count]) => ({ category, count })
    ),
  };
  });
}

export async function listRfqSubmissions(): Promise<RfqSubmission[]> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  let snap;
  try {
    snap = await db
      .collection("rfq_submissions")
      .orderBy("createdAt", "desc")
      .get();
  } catch {
    snap = await db.collection("rfq_submissions").get();
  }

  const rows = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      companyName: String(data.companyName ?? ""),
      contactPerson: String(data.contactPerson ?? ""),
      email: String(data.email ?? ""),
      country: String(data.country ?? ""),
      quantityKg: Number(data.quantityKg ?? 0),
      productInterest: Array.isArray(data.productInterest)
        ? data.productInterest.map(String)
        : [],
      message: data.message ? String(data.message) : undefined,
      status: (data.status as RfqStatus) ?? "new",
      createdAt: timestampToIso(data.createdAt),
    };
  });

  return rows.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  });
}

export async function listRecentRfqSubmissions(
  limit = 5
): Promise<RfqSubmission[]> {
  const all = await listRfqSubmissions();
  return all.slice(0, limit);
}

export async function updateRfqStatus(
  id: string,
  status: RfqStatus
): Promise<{ success: boolean }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const doc = await db.collection("rfq_submissions").doc(id).get();
  const company = doc.exists ? String(doc.data()?.companyName ?? id) : id;

  await db.collection("rfq_submissions").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await writeAuditLog({
    action: "rfq.status_update",
    category: "rfq",
    summary: `RFQ status set to "${status}" for ${company}`,
    targetId: id,
    targetLabel: company,
    metadata: { status },
  });

  revalidateAdminAndSite();
  return { success: true };
  });
}

function parseProductDoc(
  id: string,
  data: Record<string, unknown>
): ProductRecord {
  return {
    id,
    slug: String(data.slug ?? ""),
    category: data.category as ProductRecord["category"],
    moqKg: Number(data.moqKg ?? 0),
    specsUrl: String(data.specsUrl ?? ""),
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    specs: (data.specs as ProductRecord["specs"]) ?? {
      moisture: "",
      particleSize: "",
      microbiology: "",
      packaging: "",
    },
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

function revalidatePublicSite(
  productSlugs?: string | string[],
  previousSlugs?: string | string[]
) {
  revalidateAdminAndSite(productSlugs, previousSlugs);
}

export async function listProducts(): Promise<ProductRecord[]> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  let snap;
  try {
    snap = await db.collection("products").orderBy("order", "asc").get();
  } catch {
    snap = await db.collection("products").get();
  }
  const rows = snap.docs.map((doc) => parseProductDoc(doc.id, doc.data()));
  return rows.sort((a, b) => a.order - b.order);
  });
}

export async function upsertProduct(
  product: Omit<ProductRecord, "id"> & { id?: string }
): Promise<{ success: boolean; id: string }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const payload = {
    slug: product.slug,
    category: product.category,
    moqKg: product.moqKg,
    specsUrl: product.specsUrl,
    images: product.images,
    specs: product.specs,
    active: product.active,
    order: product.order,
    names: product.names,
    descriptions: product.descriptions,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (product.id) {
    const existing = await db.collection("products").doc(product.id).get();
    const previousSlug = existing.exists
      ? String(existing.data()?.slug ?? "").trim()
      : "";

    await db.collection("products").doc(product.id).set(payload, { merge: true });

    await writeAuditLog({
      action: "product.update",
      category: "product",
      summary: `Updated product "${product.names.en || product.slug}"`,
      targetId: product.id,
      targetLabel: product.slug,
    });

    revalidatePublicSite(
      product.slug,
      previousSlug && previousSlug !== product.slug ? previousSlug : undefined
    );
    return { success: true, id: product.id };
  }

  const ref = await db.collection("products").add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
  });

  await writeAuditLog({
    action: "product.create",
    category: "product",
    summary: `Created product "${product.names.en || product.slug}"`,
    targetId: ref.id,
    targetLabel: product.slug,
  });

  revalidatePublicSite(product.slug);
  return { success: true, id: ref.id };
  });
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const existing = await db.collection("products").doc(id).get();
  const previousSlug = existing.exists
    ? String(existing.data()?.slug ?? "").trim()
    : "";

  await db.collection("products").doc(id).delete();

  await writeAuditLog({
    action: "product.delete",
    category: "product",
    summary: `Deleted product "${previousSlug || id}"`,
    targetId: id,
    targetLabel: previousSlug || undefined,
  });

  revalidatePublicSite(undefined, previousSlug || undefined);
  return { success: true };
  });
}

type CatalogMessages = Record<string, { name?: string; description?: string }>;

function catalogMessages(locale: "en" | "ja" | "zh"): CatalogMessages {
  const m = { en, ja, zh }[locale].catalog as CatalogMessages;
  return m;
}

export async function seedProductsFromStatic(): Promise<{ count: number }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const batch = db.batch();

  staticProducts.forEach((product, index) => {
    const ref = db.collection("products").doc(product.id);
    const key = product.nameKey.replace(".name", "");
    batch.set(
      ref,
      {
        slug: product.slug,
        category: product.category,
        moqKg: product.moqKg,
        specsUrl: product.specsUrl ?? "",
        images: product.images.length ? product.images : [...PRODUCT_IMAGES],
        specs: product.specs,
        active: true,
        order: index,
        names: {
          en: catalogMessages("en")[key]?.name ?? "",
          ja: catalogMessages("ja")[key]?.name ?? "",
          zh: catalogMessages("zh")[key]?.name ?? "",
        },
        descriptions: {
          en: catalogMessages("en")[key]?.description ?? "",
          ja: catalogMessages("ja")[key]?.description ?? "",
          zh: catalogMessages("zh")[key]?.description ?? "",
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  await writeAuditLog({
    action: "product.seed",
    category: "product",
    summary: `Imported ${staticProducts.length} products from static catalog`,
    metadata: { count: staticProducts.length },
  });

  revalidatePublicSite(staticProducts.map((p) => p.slug));
  return { count: staticProducts.length };
  });
}

export async function seedSiteContentFromMessages(): Promise<{ count: number }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const locales: LocaleCode[] = ["en", "ja", "zh"];
  const messages = { en, ja, zh };

  for (const locale of locales) {
    const m = messages[locale];
    await db
      .collection("site_content")
      .doc(locale)
      .set(
        {
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
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  }

  await writeAuditLog({
    action: "content.seed",
    category: "content",
    summary: `Seeded site copy for ${locales.length} locales`,
    metadata: { count: locales.length },
  });

  revalidatePublicSite();
  return { count: locales.length };
  });
}

const emptyContent = (): SiteContent => ({
  hero: {
    headline1: "",
    headline2: "",
    headline3: "",
    body: "",
    trustLine: "",
  },
  about: {
    title: "",
    p1: "",
    p2: "",
    p3: "",
  },
  trust: {
    title: "",
    subtitle: "",
  },
});

export async function getSiteContent(locale: LocaleCode): Promise<SiteContent> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  const doc = await db.collection("site_content").doc(locale).get();
  if (!doc.exists) return emptyContent();
  return { ...emptyContent(), ...(doc.data() as Partial<SiteContent>) };
  });
}

export async function saveSiteContent(
  locale: LocaleCode,
  content: SiteContent
): Promise<{ success: boolean }> {
  await requireAdmin();
  return withFirestore(async () => {
  const db = getAdminDb();
  await db
    .collection("site_content")
    .doc(locale)
    .set(
      {
        ...content,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  revalidatePublicSite();
  return { success: true };
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await requireAdmin();
  return withFirestore(async () => {
    const db = getAdminDb();
    const doc = await db.collection("site_settings").doc(SITE_SETTINGS_DOC).get();
    if (!doc.exists) return defaultSiteSettings();
    return mergeSiteSettings(doc.data() as Partial<SiteSettings>);
  });
}

export async function saveSiteSettings(
  settings: SiteSettings
): Promise<{ success: boolean }> {
  await requireAdmin();
  return withFirestore(async () => {
    const db = getAdminDb();
    await db
      .collection("site_settings")
      .doc(SITE_SETTINGS_DOC)
      .set(
        {
          ...normalizeSiteSettingsForSave(settings),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    await writeAuditLog({
      action: "site.save",
      category: "site",
      summary: "Saved site settings (social links, images, Meta Pixel)",
    });

    revalidatePublicSite();
    return { success: true };
  });
}

export async function seedSiteSettingsFromDefaults(): Promise<{ success: boolean }> {
  await requireAdmin();
  return withFirestore(async () => {
    const db = getAdminDb();
    await db
      .collection("site_settings")
      .doc(SITE_SETTINGS_DOC)
      .set({
        ...defaultSiteSettings(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    await writeAuditLog({
      action: "site.seed",
      category: "site",
      summary: "Reset site settings to defaults",
    });

    revalidatePublicSite();
    return { success: true };
  });
}

export async function uploadAdminImageToCloudinary(
  formData: FormData
): Promise<{ publicId?: string; secureUrl?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "osi/uploads").trim();

  if (!(file instanceof File)) {
    return { error: "No image file received." };
  }

  const result = await uploadFileToCloudinary(file, folder);
  if (!result.ok) {
    return { error: result.error };
  }

  return { publicId: result.publicId, secureUrl: result.secureUrl };
}

export async function uploadAdminSiteImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  const imageKey = String(formData.get("imageKey") ?? "image").trim();

  if (!(file instanceof File)) {
    return { error: "No image file received." };
  }

  try {
    return await uploadSiteImage(file, imageKey);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Image upload failed.",
    };
  }
}

export async function listAvailableSiteImages() {
  await requireAdmin();
  return listSiteImageLibrary();
}

export async function syncPublicSite(): Promise<{ success: boolean; pages: number }> {
  await requireAdmin();
  return withFirestore(async () => {
    const products = await listProducts();
    const slugs = products.filter((p) => p.active && p.slug).map((p) => p.slug);
    revalidatePublicSite(slugs);

    const pages = 3 + slugs.length * 3;
    await writeAuditLog({
      action: "sync.revalidate",
      category: "sync",
      summary: `Revalidated public storefront (${pages} page groups)`,
      metadata: { pages },
    });

    return { success: true, pages };
  });
}

export async function listAuditLogsForAdmin(limit = 200) {
  await requireAdmin();
  return withFirestore(() => listAuditLogs(limit));
}
