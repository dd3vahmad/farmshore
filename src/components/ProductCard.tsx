"use client";

import Link from "next/link";
import Image from "next/image";
import { naira } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/db";

export default function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const soldOut = p.stock <= 0;
  const discount =
    p.compare_at_price && p.compare_at_price > p.price
      ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
      : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-dark/10 bg-white">
      <Link
        href={`/products/${p.slug}`}
        className="relative aspect-square bg-primary/5"
      >
        {p.images[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(max-width:640px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">🐟</div>
        )}
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-bold text-light">
            -{discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute right-2 top-2 rounded-full bg-dark px-2 py-1 text-xs font-bold text-light">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/products/${p.slug}`}
          className="line-clamp-2 font-medium hover:text-primary"
        >
          {p.name}
        </Link>
        {p.pack_size && <p className="text-sm text-dark/60">{p.pack_size}</p>}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {naira(p.price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-dark/40 line-through">
              {naira(p.compare_at_price!)}
            </span>
          )}
        </div>

        <button
          disabled={soldOut}
          onClick={() =>
            add({
              id: p.id,
              slug: p.slug,
              name: p.name,
              price: p.price,
              image: p.images[0] ?? null,
              stock: p.stock,
            })
          }
          className="mt-3 rounded-full bg-primary py-2 text-sm font-semibold text-light transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
