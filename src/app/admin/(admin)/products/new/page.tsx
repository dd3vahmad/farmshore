import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";
import type { Category } from "@/types/db";

export default async function NewProduct() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <>
      <PageHeader
        title="Add product"
        back={{ href: "/admin/products", label: "Products" }}
      />
      <ProductForm categories={(data ?? []) as Category[]} />
    </>
  );
}
