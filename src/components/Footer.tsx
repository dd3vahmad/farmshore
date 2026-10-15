import type { SiteSettings } from "@/types/db";

export default function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer id="contact" className="bg-dark text-light">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold">{s.brand_name}</h3>
          <p className="mt-2 text-sm text-light/70">{s.tagline}</p>
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold">Contact</h4>
          {s.whatsapp_number && (
            <a
              href={`https://wa.me/${s.whatsapp_number}`}
              className="block text-light/70 hover:text-light"
            >
              WhatsApp: +{s.whatsapp_number}
            </a>
          )}
          {s.instagram_handle && (
            <a
              href={`https://instagram.com/${s.instagram_handle}`}
              className="block text-light/70 hover:text-light"
            >
              Instagram: @{s.instagram_handle}
            </a>
          )}
        </div>
        <div className="text-sm">
          <h4 className="mb-2 font-semibold">Shop</h4>
          <a href="/products" className="block text-light/70 hover:text-light">
            All products
          </a>
          <a href="/cart" className="block text-light/70 hover:text-light">
            Cart
          </a>
        </div>
      </div>
      <p className="border-t border-light/10 py-4 text-center text-xs text-light/50">
        © {new Date().getFullYear()} {s.brand_name}. All rights reserved.
      </p>
    </footer>
  );
}
