import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Product } from "@/types/db";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: cats }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title="Edit product"
        subtitle={(product as Product).name}
        back={{ href: "/admin/products", label: "Products" }}
      />
      <ProductForm
        categories={(cats ?? []) as Category[]}
        product={product as Product}
      />
    </>
  );
}
