import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  saveCampaign,
  deleteCampaign,
  savePromotion,
  deletePromotion,
} from "@/lib/actions/admin";
import { TriField } from "@/components/admin/TriField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { pick } from "@/lib/i18n";
import type { Campaign, Promotion } from "@/lib/types";

export const metadata = { title: "Edit campaign", robots: { index: false } };

const input = "w-full rounded-lg border border-hair bg-white px-3 py-2 text-sm outline-none focus:border-brand";
const labelCls = "mb-1 block text-sm font-medium text-body";

export default async function CampaignEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  let campaign: Campaign | null = null;
  let promotions: Promotion[] = [];

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    campaign = data as Campaign;
    const { data: promos } = await supabase
      .from("promotions")
      .select("*")
      .eq("campaign_id", id)
      .order("sort_order", { ascending: true });
    promotions = (promos as Promotion[] | null) ?? [];
  }

  return (
    <>
      <Link href="/admin/campaigns" className="link-arrow text-sm">← Campaigns</Link>
      <h1 className="mt-3 text-3xl">
        {isNew ? "New campaign" : pick(campaign!.title) || "Edit campaign"}
      </h1>

      <form action={saveCampaign} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input name="slug" required defaultValue={campaign?.slug ?? ""} placeholder="year-end-drive" className={input} />
          </div>
          <div>
            <label className={labelCls}>Tag</label>
            <input name="tag" defaultValue={campaign?.tag ?? ""} placeholder="Medical" className={input} />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={campaign?.status ?? "draft"} className={input}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (live)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={campaign?.sort_order ?? 0} className={input} />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload name="hero_image_url" label="Hero image (optional)" value={campaign?.hero_image_url} />
          </div>
        </div>

        <TriField name="title" label="Title" value={campaign?.title} required />
        <TriField name="summary" label="Summary" value={campaign?.summary} multiline rows={3} />
        <TriField name="body" label="Body (optional, HTML allowed)" value={campaign?.body} multiline rows={6} />

        <button type="submit" className="btn btn-primary">
          {isNew ? "Create campaign" : "Save changes"}
        </button>
      </form>

      {!isNew && (
        <>
          <form action={deleteCampaign} className="mt-4">
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">
              Delete this campaign
            </button>
          </form>

          <section className="mt-14">
            <h2 className="text-2xl">Promotions</h2>
            <p className="mt-1 text-muted">The offers shown inside this campaign.</p>
            <div className="mt-5 space-y-5">
              {promotions.map((p) => (
                <PromoForm key={p.id} campaignId={id} promo={p} />
              ))}
              <PromoForm campaignId={id} />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function PromoForm({ campaignId, promo }: { campaignId: string; promo?: Promotion }) {
  const isNew = !promo;
  return (
    <div className={`card p-5 ${isNew ? "border-dashed" : ""}`}>
      <form action={savePromotion} className="space-y-4">
        <input type="hidden" name="campaign_id" value={campaignId} />
        <input type="hidden" name="id" value={promo?.id ?? "new"} />
        <h3 className="text-lg">{isNew ? "Add a promotion" : pick(promo!.title) || "Promotion"}</h3>

        <TriField name="title" label="Title" value={promo?.title} required />
        <TriField name="description" label="Description" value={promo?.description} multiline rows={3} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={promo?.status ?? "published"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Ends on (optional)</label>
            <input type="date" name="ends_at" defaultValue={promo?.ends_at?.slice(0, 10) ?? ""} className={input} />
          </div>
          <div>
            <label className={labelCls}>Sort order</label>
            <input type="number" name="sort_order" defaultValue={promo?.sort_order ?? 0} className={input} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-body">
          <input type="checkbox" name="is_urgent" defaultChecked={promo?.is_urgent ?? false} />
          Mark as limited-time / urgent
        </label>

        <button type="submit" className="btn btn-primary">
          {isNew ? "Add promotion" : "Save promotion"}
        </button>
      </form>

      {!isNew && (
        <form action={deletePromotion} className="mt-3">
          <input type="hidden" name="campaign_id" value={campaignId} />
          <input type="hidden" name="id" value={promo!.id} />
          <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">
            Delete promotion
          </button>
        </form>
      )}
    </div>
  );
}
