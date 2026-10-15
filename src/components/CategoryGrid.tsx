import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/db";

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold">
        Shop by <span className="text-primary">category</span>
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-primary/10"
          >
            {c.image_url && (
              <Image
                src={c.image_url}
                alt={c.name}
                fill
                sizes="(max-width:640px) 50vw, 25vw"
                className="object-cover transition group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-dark/70 to-transparent" />
            <span className="absolute bottom-3 left-3 font-semibold text-light">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
