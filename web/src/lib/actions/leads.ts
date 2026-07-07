"use server";

import { createClient } from "@/lib/supabase/server";

export interface LeadFormState {
  ok: boolean;
  error?: string;
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = String(formData.get("source") ?? "contact_form").trim();

  if (!name || !phone) {
    return { ok: false, error: "Please add your name and a phone or WhatsApp number." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("leads")
      .insert({ name, phone, interest, message, source, lang: "en" });
    if (error) {
      return {
        ok: false,
        error: "Sorry, that didn't go through. Please WhatsApp me instead and I'll reply fast.",
      };
    }
  } catch {
    return {
      ok: false,
      error: "Sorry, something went wrong. Please WhatsApp me instead and I'll reply fast.",
    };
  }

  // Best-effort notifications — never block the visitor on these.
  await Promise.allSettled([
    notifyByEmail({ name, phone, interest, message }),
    notifyByNtfy({ name, interest }),
  ]);
  return { ok: true };
}

// Instant push to the advisor's phone + iPad via ntfy.sh.
// Keeps the message minimal (no phone number) since ntfy topics are shared by name.
async function notifyByNtfy(lead: { name: string; interest: string }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return; // not configured yet

  await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: {
      Title: "New website lead",
      Tags: "bell,moneybag",
      Priority: "high",
      Click: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/leads`,
    },
    body: `${lead.name} — interested in ${lead.interest || "your services"}. Open the dashboard to reply.`,
  });
}

async function notifyByEmail(lead: {
  name: string;
  phone: string;
  interest: string;
  message: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return; // not configured yet — silently skip

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Website Leads <onboarding@resend.dev>",
      to: [to],
      subject: `New website lead: ${lead.name}`,
      text:
        `New lead from your website:\n\n` +
        `Name: ${lead.name}\n` +
        `Phone/WhatsApp: ${lead.phone}\n` +
        `Interested in: ${lead.interest}\n` +
        `Message: ${lead.message || "(none)"}\n`,
    }),
  });
}
