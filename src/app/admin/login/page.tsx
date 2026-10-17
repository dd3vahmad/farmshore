"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/browser";
import { inputCls } from "@/components/admin/ui";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    if (data.user?.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-dark px-4 text-light">
      <div className="absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-light/10 bg-light/5 p-7 backdrop-blur"
      >
        <div className="mb-2 flex justify-center">
          <Logo href={null} />
        </div>
        <h1 className="text-center text-xl font-extrabold tracking-tight">
          Admin sign in
        </h1>

        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />

        {error && (
          <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-light transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
