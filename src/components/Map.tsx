import { Clock, ExternalLink, MapPin, Navigation } from "lucide-react";
import { directionsUrl, embedUrl, mapQuery, placeUrl } from "@/lib/map";
import type { SiteSettings } from "@/types/db";

export default function MapSection({
  s,
  tone = "light",
}: {
  s: SiteSettings;
  tone?: "light" | "cream";
}) {
  const q = mapQuery(s);
  if (!q) return null;

  const title = s.hq_title?.trim() || `${s.brand_name} headquarters`;
  const address = s.hq_address?.trim();
  const hours = s.hq_hours?.trim();

  return (
    <section
      id="visit"
      className={`scroll-mt-20 py-16 text-dark sm:py-24 ${
        tone === "cream" ? "bg-[#f5f2e8]" : "bg-light"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
            Visit us
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find the{" "}
            <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
              farm
            </span>
          </h2>
          <p className="mt-4 text-base text-dark/60 sm:text-lg">
            Come see where it all happens, or get directions straight to our
            headquarters.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Info card */}
          <div className="flex flex-col rounded-3xl bg-dark p-6 text-light shadow-xl shadow-dark/20 sm:p-7">
            <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
              {title}
            </h3>

            <div className="mt-6 space-y-5">
              {address && (
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      Address
                    </p>
                    <p className="mt-1 whitespace-pre-line text-light/85">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {hours && (
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      Opening hours
                    </p>
                    <p className="mt-1 whitespace-pre-line text-light/85">
                      {hours}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-3 lg:mt-auto lg:pt-8">
              <a
                href={directionsUrl(q)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-light transition hover:opacity-90"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
              <a
                href={placeUrl(q)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-light/25 px-6 py-3 font-semibold transition hover:bg-light/10"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="relative h-85 overflow-hidden rounded-3xl bg-dark/5 shadow-xl ring-1 ring-dark/10 sm:h-105 lg:h-auto lg:min-h-110">
            <iframe
              src={embedUrl(q)}
              title={`Map showing ${title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
