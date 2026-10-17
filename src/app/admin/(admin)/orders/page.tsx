import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import OrdersTable, { type Order } from "@/components/admin/OrdersTable";

export default async function AdminOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Tap an order to see the full details."
      />
      <OrdersTable initial={(data ?? []) as Order[]} />
    </>
  );
}
