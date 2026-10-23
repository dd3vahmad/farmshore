import type { SiteSettings } from "@/types/db";

export type SocialKey =
  | "instagram"
  | "facebook"
  | "twitter"
  | "tiktok"
  | "youtube";

export const SOCIAL_LABEL: Record<SocialKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const BASE: Record<SocialKey, string> = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  twitter: "https://x.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
};

/** Accepts a handle ("farmshore", "@farmshore") or a full URL. */
export function socialHref(key: SocialKey, value: string) {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  return BASE[key] + v.replace(/^@/, "");
}

export function getSocials(s: SiteSettings) {
  const raw: Record<SocialKey, string | null | undefined> = {
    instagram: s.instagram_handle,
    facebook: s.facebook_url,
    tiktok: s.tiktok_url,
    youtube: s.youtube_url,
    twitter: s.twitter_url,
  };

  return (Object.keys(raw) as SocialKey[])
    .filter((k) => raw[k]?.trim())
    .map((k) => {
      const value = raw[k]!.trim();
      const isUrl = /^https?:\/\//i.test(value);
      return {
        key: k,
        label: SOCIAL_LABEL[k],
        href: socialHref(k, value),
        display: isUrl
          ? value.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")
          : `@${value.replace(/^@/, "")}`,
      };
    });
}
