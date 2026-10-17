"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { CartProduct } from "@/lib/cart";
import { toCartItem, useCartQty } from "@/store/cart-hooks";

export default function AddToCartButton({
  p,
  className = "",
}: {
  p: CartProduct;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const inCart = useCartQty(p.id);
  const [done, setDone] = useState(false);

  const maxed = inCart >= p.stock;

  function onAdd() {
    add(toCartItem(p), 1);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={maxed}
      aria-label={maxed ? "Maximum quantity in cart" : `Add ${p.name} to cart`}
      className={`grid h-9 w-9 place-items-center rounded-full shadow-md transition duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 ${
        done
          ? "bg-accent text-light"
          : "bg-white text-dark hover:bg-accent hover:text-light"
      } ${className}`}
    >
      {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
