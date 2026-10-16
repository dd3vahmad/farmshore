import Image from "next/image";
import Link from "next/link";

export default function Logo({
  name = "FarmShore",
  href = "/",
}: {
  name?: string;
  href?: string | null;
}) {

  return href ? (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <Image
        src={href}
        alt={name}
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
      <span className="text-lg font-extrabold tracking-tight">{name}</span>
    </Link>
  ) : (
    <span className="text-lg font-extrabold tracking-tight">{name}</span>
  );
}
