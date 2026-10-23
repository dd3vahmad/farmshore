import { MessageCircle } from "lucide-react";

export type SocialName =
  | "instagram"
  | "facebook"
  | "twitter"
  | "tiktok"
  | "youtube"
  | "whatsapp";

/** Small stroke icons (lucide's brand icons are being removed, so these are inline). */
export default function SocialIcon({
  name,
  className = "h-5 w-5",
}: {
  name: SocialName;
  className?: string;
}) {
  if (name === "whatsapp") return <MessageCircle className={className} />;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {name === "instagram" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </>
      )}
      {name === "facebook" && (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      )}
      {name === "twitter" && <path d="M4 4l16 16M20 4L4 20" />}
      {name === "tiktok" && (
        <>
          <path d="M14 3v11a4 4 0 1 1-4-4" />
          <path d="M14 3a5 5 0 0 0 5 5" />
        </>
      )}
      {name === "youtube" && (
        <>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </>
      )}
    </svg>
  );
}
