"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartCount } from "@/store/cart-hooks";

export default function CartButton() {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative ml-1 grid h-10 w-10 place-items-center rounded-full text-light transition hover:bg-light/10"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-light ring-2 ring-dark">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
