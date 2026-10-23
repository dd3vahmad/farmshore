import type { SiteSettings } from "@/types/db";

type Loc = Pick<SiteSettings, "hq_address" | "hq_lat" | "hq_lng">;

const hasPin = (s: Loc) => s.hq_lat != null && s.hq_lng != null;

/** What Google Maps should look for: exact pin if we have one, otherwise the address. */
export function mapQuery(s: Loc): string | null {
  if (hasPin(s)) return `${s.hq_lat},${s.hq_lng}`;
  const a = s.hq_address?.trim();
  return a || null;
}

/** Free embed, no API key needed. */
export const embedUrl = (q: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&hl=en&output=embed`;

export const directionsUrl = (q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

export const placeUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/**
 * Accepts:
 *  - "6.5244, 3.3792"                      (right-click a spot in Google Maps and copy the coordinates)
 *  - a long Google Maps link containing @lat,lng, !3dLAT!4dLNG, or ?q=lat,lng
 * Short links (maps.app.goo.gl) can't be read; the user must open them and copy the full address-bar link.
 */
export function parseLatLng(
  input: string,
): { lat: number; lng: number } | null {
  const v = input.trim();
  const num = "(-?\\d{1,3}(?:\\.\\d+)?)";
  const m =
    v.match(new RegExp(`^${num}\\s*[,\\s]\\s*${num}$`)) ??
    v.match(new RegExp(`!3d${num}!4d${num}`)) ??
    v.match(new RegExp(`[?&](?:q|query|ll)=${num},${num}`)) ??
    v.match(new RegExp(`@${num},${num}`));
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}
