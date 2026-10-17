"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
  badge,
  soldOut,
}: {
  images: string[];
  name: string;
  badge?: string;
  soldOut?: boolean;
}) {
  const [i, setI] = useState(0);
  const main = images[i];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-primary/10 shadow-sm ring-1 ring-dark/5">
        {main ? (
          <Image
            key={main}
            src={main}
            alt={name}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className={`object-cover ${soldOut ? "opacity-60 grayscale" : ""}`}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-primary to-dark text-8xl font-extrabold text-light/30">
            {name.charAt(0)}
          </span>
        )}

        {soldOut ? (
          <span className="absolute left-4 top-4 rounded-full bg-dark/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-light backdrop-blur">
            Sold out
          </span>
        ) : (
          badge && (
            <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-dark">
              {badge}
            </span>
          )
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                idx === i
                  ? "ring-accent"
                  : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
