import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import CartButton from "./CartButton";
import type { SiteSettings } from "@/types/db";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ s }: { s: SiteSettings }) {
  const whatsapp = s.whatsapp_number
    ? `https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Hello, I'd like to place an order.")}`
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-light/10 bg-dark/80 text-light backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {s.logo_url ? (
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src={s.logo_url}
              alt={s.brand_name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight">
              {s.brand_name}
            </span>
          </Link>
        ) : (
          <Logo name={s.brand_name} />
        )}

        <form
          action="/products"
          method="get"
          className="mx-auto hidden max-w-xs flex-1 lg:block"
        >
          <div className="flex items-center gap-2 rounded-full border border-light/15 bg-light/10 px-4 py-2 focus-within:border-accent">
            <Search className="h-4 w-4 text-light/50" />
            <input
              name="q"
              placeholder="Search products…"
              className="w-full bg-transparent text-sm text-light outline-none placeholder:text-light/50"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden rounded-full px-3 py-2 text-light/80 transition hover:bg-light/10 hover:text-light md:block"
            >
              {l.label}
            </Link>
          ))}

          {whatsapp && (
            <a
              href={whatsapp}
              className="ml-2 hidden rounded-full bg-accent px-5 py-2 font-semibold text-light transition hover:opacity-90 md:block"
            >
              Order on WhatsApp
            </a>
          )}

          <CartButton />
          <MobileMenu links={NAV_LINKS} whatsapp={whatsapp} />
        </nav>
      </div>
    </header>
  );
}
