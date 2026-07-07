import Link from "next/link";
import { nav, site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hair bg-cloud">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand block */}
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-mid text-sm font-bold text-white">
              CY
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-ink">{site.name}</span>
              <span className="block text-[0.7rem] font-medium text-muted">{site.role}</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.shortTagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={waLink(`Hi ${site.name}, I'd like a free consultation.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              WhatsApp
            </a>
            <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="btn btn-ghost">
              Call
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-bold text-ink">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/card" className="transition-colors hover:text-brand">
                Digital Card
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-ink">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>{site.phoneDisplay}</li>
            <li>{site.email}</li>
            <li>{site.office.addressLines.join(", ")}</li>
            <li>{site.office.hours}</li>
          </ul>
        </div>
      </div>

      {/* Compliance + copyright */}
      <div className="border-t border-hair">
        <div className="container-x py-6">
          <p className="text-xs leading-relaxed text-muted">{site.disclaimer}</p>
          <p className="mt-3 text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
