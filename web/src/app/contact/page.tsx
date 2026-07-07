import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Office",
  description:
    "Find Chin Yue Hau's advisory office in the Klang Valley. Call, WhatsApp or get directions, or send a message for a free consultation.",
};

const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.office.mapsQuery)}&output=embed`;
const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.office.mapsQuery)}`;
const tel = site.phoneDisplay.replace(/\s/g, "");

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Let's talk"
        title={
          <>
            Contact &amp; <span className="serif-accent text-gold">office</span>
          </>
        }
        subtitle="Reach me the easy way on WhatsApp, or drop by the office. No pressure — just a clear, friendly conversation about your options."
      />

      {/* Quick actions */}
      <section className="container-x -mt-0 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={waLink(`Hi ${site.name}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover flex items-center gap-4 p-5"
          >
            <Dot className="bg-whatsapp" />
            <div>
              <p className="font-semibold text-ink">WhatsApp</p>
              <p className="text-sm text-muted">Fastest reply</p>
            </div>
          </a>
          <a href={`tel:${tel}`} className="card card-hover flex items-center gap-4 p-5">
            <Dot className="bg-brand" />
            <div>
              <p className="font-semibold text-ink">Call</p>
              <p className="text-sm text-muted">{site.phoneDisplay}</p>
            </div>
          </a>
          <a href={`mailto:${site.email}`} className="card card-hover flex items-center gap-4 p-5">
            <Dot className="bg-gold" />
            <div>
              <p className="font-semibold text-ink">Email</p>
              <p className="text-sm text-muted">{site.email}</p>
            </div>
          </a>
        </div>
      </section>

      <section className="container-x grid gap-10 pb-20 md:grid-cols-2">
        {/* Office + map */}
        <div>
          <span className="eyebrow">Where to find me</span>
          <h2 className="mt-3 text-2xl">{site.office.label}</h2>
          <address className="mt-3 not-italic leading-relaxed text-body">
            {site.office.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <p className="mt-3 text-sm text-muted">🕒 {site.office.hours}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={waLink(`Hi ${site.name}, I'd like to arrange a visit / consultation.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp me
            </a>
            <a href={mapsDirections} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Get directions →
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-card border border-hair shadow-e1">
            <iframe
              title="Office location map"
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0"
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            📍 Exact office address &amp; pin to be confirmed — placeholder map shown.
          </p>
        </div>

        {/* Lead form — saves to the leads table + emails you (when Resend is configured) */}
        <div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`h-10 w-10 shrink-0 rounded-full ${className}`} />;
}
