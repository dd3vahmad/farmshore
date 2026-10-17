import Announcement from "@/components/Announcement";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFab from "@/components/WhatsAppFab";
import { getSettings } from "@/lib/settings";
import React from "react";

const LandingLayout = async ({ children }: { children: React.ReactNode }) => {
  const s = await getSettings();

  return (
    <div className="min-h-screen">
      <Announcement text={s.announcement_text} />
      <Navbar s={s} />
      <main>{children}</main>
      <Footer s={s} />
      <WhatsAppFab number={s.whatsapp_number} />
    </div>
  );
};

export default LandingLayout;
