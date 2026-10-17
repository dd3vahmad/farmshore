import Contact from "@/components/Contact";
import { getSettings } from "@/lib/settings";

const ContactPage = async () => {
  const s = await getSettings();
  return (
    <div>
      <Contact s={s} />
    </div>
  );
};

export default ContactPage;
