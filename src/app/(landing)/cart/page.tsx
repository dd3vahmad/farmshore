import { getSettings } from "@/lib/settings";
import CartView from "@/components/CartView";

export const metadata = { title: "Your cart" };

export default async function CartPage() {
  const s = await getSettings();

  return (
    <main className="bg-[#f5f2e8] py-10 text-dark sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
          Almost there
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Your{" "}
          <span className="bg-linear-to-r from-primary via-accent to-lime-500 bg-clip-text text-transparent">
            cart
          </span>
        </h1>

        <div className="mt-8">
          <CartView
            deliveryFee={Number(s.delivery_fee) || 0}
            freeAbove={
              s.free_delivery_above != null
                ? Number(s.free_delivery_above)
                : null
            }
            whatsapp={s.whatsapp_number || null}
          />
        </div>
      </div>
    </main>
  );
}
