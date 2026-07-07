import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { site, waLink } from "@/lib/site";
import { getCampaigns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Campaigns & Promotions",
  description:
    "Current Allianz campaigns and the promotions running under each — medical, savings and investment plans for Klang Valley families.",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <>
      <PageHeader
        eyebrow="From Allianz · Updated regularly"
        title={
          <>
            Campaigns &amp; <span className="serif-accent text-gold">promotions</span>
          </>
        }
        subtitle="Each campaign is a theme that bundles a few promotions you can act on today. Tap any to ask me about it — no pressure, just answers."
      />

      <section className="container-x space-y-12 py-16 md:py-20">
        {campaigns.map((c) => (
          <article key={c.slug} className="card overflow-hidden lg:grid lg:grid-cols-[0.95fr_1.4fr]">
            {/* Campaign theme panel */}
            <div className="relative flex flex-col justify-between overflow-hidden p-8 text-white">
              {c.heroImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-brand/80" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand to-mid" />
              )}
              <div className="relative">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
                  {c.tag}
                </span>
                <h2 className="mt-5 text-2xl text-white md:text-[1.75rem]">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{c.summary}</p>
              </div>
              <p className="relative mt-6 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                {c.promotions.length} promotion{c.promotions.length === 1 ? "" : "s"} inside
              </p>
            </div>

            {/* Promotions inside this campaign */}
            <div className="p-6 md:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {c.promotions.map((p) => (
                  <div key={p.id} className="flex flex-col rounded-card border border-hair bg-paper p-5">
                    <span className="self-start rounded-full bg-gold/12 px-2.5 py-1 text-xs font-semibold text-gold">
                      {p.badge}
                    </span>
                    <h3 className="mt-3 text-lg">{p.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                    <a
                      href={waLink(`Hi ${site.name}, I'm interested in "${p.title}" (${c.title}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow mt-4 text-sm"
                    >
                      Ask about this →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
