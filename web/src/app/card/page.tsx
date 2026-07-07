import type { Metadata } from "next";
import { Stars } from "@/components/site/Decor";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Digital Card",
  description: `Save ${site.name}'s contact, call, or message on WhatsApp — tap and connect.`,
};

/* Minimal NFC-tap landing for now. Phase 3 ports the full premium card design. */
export default function CardPage() {
  return (
    <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-brand to-mid px-5 py-16">
      <div className="hero-orb left-[-4rem] top-[-3rem] h-72 w-72 bg-gold-soft/25" />
      <div className="hero-orb right-[-4rem] bottom-[-3rem] h-72 w-72 bg-bright/25" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/95 p-8 text-center shadow-e3 backdrop-blur">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand to-mid text-2xl font-bold text-white shadow-e2 ring-4 ring-mist">
          CY
        </div>
        <h1 className="mt-5 text-2xl">{site.name}</h1>
        <p className="mt-1 text-sm font-medium text-muted">{site.role}</p>
        <p className="text-sm text-muted">{site.region}</p>
        <div className="mt-3 flex justify-center">
          <Stars />
        </div>

        <div className="my-6 mx-auto gold-rule" />

        <div className="grid gap-3">
          <a
            href={waLink(`Hi ${site.name}, I just tapped your card!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp w-full"
          >
            WhatsApp me
          </a>
          <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="btn btn-primary w-full">
            Call {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost w-full">
            Email me
          </a>
        </div>

        <p className="mt-6 text-xs text-muted">
          🔧 Your premium NFC card (Save Contact .vcf + quick actions) gets ported here in Phase 3.
        </p>
      </div>
    </section>
  );
}
