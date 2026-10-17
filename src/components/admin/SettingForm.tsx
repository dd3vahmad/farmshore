"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { uploadImage } from "@/lib/admin-utils";
import { btnPrimary, Card, Field, inputCls } from "./ui";
import ImageField from "./ImageField";
import type { SiteSettings } from "@/types/db";

const HEX = /^#[0-9a-fA-F]{3,8}$/;

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10.5 w-12 shrink-0 cursor-pointer rounded-xl border border-dark/15 bg-white p-1"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      </div>
    </Field>
  );
}

export default function SettingsForm({ s }: { s: SiteSettings }) {
  const router = useRouter();
  const [f, setF] = useState({
    brand_name: s.brand_name ?? "",
    tagline: s.tagline ?? "",
    logo_url: s.logo_url ?? null,
    color_primary: s.color_primary ?? "#166534",
    color_accent: s.color_accent ?? "#16a34a",
    color_dark: s.color_dark ?? "#0b1f14",
    color_light: s.color_light ?? "#ffffff",
    hero_title: s.hero_title ?? "",
    hero_subtitle: s.hero_subtitle ?? "",
    hero_image_url: s.hero_image_url ?? null,
    announcement_text: s.announcement_text ?? "",
    delivery_fee: String(s.delivery_fee ?? 0),
    free_delivery_above:
      s.free_delivery_above != null ? String(s.free_delivery_above) : "",
    whatsapp_number: s.whatsapp_number ?? "",
    instagram_handle: s.instagram_handle ?? "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    for (const k of [
      "color_primary",
      "color_accent",
      "color_dark",
      "color_light",
    ] as const) {
      if (!HEX.test(f[k]))
        return setMsg({
          ok: false,
          text: "Colours must be hex values like #166534.",
        });
    }
    const fee = Number(f.delivery_fee || 0);
    const free = f.free_delivery_above.trim()
      ? Number(f.free_delivery_above)
      : null;
    if (!Number.isFinite(fee) || fee < 0)
      return setMsg({ ok: false, text: "Delivery fee must be 0 or more." });
    if (free != null && (!Number.isFinite(free) || free < 0))
      return setMsg({
        ok: false,
        text: "Free delivery amount must be 0 or more.",
      });

    setSaving(true);
    try {
      const supabase = createClient();
      const [logo, hero] = await Promise.all([
        logoFile
          ? uploadImage(supabase, logoFile, "branding")
          : Promise.resolve(f.logo_url),
        heroFile
          ? uploadImage(supabase, heroFile, "branding")
          : Promise.resolve(f.hero_image_url),
      ]);

      const { error } = await supabase
        .from("site_settings")
        .update({
          brand_name: f.brand_name.trim() || null,
          tagline: f.tagline.trim() || null,
          logo_url: logo,
          color_primary: f.color_primary,
          color_accent: f.color_accent,
          color_dark: f.color_dark,
          color_light: f.color_light,
          hero_title: f.hero_title.trim() || null,
          hero_subtitle: f.hero_subtitle.trim() || null,
          hero_image_url: hero,
          announcement_text: f.announcement_text.trim() || null,
          delivery_fee: fee,
          free_delivery_above: free,
          whatsapp_number: f.whatsapp_number.replace(/\D/g, "") || null,
          instagram_handle: f.instagram_handle.trim().replace(/^@/, "") || null,
        })
        .eq("id", 1);

      if (error) throw error;
      setLogoFile(null);
      setHeroFile(null);
      setF((p) => ({ ...p, logo_url: logo, hero_image_url: hero }));
      setMsg({ ok: true, text: "Settings saved." });
      router.refresh();
    } catch (err) {
      setMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Could not save settings.",
      });
    }
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <Card title="Brand">
        <div className="space-y-4">
          <Field label="Brand name">
            <input
              value={f.brand_name}
              onChange={(e) => set("brand_name", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Tagline">
            <input
              value={f.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className={inputCls}
            />
          </Field>
          <ImageField
            label="Logo"
            current={f.logo_url}
            file={logoFile}
            onFile={setLogoFile}
            onRemove={() => set("logo_url", null)}
            hint="Leave empty to use the built-in FarmShore logo."
          />
        </div>
      </Card>

      <Card title="Home page hero">
        <div className="space-y-4">
          <Field
            label="Headline"
            hint="Split at the first full stop or comma: the first part is white, the rest gets the colour gradient."
          >
            <input
              value={f.hero_title}
              onChange={(e) => set("hero_title", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Subtitle">
            <textarea
              rows={2}
              value={f.hero_subtitle}
              onChange={(e) => set("hero_subtitle", e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </Field>
          <ImageField
            label="Hero image"
            current={f.hero_image_url}
            file={heroFile}
            onFile={setHeroFile}
            onRemove={() => set("hero_image_url", null)}
            hint="A wide photo works best."
          />
          <Field
            label="Announcement bar"
            hint="Shown at the very top of the store. Leave empty to hide."
          >
            <input
              value={f.announcement_text}
              onChange={(e) => set("announcement_text", e.target.value)}
              placeholder="e.g. Free delivery on orders above ₦20,000"
              className={inputCls}
            />
          </Field>
        </div>
      </Card>

      <Card title="Colours">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Primary"
            value={f.color_primary}
            onChange={(v) => set("color_primary", v)}
          />
          <ColorField
            label="Accent"
            value={f.color_accent}
            onChange={(v) => set("color_accent", v)}
          />
          <ColorField
            label="Dark"
            value={f.color_dark}
            onChange={(v) => set("color_dark", v)}
          />
          <ColorField
            label="Light"
            value={f.color_light}
            onChange={(v) => set("color_light", v)}
          />
        </div>
      </Card>

      <Card title="Delivery">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Delivery fee (₦)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={f.delivery_fee}
              onChange={(e) => set("delivery_fee", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field
            label="Free delivery above (₦)"
            hint="Leave empty for no free delivery"
          >
            <input
              type="number"
              min="0"
              step="0.01"
              value={f.free_delivery_above}
              onChange={(e) => set("free_delivery_above", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </Card>

      <Card title="Contact">
        <div className="space-y-4">
          <Field
            label="WhatsApp number"
            hint="With country code, no + or spaces, e.g. 2347082876300"
          >
            <input
              value={f.whatsapp_number}
              onChange={(e) => set("whatsapp_number", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Instagram handle">
            <input
              value={f.instagram_handle}
              onChange={(e) => set("instagram_handle", e.target.value)}
              placeholder="farmshore"
              className={inputCls}
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        {msg && (
          <p
            className={`text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-600"}`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
