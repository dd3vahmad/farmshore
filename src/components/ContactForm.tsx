"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

const field =
  "w-full rounded-2xl border border-dark/10 bg-[#faf6ee] px-5 py-3.5 text-base text-dark outline-none transition placeholder:text-dark/40 focus:border-accent focus:bg-white";

export default function ContactForm({ number }: { number: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hello, I'm ${name.trim()}.\n\n${message.trim()}`;
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className={field}
      />
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message…"
        className={`${field} resize-none`}
      />
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-dark px-6 py-4 font-semibold text-light transition hover:bg-primary"
      >
        <MessageCircle className="h-5 w-5" />
        Send on WhatsApp
      </button>
      <p className="text-center text-xs text-dark/50">
        This opens WhatsApp with your message ready to send.
      </p>
    </form>
  );
}
