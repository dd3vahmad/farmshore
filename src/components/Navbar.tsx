import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import CartButton from "./CartButton";
import type { SiteSettings } from "@/types/db";

export default function Navbar({ s }: { s: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-dark/10 bg-light/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {s.logo_url && (
            <Image
              src={s.logo_url}
              alt={s.brand_name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          )}
          <span className="text-lg font-bold text-primary">{s.brand_name}</span>
        </Link>

        <form
          action="/products"
          method="get"
          className="mx-auto hidden max-w-md flex-1 md:block"
        >
          <div className="flex items-center gap-2 rounded-full border border-dark/15 bg-white px-4 py-2 focus-within:border-primary">
            <Search className="h-4 w-4 text-dark/50" />
            <input
              name="q"
              placeholder="Search smoked fish cutlets..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          <Link
            href="/products"
            className="hidden rounded-full px-3 py-2 hover:bg-primary/10 sm:block"
          >
            Shop
          </Link>
          <Link
            href="/#contact"
            className="hidden rounded-full px-3 py-2 hover:bg-primary/10 sm:block"
          >
            Contact
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
