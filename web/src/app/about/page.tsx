import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Stars } from "@/components/site/Decor";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.role} serving ${site.region}.`,
};

const principles = [
  { title: "Needs first, never a hard sell", body: "We start with your goals and budget. The right plan is the one that fits your life — not the biggest premium." },
  { title: "Plain language, always", body: "No jargon, no fine-print surprises. You'll know exactly what you're covered for before you decide anything." },
  { title: "A partner for the long run", body: "I'm here after you sign too — for reviews, claims support, and the changes life inevitably brings." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About me"
        title={
          <>
            Hi, I&apos;m <span className="serif-accent text-brand">{site.name}</span>.
          </>
        }
        subtitle={`${site.role} · ${site.region}`}
      />

      <section className="container-x grid items-start gap-12 py-16 md:grid-cols-[1.3fr_0.9fr] md:py-20">
        <div>
          <p className="text-xl leading-relaxed text-body">
            I help families and professionals across the Klang Valley protect what matters and plan
            for the future with confidence.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            As an authorised Allianz advisor, I make insurance simple — translating campaigns,
            coverage and numbers into clear choices you can act on. Whether you&apos;re buying your
            first medical card, building a savings habit, or planning for retirement, my job is to
            give you honest options and stay with you for the long run.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            No pressure, no jargon — just guidance you can trust, in the language you&apos;re most
            comfortable with.
          </p>
          <a
            href={waLink(`Hi ${site.name}, I'd like to get to know my options.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-7"
          >
            Start a conversation
          </a>
        </div>

        {/* Advisor panel */}
        <div className="card p-6 md:p-7">
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-brand to-mid text-3xl font-bold text-white ring-4 ring-mist">
            CY
          </div>
          <p className="mt-4 font-display text-xl text-ink">{site.name}</p>
          <p className="text-sm text-muted">{site.role}</p>
          <div className="mt-3 flex items-center gap-2">
            <Stars />
            <span className="rounded-full bg-mist px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-mid">
              Authorised agent
            </span>
          </div>
          <div className="my-5 h-px bg-hair" />
          <dl className="space-y-3 text-sm">
            <Row k="Based in" v={site.region} />
            <Row k="Specialises in" v="Medical · Life · Savings · Retirement" />
            <Row k="Languages" v="English · 中文 · Bahasa Malaysia" />
          </dl>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-cloud py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">How I work</span>
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
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium text-body">{v}</dd>
    </div>
  );
}
