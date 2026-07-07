import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { pick } from "@/lib/i18n";
import type { Post } from "@/lib/types";

export const metadata = { title: "Blog posts", robots: { index: false } };

export default async function PostsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = (data as Post[] | null) ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Blog posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">+ New post</Link>
      </div>

      <div className="mt-8 space-y-3">
        {posts.length === 0 && (
          <p className="card p-6 text-sm text-muted">No posts yet. Write your first one.</p>
        )}
        {posts.map((p) => {
          const scheduled =
            p.status === "published" && p.published_at && new Date(p.published_at) > new Date();
          return (
            <Link
              key={p.id}
              href={`/admin/posts/${p.id}`}
              className="card card-hover flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-ink">{pick(p.title) || p.slug || "(untitled)"}</p>
                <p className="text-sm text-muted">
                  {p.category ?? "—"}
                  {p.published_at ? ` · ${new Date(p.published_at).toLocaleDateString("en-GB")}` : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  scheduled
                    ? "bg-gold/15 text-gold"
                    : p.status === "published"
                      ? "bg-success/15 text-success"
                      : "bg-ice text-mid"
                }`}
              >
                {scheduled ? "scheduled" : p.status}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
