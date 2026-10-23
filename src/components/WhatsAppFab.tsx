import { FaWhatsapp } from "react-icons/fa6";

function WhatsAppFab({ number }: { number: string }) {
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

export default WhatsAppFab;
