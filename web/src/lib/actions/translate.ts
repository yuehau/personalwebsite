"use server";

import { getAdminUser } from "@/lib/auth";

export interface TranslateResult {
  ok: boolean;
  zh?: string;
  ms?: string;
  error?: string;
}

// Cheap, fast model — ample for short marketing/blog copy.
const MODEL = "claude-haiku-4-5-20251001";

/**
 * "Write once, AI drafts the rest." Translates English copy into
 * Simplified Chinese + Bahasa Malaysia. Admin-only.
 */
export async function translateText(text: string): Promise<TranslateResult> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "Not authorised." };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI translation isn't set up yet — add ANTHROPIC_API_KEY to .env.local." };
  }
  if (!text.trim()) return { ok: false, error: "Nothing to translate." };

  const prompt =
    "You translate copy for a licensed Malaysian Allianz insurance advisor's website. " +
    "Translate the English text below into (1) Simplified Chinese and (2) Bahasa Malaysia. " +
    "Keep it natural, warm and professional for a Malaysian audience. " +
    "Preserve any HTML tags exactly as they appear. Do not add or remove meaning. " +
    'Respond with ONLY a JSON object, no markdown: {"zh":"...","ms":"..."}\n\n' +
    `English:\n${text}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Translation service error (${res.status}).` };
    }

    const data = await res.json();
    const raw: string = data?.content?.[0]?.text ?? "";
    const jsonText = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(jsonText) as { zh?: string; ms?: string };
    return { ok: true, zh: parsed.zh ?? "", ms: parsed.ms ?? "" };
  } catch {
    return { ok: false, error: "Couldn't parse the translation. Please try again." };
  }
}
