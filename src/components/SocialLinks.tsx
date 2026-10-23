import SocialIcon from "./SocialIcon";
import { getSocials } from "@/lib/social";
import type { SiteSettings } from "@/types/db";

export default function SocialLinks({
  s,
  className = "",
}: {
  s: SiteSettings;
  className?: string;
}) {
  const socials = getSocials(s);
  if (!socials.length) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {socials.map((x) => (
        <a
          key={x.key}
          href={x.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={x.label}
          className="grid h-11 w-11 place-items-center rounded-xl border border-light/10 bg-light/5 text-light/80 transition hover:border-accent hover:bg-accent/15 hover:text-light"
        >
          <SocialIcon name={x.key} />
        </a>
      ))}
    </div>
  );
}
