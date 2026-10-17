"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { CartProduct, toCartItem, useCartQty } from "@/store/cart-hooks";

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

function Stepper({
  value,
  onMinus,
  onPlus,
  plusDisabled,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  plusDisabled?: boolean;
}) {
  const btn =
    "grid h-11 w-11 place-items-center rounded-full text-dark transition hover:bg-dark/10 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex items-center rounded-full border border-dark/15 bg-white p-1">
      <button
        type="button"
        onClick={onMinus}
        aria-label="Decrease quantity"
        className={btn}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-lg font-extrabold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={onPlus}
        disabled={plusDisabled}
        aria-label="Increase quantity"
        className={btn}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProductPurchase({ p }: { p: CartProduct }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const inCart = useCartQty(p.id);
  const [n, setN] = useState(1);

  if (p.stock <= 0) {
    return (
      <p className="rounded-2xl bg-dark/5 px-5 py-4 text-center font-semibold text-dark/60">
        Currently sold out
      </p>
    );
  }

  if (inCart > 0) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Stepper
            value={inCart}
            onMinus={() => setQty(p.id, inCart - 1)}
            onPlus={() => setQty(p.id, inCart + 1)}
            plusDisabled={inCart >= p.stock}
          />
          <Link
            href="/cart"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-dark px-6 py-3.5 font-semibold text-light transition hover:bg-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            View cart · {naira(inCart * p.price)}
          </Link>
        </div>
        <p className="text-sm text-dark/60">
          {inCart} in your cart
          {inCart >= p.stock && " (all we have in stock)"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Stepper
          value={n}
          onMinus={() => setN((v) => Math.max(1, v - 1))}
          onPlus={() => setN((v) => Math.min(p.stock, v + 1))}
          plusDisabled={n >= p.stock}
        />
        <button
          type="button"
          onClick={() => {
            add(toCartItem(p), n);
            setN(1);
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-light transition hover:opacity-90 active:scale-[0.98]"
        >
          <ShoppingBag className="h-5 w-5" />
          Add to cart · {naira(n * p.price)}
        </button>
      </div>
      {p.stock <= 5 && (
        <p className="text-sm font-medium text-amber-600">
          Only {p.stock} left
        </p>
      )}
    </div>
  );
}
