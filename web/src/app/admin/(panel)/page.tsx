import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function Dashboard() {
  const supabase = await createClient();
  const [leads, campaigns, posts, recent] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const newLeads = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const stats = [
    { label: "New leads", value: newLeads.count ?? 0, href: "/admin/leads", accent: true },
    { label: "Total leads", value: leads.count ?? 0, href: "/admin/leads" },
    { label: "Campaigns", value: campaigns.count ?? 0, href: "/admin/campaigns" },
    { label: "Blog posts", value: posts.count ?? 0, href: "/admin/posts" },
  ];

  return (
    <>
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-2 text-muted">Manage your campaigns, blog, and incoming leads.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-5">
            <p className={`font-display text-3xl ${s.accent ? "text-gold" : "text-ink"}`}>{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl">Recent leads</h2>
        <Link href="/admin/leads" className="link-arrow text-sm">View all →</Link>
      </div>
      <div className="mt-4 space-y-3">
        {(recent.data as Lead[] | null)?.length ? (
          (recent.data as Lead[]).map((l) => (
            <div key={l.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-ink">{l.name ?? "Someone"}</p>
                <p className="text-sm text-muted">
                  {l.interest ?? "—"} · {new Date(l.created_at).toLocaleString("en-GB")}
                </p>
              </div>
              <span className="rounded-full bg-ice px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mid">
                {l.status}
              </span>
            </div>
          ))
        ) : (
          <p className="card p-6 text-sm text-muted">No leads yet — they&apos;ll appear here the moment someone submits the contact form.</p>
        )}
      </div>
    </>
  );
}
