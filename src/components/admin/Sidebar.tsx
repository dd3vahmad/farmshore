"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/browser";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  email,
  brand,
  logoUrl,
}: {
  email: string;
  brand: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  const db = createClient();

  async function logout() {
    await db.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const brandEl = logoUrl ? (
    <span className="flex items-center gap-2">
      <Image
        src={logoUrl}
        alt={brand}
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg object-contain"
      />
      <span className="font-extrabold tracking-tight">{brand}</span>
    </span>
  ) : (
    <Logo name={brand} src={logoUrl!} />
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-light/10 bg-dark px-4 text-light lg:hidden">
        {brandEl}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-light/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-dark/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-dark text-light transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          {brandEl}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-light/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-light/70 hover:bg-light/5 hover:text-light"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-light/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-3 flex items-center gap-2 text-sm text-light/60 hover:text-light"
          >
            <ExternalLink className="h-4 w-4" />
            View store
          </Link>
          <p className="truncate text-xs text-light/40">{email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex items-center gap-2 text-sm font-medium text-light/80 transition hover:text-light"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
