import type { SiteSettings } from "@/types/db";
import ContactForm from "./ContactForm";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { getSocials, type SocialKey } from "@/lib/social";

// brand icon + colour for each social network
const SOCIAL_UI: Record<
  SocialKey,
  { icon: React.ReactNode; iconClass: string }
> = {
  instagram: {
    icon: <FaInstagram className="h-6 w-6" />,
    iconClass:
      "bg-linear-to-tr from-amber-400 via-pink-500 to-purple-600 text-light",
  },
  facebook: {
    icon: <FaFacebookF className="h-6 w-6" />,
    iconClass: "bg-[#1877F2] text-light",
  },
  twitter: {
    icon: <FaXTwitter className="h-6 w-6" />,
    iconClass: "bg-black text-light ring-1 ring-light/20",
  },
  tiktok: {
    icon: <FaTiktok className="h-6 w-6" />,
    iconClass: "bg-black text-light ring-1 ring-light/20",
  },
  youtube: {
    icon: <FaYoutube className="h-6 w-6" />,
    iconClass: "bg-[#FF0000] text-light",
  },
};

type ContactCard = {
  key: string;
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  iconClass: string;
};

export default function Contact({ s }: { s: SiteSettings }) {
  const cards: ContactCard[] = [];

  if (s.whatsapp_number) {
    cards.push({
      key: "wa",
      label: "WhatsApp us",
      value: `+${s.whatsapp_number}`,
      href: `https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Hello, I'd like to place an order.")}`,
      icon: <FaWhatsapp className="h-6 w-6" />,
      iconClass: "bg-accent text-light",
    });
  }

  // Instagram, Facebook, X, TikTok, YouTube: only the ones filled in on the dashboard
  for (const x of getSocials(s)) {
    cards.push({
      key: x.key,
      label: x.label,
      value: x.display,
      href: x.href,
      ...SOCIAL_UI[x.key],
    });
  }

  if (cards.length === 0) return null;

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
