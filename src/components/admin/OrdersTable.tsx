"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { naira, waNumber } from "@/lib/admin-utils";
import { Card, StatusBadge } from "./ui";
import { FaWhatsapp } from "react-icons/fa6";

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  items: { name: string; qty: number; price: number }[];
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  status: string;
  payment_status: string;
  payment_reference: string | null;
  created_at: string;
};

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const label = (s: string) => s.replace(/_/g, " ");

export default function OrdersTable({ initial }: { initial: Order[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const shown =
    filter === "all" ? rows : rows.filter((o) => o.status === filter);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    const { error } = await createClient()
      .from("orders")
      .update({ status })
      .eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((r) => r.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const tab = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
      active
        ? "bg-dark text-light"
        : "bg-white text-dark/60 ring-1 ring-dark/10 hover:text-dark"
    }`;

  return (
    <>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={tab(filter === "all")}
        >
          All ({rows.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={tab(filter === s)}
          >
            {label(s)} ({rows.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <Card className="p-0! overflow-hidden">
        {shown.length === 0 ? (
          <p className="p-8 text-center text-sm text-dark/50">
            No orders here yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-left text-sm">
              <thead className="border-b border-dark/5 text-xs uppercase tracking-wider text-dark/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-3 py-3 font-semibold">Customer</th>
                  <th className="px-3 py-3 font-semibold">Items</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  <th className="px-3 py-3 font-semibold">Payment</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => {
                  const open = openId === o.id;
                  const count = (o.items ?? []).reduce((n, i) => n + i.qty, 0);
                  return (
                    <Fragment key={o.id}>
                      <tr
                        onClick={() => setOpenId(open ? null : o.id)}
                        className="cursor-pointer border-t border-dark/5 transition hover:bg-dark/2"
                      >
                        <td className="px-5 py-3">
                          <p className="font-bold">{o.order_number}</p>
                          <p
                            className="text-xs text-dark/50"
                            suppressHydrationWarning
                          >
                            {new Date(o.created_at).toLocaleString("en-NG", {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-semibold">{o.customer_name}</p>
                          <p className="text-xs text-dark/50">{o.phone}</p>
                        </td>
                        <td className="px-3 py-3">{count}</td>
                        <td className="px-3 py-3 font-bold">
                          {naira(o.total)}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge value={o.payment_status} />
                        </td>
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={o.status}
                            disabled={busy === o.id}
                            onChange={(e) => setStatus(o.id, e.target.value)}
                            className="rounded-full border border-dark/15 bg-white px-3 py-1.5 text-xs font-semibold capitalize outline-none focus:border-accent disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {label(s)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <ChevronDown
                            className={`h-4 w-4 text-dark/40 transition ${open ? "rotate-180" : ""}`}
                          />
                        </td>
                      </tr>

                      {open && (
                        <tr className="bg-dark/3">
                          <td colSpan={7} className="px-5 py-5">
                            <div className="grid gap-6 md:grid-cols-3">
                              <div>
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark/50">
                                  Items
                                </h3>
                                <ul className="space-y-1.5 text-sm">
                                  {(o.items ?? []).map((i, idx) => (
                                    <li
                                      key={idx}
                                      className="flex justify-between gap-3"
                                    >
                                      <span>
                                        {i.qty} × {i.name}
                                      </span>
                                      <span className="font-semibold">
                                        {naira(i.qty * i.price)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <dl className="mt-3 space-y-1 border-t border-dark/10 pt-3 text-sm">
                                  <div className="flex justify-between">
                                    <dt className="text-dark/60">Subtotal</dt>
                                    <dd>{naira(o.subtotal)}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-dark/60">Delivery</dt>
                                    <dd>{naira(o.delivery_fee)}</dd>
                                  </div>
                                  <div className="flex justify-between font-extrabold">
                                    <dt>Total</dt>
                                    <dd>{naira(o.total)}</dd>
                                  </div>
                                </dl>
                              </div>

                              <div className="text-sm">
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark/50">
                                  Delivery
                                </h3>
                                <p className="font-semibold">
                                  {o.customer_name}
                                </p>
                                <p className="text-dark/70">
                                  {[o.address, o.city, o.state]
                                    .filter(Boolean)
                                    .join(", ") || "No address given"}
                                </p>
                                {o.email && (
                                  <p className="text-dark/70">{o.email}</p>
                                )}
                                {o.notes && (
                                  <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-900">
                                    “{o.notes}”
                                  </p>
                                )}
                              </div>

                              <div className="text-sm">
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark/50">
                                  Contact & payment
                                </h3>
                                <a
                                  href={`https://wa.me/${waNumber(o.phone)}?text=${encodeURIComponent(`Hello ${o.customer_name}, about your order ${o.order_number}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-semibold text-light transition hover:opacity-90"
                                >
                                  <FaWhatsapp className="h-4 w-4" />
                                  WhatsApp {o.phone}
                                </a>
                                <p className="mt-3 text-dark/60">
                                  Ref:{" "}
                                  <span className="font-mono text-xs">
                                    {o.payment_reference ?? "—"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
