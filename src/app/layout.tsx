import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.brand_name, description: s.tagline };
}

// Only allow valid hex colours into the injected CSS
const hex = (v: string, fallback: string) =>
  /^#[0-9a-fA-F]{3,8}$/.test(v) ? v : fallback;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();

  const theme = `:root{
    --brand-primary:${hex(s.color_primary, "#166534")};
    --brand-accent:${hex(s.color_accent, "#16a34a")};
    --brand-dark:${hex(s.color_dark, "#0b1f14")};
    --brand-light:${hex(s.color_light, "#ffffff")};
  }`;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans bg-light text-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
