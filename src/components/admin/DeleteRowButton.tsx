"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function DeleteRowButton({
  table,
  id,
  label,
}: {
  table: "products" | "categories";
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setBusy(true);
    const { error } = await createClient().from(table).delete().eq("id", id);
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete ${label}`}
      className="grid h-9 w-9 place-items-center rounded-full text-dark/50 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
