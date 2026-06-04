import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/lib/admin-actions";
import type { ProductRecord } from "@/lib/admin-types";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminProductsPage() {
  const firebaseReady = isAdminConfigured();

  if (!firebaseReady) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Products"
          title="Catalog content"
          description="Connect Firestore to manage products shown on the public catalog and product detail pages."
        />
      </div>
    );
  }

  let products: ProductRecord[] = [];
  let error: string | null = null;

  try {
    products = await listProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  const activeCount = products.filter((p) => p.active).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Products"
        title="Catalog content"
        description="Manage Firestore product records. Saves revalidate /en, /ja, /zh and product detail routes."
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/en#catalog">View catalog on site</Link>
        </Button>
      </AdminPageHeader>

      {!error ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Total products" value={products.length} />
          <StatCard label="Active" value={activeCount} />
          <StatCard label="Hidden" value={products.length - activeCount} />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : (
        <ProductsManager initialProducts={products} />
      )}
    </div>
  );
}
