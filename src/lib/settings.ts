import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/db";

const FALLBACK: SiteSettings = {
  id: 1,
  brand_name: "Your Brand Name",
  tagline: "Premium smoked fish, delivered fresh to your door.",
  logo_url: null,
  color_primary: "#166534",
  color_accent: "#16a34a",
  color_dark: "#0b1f14",
  color_light: "#ffffff",
  hero_title: "Rich, smoky flavour. Ready when you are.",
  hero_subtitle: "Carefully smoked fish cutlets, delivered to you.",
  hero_image_url: null,
  announcement_text: null,
  delivery_fee: 0,
  free_delivery_above: null,
  whatsapp_number: "",
  instagram_handle: null,
};

// cache() dedupes the query within a single request
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return { ...FALLBACK, ...(data ?? {}) } as SiteSettings;
});
