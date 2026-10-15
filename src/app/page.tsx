import { getSettings } from "@/lib/settings";

export default async function Home() {
  const s = await getSettings();
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">{s.brand_name}</h1>
        <p>{s.tagline}</p>
        <button className="rounded-full bg-primary px-6 py-3 text-light hover:bg-accent">
          Shop now
        </button>
      </div>
    </main>
  );
}
