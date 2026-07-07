"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";

/* ---------- helpers ---------- */
function tri(form: FormData, name: string): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const loc of ["en", "zh", "ms"] as const) {
    const val = String(form.get(`${name}__${loc}`) ?? "").trim();
    if (val) obj[loc] = val;
  }
  return obj;
}
function str(form: FormData, name: string): string | null {
  const v = String(form.get(name) ?? "").trim();
  return v || null;
}
async function adminDb() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return createClient();
}

/* ---------- auth ---------- */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- campaigns ---------- */
export async function saveCampaign(formData: FormData) {
  const supabase = await adminDb();
  const id = str(formData, "id");
  const payload = {
    slug: str(formData, "slug"),
    tag: str(formData, "tag"),
    status: str(formData, "status") ?? "draft",
    sort_order: Number(formData.get("sort_order") ?? 0),
    hero_image_url: str(formData, "hero_image_url"),
    title: tri(formData, "title"),
    summary: tri(formData, "summary"),
    body: tri(formData, "body"),
  };
  if (id && id !== "new") await supabase.from("campaigns").update(payload).eq("id", id);
  else await supabase.from("campaigns").insert(payload);
  revalidatePath("/campaigns");
  revalidatePath("/");
  redirect("/admin/campaigns");
}

export async function deleteCampaign(formData: FormData) {
  const supabase = await adminDb();
  await supabase.from("campaigns").delete().eq("id", String(formData.get("id")));
  revalidatePath("/campaigns");
  redirect("/admin/campaigns");
}

/* ---------- promotions ---------- */
export async function savePromotion(formData: FormData) {
  const supabase = await adminDb();
  const id = str(formData, "id");
  const campaign_id = String(formData.get("campaign_id"));
  const payload = {
    campaign_id,
    status: str(formData, "status") ?? "draft",
    is_urgent: formData.get("is_urgent") === "on",
    ends_at: str(formData, "ends_at"),
    sort_order: Number(formData.get("sort_order") ?? 0),
    title: tri(formData, "title"),
    description: tri(formData, "description"),
  };
  if (id && id !== "new") await supabase.from("promotions").update(payload).eq("id", id);
  else await supabase.from("promotions").insert(payload);
  revalidatePath(`/admin/campaigns/${campaign_id}`);
  revalidatePath("/campaigns");
  redirect(`/admin/campaigns/${campaign_id}`);
}

export async function deletePromotion(formData: FormData) {
  const supabase = await adminDb();
  const campaign_id = String(formData.get("campaign_id"));
  await supabase.from("promotions").delete().eq("id", String(formData.get("id")));
  revalidatePath(`/admin/campaigns/${campaign_id}`);
  revalidatePath("/campaigns");
  redirect(`/admin/campaigns/${campaign_id}`);
}

/* ---------- posts ---------- */
export async function savePost(formData: FormData) {
  const supabase = await adminDb();
  const id = str(formData, "id");
  const status = str(formData, "status") ?? "draft";
  let published_at = str(formData, "published_at");
  if (status === "published" && !published_at) published_at = new Date().toISOString();
  const payload = {
    slug: str(formData, "slug"),
    category: str(formData, "category"),
    status,
    published_at,
    reading_minutes: formData.get("reading_minutes")
      ? Number(formData.get("reading_minutes"))
      : null,
    cover_image_url: str(formData, "cover_image_url"),
    title: tri(formData, "title"),
    excerpt: tri(formData, "excerpt"),
    body: tri(formData, "body"),
  };
  if (id && id !== "new") await supabase.from("posts").update(payload).eq("id", id);
  else await supabase.from("posts").insert(payload);
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const supabase = await adminDb();
  await supabase.from("posts").delete().eq("id", String(formData.get("id")));
  revalidatePath("/blog");
  redirect("/admin/posts");
}

/* ---------- leads ---------- */
export async function updateLeadStatus(formData: FormData) {
  const supabase = await adminDb();
  await supabase
    .from("leads")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
