"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id
                  ? { ...i, qty: Math.min(i.qty + qty, item.stock) }
                  : i,
              ),
            };
          }
          return {
            items: [...s.items, { ...item, qty: Math.min(qty, item.stock) }],
          };
        }),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.id === id ? { ...i, qty: Math.min(qty, i.stock) } : i,
            )
            .filter((i) => i.qty > 0),
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart" },
  ),
);
