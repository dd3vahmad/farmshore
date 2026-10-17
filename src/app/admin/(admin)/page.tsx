import Link from "next/link";
import { AlertTriangle, Clock, ShoppingBag, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { naira } from "@/lib/admin-utils";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";

const LOW_STOCK = 5;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [paid, orders, pending, low, recent, lowList] = await Promise.all([
    supabase.from("orders").select("total").eq("payment_status", "paid"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .lte("stock", LOW_STOCK),
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("products")
      .select("id, name, stock")
      .eq("is_active", true)
      .lte("stock", LOW_STOCK)
      .order("stock", { ascending: true })
      .limit(6),
  ]);

  const sales = (paid.data ?? []).reduce((n, o) => n + Number(o.total), 0);

  const stats = [
    {
      label: "Total sales",
      value: naira(sales),
      icon: Wallet,
      tone: "bg-accent/15 text-accent",
    },
    {
      label: "Total orders",
      value: String(orders.count ?? 0),
      icon: ShoppingBag,
      tone: "bg-sky-100 text-sky-700",
    },
    {
      label: "Pending",
      value: String(pending.count ?? 0),
      icon: Clock,
      tone: "bg-amber-100 text-amber-700",
    },
    {
      label: "Low stock",
      value: String(low.count ?? 0),
      icon: AlertTriangle,
      tone: "bg-red-100 text-red-600",
    },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="How the farm shop is doing" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-dark/60">{label}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold tracking-tight">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {(recent.data ?? []).length === 0 ? (
            <p className="py-6 text-sm text-dark/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-dark/5">
              {recent.data!.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {o.customer_name}
                    </p>
                    <p className="text-xs text-dark/50">
                      {o.order_number} ·{" "}
                      <span suppressHydrationWarning>
                        {new Date(o.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge value={o.status} />
                    <span className="w-24 text-right text-sm font-extrabold">
                      {naira(o.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Running low">
          {(lowList.data ?? []).length === 0 ? (
            <p className="text-sm text-dark/50">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {lowList.data!.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-dark/5"
                  >
                    <span className="truncate font-medium">{p.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        p.stock === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock === 0 ? "Out" : `${p.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
