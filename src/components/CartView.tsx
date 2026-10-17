"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { FaWhatsapp } from "react-icons/fa6";

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

export default function CartView({
  deliveryFee,
  freeAbove,
  whatsapp,
}: {
  deliveryFee: number;
  freeAbove: number | null;
  whatsapp: string | null;
}) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  // cart lives in localStorage; wait for the browser before rendering it
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="h-64 animate-pulse rounded-3xl bg-dark/5" />
        <div className="h-64 animate-pulse rounded-3xl bg-dark/5" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-dark/5">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
          <ShoppingBag className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
          Your cart is empty
        </h2>
        <p className="mt-2 text-dark/60">
          Add something delicious and it will show up here.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3 font-semibold text-light transition hover:bg-primary"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
  const free = freeAbove != null && freeAbove > 0 && subtotal >= freeAbove;
  const delivery = free ? 0 : deliveryFee;
  const total = subtotal + delivery;
  const toFree =
    freeAbove != null && freeAbove > 0 && !free ? freeAbove - subtotal : 0;

  const waText = [
    "Hello, I'd like to order:",
    ...items.map((i) => `• ${i.qty} × ${i.name} (${naira(i.price * i.qty)})`),
    `Subtotal: ${naira(subtotal)}`,
  ].join("\n");

  const stepBtn =
    "grid h-8 w-8 place-items-center rounded-full text-dark transition hover:bg-dark/10 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      {/* Items */}
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex gap-4 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-dark/5 sm:p-4"
          >
            <Link
              href={`/products/${i.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-primary/10 sm:h-28 sm:w-28"
            >
              {i.image ? (
                <Image
                  src={i.image}
                  alt={i.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark text-3xl font-extrabold text-light/30">
                  {i.name.charAt(0)}
                </span>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/products/${i.slug}`}
                  className="line-clamp-2 font-extrabold leading-snug tracking-tight hover:text-primary"
                >
                  {i.name}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  aria-label={`Remove ${i.name}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-dark/40 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-0.5 text-sm text-dark/50">
                {naira(i.price)} each
              </p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-dark/15 p-0.5">
                  <button
                    type="button"
                    onClick={() => setQty(i.id, i.qty - 1)}
                    aria-label="Decrease quantity"
                    className={stepBtn}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold tabular-nums">
                    {i.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(i.id, i.qty + 1)}
                    disabled={i.qty >= i.stock}
                    aria-label="Increase quantity"
                    className={stepBtn}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-lg font-extrabold text-primary">
                  {naira(i.price * i.qty)}
                </span>
              </div>
            </div>
          </li>
        ))}

        <li className="flex items-center justify-between px-1 pt-1 text-sm">
          <Link
            href="/products"
            className="font-semibold text-primary hover:underline"
          >
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-dark/50 transition hover:text-red-600"
          >
            Clear cart
          </button>
        </li>
      </ul>

      {/* Summary */}
      <aside className="rounded-3xl bg-dark p-6 text-light shadow-xl shadow-dark/20 lg:sticky lg:top-24">
        <h2 className="text-xl font-extrabold tracking-tight">Order summary</h2>

        {toFree > 0 && (
          <div className="mt-4 rounded-2xl bg-light/10 p-3 text-sm">
            <p>
              Add{" "}
              <span className="font-bold text-amber-400">{naira(toFree)}</span>{" "}
              more for free delivery
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light/15">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{
                  width: `${Math.min(100, (subtotal / freeAbove!) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-light/60">Subtotal</dt>
            <dd className="font-semibold">{naira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-light/60">Delivery</dt>
            <dd className="font-semibold">
              {delivery === 0 ? (
                <span className="text-accent">Free</span>
              ) : (
                naira(delivery)
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-light/10 pt-4">
            <dt className="text-base font-semibold">Total</dt>
            <dd className="text-2xl font-extrabold">{naira(total)}</dd>
          </div>
        </dl>

        <Link
          href="/checkout"
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-semibold text-light transition hover:opacity-90 active:scale-[0.98]"
        >
          Checkout <ArrowRight className="h-4 w-4" />
        </Link>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}`}
            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-light/25 px-6 py-3.5 font-semibold transition hover:bg-light/10"
          >
            <FaWhatsapp className="h-5 w-5" />
            Order on WhatsApp
          </a>
        )}

        <p className="mt-4 text-center text-xs text-light/40">
          Secure payment with Paystack
        </p>
      </aside>
    </div>
  );
}
