"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

export default function CartButton() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []); // avoids hydration mismatch with persisted cart

  return (
    <Link
      href="/cart"
      className="relative rounded-full p-2 hover:bg-primary/10"
      aria-label="Cart"
    >
      <ShoppingBag className="h-6 w-6" />
      {mounted && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-semibold text-light">
          {count}
        </span>
      )}
    </Link>
  );
}
