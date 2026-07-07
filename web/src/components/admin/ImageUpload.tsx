"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to the Supabase 'media' bucket (admins only, per RLS),
 * then stores its public URL in a hidden field so the form submits it.
 */
export function ImageUpload({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string | null;
}) {
  const [url, setUrl] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    const supabase = createClient();
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setBusy(false);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-body">{label}</label>
      <input type="hidden" name={name} value={url} />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mb-2 h-32 w-full max-w-xs rounded-lg border border-hair object-cover" />
      )}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={busy}
          className="text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-ice file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand"
        />
        {busy && <span className="text-xs text-muted">Uploading…</span>}
        {url && !busy && (
          <button type="button" onClick={() => setUrl("")} className="text-xs font-semibold text-red-600">
            Remove
          </button>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
