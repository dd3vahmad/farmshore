import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/types/db";

export default function Hero({ s }: { s: SiteSettings }) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-light">
      {s.hero_image_url && (
        <Image
          src={s.hero_image_url}
          alt=""
          fill
          priority
          className="-z-10 object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-dark via-dark/80 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <p className="mb-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent">
          Smoked to perfection
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
          {s.hero_title}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-light/80">{s.hero_subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-accent px-7 py-3 font-semibold text-light hover:opacity-90"
          >
            Shop now
          </Link>
          {s.whatsapp_number && (
            <a
              href={`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Hello, I'd like to place an order.")}`}
              className="rounded-full border border-light/40 px-7 py-3 font-semibold hover:bg-light/10"
            >
              Order on WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
