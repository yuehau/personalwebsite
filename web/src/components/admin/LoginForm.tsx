"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
          ✓
        </div>
        <h1 className="mt-4 text-2xl">Check your email</h1>
        <p className="mt-2 text-sm text-muted">
          I sent a one-time login link to <span className="font-semibold text-body">{email}</span>.
          Open it on this device to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md p-8">
      <span className="eyebrow">Private area</span>
      <h1 className="mt-4 text-2xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your email and I&apos;ll send you a one-time login link. Only allowlisted addresses can sign in.
      </p>
      <form onSubmit={sendLink} className="mt-6 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-xl border border-hair bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send me a login link"}
        </button>
        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
        )}
      </form>
    </div>
  );
}
