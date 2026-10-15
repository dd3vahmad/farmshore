import Link from "next/link";

/** Just the icon: a fish riding two waves, on a rounded green badge. */
export function LogoMark({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Fish farm logo"
      className={className}
    >
      {/* badge */}
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        className="fill-primary stroke-accent/50"
        strokeWidth="1.5"
      />

      {/* fish: tail + body + eye */}
      <path d="M15 20 L7 13 L7 27 Z" className="fill-light" />
      <path
        d="M14 20 C20 12 31 12 37 20 C31 28 20 28 14 20 Z"
        className="fill-light"
      />
      <circle cx="32" cy="18.5" r="1.7" className="fill-primary" />

      {/* waves (the "shore") */}
      <path
        d="M9 34 q3.75 -3 7.5 0 t7.5 0 t7.5 0 t7.5 0"
        fill="none"
        className="stroke-accent"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9 40 q3.75 -3 7.5 0 t7.5 0 t7.5 0 t7.5 0"
        fill="none"
        className="stroke-accent/60"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Icon + wordmark. "FarmShore" renders as Farm (current text colour) + Shore (accent). */
export default function Logo({
  name = "FarmShore",
  size = 40,
  showText = true,
  href = "/",
  className = "",
}: {
  name?: string;
  size?: number;
  showText?: boolean;
  /** pass null to render without a link wrapper */
  href?: string | null;
  className?: string;
}) {
  const m = name.match(/^(.*?[a-z])([A-Z].*)$/);
  const [first, second] = m ? [m[1], m[2]] : [name, ""];

  const content = (
    <>
      <LogoMark size={size} />
      {showText && (
        <span className="text-lg font-extrabold leading-none tracking-tight">
          {first}
          {second && <span className="text-accent">{second}</span>}
        </span>
      )}
    </>
  );

  const classes = `flex shrink-0 items-center gap-2 ${className}`;

  return href ? (
    <Link href={href} className={classes} aria-label={name}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}
