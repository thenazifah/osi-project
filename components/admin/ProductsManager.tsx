"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  deleteProduct,
  seedProductsFromStatic,
  upsertProduct,
} from "@/lib/admin-actions";
import type { LocaleCode, ProductRecord } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const LOCALES: LocaleCode[] = ["en", "ja", "zh"];
const CATEGORIES = ["tilapia", "carp", "marine", "custom"] as const;

const emptyProduct = (): Omit<ProductRecord, "id"> => ({
  slug: "",
  category: "tilapia",
  moqKg: 500,
  specsUrl: "#",
  active: true,
  order: 0,
  names: { en: "", ja: "", zh: "" },
  descriptions: { en: "", ja: "", zh: "" },
});

export function ProductsManager({
  initialProducts,
}: {
  initialProducts: ProductRecord[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<
    (Omit<ProductRecord, "id"> & { id?: string }) | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startNew = () => setEditing(emptyProduct());

  const startEdit = (product: ProductRecord) => {
    const { id, ...rest } = product;
    setEditing({ id, ...rest });
  };

  const save = () => {
    if (!editing) return;
    setMessage(null);
    startTransition(async () => {
      const result = await upsertProduct(editing);
      setMessage("Product saved.");
      setEditing(null);
      setProducts((prev) => {
        const next = {
          ...(editing as ProductRecord),
          id: result.id,
        };
        const exists = prev.find((p) => p.id === result.id);
        if (exists) {
          return prev.map((p) => (p.id === result.id ? next : p));
        }
        return [...prev, next].sort((a, b) => a.order - b.order);
      });
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("Product deleted.");
    });
  };

  const seed = () => {
    startTransition(async () => {
      const { count } = await seedProductsFromStatic();
      setMessage(`Seeded ${count} products from static catalog. Refresh to see updates.`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={startNew}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
        <Button type="button" variant="outline" onClick={seed} disabled={isPending}>
          Import from static catalog
        </Button>
      </div>

      {message ? (
        <p className="rounded-lg border border-border bg-tag-bg px-4 py-3 font-sans text-sm text-ink">
          {message}
        </p>
      ) : null}

      {editing ? (
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base">
              {editing.id ? "Edit product" : "New product"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editing.category}
                  onValueChange={(v) =>
                    setEditing({
                      ...editing,
                      category: v as ProductRecord["category"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">MOQ (kg)</Label>
                <Input
                  id="moq"
                  type="number"
                  value={editing.moqKg}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      moqKg: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Sort order</Label>
                <Input
                  id="order"
                  type="number"
                  value={editing.order}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      order: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {LOCALES.map((locale) => (
              <div key={locale} className="rounded-lg border border-border p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-sea">
                  {locale.toUpperCase()}
                </p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editing.names[locale]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          names: { ...editing.names, [locale]: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editing.descriptions[locale]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          descriptions: {
                            ...editing.descriptions,
                            [locale]: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <Checkbox
                id="active"
                checked={editing.active}
                onCheckedChange={(checked) =>
                  setEditing({ ...editing, active: checked === true })
                }
              />
              <Label htmlFor="active">Active on catalog</Label>
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={save} disabled={isPending}>
                Save product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="font-sans text-sm text-ink-muted">
            No products in Firestore yet. Import from static catalog or add one.
          </p>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="border-border bg-surface">
              <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-base text-ink">
                    {product.names.en || product.slug}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-muted">
                    {product.category} · MOQ {product.moqKg}kg ·{" "}
                    {product.active ? "active" : "hidden"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
