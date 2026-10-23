import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/supabase/gallery";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function AdminGallery() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <GalleryManager items={(data ?? []) as GalleryItem[]} />;
}
