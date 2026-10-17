"use client";

import { useSyncExternalStore } from "react";

/**
 * Device-local cart. Lives in localStorage only (nothing is stored in the DB).
 * Item shape matches the `orders.items` snapshot: product_id, name, price, qty, image.
 */
export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  stock: number;
};

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[] | null;
  stock: number;
};

const KEY = "farmshore-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  items = read();
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full / blocked: cart still works for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  ensureLoaded();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      items = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  ensureLoaded();
  return items;
};
const getServerSnapshot = () => EMPTY;

export const cart = {
  add(p: CartProduct, qty = 1) {
    ensureLoaded();
    if (p.stock <= 0) return;
    const existing = items.find((i) => i.product_id === p.id);
    if (existing) {
      commit(
        items.map((i) =>
          i.product_id === p.id
            ? {
                ...i,
                price: p.price,
                stock: p.stock,
                qty: Math.min(i.qty + qty, p.stock),
              }
            : i,
        ),
      );
    } else {
      commit([
        ...items,
        {
          product_id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.images?.[0] ?? null,
          qty: Math.min(qty, p.stock),
          stock: p.stock,
        },
      ]);
    }
  },
  setQty(productId: string, qty: number) {
    ensureLoaded();
    if (qty <= 0) {
      commit(items.filter((i) => i.product_id !== productId));
      return;
    }
    commit(
      items.map((i) =>
        i.product_id === productId ? { ...i, qty: Math.min(qty, i.stock) } : i,
      ),
    );
  },
  remove(productId: string) {
    ensureLoaded();
    commit(items.filter((i) => i.product_id !== productId));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = list.reduce((n, i) => n + i.qty, 0);
  const total = list.reduce((n, i) => n + i.qty * i.price, 0);
  return { items: list, count, total };
}
