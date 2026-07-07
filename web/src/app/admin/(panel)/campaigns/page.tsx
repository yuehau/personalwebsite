import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { pick } from "@/lib/i18n";
import type { Campaign } from "@/lib/types";

export const metadata = { title: "Campaigns", robots: { index: false } };

export default async function CampaignsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("sort_order", { ascending: true });
  const campaigns = (data as Campaign[] | null) ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Campaigns</h1>
        <Link href="/admin/campaigns/new" className="btn btn-primary">+ New campaign</Link>
      </div>

      <div className="mt-8 space-y-3">
        {campaigns.length === 0 && (
          <p className="card p-6 text-sm text-muted">No campaigns yet. Create your first one.</p>
        )}
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/admin/campaigns/${c.id}`}
            className="card card-hover flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="font-semibold text-ink">{pick(c.title) || c.slug || "(untitled)"}</p>
              <p className="text-sm text-muted">{c.tag ?? "—"}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                c.status === "published" ? "bg-success/15 text-success" : "bg-ice text-mid"
              }`}
            >
              {c.status}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
