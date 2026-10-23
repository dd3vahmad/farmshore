import type { GalleryItem } from "@/lib/supabase/gallery";
import GalleryCarousel from "./GalleryCarousel";

export default function Gallery({
  items,
  eyebrow = "Our gallery",
  title = "Moments from the",
  accent = "farm",
  tone = "cream",
}: {
  items: GalleryItem[];
  eyebrow?: string;
  title?: string;
  accent?: string;
  tone?: "light" | "cream";
}) {
  if (!items.length) return null;

  return (
    <section
      id="gallery"
      className={`scroll-mt-20 py-14 text-dark sm:py-20 ${
        tone === "cream" ? "bg-[#f5f2e8]" : "bg-light"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}{" "}
          <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
            {accent}
          </span>
        </h2>

        <div className="mt-8">
          <GalleryCarousel items={items} />
        </div>
      </div>
    </section>
  );
}
