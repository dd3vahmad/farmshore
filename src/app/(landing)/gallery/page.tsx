import Gallery from "@/components/Gallery";
import { GalleryItem } from "@/lib/supabase/gallery";
import { createClient } from "@/lib/supabase/server";

const GalleryPage = async () => {
  const supabase = await createClient();
  const gallery = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div>
      <Gallery items={(gallery.data ?? []) as GalleryItem[]} />
    </div>
  );
};

export default GalleryPage;
