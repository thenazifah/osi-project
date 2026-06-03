import { ProductsManager } from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/admin-actions";
import type { ProductRecord } from "@/lib/admin-types";

export default async function AdminProductsPage() {
  let products: ProductRecord[] = [];
  let error: string | null = null;

  try {
    products = await listProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          Products
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">Catalog content</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Manage product records in Firestore. Use import to sync IDs from the static
          catalog, then edit names and descriptions per locale.
        </p>
      </div>

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
