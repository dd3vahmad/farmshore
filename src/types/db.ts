export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  pack_size: string | null;
  weight_grams: number | null;
  shelf_life: string | null;
  storage_instructions: string | null;
  images: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
};

export type SiteSettings = {
  id: 1;
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  color_primary: string;
  color_accent: string;
  color_dark: string;
  color_light: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  announcement_text: string | null;
  delivery_fee: number;
  free_delivery_above: number | null;
  whatsapp_number: string;
  instagram_handle: string | null;
};
