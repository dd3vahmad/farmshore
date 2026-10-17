import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/db";
import {
  btnPrimary,
  Card,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { naira } from "@/lib/admin-utils";
import DeleteRowButton from "@/components/admin/DeleteRowButton";

export default async function AdminProducts() {
  const supabase = await createClient();
  const [{ data: prods }, { data: cats }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
  ]);

  const products = (prods ?? []) as Product[];
  const catName = new Map((cats ?? []).map((c) => [c.id, c.name]));

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"}`}
        action={
          <Link href="/admin/products/new" className={btnPrimary}>
            <Plus className="h-4 w-4" /> Add product
          </Link>
        }
      />

      <Card className="p-0! overflow-hidden">
        {products.length === 0 ? (
          <p className="p-8 text-center text-sm text-dark/50">
            No products yet. Add your first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-dark/5 text-xs uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Price</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {products.map((p) => (
                  <tr key={p.id} className="transition hover:bg-dark/2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary/10">
                          {p.images?.[0] && (
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-semibold">
                            <span className="truncate">{p.name}</span>
                            {p.is_featured && (
                              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                            )}
                          </p>
                          {p.pack_size && (
                            <p className="text-xs text-dark/50">
                              {p.pack_size}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-dark/70">
                      {p.category_id
                        ? (catName.get(p.category_id) ?? "—")
                        : "—"}
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      {naira(p.price)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={
                          p.stock === 0
                            ? "font-bold text-red-600"
                            : p.stock <= 5
                              ? "font-bold text-amber-600"
                              : ""
                        }
                      >
                        {p.stock === 0 ? "Out of stock" : p.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge value={p.is_active ? "active" : "hidden"} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          aria-label={`Edit ${p.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-dark/50 transition hover:bg-dark/5 hover:text-dark"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          aria-label={`View ${p.name} on the store`}
                          className="grid h-9 w-9 place-items-center rounded-full text-dark/50 transition hover:bg-dark/5 hover:text-dark"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <DeleteRowButton
                          table="products"
                          id={p.id}
                          label={p.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
