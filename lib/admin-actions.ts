"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { products as staticProducts } from "@/data/products";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase-admin";
import type {
  LocaleCode,
  ProductRecord,
  RfqStatus,
  RfqSubmission,
  SiteContent,
} from "@/lib/admin-types";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  if (!isAdminConfigured()) {
    throw new Error("Firebase Admin is not configured.");
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

export async function loginAdmin(
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Invalid password" };
  }
  await setAdminSession();
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  revalidatePath("/admin");
}

export async function getDashboardStats(): Promise<{
  rfqTotal: number;
  rfqNew: number;
  productCount: number;
  contentLocales: number;
}> {
  await requireAdmin();
  const db = getAdminDb();

  const [rfqSnap, productsSnap, contentSnap] = await Promise.all([
    db.collection("rfq_submissions").get(),
    db.collection("products").get(),
    db.collection("site_content").get(),
  ]);

  const rfqNew = rfqSnap.docs.filter(
    (doc) => (doc.data().status as string | undefined) === "new"
  ).length;

  return {
    rfqTotal: rfqSnap.size,
    rfqNew,
    productCount: productsSnap.size,
    contentLocales: contentSnap.size,
  };
}

export async function listRfqSubmissions(): Promise<RfqSubmission[]> {
  await requireAdmin();
  const db = getAdminDb();
  const snap = await db
    .collection("rfq_submissions")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((doc) => {
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
}

export async function updateRfqStatus(
  id: string,
  status: RfqStatus
): Promise<{ success: boolean }> {
  await requireAdmin();
  const db = getAdminDb();
  await db.collection("rfq_submissions").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });
  revalidatePath("/admin/rfq");
  return { success: true };
}

export async function listProducts(): Promise<ProductRecord[]> {
  await requireAdmin();
  const db = getAdminDb();
  const snap = await db.collection("products").orderBy("order", "asc").get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: String(data.slug ?? ""),
      category: data.category as ProductRecord["category"],
      moqKg: Number(data.moqKg ?? 0),
      specsUrl: String(data.specsUrl ?? "#"),
      active: Boolean(data.active ?? true),
      order: Number(data.order ?? 0),
      names: (data.names as ProductRecord["names"]) ?? {
        en: "",
        ja: "",
        zh: "",
      },
      descriptions: (data.descriptions as ProductRecord["descriptions"]) ?? {
        en: "",
        ja: "",
        zh: "",
      },
    };
  });
}

export async function upsertProduct(
  product: Omit<ProductRecord, "id"> & { id?: string }
): Promise<{ success: boolean; id: string }> {
  await requireAdmin();
  const db = getAdminDb();
  const payload = {
    slug: product.slug,
    category: product.category,
    moqKg: product.moqKg,
    specsUrl: product.specsUrl,
    active: product.active,
    order: product.order,
    names: product.names,
    descriptions: product.descriptions,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (product.id) {
    await db.collection("products").doc(product.id).set(payload, { merge: true });
    revalidatePath("/admin/products");
    return { success: true, id: product.id };
  }

  const ref = await db.collection("products").add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
  });
  revalidatePath("/admin/products");
  return { success: true, id: ref.id };
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  await requireAdmin();
  const db = getAdminDb();
  await db.collection("products").doc(id).delete();
  revalidatePath("/admin/products");
  return { success: true };
}

export async function seedProductsFromStatic(): Promise<{ count: number }> {
  await requireAdmin();
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
        specsUrl: product.specsUrl,
        active: true,
        order: index,
        names: {
          en: `See catalog.${key}.name in messages`,
          ja: "",
          zh: "",
        },
        descriptions: {
          en: `See catalog.${key}.description in messages`,
          ja: "",
          zh: "",
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
  revalidatePath("/admin/products");
  return { count: staticProducts.length };
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
  const db = getAdminDb();
  const doc = await db.collection("site_content").doc(locale).get();
  if (!doc.exists) return emptyContent();
  return { ...emptyContent(), ...(doc.data() as Partial<SiteContent>) };
}

export async function saveSiteContent(
  locale: LocaleCode,
  content: SiteContent
): Promise<{ success: boolean }> {
  await requireAdmin();
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
  revalidatePath("/admin/content");
  revalidatePath(`/${locale}`);
  return { success: true };
}
