"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, Play, X } from "lucide-react";
import {
  fmtDate,
  PLATFORM_LABEL,
  resolveItem,
  type GalleryItem,
  type Platform,
  type Resolved,
} from "@/lib/supabase/gallery";
import SocialIcon, { SocialName } from "./SocialIcon";

const iconFor = (p: Platform | null): SocialName | null =>
  !p || p === "other" ? null : p === "x" ? "twitter" : p;

// Row height (--gh) and gap (--gap) drive every tile size:
//   landscape = 16:9, one row tall   -> two stack in a column
//   portrait  = 9:16, two rows tall  -> fills a whole column
const tileStyle = (portrait: boolean): React.CSSProperties =>
  portrait
    ? {
        width: "calc((var(--gh) * 2 + var(--gap)) * 0.5625)",
        gridRow: "span 2",
      }
    : { width: "calc(var(--gh) * 1.7778)" };

function TileBody({ g, r }: { g: GalleryItem; r: Resolved }) {
  const icon = iconFor(r.platform);
  return (
    <>
      {r.thumb ? (
        r.thumbIsUpload ? (
          <Image
            src={r.thumb}
            alt={g.title}
            fill
            sizes="(max-width:640px) 70vw, 420px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.thumb}
            alt={g.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark">
          {icon ? (
            <SocialIcon name={icon} className="h-16 w-16 text-light/25" />
          ) : (
            <ExternalLink className="h-14 w-14 text-light/25" />
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-dark/85 via-dark/10 to-transparent" />

      {r.platform && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-dark/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-light backdrop-blur">
          {icon && <SocialIcon name={icon} className="h-3 w-3" />}
          {PLATFORM_LABEL[r.platform]}
        </span>
      )}

      {r.action === "link" && (
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-light/20 text-light backdrop-blur">
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      )}

      {r.isVideo && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-light/25 text-light backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-accent">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        {g.tag && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {g.tag}
          </p>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-snug tracking-tight text-light sm:text-base">
          {g.title}
        </h3>
        {g.event_date && (
          <p className="mt-1 text-xs text-light/60">{fmtDate(g.event_date)}</p>
        )}
      </div>
    </>
  );
}

function Lightbox({
  list,
  index,
  onIndex,
  onClose,
}: {
  list: GalleryItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const g = list[index];
  const r = resolveItem(g);
  const portrait = g.orientation === "portrait";
  const label = r.platform ? PLATFORM_LABEL[r.platform] : "link";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onIndex(index - 1);
      if (e.key === "ArrowRight" && index < list.length - 1) onIndex(index + 1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, list.length, onClose, onIndex]);

  const navBtn =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-light/15 text-light backdrop-blur transition hover:bg-light/30 sm:grid";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={g.title}
      className="fixed inset-0 z-50 overflow-y-auto bg-dark/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-light/15 text-light backdrop-blur transition hover:bg-light/30"
      >
        <X className="h-5 w-5" />
      </button>

      {index > 0 && (
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            onIndex(index - 1);
          }}
          className={`${navBtn} left-4 fixed`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {index < list.length - 1 && (
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            onIndex(index + 1);
          }}
          className={`${navBtn} right-4 fixed`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div className="mx-auto flex min-h-full max-w-5xl items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex w-full flex-col items-center gap-5 py-8 lg:flex-row lg:items-start lg:justify-center lg:gap-8"
        >
          <div
            className={`relative shrink-0 overflow-hidden rounded-2xl bg-black shadow-2xl ${
              portrait
                ? "aspect-9/16 h-[68vh] max-h-190 lg:h-[80vh]"
                : "aspect-video w-full lg:w-[min(760px,62vw)]"
            }`}
          >
            {r.action === "embed" && r.media?.embedUrl ? (
              <iframe
                key={g.id}
                src={r.media.embedUrl}
                title={g.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              g.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={g.image_url}
                  alt={g.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )
            )}
          </div>

          <div className="w-full max-w-md text-light lg:pt-2">
            {g.tag && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
                {g.tag}
              </p>
            )}
            <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {g.title}
            </h3>
            {g.event_date && (
              <p className="mt-2 text-sm text-light/60">
                {fmtDate(g.event_date)}
              </p>
            )}
            {g.description && (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-light/75">
                {g.description}
              </p>
            )}
            {g.link_url && (
              <a
                href={g.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-light transition hover:opacity-90"
              >
                Open on {label}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // items that open in the lightbox (the rest open their link in a new tab)
  const openable = useMemo(
    () => items.filter((g) => resolveItem(g).action !== "link"),
    [items],
  );
  const activeIndex = openable.findIndex((g) => g.id === activeId);

  const rows =
    items.length <= 2 && items.every((g) => g.orientation !== "portrait")
      ? 1
      : 2;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [items]);

  const scrollBy = (dir: 1 | -1) =>
    scroller.current?.scrollBy({
      left: dir * scroller.current.clientWidth * 0.85,
      behavior: "smooth",
    });

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-dark shadow-lg ring-1 ring-dark/5 transition hover:bg-accent hover:text-light sm:grid";

  const tileCls =
    "group relative block h-full snap-start overflow-hidden rounded-3xl bg-dark text-left shadow-sm ring-1 ring-dark/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-dark/20";

  return (
    <div className="relative">
      {canPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className={`${arrow} -left-3`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className={`${arrow} -right-3`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scroller}
        className="-mx-4 snap-x snap-proximity overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="grid w-max auto-cols-max grid-flow-col-dense gap-(--gap) [--gap:12px] [--gh:150px] sm:[--gap:16px] sm:[--gh:200px] lg:[--gh:230px]"
          style={{ gridTemplateRows: `repeat(${rows}, var(--gh))` }}
        >
          {items.map((g) => {
            const r = resolveItem(g);
            const style = tileStyle(g.orientation === "portrait");
            return r.action === "link" ? (
              <a
                key={g.id}
                href={g.link_url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${g.title} (opens in a new tab)`}
                className={tileCls}
                style={style}
              >
                <TileBody g={g} r={r} />
              </a>
            ) : (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveId(g.id)}
                aria-label={g.title}
                className={tileCls}
                style={style}
              >
                <TileBody g={g} r={r} />
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex >= 0 && (
        <Lightbox
          list={openable}
          index={activeIndex}
          onIndex={(i) => setActiveId(openable[i].id)}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
