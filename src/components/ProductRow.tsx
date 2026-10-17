import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/db";

export default function ProductRow({
  title,
  accent,
  href,
  products,
  eyebrow,
  tone = "light",
}: {
  title: string;
  accent: string;
  href: string;
  products: Product[];
  /** small spaced-out label above the heading, e.g. "Fresh picks" */
  eyebrow?: string;
  /** alternate "light" and "cream" between rows so sections stay distinct */
  tone?: "light" | "cream";
}) {
  if (!products.length) return null;

  return (
    <section
      className={`py-14 text-dark sm:py-20 ${
        tone === "cream" ? "bg-[#f5f2e8]" : "bg-light"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}{" "}
              <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
                {accent}
              </span>
            </h2>
          </div>

          <Link
            href={href}
            className="group flex shrink-0 items-center gap-1.5 border-b-2 border-dark/50 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark/70 transition hover:opacity-70"
          >
            See all
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
