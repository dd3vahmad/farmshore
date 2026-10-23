export type Orientation = "landscape" | "portrait";
export type Platform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "x"
  | "other";

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  tag: string | null;
  event_date: string | null;
  image_url: string | null;
  link_url: string | null;
  orientation: Orientation;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  x: "X",
  other: "Link",
};

export function normalizeUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function parse(raw: string): URL | null {
  try {
    return new URL(normalizeUrl(raw));
  } catch {
    return null;
  }
}

export function detectPlatform(raw: string): Platform {
  const u = parse(raw);
  if (!u) return "other";
  const h = u.hostname.replace(/^(www|m|mobile|vm|vt)\./, "");
  if (h === "youtu.be" || h.endsWith("youtube.com")) return "youtube";
  if (h.endsWith("instagram.com") || h === "instagr.am") return "instagram";
  if (h.endsWith("facebook.com") || h === "fb.watch" || h === "fb.com")
    return "facebook";
  if (h.endsWith("tiktok.com")) return "tiktok";
  if (h === "x.com" || h.endsWith("twitter.com")) return "x";
  return "other";
}

export type Media = {
  platform: Platform;
  /** iframe URL if the platform lets us play it on the site */
  embedUrl: string | null;
  /** auto thumbnail (YouTube only; others need an uploaded image) */
  thumbnail: string | null;
  isVideo: boolean;
  /** vertical video (Shorts, Reels, TikTok) */
  portrait: boolean;
};

export function parseMedia(raw: string): Media {
  const platform = detectPlatform(raw);
  const base: Media = {
    platform,
    embedUrl: null,
    thumbnail: null,
    isVideo: false,
    portrait: false,
  };
  const u = parse(raw);
  if (!u) return base;
  const path = u.pathname;
  const host = u.hostname.replace(/^www\./, "");

  if (platform === "youtube") {
    const seg = path.split("/").filter(Boolean);
    let id: string | null = null;
    let portrait = false;
    if (host === "youtu.be") id = seg[0] ?? null;
    else if (seg[0] === "shorts") {
      id = seg[1] ?? null;
      portrait = true;
    } else if (["embed", "live", "v"].includes(seg[0])) id = seg[1] ?? null;
    else if (seg[0] === "watch") id = u.searchParams.get("v");
    if (id && /^[\w-]{11}$/.test(id)) {
      return {
        ...base,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        isVideo: true,
        portrait,
      };
    }
    return base;
  }

  if (platform === "tiktok") {
    const m = path.match(/\/video\/(\d+)/);
    return m
      ? {
          ...base,
          embedUrl: `https://www.tiktok.com/embed/v2/${m[1]}`,
          isVideo: true,
          portrait: true,
        }
      : { ...base, portrait: true };
  }

  if (platform === "instagram") {
    const m = path.match(/\/(p|reel|reels|tv)\/([\w-]+)/);
    if (!m) return base;
    const type = m[1] === "reels" ? "reel" : m[1];
    return {
      ...base,
      embedUrl: `https://www.instagram.com/${type}/${m[2]}/embed`,
      isVideo: type !== "p",
      portrait: type === "reel",
    };
  }

  if (platform === "facebook") {
    const href = encodeURIComponent(u.toString());
    const video = host === "fb.watch" || /\/(videos|reel|watch)\b/.test(path);
    if (video) {
      return {
        ...base,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=true`,
        isVideo: true,
        portrait: /\/reel\//.test(path),
      };
    }
    if (/\/(posts|photo|permalink)/.test(path)) {
      return {
        ...base,
        embedUrl: `https://www.facebook.com/plugins/post.php?href=${href}&show_text=true&width=500`,
      };
    }
    return base;
  }

  return base;
}

export type Resolved = {
  media: Media | null;
  thumb: string | null;
  /** true = our own Supabase image (safe for next/image) */
  thumbIsUpload: boolean;
  /**
   * link  -> tile opens the link in a new tab
   * embed -> tile opens a lightbox that plays the video
   * image -> tile opens the photo larger
   */
  action: "link" | "embed" | "image";
  isVideo: boolean;
  platform: Platform | null;
};

/**
 * Rules:
 *  - image + link      -> image is shown, clicking it goes to the link
 *  - link only         -> plays on the site if the platform allows, otherwise banner + link
 *  - image only        -> photo, opens larger
 */
export function resolveItem(g: GalleryItem): Resolved {
  const media = g.link_url ? parseMedia(g.link_url) : null;
  const thumb = g.image_url ?? media?.thumbnail ?? null;
  let action: Resolved["action"] = "image";
  if (g.link_url) action = !g.image_url && media?.embedUrl ? "embed" : "link";
  return {
    media,
    thumb,
    thumbIsUpload: !!g.image_url,
    action,
    isVideo: !!media?.isVideo,
    platform: media?.platform ?? null,
  };
}

export function fmtDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
