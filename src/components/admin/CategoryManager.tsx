"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { slugify, uploadImage } from "@/lib/admin-utils";
import { btnGhost, btnPrimary, Card, Field, inputCls, PageHeader } from "./ui";
import ImageField from "./ImageField";
import type { Category } from "@/types/db";

type Cat = Category & { count: number };
type Modal = { mode: "new" } | { mode: "edit"; cat: Cat } | null;

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<Modal>(null);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("0");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(m: Modal) {
    setError(null);
    setFile(null);
    if (m?.mode === "edit") {
      setName(m.cat.name);
      setOrder(String(m.cat.sort_order));
      setImageUrl(m.cat.image_url);
    } else {
      setName("");
      setOrder(String(categories.length));
      setImageUrl(null);
    }
    setModal(m);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a name.");
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const image = file
        ? await uploadImage(supabase, file, "categories")
        : imageUrl;
      const payload = {
        name: name.trim(),
        image_url: image,
        sort_order: Math.floor(Number(order)) || 0,
      };
      const { error } =
        modal?.mode === "edit"
          ? await supabase
              .from("categories")
              .update(payload)
              .eq("id", modal.cat.id)
          : await supabase.from("categories").insert({
              ...payload,
              slug: slugify(name) || crypto.randomUUID().slice(0, 8),
            });
      if (error) {
        setError(
          error.code === "23505"
            ? "A category with this name already exists."
            : error.message,
        );
        setBusy(false);
        return;
      }
      setModal(null);
      setBusy(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function remove(c: Cat) {
    const note = c.count
      ? ` Its ${c.count} product${c.count === 1 ? "" : "s"} will stay but lose their category.`
      : "";
    if (!confirm(`Delete "${c.name}"?${note}`)) return;
    const { error } = await createClient()
      .from("categories")
      .delete()
      .eq("id", c.id);
    if (error) return alert(error.message);
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="These show on your home page and shop filters, in this order."
        action={
          <button
            type="button"
            onClick={() => open({ mode: "new" })}
            className={btnPrimary}
          >
            <Plus className="h-4 w-4" /> Add category
          </button>
        }
      />

      {categories.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-dark/50">
            No categories yet. Add ones like “Soft smoked fish”, “Dry smoked
            fish” or “Raw fish”.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark/5"
            >
              <div className="relative grid aspect-4/3 place-items-center bg-dark/5">
                {c.image_url ? (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-dark/25" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <span className="shrink-0 rounded-full bg-dark/5 px-2 py-0.5 text-xs font-semibold text-dark/60">
                    {c.count}
                  </span>
                </div>
                <div className="flex shrink-0">
                  <button
                    type="button"
                    onClick={() => open({ mode: "edit", cat: c })}
                    aria-label={`Edit ${c.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-dark/50 hover:bg-dark/5 hover:text-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    aria-label={`Delete ${c.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-dark/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-dark/60 p-4"
          onClick={() => setModal(null)}
        >
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-extrabold tracking-tight">
              {modal.mode === "edit" ? "Edit category" : "Add category"}
            </h2>

            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Soft smoked fish"
                className={inputCls}
                autoFocus
              />
            </Field>

            <ImageField
              label="Image"
              current={imageUrl}
              file={file}
              onFile={setFile}
              onRemove={() => setImageUrl(null)}
            />

            <Field label="Order" hint="Lower numbers show first">
              <input
                type="number"
                step="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputCls}
              />
            </Field>

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
