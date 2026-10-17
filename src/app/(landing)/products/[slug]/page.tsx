import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Scale,
  Snowflake,
} from "lucide-react";
import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";
import type { Category, Product } from "@/types/db";

export const revalidate = 60;

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;
const grams = (g: number) => (g >= 1000 ? `${g / 1000}kg` : `${g}g`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  return {
    title: data?.name ?? "Product",
    description: data?.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const s = await getSettings();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) notFound();
  const p = data as Product;

  let category: Category | null = null;
  if (p.category_id) {
    const { data: c } = await supabase
      .from("categories")
      .select("*")
      .eq("id", p.category_id)
      .maybeSingle();
    category = (c as Category) ?? null;
  }

  let relatedQuery = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .neq("id", p.id)
    .order("created_at", { ascending: false })
    .limit(4);
  if (p.category_id)
    relatedQuery = relatedQuery.eq("category_id", p.category_id);
  const { data: rel } = await relatedQuery;
  const related = (rel ?? []) as Product[];

  const hasDeal = p.compare_at_price != null && p.compare_at_price > p.price;
  const off = hasDeal
    ? Math.round(((p.compare_at_price! - p.price) / p.compare_at_price!) * 100)
    : 0;

  const facts = [
    p.pack_size && { icon: Package, label: "Pack size", value: p.pack_size },
    p.weight_grams && {
      icon: Scale,
      label: "Weight",
      value: grams(p.weight_grams),
    },
    p.shelf_life && { icon: Clock, label: "Shelf life", value: p.shelf_life },
    p.storage_instructions && {
      icon: Snowflake,
      label: "Storage",
      value: p.storage_instructions,
    },
  ].filter(Boolean) as {
    icon: typeof Package;
    label: string;
    value: string;
  }[];

  const ask = s.whatsapp_number
    ? `https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent(`Hello, I have a question about ${p.name}.`)}`
    : null;

  return (
    <main>
      <section className="bg-[#f5f2e8] py-8 text-dark sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-dark/50">
            <Link href="/" className="hover:text-dark">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-dark">
              Shop
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hover:text-dark"
                >
                  {category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              images={p.images ?? []}
              name={p.name}
              badge={hasDeal ? `${off}% off` : undefined}
              soldOut={p.stock <= 0}
            />

            <div className="lg:py-2">
              {category && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                  {category.name}
                </p>
              )}
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {p.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary sm:text-4xl">
                  {naira(p.price)}
                </span>
                {hasDeal && (
                  <>
                    <span className="text-lg text-dark/40 line-through">
                      {naira(p.compare_at_price!)}
                    </span>
                    <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold uppercase text-dark">
                      Save {naira(p.compare_at_price! - p.price)}
                    </span>
                  </>
                )}
              </div>

              {p.description && (
                <p className="mt-5 whitespace-pre-line leading-relaxed text-dark/70">
                  {p.description}
                </p>
              )}

              <div className="mt-7">
                <ProductPurchase p={p} />
              </div>

              {ask && (
                <a
                  href={ask}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-dark/70 underline-offset-4 hover:text-dark hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask a question on WhatsApp
                </a>
              )}

              {facts.length > 0 && (
                <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/5"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dark/50">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold leading-snug">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-light py-14 text-dark sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
              More to love
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              You may also{" "}
              <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
                like
              </span>
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
