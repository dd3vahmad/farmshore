import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/admin/CategoryManager";
import type { Category } from "@/types/db";

export default async function AdminCategories() {
  const supabase = await createClient();
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("category_id"),
  ]);

  const counts = new Map<string, number>();
  for (const p of prods ?? []) {
    if (p.category_id)
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }

  const categories = ((cats ?? []) as Category[]).map((c) => ({
    ...c,
    count: counts.get(c.id) ?? 0,
  }));

  return <CategoryManager categories={categories} />;
}
