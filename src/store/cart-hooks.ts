"use client";

import { useEffect, useState } from "react";
import { useCart, type CartItem } from "./cart";

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[] | null;
  stock: number;
};

export function toCartItem(p: CartProduct): Omit<CartItem, "qty"> {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.images?.[0] ?? null,
    stock: p.stock,
  };
}

/**
 * The cart is persisted in localStorage, so the server always renders it empty.
 * Reading it before mount would cause a hydration mismatch, so these hooks
 * return 0 until the component has mounted on the client.
 */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useCartCount() {
  const items = useCart((s) => s.items);
  const mounted = useMounted();
  return mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;
}

export function useCartQty(id: string) {
  const items = useCart((s) => s.items);
  const mounted = useMounted();
  return mounted ? (items.find((i) => i.id === id)?.qty ?? 0) : 0;
}
