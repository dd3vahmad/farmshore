"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MobileMenu({
  links,
  whatsapp,
}: {
  links: { href: string; label: string }[];
  whatsapp: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close after navigating
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="ml-1 rounded-full p-2 text-light hover:bg-light/10"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-light/10 bg-dark/95 px-4 py-4 backdrop-blur-md">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-light/90 hover:bg-light/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {whatsapp && (
            <a
              href={whatsapp}
              className="mt-3 block rounded-full bg-accent px-5 py-3 text-center font-semibold text-light"
            >
              Order on WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
