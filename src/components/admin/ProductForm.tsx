"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Star, X } from "lucide-react";
import { btnGhost, btnPrimary, Card, Field, inputCls } from "./ui";
import type { Category, Product } from "@/types/db";
import { createClient } from "@/lib/supabase/browser";
import { slugify, uploadImage } from "@/lib/admin-utils";

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();

  const [f, setF] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    category_id: product?.category_id ?? "",
    price: product ? String(product.price) : "",
    compare_at_price:
      product?.compare_at_price != null ? String(product.compare_at_price) : "",
    stock: product ? String(product.stock) : "0",
    pack_size: product?.pack_size ?? "",
    weight_grams:
      product?.weight_grams != null ? String(product.weight_grams) : "",
    shelf_life: product?.shelf_life ?? "",
    storage_instructions: product?.storage_instructions ?? "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const [existing, setExisting] = useState<string[]>(product?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((x) => URL.createObjectURL(x)),
    [files],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(f.price);
    const compare = f.compare_at_price.trim()
      ? Number(f.compare_at_price)
      : null;
    const stock = Math.floor(Number(f.stock));

    if (!f.name.trim()) return setError("Please enter a product name.");
    if (!f.price.trim() || !Number.isFinite(price) || price < 0)
      return setError("Please enter a valid price.");
    if (compare != null && !(compare > price))
      return setError("Compare-at price must be higher than the price.");
    if (!Number.isFinite(stock) || stock < 0)
      return setError("Stock must be 0 or more.");

    setSaving(true);
    try {
      const supabase = createClient();
      const uploaded = await Promise.all(
        files.map((file) => uploadImage(supabase, file, "products")),
      );

      const payload = {
        name: f.name.trim(),
        description: f.description.trim() || null,
        category_id: f.category_id || null,
        price,
        compare_at_price: compare,
        stock,
        pack_size: f.pack_size.trim() || null,
        weight_grams: f.weight_grams.trim()
          ? Math.round(Number(f.weight_grams))
          : null,
        shelf_life: f.shelf_life.trim() || null,
        storage_instructions: f.storage_instructions.trim() || null,
        images: [...existing, ...uploaded],
        is_active: f.is_active,
        is_featured: f.is_featured,
      };

      const { error } = product
        ? await supabase.from("products").update(payload).eq("id", product.id)
        : await supabase.from("products").insert({
            ...payload,
            slug: slugify(f.name) || crypto.randomUUID().slice(0, 8),
          });

      if (error) {
        setError(
          error.code === "23505"
            ? "A product with this name already exists. Please use a different name."
            : error.message,
        );
        setSaving(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  const checkbox =
    "flex cursor-pointer items-center gap-3 rounded-xl border border-dark/10 px-4 py-3 text-sm font-medium transition hover:bg-dark/[0.03]";

  return (
    <form
      onSubmit={onSubmit}
      className="grid items-start gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <Card title="Details">
          <div className="space-y-4">
            <Field label="Name">
              <input
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Soft smoked catfish"
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={5}
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
                className={`${inputCls} resize-y`}
              />
            </Field>
            <Field label="Category">
              <select
                value={f.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={inputCls}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <Card title="Pricing & stock">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (₦)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={f.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="Compare-at price (₦)"
              hint="Old price, shown crossed out"
            >
              <input
                type="number"
                min="0"
                step="0.01"
                value={f.compare_at_price}
                onChange={(e) => set("compare_at_price", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                min="0"
                step="1"
                value={f.stock}
                onChange={(e) => set("stock", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        <Card title="Product info">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pack size" hint="e.g. 500g, 1kg, 5 pieces">
              <input
                value={f.pack_size}
                onChange={(e) => set("pack_size", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Weight (grams)">
              <input
                type="number"
                min="0"
                step="1"
                value={f.weight_grams}
                onChange={(e) => set("weight_grams", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Shelf life" hint="e.g. 3 months frozen">
              <input
                value={f.shelf_life}
                onChange={(e) => set("shelf_life", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Storage instructions">
              <input
                value={f.storage_instructions}
                onChange={(e) => set("storage_instructions", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8">
        <Card title="Images">
          <div className="grid grid-cols-3 gap-2">
            {existing.map((src, i) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-xl bg-dark/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-dark/80 px-2 py-0.5 text-[10px] font-semibold text-light">
                    Cover
                  </span>
                )}
                {i > 0 && (
                  <button
                    type="button"
                    aria-label="Make cover image"
                    onClick={() =>
                      setExisting((l) => [src, ...l.filter((x) => x !== src)])
                    }
                    className="absolute bottom-1 left-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-dark opacity-0 transition group-hover:opacity-100"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setExisting((l) => l.filter((x) => x !== src))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-dark transition hover:bg-red-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {previews.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-xl bg-dark/5 ring-2 ring-accent/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() =>
                    setFiles((l) => l.filter((_, idx) => idx !== i))
                  }
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-dark transition hover:bg-red-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-dark/15 text-dark/40 transition hover:border-accent hover:text-accent">
              <ImagePlus className="h-6 w-6" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? []);
                  if (picked.length) setFiles((l) => [...l, ...picked]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-dark/45">
            The first image is the cover. Hover an image and tap the star to
            make it the cover.
          </p>
        </Card>

        <Card title="Visibility">
          <div className="space-y-2">
            <label className={checkbox}>
              <input
                type="checkbox"
                checked={f.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Active (visible on store)
            </label>
            <label className={checkbox}>
              <input
                type="checkbox"
                checked={f.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Featured on home page
            </label>
          </div>
        </Card>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`${btnPrimary} flex-1`}
          >
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
          <Link href="/admin/products" className={btnGhost}>
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
