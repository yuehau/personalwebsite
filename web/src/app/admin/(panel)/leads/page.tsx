import { createClient } from "@/lib/supabase/server";
import { updateLeadStatus } from "@/lib/actions/admin";
import { site } from "@/lib/site";
import type { Lead } from "@/lib/types";

export const metadata = { title: "Leads", robots: { index: false } };

const statuses = ["new", "contacted", "won", "lost"] as const;

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  const leads = (data as Lead[] | null) ?? [];

  return (
    <>
      <h1 className="text-3xl">Leads</h1>
      <p className="mt-2 text-muted">{leads.length} total · newest first.</p>

      <div className="mt-8 space-y-4">
        {leads.length === 0 && (
          <p className="card p-6 text-sm text-muted">No leads yet.</p>
        )}
        {leads.map((l) => {
          const wa = l.phone
            ? `https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`
            : `https://wa.me/${site.whatsapp}`;
          return (
            <div key={l.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{l.name ?? "Someone"}</p>
                  <p className="text-sm text-muted">
                    {l.phone ?? "no phone"} · {l.interest ?? "—"}
                  </p>
                </div>
                <span className="text-xs text-muted">{new Date(l.created_at).toLocaleString("en-GB")}</span>
              </div>

              {l.message && (
                <p className="mt-3 rounded-lg bg-ice px-3 py-2 text-sm text-body">{l.message}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Reply on WhatsApp
                </a>
                <form action={updateLeadStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <select
                    name="status"
                    defaultValue={l.status}
                    className="rounded-lg border border-hair bg-white px-3 py-2 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-ghost text-sm">Update</button>
                </form>
                {l.source && (
                  <span className="ml-auto text-xs text-muted">via {l.source}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
