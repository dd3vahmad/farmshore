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
    <section className="bg-primary/5 py-14">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
            <Icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-dark/70">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
