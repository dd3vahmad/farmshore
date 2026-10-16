import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/db";

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;

  return (
    <section className="bg-[#f5f2e8] py-16 text-dark sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            Explore
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shop by{" "}
            <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="mt-4 text-base text-dark/60 sm:text-lg">
            Tap any category to see what&apos;s fresh from our farm.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group relative isolate aspect-square overflow-hidden rounded-3xl bg-primary/20 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-dark/20"
            >
              {c.image_url ? (
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 25vw"
                  className="-z-10 object-cover transition duration-700 group-hover:scale-110"
                />
              ) : (
                <span className="absolute inset-0 -z-10 grid place-items-center bg-linear-to-br from-primary to-dark text-6xl font-extrabold text-light/30">
                  {c.name.charAt(0)}
                </span>
              )}

              <div className="absolute inset-0 -z-10 bg-linear-to-t from-dark/80 via-dark/10 to-transparent transition-opacity duration-300 group-hover:from-dark/90" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="text-lg font-extrabold leading-tight text-light sm:text-xl">
                  {c.name}
                </h3>
                <span className="mt-2 grid h-7 w-7 place-items-center rounded-full border border-accent/20 bg-accent/10 text-accent/40 backdrop-blur transition duration-300 sm:h-8 sm:w-8 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
