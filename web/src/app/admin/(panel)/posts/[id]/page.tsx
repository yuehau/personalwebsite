import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { savePost, deletePost } from "@/lib/actions/admin";
import { TriField } from "@/components/admin/TriField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { pick } from "@/lib/i18n";
import type { Post } from "@/lib/types";

export const metadata = { title: "Edit post", robots: { index: false } };

const input = "w-full rounded-lg border border-hair bg-white px-3 py-2 text-sm outline-none focus:border-brand";
const labelCls = "mb-1 block text-sm font-medium text-body";
const categories = ["Medical", "Life", "Savings", "Investment", "Retirement", "Takaful", "Tips"];

export default async function PostEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  let post: Post | null = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    post = data as Post;
  }

  return (
    <>
      <Link href="/admin/posts" className="link-arrow text-sm">← Blog posts</Link>
      <h1 className="mt-3 text-3xl">{isNew ? "New post" : pick(post!.title) || "Edit post"}</h1>

      <form action={savePost} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input name="slug" required defaultValue={post?.slug ?? ""} placeholder="do-you-need-a-medical-card" className={input} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" defaultValue={post?.category ?? "Medical"} className={input}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Publish date (future = schedule)</label>
            <input
              type="datetime-local"
              name="published_at"
              defaultValue={post?.published_at ? post.published_at.slice(0, 16) : ""}
              className={input}
            />
          </div>
          <div>
            <label className={labelCls}>Reading minutes</label>
            <input type="number" name="reading_minutes" defaultValue={post?.reading_minutes ?? 4} className={input} />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload name="cover_image_url" label="Cover image (optional)" value={post?.cover_image_url} />
          </div>
        </div>

        <TriField name="title" label="Title" value={post?.title} required />
        <TriField name="excerpt" label="Excerpt (preview text)" value={post?.excerpt} multiline rows={3} />
        <TriField name="body" label="Body (HTML — use <p>, <h2>, <ul>, <strong>…)" value={post?.body} multiline rows={12} />

        <button type="submit" className="btn btn-primary">
          {isNew ? "Create post" : "Save changes"}
        </button>
      </form>

      {!isNew && (
        <form action={deletePost} className="mt-4">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">
            Delete this post
          </button>
        </form>
      )}
    </>
  );
}
