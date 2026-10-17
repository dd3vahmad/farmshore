"use client";

import { useEffect, useMemo } from "react";
import { ImageIcon, X } from "lucide-react";
import { btnGhost } from "./ui";

/** Single-image picker with preview. The parent uploads `file` on save. */
export default function ImageField({
  label,
  current,
  file,
  onFile,
  onRemove,
  hint,
}: {
  label: string;
  current: string | null;
  file: File | null;
  onFile: (f: File | null) => void;
  onRemove?: () => void;
  hint?: string;
}) {
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : current),
    [file, current],
  );
  useEffect(
    () => () => {
      if (file && preview) URL.revokeObjectURL(preview);
    },
    [file, preview],
  );

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-dark/70">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-dark/5 ring-1 ring-dark/10">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-7 w-7 text-dark/30" />
          )}
        </div>
        <div className="space-y-2">
          <label className={`${btnGhost} cursor-pointer`}>
            {preview ? "Replace" : "Choose file"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => {
                onFile(null);
                onRemove?.();
              }}
              className="ml-2 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          {hint && <p className="text-xs text-dark/45">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
