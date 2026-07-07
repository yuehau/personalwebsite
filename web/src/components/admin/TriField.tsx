"use client";

import { useState } from "react";
import { translateText } from "@/lib/actions/translate";
import { localeNames, type I18nText, type Locale } from "@/lib/i18n";

const order: Locale[] = ["en", "zh", "ms"];

export function TriField({
  name,
  label,
  value,
  multiline = false,
  rows = 5,
  required = false,
}: {
  name: string;
  label: string;
  value?: I18nText;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const initial =
    value && typeof value === "object" ? value : ({} as Record<string, string>);
  const [v, setV] = useState<Record<Locale, string>>({
    en: initial.en ?? "",
    zh: initial.zh ?? "",
    ms: initial.ms ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function translate() {
    if (!v.en.trim()) {
      setErr("Write the English version first.");
      return;
    }
    setBusy(true);
    setErr("");
    const r = await translateText(v.en);
    setBusy(false);
    if (!r.ok) {
      setErr(r.error ?? "Translation failed.");
      return;
    }
    setV((s) => ({ ...s, zh: r.zh ?? "", ms: r.ms ?? "" }));
  }

  const cls =
    "w-full rounded-lg border border-hair bg-white px-3 py-2 text-sm text-body outline-none focus:border-brand";

  return (
    <fieldset className="rounded-card border border-hair p-4">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-sm font-semibold text-ink">
          {label} {required && <span className="text-gold">*</span>}
        </legend>
        <button
          type="button"
          onClick={translate}
          disabled={busy}
          className="rounded-full bg-gold/12 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
        >
          {busy ? "Translating…" : "✦ AI translate"}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {order.map((loc) => (
          <label key={loc} className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
              {localeNames[loc]}
            </span>
            {multiline ? (
              <textarea
                name={`${name}__${loc}`}
                rows={rows}
                required={required && loc === "en"}
                value={v[loc]}
                onChange={(e) => setV((s) => ({ ...s, [loc]: e.target.value }))}
                className={cls}
              />
            ) : (
              <input
                name={`${name}__${loc}`}
                required={required && loc === "en"}
                value={v[loc]}
                onChange={(e) => setV((s) => ({ ...s, [loc]: e.target.value }))}
                className={cls}
              />
            )}
          </label>
        ))}
      </div>

      {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
    </fieldset>
  );
}
