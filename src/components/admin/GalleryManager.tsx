"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { uploadImage } from "@/lib/admin-utils";
import {
  normalizeUrl,
  parseMedia,
  PLATFORM_LABEL,
  resolveItem,
  type GalleryItem,
  type Orientation,
  type Platform,
} from "@/lib/supabase/gallery";
import {
  btnGhost,
  btnPrimary,
  Card,
  Field,
  inputCls,
  PageHeader,
  StatusBadge,
} from "./ui";
import ImageField from "./ImageField";
import SocialIcon, { SocialName } from "../SocialIcon";

const iconFor = (p: Platform | null): SocialName | null =>
  !p || p === "other" ? null : p === "x" ? "twitter" : p;

const EMPTY = {
  title: "",
  description: "",
  tag: "",
  event_date: "",
  link_url: "",
  orientation: "landscape" as Orientation,
  is_published: true,
  sort_order: "0",
};

type Modal = { mode: "new" } | { mode: "edit"; item: GalleryItem } | null;

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<Modal>(null);
  const [f, setF] = useState(EMPTY);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orientationTouched = useRef(false);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const tags = Array.from(
    new Set(items.map((i) => i.tag).filter(Boolean)),
  ) as string[];

  function open(m: Modal) {
    setError(null);
    setFile(null);
    orientationTouched.current = m?.mode === "edit";
    if (m?.mode === "edit") {
      const i = m.item;
      setF({
        title: i.title,
        description: i.description ?? "",
        tag: i.tag ?? "",
        event_date: i.event_date ?? "",
        link_url: i.link_url ?? "",
        orientation: i.orientation,
        is_published: i.is_published,
        sort_order: String(i.sort_order),
      });
      setImageUrl(i.image_url);
    } else {
      setF(EMPTY);
      setImageUrl(null);
    }
    setModal(m);
  }

  function setOrientation(o: Orientation, manual = false) {
    if (manual) orientationTouched.current = true;
    set("orientation", o);
  }

  function onLink(v: string) {
    set("link_url", v);
    if (!orientationTouched.current && v.trim()) {
      const m = parseMedia(v);
      if (m.isVideo || m.portrait)
        setOrientation(m.portrait ? "portrait" : "landscape");
    }
  }

  function onPick(picked: File | null) {
    setFile(picked);
    if (!picked || orientationTouched.current) return;
    const url = URL.createObjectURL(picked);
    const img = new globalThis.Image();
    img.onload = () => {
      if (!orientationTouched.current)
        setOrientation(
          img.naturalHeight > img.naturalWidth ? "portrait" : "landscape",
        );
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const link = f.link_url.trim();
  const media = link ? parseMedia(link) : null;
  const hasImage = !!(file || imageUrl);

  let hint =
    "Optional. Paste a YouTube, Instagram, Facebook, TikTok or X link.";
  if (media && hasImage)
    hint =
      "Because you added an image, tapping it on the site opens this link.";
  else if (media?.embedUrl)
    hint = `${PLATFORM_LABEL[media.platform]} ${media.isVideo ? "video" : "post"} detected: visitors can ${media.isVideo ? "watch it" : "view it"} right on your site.`;
  else if (media)
    hint = `${PLATFORM_LABEL[media.platform]} link: shown as a banner that opens the link${media.platform === "youtube" ? "" : ". Add an image for a nicer banner."}`;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!f.title.trim()) return setError("Please enter a title.");
    if (!hasImage && !link) return setError("Add an image, a link, or both.");

    let normalized: string = "";
    if (link) {
      normalized = normalizeUrl(link);
      try {
        new URL(normalized);
      } catch {
        return setError("That link doesn't look valid.");
      }
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const image = file
        ? await uploadImage(supabase, file, "gallery")
        : imageUrl;
      const payload = {
        title: f.title.trim(),
        description: f.description.trim() || null,
        tag: f.tag.trim() || null,
        event_date: f.event_date || null,
        image_url: image,
        link_url: normalized,
        orientation: f.orientation,
        is_published: f.is_published,
        sort_order: Math.floor(Number(f.sort_order)) || 0,
      };
      const { error } =
        modal?.mode === "edit"
          ? await supabase
              .from("gallery_items")
              .update(payload)
              .eq("id", modal.item.id)
          : await supabase.from("gallery_items").insert(payload);
      if (error) throw error;
      setModal(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(false);
  }

  async function remove(i: GalleryItem) {
    if (!confirm(`Delete "${i.title}"? This cannot be undone.`)) return;
    const { error } = await createClient()
      .from("gallery_items")
      .delete()
      .eq("id", i.id);
    if (error) return alert(error.message);
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Key moments and events shown in the Gallery section on your home page."
        action={
          <button
            type="button"
            onClick={() => open({ mode: "new" })}
            className={btnPrimary}
          >
            <Plus className="h-4 w-4" /> Add to gallery
          </button>
        }
      />

      {items.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-dark/50">
            Nothing here yet. Upload a photo, or paste a YouTube, Instagram,
            Facebook or TikTok link.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((g) => {
            const r = resolveItem(g);
            const icon = iconFor(r.platform);
            return (
              <div
                key={g.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark/5"
              >
                <div className="relative aspect-video bg-dark/5">
                  {r.thumb ? (
                    r.thumbIsUpload ? (
                      <Image
                        src={r.thumb}
                        alt={g.title}
                        fill
                        sizes="(max-width:1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.thumb}
                        alt={g.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark">
                      {icon ? (
                        <SocialIcon
                          name={icon}
                          className="h-10 w-10 text-light/30"
                        />
                      ) : (
                        <ExternalLink className="h-9 w-9 text-light/30" />
                      )}
                    </div>
                  )}
                  {r.isVideo && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-dark/50 text-light backdrop-blur">
                        <Play className="h-4 w-4 fill-current" />
                      </span>
                    </span>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-dark/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-light">
                    {g.orientation === "portrait" ? "9:16" : "16:9"}
                  </span>
                </div>

                <div className="p-3">
                  <p className="truncate text-sm font-bold">{g.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {!g.is_published && <StatusBadge value="hidden" />}
                    {r.platform && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-dark/5 px-2 py-0.5 text-[11px] font-semibold text-dark/60">
                        {icon && <SocialIcon name={icon} className="h-3 w-3" />}
                        {PLATFORM_LABEL[r.platform]}
                      </span>
                    )}
                    {g.tag && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {g.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => open({ mode: "edit", item: g })}
                      aria-label={`Edit ${g.title}`}
                      className="grid h-8 w-8 place-items-center rounded-full text-dark/50 hover:bg-dark/5 hover:text-dark"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(g)}
                      aria-label={`Delete ${g.title}`}
                      className="grid h-8 w-8 place-items-center rounded-full text-dark/50 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-dark/60 p-4"
          onClick={() => setModal(null)}
        >
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto my-6 w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-extrabold tracking-tight">
              {modal.mode === "edit" ? "Edit gallery item" : "Add to gallery"}
            </h2>

            <Field label="Title">
              <input
                value={f.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Harvest day at the pond"
                className={inputCls}
                autoFocus
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={3}
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What happened? Who was there?"
                className={`${inputCls} resize-y`}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tag" hint="Groups and labels the item">
                <input
                  list="gallery-tags"
                  value={f.tag}
                  onChange={(e) => set("tag", e.target.value)}
                  placeholder="Harvest, Event…"
                  className={inputCls}
                />
                <datalist id="gallery-tags">
                  {tags.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  value={f.event_date}
                  onChange={(e) => set("event_date", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field
              label="Link (YouTube, Instagram, Facebook, TikTok, X…)"
              hint={hint}
            >
              <input
                value={f.link_url}
                onChange={(e) => onLink(e.target.value)}
                placeholder="https://"
                className={inputCls}
              />
            </Field>

            <ImageField
              label="Image / banner"
              current={imageUrl}
              file={file}
              onFile={onPick}
              onRemove={() => setImageUrl(null)}
              hint={
                media && !hasImage && !media.thumbnail
                  ? "Recommended: this platform has no automatic preview."
                  : "Optional if you added a link."
              }
            />

            <div>
              <span className="mb-1.5 block text-sm font-medium text-dark/70">
                Shape on the site
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(["landscape", "portrait"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOrientation(o, true)}
                    className={`flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      f.orientation === o
                        ? "border-accent bg-accent/10 text-primary"
                        : "border-dark/15 text-dark/60 hover:bg-dark/5"
                    }`}
                  >
                    <span
                      className={`block border-2 border-current ${o === "landscape" ? "h-4 w-7" : "h-7 w-4"} rounded-sm`}
                    />
                    {o === "landscape" ? "Landscape 16:9" : "Portrait 9:16"}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-dark/45">
                Set automatically from your image or link. Change it if needed.
              </p>
            </div>

            <div className="grid items-end gap-4 sm:grid-cols-2">
              <Field
                label="Order"
                hint="Lower shows first. Leave 0 for newest first."
              >
                <input
                  type="number"
                  step="1"
                  value={f.sort_order}
                  onChange={(e) => set("sort_order", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark/10 px-4 py-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={f.is_published}
                  onChange={(e) => set("is_published", e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                Show on website
              </label>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setModal(null)}
                className={btnGhost}
              >
                Cancel
              </button>
              <button type="submit" disabled={busy} className={btnPrimary}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
