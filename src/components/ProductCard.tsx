import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/db";
import AddToCartButton from "./AddToCartButton";

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0];
  const soldOut = p.stock <= 0;
  const hasDeal = p.compare_at_price != null && p.compare_at_price > p.price;
  const off = hasDeal
    ? Math.round(((p.compare_at_price! - p.price) / p.compare_at_price!) * 100)
    : 0;
  const href = `/products/${p.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-dark/10">
      {/* Image: opens the product page. The + button sits on top and adds to cart. */}
      <div className="relative aspect-5/4 overflow-hidden bg-primary/10">
        <Link href={href} aria-label={p.name} className="absolute inset-0">
          {img ? (
            <Image
              src={img}
              alt={p.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
              className={`object-cover transition duration-700 group-hover:scale-105 ${
                soldOut ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark text-4xl font-extrabold text-light/30">
              {p.name.charAt(0)}
            </span>
          )}

          {soldOut ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-dark/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-light backdrop-blur">
              Sold out
            </span>
          ) : (
            hasDeal && (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dark">
                {off}% off
              </span>
            )
          )}
        </Link>

        {!soldOut && (
          <AddToCartButton
            p={p}
            className="absolute bottom-2.5 right-2.5 z-10"
          />
        )}
      </div>

      {/* Caption: also opens the product page */}
      <Link href={href} className="flex flex-1 flex-col p-3 sm:p-3.5">
        {p.pack_size && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-accent">
            {p.pack_size}
          </p>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-snug tracking-tight text-dark sm:text-[15px]">
          {p.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-1.5 pt-2">
          <span className="text-base font-extrabold text-primary">
            {naira(p.price)}
          </span>
          {hasDeal && (
            <span className="text-xs text-dark/40 line-through">
              {naira(p.compare_at_price!)}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
