import Link from "next/link";
import Logo from "./Logo";
import type { SiteSettings } from "@/types/db";
import { FaWhatsapp } from "react-icons/fa6";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/#contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function Footer({ s }: { s: SiteSettings }) {
  const handle = s.instagram_handle?.replace(/^@/, "");
  const wa = s.whatsapp_number ? `https://wa.me/${s.whatsapp_number}` : null;

  const socialBtn =
    "grid h-11 w-11 place-items-center rounded-xl border border-light/10 bg-light/5 text-light/80 transition hover:border-accent hover:bg-accent/15 hover:text-light";

  return (
    <footer className="relative overflow-hidden bg-dark text-light">
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo name={s.brand_name} href={s.logo_url} />
          {s.tagline && (
            <p className="mt-5 max-w-sm leading-relaxed text-light/60">
              {s.tagline}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            {wa && (
              <a href={wa} aria-label="WhatsApp" className={socialBtn}>
                <FaWhatsapp className="h-5 w-5" />
              </a>
            )}
            {handle && (
              <a
                href={`https://instagram.com/${handle}`}
                aria-label="Instagram"
                className={socialBtn}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            Navigate
          </h4>
          <ul className="mt-5 space-y-3">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-light/60 transition hover:text-light"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            Contact
          </h4>
          <ul className="mt-5 space-y-3">
            {wa && (
              <li>
                <a
                  href={wa}
                  className="text-accent transition hover:text-lime-300"
                >
                  +{s.whatsapp_number}
                </a>
              </li>
            )}
            {handle && (
              <li>
                <a
                  href={`https://instagram.com/${handle}`}
                  className="text-accent transition hover:text-lime-300"
                >
                  @{handle}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl border-t border-light/10 px-4 py-6 text-sm text-light/40">
        © {new Date().getFullYear()} {s.brand_name}. All rights reserved.
      </div>
    </footer>
  );
}
