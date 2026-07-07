"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/lib/actions/leads";

const initial: LeadFormState = { ok: false };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-hair bg-white px-4 py-3 text-sm text-body outline-none focus:border-brand";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitLead, initial);

  if (state.ok) {
    return (
      <div className="card p-7 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
          ✓
        </div>
        <h2 className="mt-4 text-2xl">Thank you — message received</h2>
        <p className="mt-2 text-sm text-muted">
          I&apos;ll get back to you shortly. For a faster reply, you can WhatsApp me any time.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-7">
      <h2 className="text-2xl">Send a message</h2>
      <p className="mt-2 text-sm text-muted">
        Prefer to write? Fill this in and I&apos;ll get back to you — usually within hours.
      </p>

      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="source" value="contact_form" />
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-body">Your name</label>
          <input id="name" name="name" required placeholder="e.g. Ahmad / Mei Ling" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-body">Phone / WhatsApp</label>
          <input id="phone" name="phone" required placeholder="+60..." className={fieldClass} />
        </div>
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-body">
            What are you interested in?
          </label>
          <select id="interest" name="interest" className={fieldClass} defaultValue="Medical card / hospitalisation">
            <option>Medical card / hospitalisation</option>
            <option>Life / critical illness</option>
            <option>Savings plan</option>
            <option>Investment-linked</option>
            <option>Retirement planning</option>
            <option>A current campaign or promotion</option>
            <option>Not sure — need advice</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-body">Message</label>
          <textarea id="message" name="message" rows={4} placeholder="Tell me a little about what you're looking for…" className={fieldClass} />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}

        <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
          {pending ? "Sending…" : "Send message"}
        </button>
        <p className="text-center text-xs text-muted">
          Saved straight to my inbox. Or{" "}
          <a href="https://wa.me/60147058125" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand">
            WhatsApp me
          </a>{" "}
          for an instant reply.
        </p>
      </form>
    </div>
  );
}
