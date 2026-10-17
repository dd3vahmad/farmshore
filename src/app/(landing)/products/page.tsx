import Link from "next/link";
import { Search, X } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/types/db";

type SP = {
  q?: string;
  category?: string;
  featured?: string;
  deals?: string;
  sort?: string;
};

const SORTS = [
  { key: "new", label: "Newest" },
  { key: "price_asc", label: "Price: low to high" },
  { key: "price_desc", label: "Price: high to low" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const s = await getSettings();

  const q = (sp.q ?? "").trim().slice(0, 80);
  const sort = SORTS.some((x) => x.key === sp.sort) ? sp.sort! : "new";

  const { data: cats } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  const categories = (cats ?? []) as Category[];
  const active = categories.find((c) => c.slug === sp.category);

  let query = supabase.from("products").select("*").eq("is_active", true);
  if (active) query = query.eq("category_id", active.id);
  if (sp.featured === "1") query = query.eq("is_featured", true);
  if (sp.deals === "1") query = query.not("compare_at_price", "is", null);
  if (q) query = query.ilike("name", `%${q.replace(/[%_\\]/g, "")}%`);
  query =
    sort === "price_asc"
      ? query.order("price", { ascending: true })
      : sort === "price_desc"
        ? query.order("price", { ascending: false })
        : query.order("created_at", { ascending: false });

  const { data } = await query.limit(60);
  const products = (data ?? []) as Product[];

  const link = (o: Partial<SP> = {}) => {
    const merged: Record<string, string | undefined> = {
      q: q || undefined,
      category: active?.slug,
      featured: sp.featured,
      deals: sp.deals,
      sort: sort === "new" ? undefined : sort,
      ...o,
    };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const [title, accent] = q
    ? ["Results for", `“${q}”`]
    : sp.featured === "1"
      ? ["Featured", "products"]
      : sp.deals === "1"
        ? ["Best", "deals"]
        : active
          ? ["Shop", active.name]
          : ["Shop", "all products"];

  const filtered = Boolean(
    q || active || sp.featured === "1" || sp.deals === "1",
  );

  const pill = (isActive: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
      isActive
        ? "border-dark bg-dark text-light"
        : "border-dark/15 text-dark/70 hover:border-accent hover:text-accent"
    }`;

  return (
    <>
      <main>
        <section className="relative isolate overflow-hidden bg-dark py-14 text-light sm:py-20">
          <div className="absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="mx-auto max-w-6xl px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
              {s.brand_name}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
              {title}{" "}
              <span className="bg-linear-to-r from-accent via-lime-300 to-amber-400 bg-clip-text text-transparent">
                {accent}
              </span>
            </h1>

            <form
              action="/products"
              method="get"
              className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-light/15 bg-light/10 p-1.5 pl-5 backdrop-blur focus-within:border-accent"
            >
              <Search className="h-4 w-4 shrink-0 text-light/50" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search products…"
                className="min-w-0 flex-1 bg-transparent text-sm text-light outline-none placeholder:text-light/50 sm:text-base"
              />
              {active && (
                <input type="hidden" name="category" value={active.slug} />
              )}
              {sp.featured === "1" && (
                <input type="hidden" name="featured" value="1" />
              )}
              {sp.deals === "1" && (
                <input type="hidden" name="deals" value="1" />
              )}
              {sort !== "new" && (
                <input type="hidden" name="sort" value={sort} />
              )}
              <button
                type="submit"
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-light transition hover:opacity-90"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="bg-[#f5f2e8] py-10 text-dark sm:py-14">
          <div className="mx-auto max-w-6xl px-4">
            {categories.length > 0 && (
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                <Link
                  href={link({ category: "", featured: "", deals: "" })}
                  className={pill(
                    !active && sp.featured !== "1" && sp.deals !== "1",
                  )}
                >
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={link({ category: c.slug, featured: "", deals: "" })}
                    className={pill(active?.id === c.id)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-dark/60">
                {products.length} product{products.length === 1 ? "" : "s"}
                {filtered && (
                  <Link
                    href="/products"
                    className="ml-3 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                  </Link>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="mr-1 font-semibold uppercase tracking-[0.15em] text-dark/40">
                  Sort
                </span>
                {SORTS.map((o) => (
                  <Link
                    key={o.key}
                    href={link({ sort: o.key === "new" ? "" : o.key })}
                    className={`rounded-full px-3 py-1.5 font-medium transition ${
                      sort === o.key
                        ? "bg-dark text-light"
                        : "text-dark/60 hover:bg-dark/10"
                    }`}
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>

            {products.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="text-xl font-extrabold">Nothing found</p>
                <p className="mt-2 text-dark/60">
                  Try a different search or browse everything we have.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-block rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:bg-primary"
                >
                  View all products
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
