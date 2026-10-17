import type { SupabaseClient } from "@supabase/supabase-js";

export const naira = (n: number | string) =>
  `₦${Number(n).toLocaleString("en-NG")}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("store-assets")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return supabase.storage.from("store-assets").getPublicUrl(path).data
    .publicUrl;
}

export function waNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") ? `234${d.slice(1)}` : d;
}
