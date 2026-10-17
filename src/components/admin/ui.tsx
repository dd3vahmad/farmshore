import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const inputCls =
  "w-full rounded-xl border border-dark/15 bg-white px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-dark/40 focus:border-accent focus:ring-2 focus:ring-accent/20";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-light transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-dark/15 px-4 py-2.5 text-sm font-semibold text-dark/70 transition hover:bg-dark/5";

export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link
          href={back.href}
          className="mb-2 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-dark"
        >
          <ChevronLeft className="h-4 w-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-dark/60">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/5 sm:p-6 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-base font-extrabold tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-dark/70">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-dark/45">{hint}</span>}
    </label>
  );
}

const STATUS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  unpaid: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  processing: "bg-sky-100 text-sky-800",
  out_for_delivery: "bg-violet-100 text-violet-800",
  delivered: "bg-green-100 text-green-800",
  active: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-dark/10 text-dark/70",
  hidden: "bg-dark/10 text-dark/60",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS[value] ?? "bg-dark/10 text-dark/70"
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
