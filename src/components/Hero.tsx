import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/types/db";

export type HeroCategory = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

function splitTitle(title: string): [string, string, string] {
  const m = title.match(/^(.+?,)\s+(.+?\.)\s+(.+)$/);

  if (m) {
    return [m[1], m[2], m[3]];
  }

  // Fallback: Split into 3 parts instead of 2 to satisfy the return type
  const words = title.split(" ");
  const third = Math.ceil(words.length / 3);

  const part1 = words.slice(0, third).join(" ");
  const part2 = words.slice(third, third * 2).join(" ");
  const part3 = words.slice(third * 2).join(" ");

  return [part1, part2, part3];
}

export default function Hero({
  s,
  categories = [],
}: {
  s: SiteSettings;
  categories?: HeroCategory[];
}) {
  const [lead, mid, rest] = splitTitle(s.hero_title ?? "");

  return (
    <section className="relative isolate overflow-hidden bg-dark text-light">
      {s.hero_image_url && (
        <Image
          src={s.hero_image_url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-[70%_center] opacity-70"
        />
      )}

      <div className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="mx-auto flex min-h-[85svh] max-w-6xl flex-col justify-center px-4 py-16 sm:py-24">
        <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-light/15 bg-light/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {s.brand_name}
        </p>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          <span className="block text-light">{lead}</span>
          <span className="block bg-linear-to-r from-amber-400 via-lime-300 to-accent bg-clip-text text-transparent">
            {mid}
          </span>
          {rest && (
            <span className="block bg-linear-to-r from-accent via-lime-300 to-amber-400 bg-clip-text text-transparent">
              {rest}
            </span>
          )}
        </h1>

        {s.tagline && (
          <p className="mt-6 text-sm uppercase tracking-[0.35em] block bg-linear-to-r from-amber-400 via-lime-300 to-accent bg-clip-text text-transparent font-bold sm:text-md">
            {s.tagline}
          </p>
        )}
        {s.hero_subtitle && (
          <p className="mt-4 max-w-xl text-base text-white font-bold sm:text-md">
            {s.hero_subtitle}
          </p>
        )}

        <form
          action="/products"
          method="get"
          className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border border-light/15 bg-light/10 p-1.5 pl-5 backdrop-blur"
        >
          <input
            type="search"
            name="q"
            placeholder="Search smoked catfish, tilapia, fillets…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white font-bold placeholder:text-white focus:outline-none sm:text-base"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-light transition hover:opacity-90"
          >
            Search
          </button>
        </form>

        {s.whatsapp_number && (
          <a
            href={`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Hello, I'd like to place an order.")}`}
            className="mt-3 underline ms-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:text-light hover:underline"
          >
            Prefer to order on WhatsApp
          </a>
        )}

        {categories.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-md uppercase tracking-[0.3em] text-white font-bold">
                Browse categories
              </h2>
              <Link
                href="/products"
                className="rounded-full border border-light/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-light/90 hover:text-light/90"
              >
                All products ›
              </Link>
            </div>

            <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 lg:grid-cols-8 [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => (
                <li key={c.id} className="w-24 shrink-0 snap-start sm:w-auto">
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-light/15 bg-light/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent"
                  >
                    <div className="relative aspect-square bg-primary/40">
                      {c.image_url ? (
                        <Image
                          src={c.image_url}
                          alt=""
                          fill
                          sizes="(min-width: 828px) 160px, (min-width: 640px) 25vw, 96px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center text-3xl font-bold text-light/40">
                          {c.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <p className="truncate px-2 py-1.5 text-white text-center text-sm sm:text-sm font-bold">
                      {c.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
