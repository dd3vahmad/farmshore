"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { embedUrl, parseLatLng } from "@/lib/map";
import { btnGhost, Field, inputCls } from "./ui";

export type LocationValue = {
  hq_title: string;
  hq_address: string;
  hq_hours: string;
  hq_pin: string;
};

/** Used inside the Settings form under a "Farm location" card. */
export default function LocationFields({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (patch: Partial<LocationValue>) => void;
}) {
  const pin = value.hq_pin.trim() ? parseLatLng(value.hq_pin) : null;
  const pinBad = value.hq_pin.trim() !== "" && !pin;

  const currentQuery = pin ? `${pin.lat},${pin.lng}` : value.hq_address.trim();
  const [preview, setPreview] = useState<string | null>(currentQuery || null);

  return (
    <div className="space-y-4">
      <Field
        label="Location name"
        hint="Shown on the card next to the map, e.g. “FarmShore Headquarters”."
      >
        <input
          value={value.hq_title}
          onChange={(e) => onChange({ hq_title: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field
        label="Address"
        hint="Used to find the farm on the map if you don't add a pin."
      >
        <textarea
          rows={2}
          value={value.hq_address}
          onChange={(e) => onChange({ hq_address: e.target.value })}
          placeholder="Street, town, state"
          className={`${inputCls} resize-y`}
        />
      </Field>

      <Field
        label="Exact pin (optional but recommended)"
        hint="In Google Maps, right-click the farm and click the coordinates to copy them, then paste here. You can also paste the full link from your browser's address bar."
      >
        <input
          value={value.hq_pin}
          onChange={(e) => onChange({ hq_pin: e.target.value })}
          placeholder="6.5244, 3.3792"
          className={inputCls}
        />
      </Field>
      {pin && (
        <p className="-mt-2 text-xs font-medium text-green-700">
          Pin found: {pin.lat}, {pin.lng}
        </p>
      )}
      {pinBad && (
        <p className="-mt-2 text-xs font-medium text-red-600">
          Couldn&apos;t read that. Use coordinates like 6.5244, 3.3792 or a full
          Google Maps link (short maps.app.goo.gl links don&apos;t work).
        </p>
      )}

      <Field label="Opening hours (optional)">
        <textarea
          rows={2}
          value={value.hq_hours}
          onChange={(e) => onChange({ hq_hours: e.target.value })}
          placeholder={"Mon – Sat: 8am – 6pm\nSunday: closed"}
          className={`${inputCls} resize-y`}
        />
      </Field>

      <div>
        <button
          type="button"
          onClick={() => setPreview(currentQuery || null)}
          disabled={!currentQuery || pinBad}
          className={`${btnGhost} disabled:opacity-40`}
        >
          <MapPin className="h-4 w-4" />
          Preview map
        </button>

        {preview && (
          <div className="relative mt-3 h-64 overflow-hidden rounded-2xl ring-1 ring-dark/10">
            <iframe
              key={preview}
              src={embedUrl(preview)}
              title="Map preview"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
