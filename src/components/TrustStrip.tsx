import { ShieldCheck, Truck, Snowflake, Wallet } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Hygienically smoked",
    text: "Processed and packed in clean, controlled conditions.",
  },
  {
    icon: Snowflake,
    title: "Freshness locked in",
    text: "Packed to preserve flavour and quality.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    text: "Delivered straight to your doorstep.",
  },
  {
    icon: Wallet,
    title: "Secure payment",
    text: "Pay safely online with Paystack.",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative isolate overflow-hidden bg-dark py-16 text-light sm:py-24">
      {/* soft glows + faint grid, same language as the hero */}
      <div className="absolute -left-32 top-0 -z-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
            Why choose us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Quality you can{" "}
            <span className="bg-linear-to-r from-accent via-lime-300 to-amber-400 bg-clip-text text-transparent">
              taste
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-light/10 bg-light/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:bg-light/10"
            >
              <span className="absolute right-5 top-5 text-xs font-bold tracking-widest text-light/20">
                0{i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent transition duration-300 group-hover:bg-accent group-hover:text-light">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-light/60">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
