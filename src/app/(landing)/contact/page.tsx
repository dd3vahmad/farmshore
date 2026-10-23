import Contact from "@/components/Contact";
import MapSection from "@/components/Map";
import { getSettings } from "@/lib/settings";

const ContactPage = async () => {
  const s = await getSettings();

  return (
    <div>
      <MapSection s={s} tone="light" />
      <Contact s={s} />
    </div>
  );
};

export default ContactPage;
