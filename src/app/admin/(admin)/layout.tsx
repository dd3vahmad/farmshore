import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import AdminSidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") redirect("/admin/login");

  const s = await getSettings();

  return (
    <div className="min-h-screen bg-[#f5f2e8] text-dark lg:pl-64">
      <AdminSidebar
        email={user.email ?? ""}
        brand={s.brand_name}
        logoUrl={s.logo_url}
      />
      <main className="px-4 pb-12 pt-20 sm:px-8 lg:pt-8">{children}</main>
    </div>
  );
}
