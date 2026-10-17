import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/types/db";

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0];
  const soldOut = p.stock <= 0;
  const hasDeal = p.compare_at_price != null && p.compare_at_price > p.price;
  const off = hasDeal
    ? Math.round(((p.compare_at_price! - p.price) / p.compare_at_price!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-dark/15"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-primary/10">
        {img ? (
          <Image
            src={img}
            alt={p.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className={`object-cover transition duration-700 group-hover:scale-110 ${
              soldOut ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark text-5xl font-extrabold text-light/30">
            {p.name.charAt(0)}
          </span>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <span className="rounded-full bg-dark/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-light backdrop-blur">
              Sold out
            </span>
          ) : (
            hasDeal && (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-dark">
                {off}% off
              </span>
            )
          )}
        </div>

        {/* Quick-add style button (the whole card links to the product page) */}
        {!soldOut && (
          <span
            aria-hidden
            className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-dark shadow-lg transition duration-300 group-hover:bg-accent group-hover:text-light"
          >
            <Plus className="h-5 w-5" />
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {p.pack_size && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            {p.pack_size}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-dark sm:text-lg">
          {p.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-extrabold text-primary sm:text-xl">
            {naira(p.price)}
          </span>
          {hasDeal && (
            <span className="text-sm text-dark/40 line-through">
              {naira(p.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
