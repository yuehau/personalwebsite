/**
 * Central site configuration — single source of truth for brand,
 * contact details, navigation, and WhatsApp deep-links.
 * Swap the placeholder values (email, address, agent code) when confirmed.
 */
export const site = {
  name: "Chin Yue Hau",
  role: "Allianz Life Financial Advisor",
  region: "Klang Valley, Malaysia",
  shortTagline: "Protection, savings & investment planning — done properly.",
  // Contact
  whatsapp: "60147058125", // digits only, intl format (no + or spaces)
  phoneDisplay: "+60 14-705 8125",
  email: "yuehau125@gmail.com", // TODO: confirm business email
  // Office (TODO: confirm exact address + hours at build time)
  office: {
    label: "Allianz Advisory Office",
    addressLines: ["Klang Valley", "Selangor, Malaysia"],
    hours: "Mon–Sat, 9:00am – 6:00pm",
    mapsQuery: "Allianz Malaysia Klang Valley",
  },
  // Compliance footer
  disclaimer:
    "Chin Yue Hau is an authorised life insurance agent representing Allianz Life Insurance Malaysia Berhad. " +
    "This is a personal advisory website, not an official Allianz corporate site. " +
    "Product information is for general reference only and subject to the terms, conditions and " +
    "official documentation of Allianz. Promotions are advisory service offers by the agent.",
} as const;

/** Build a WhatsApp click-to-chat link with an optional pre-filled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Primary navigation used by the header and footer. */
export const nav = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
