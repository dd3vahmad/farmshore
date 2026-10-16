import { MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/types/db";
import ContactForm from "./ContactForm";

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

export default function Contact({ s }: { s: SiteSettings }) {
  const handle = s.instagram_handle?.replace(/^@/, "");
  const hasAny = s.whatsapp_number || handle;
  if (!hasAny) return null;

  const cards = [
    s.whatsapp_number && {
      key: "wa",
      label: "WhatsApp us",
      value: `+${s.whatsapp_number}`,
      href: `https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Hello, I'd like to place an order.")}`,
      icon: <MessageCircle className="h-6 w-6" />,
      iconClass: "bg-accent text-light",
    },
    handle && {
      key: "ig",
      label: "Instagram",
      value: `@${handle}`,
      href: `https://instagram.com/${handle}`,
      icon: <InstagramIcon className="h-6 w-6" />,
      iconClass:
        "bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 text-light",
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
    iconClass: string;
  }[];

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-[#f5f2e8] py-16 text-dark sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            Contact
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Let&apos;s{" "}
            <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
              talk
            </span>
          </h2>
          <p className="mt-4 text-base text-dark/60 sm:text-lg">
            Questions, bulk orders or deliveries? Message us and we&apos;ll get
            back to you quickly.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {cards.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl bg-dark p-5 text-light transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-dark/25"
              >
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${c.iconClass}`}
                >
                  {c.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                    {c.label}
                  </span>
                  <span className="mt-1 block truncate text-lg text-light/90">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          {s.whatsapp_number && (
            <div className="rounded-4xl bg-white p-6 shadow-xl shadow-dark/10 sm:p-8">
              <h3 className="text-2xl font-extrabold tracking-tight">
                Send a message
              </h3>
              <ContactForm number={s.whatsapp_number} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
