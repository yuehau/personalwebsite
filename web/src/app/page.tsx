import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { LifeTimeline } from "@/components/site/LifeTimeline";
import { Arcs, Stars } from "@/components/site/Decor";
import { getCampaigns, getPosts } from "@/lib/content";

const topics = ["Medical", "Life", "Critical illness", "Savings", "Investment-linked", "Retirement", "Takaful"];

const principles = [
  {
    title: "Needs first, never a hard sell",
    body: "We start with your goals and budget. The right plan is the one that fits your life — not the biggest premium.",
  },
  {
    title: "Plain language, always",
    body: "No jargon, no fine-print surprises. You'll know exactly what you're covered for before you decide anything.",
  },
  {
    title: "A partner for the long run",
    body: "I'm here after you sign too — for reviews, claims support, and the changes life inevitably brings.",
  },
];

const testimonials = [
  {
    quote: "Yue Hau explained everything so clearly that I finally understood what I was paying for. No pressure at all — just honest advice.",
    name: "Mei Ling",
    stage: "Mum of two, Petaling Jaya",
  },
  {
    quote: "He reviewed my old policy and found gaps I never knew about. I'm now properly covered for less than I expected.",
    name: "Arif",
    stage: "First-time buyer, Shah Alam",
  },
];

export default async function Home() {
  const [campaigns, posts] = await Promise.all([getCampaigns(), getPosts()]);
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-paper">
        <Arcs />
        <div className="container-x relative grid gap-14 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
          {/* Thesis */}
          <div>
            <span className="eyebrow rise d1">Authorised Allianz Life Advisor · {site.region}</span>
            <h1 className="rise d2 mt-6 text-[2.5rem] leading-[1.04] sm:text-5xl md:text-[3.55rem]">
              Insurance is really just a{" "}
              <span className="serif-accent text-brand">plan</span> for the people you{" "}
              <span className="serif-accent text-gold">love</span>.
            </h1>
            <p className="rise d3 mt-6 max-w-xl text-lg leading-relaxed text-body">
              I&apos;m {site.name}, a licensed Allianz advisor in the Klang Valley. I&apos;ll help
              you understand your options in plain language — no jargon, no pressure. Explore current
              campaigns, read a guide, or just ask me a question.
            </p>
            <div className="rise d4 mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(`Hi ${site.name}, I have a question about my insurance options.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Ask me anything on WhatsApp
              </a>
              <a href="#timeline" className="btn btn-ghost">
                See how cover works ↓
              </a>
            </div>

            {/* Trust row */}
            <dl className="rise d5 mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-hair pt-6">
              {[
                ["10+ yrs", "advising"],
                ["500+", "families protected"],
                ["4.9★", "client rating"],
              ].map(([v, l], i) => (
                <div key={l} className="flex items-center gap-7">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                  <div>
                    <dt className="font-display text-xl text-ink">{v}</dt>
                    <dd className="text-xs font-medium text-muted">{l}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Advisor trust panel */}
          <div className="rise d3">
            <div className="card relative p-6 md:p-7">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-mid text-2xl font-bold text-white ring-4 ring-mist">
                  CY
                </div>
                <div>
                  <p className="font-display text-xl text-ink">{site.name}</p>
                  <p className="text-sm text-muted">{site.role}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Stars />
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-mid">
                      Authorised agent
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-hair" />

              <blockquote className="font-display text-lg italic leading-snug text-ink">
                &ldquo;He made insurance feel simple, and I finally feel properly protected.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted">— A client in the Klang Valley</figcaption>

              <a
                href={waLink(`Hi ${site.name}, I'd like to book a free consultation.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6 w-full"
              >
                Book a free consultation
              </a>
              <p className="mt-3 text-center text-xs text-muted">
                Free &amp; no obligation · I usually reply within hours
              </p>
            </div>
          </div>
        </div>

        {/* Topic strip */}
        <div className="border-y border-hair bg-white/60">
          <div className="container-x flex flex-wrap items-center gap-x-3 gap-y-2 py-4 text-sm">
            <span className="font-semibold text-ink">I help with</span>
            {topics.map((t) => (
              <span key={t} className="rounded-full border border-hair bg-white px-3 py-1 text-body">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SIGNATURE TIMELINE ===================== */}
      <LifeTimeline />

      {/* ===================== PRINCIPLES ===================== */}
      <section className="bg-cloud py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Why work with me</span>
            <h2 className="mt-4 text-3xl md:text-4xl">
              Advice you can actually <span className="serif-accent text-gold">trust</span>.
            </h2>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="border-t-2 border-gold pt-5">
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CAMPAIGNS ===================== */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="eyebrow">Running now</span>
              <h2 className="mt-4 text-3xl md:text-4xl">Current campaigns</h2>
              <p className="mt-3 text-body">
                Themed protection drives from Allianz — each bundles a few promotions you can act on today.
              </p>
            </div>
            <Link href="/campaigns" className="link-arrow">
              See all campaigns →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {campaigns.slice(0, 3).map((c) => (
              <article key={c.slug} className="card card-hover overflow-hidden">
                <div className="relative flex h-40 items-end bg-gradient-to-br from-brand to-mid p-5">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
                    {c.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.summary}</p>
                  <Link href="/campaigns" className="link-arrow mt-4 text-sm">
                    Learn more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LEARN / BLOG ===================== */}
      <section className="bg-cloud py-20 md:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="eyebrow">Learn</span>
              <h2 className="mt-4 text-3xl md:text-4xl">
                Insurance, explained without the <span className="serif-accent text-gold">jargon</span>.
              </h2>
              <p className="mt-3 text-body">
                Short, honest guides to help you make confident decisions — whether or not you buy from me.
              </p>
            </div>
            <Link href="/blog" className="link-arrow">
              Read the blog →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <article key={p.slug} className="card card-hover overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-mist to-ice" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mid">
                    <span>{p.category}</span>
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    <span className="text-muted">{p.readMinutes} min read</span>
                  </div>
                  <h3 className="mt-3 text-lg leading-snug">{p.title}</h3>
                  <Link href={`/blog/${p.slug}`} className="link-arrow mt-4 text-sm">
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">In their words</span>
            <h2 className="mt-4 text-3xl md:text-4xl">Families I&apos;ve helped</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="card p-7">
                <Stars />
                <blockquote className="mt-4 font-display text-xl italic leading-snug text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted">
                  <span className="font-semibold text-body">{t.name}</span> · {t.stage}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">Sample testimonials — to be replaced with your real client words.</p>
        </div>
      </section>

      {/* ===================== CONTACT CTA ===================== */}
      <section className="bg-ink py-20 md:py-24">
        <div className="container-x grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-3xl text-white md:text-[2.6rem]">
              Let&apos;s find the right plan for{" "}
              <span className="serif-accent text-gold-soft">you</span>.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-mist">
              A relaxed, no-pressure chat — in person at my Klang Valley office, or on WhatsApp.
              Tell me your goals and I&apos;ll walk you through the options.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={waLink(`Hi ${site.name}, I'd like to chat about my insurance options.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full md:w-auto"
            >
              Message me on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-light w-full md:w-auto">
              Find my office →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

