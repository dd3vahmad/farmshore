import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/db";

export default function ProductRow({
  title,
  accent,
  href,
  products,
}: {
  title: string;
  accent: string;
  href: string;
  products: Product[];
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">
          {title} <span className="text-primary">{accent}</span>
        </h2>
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:underline"
        >
          See all →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
