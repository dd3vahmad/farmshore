import { getSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";
import Announcement from "@/components/Announcement";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductRow from "@/components/ProductRow";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import type { Category, Product } from "@/types/db";
import Contact from "@/components/Contact";
import { GalleryItem } from "@/lib/supabase/gallery";
import Gallery from "@/components/Gallery";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();
  const s = await getSettings();

  const [cats, featured, deals, latest, gallery] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select("*")
      .not("compare_at_price", "is", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("gallery_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return (
    <>
      <Announcement text={s.announcement_text} />
      <Navbar s={s} />
      <main>
        <Hero s={s} categories={cats.data ?? []} />
        <CategoryGrid categories={(cats.data ?? []) as Category[]} />
        <ProductRow
          title="Featured"
          accent="products"
          href="/products?featured=1"
          products={(featured.data ?? []) as Product[]}
        />
        <ProductRow
          title="Best"
          accent="deals"
          href="/products?deals=1"
          products={(deals.data ?? []) as Product[]}
        />
        <ProductRow
          title="Recently"
          accent="added"
          href="/products"
          products={(latest.data ?? []) as Product[]}
        />
        <Gallery items={(gallery.data ?? []) as GalleryItem[]} />
        <TrustStrip />
      </main>
      <Contact s={s} />
      <Footer s={s} />
      <WhatsAppFab number={s.whatsapp_number} />
    </>
  );
}
