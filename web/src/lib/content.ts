import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { pick, type Locale, defaultLocale } from "@/lib/i18n";
import type { CampaignWithPromotions, Post, Promotion } from "@/lib/types";

/* ---------- View models (already localized, plain strings) ---------- */
export interface PromoView {
  id: string;
  title: string;
  description: string;
  badge: string;
}
export interface CampaignView {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  heroImage?: string | null;
  promotions: PromoView[];
}
export interface PostView {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  coverImage?: string | null;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function promoBadge(p: Promotion): string {
  if (p.ends_at) return `Ends ${formatDate(p.ends_at)}`;
  if (p.is_urgent) return "Limited time";
  return "Available now";
}

function toCampaignView(c: CampaignWithPromotions, locale: Locale): CampaignView {
  const promos = [...(c.promotions ?? [])]
    .filter((p) => p.status === "published")
    .sort((a, b) => a.sort_order - b.sort_order);
  return {
    slug: c.slug,
    tag: c.tag ?? "Campaign",
    title: pick(c.title, locale),
    summary: pick(c.summary, locale),
    heroImage: c.hero_image_url,
    promotions: promos.map((p) => ({
      id: p.id,
      title: pick(p.title, locale),
      description: pick(p.description, locale),
      badge: promoBadge(p),
    })),
  };
}

function toPostView(p: Post, locale: Locale): PostView {
  return {
    slug: p.slug,
    category: p.category ?? "Insurance",
    title: pick(p.title, locale),
    excerpt: pick(p.excerpt, locale),
    readMinutes: p.reading_minutes ?? 4,
    coverImage: p.cover_image_url,
  };
}

/* ---------- Public fetchers (DB → fallback to sample) ---------- */

export async function getCampaigns(locale: Locale = defaultLocale): Promise<CampaignView[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("campaigns")
        .select("*, promotions(*)")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as CampaignWithPromotions[]).map((c) => toCampaignView(c, locale));
      }
    } catch {
      // fall through to sample
    }
  }
  return sampleCampaigns;
}

export async function getPosts(locale: Locale = defaultLocale): Promise<PostView[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as Post[]).map((p) => toPostView(p, locale));
      }
    } catch {
      // fall through to sample
    }
  }
  return samplePosts;
}

export interface PostDetail extends PostView {
  bodyHtml: string;
}

export async function getPost(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<PostDetail | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!error && data) {
        const p = data as Post;
        return { ...toPostView(p, locale), bodyHtml: pick(p.body, locale) };
      }
    } catch {
      // fall through to sample
    }
  }
  const s = samplePosts.find((p) => p.slug === slug);
  return s ? { ...s, bodyHtml: "" } : null;
}

/* ---------- Sample fallback content ---------- */
export const sampleCampaigns: CampaignView[] = [
  {
    slug: "year-end-protection-drive",
    tag: "Medical",
    title: "Year-End Protection Drive",
    summary:
      "Enhanced medical card coverage with a simplified sign-up window — get properly covered before the year closes.",
    promotions: [
      { id: "s1", title: "Free needs analysis", description: "A 30-minute review of your current cover and any gaps. No obligation.", badge: "Always free" },
      { id: "s2", title: "Simplified sign-up", description: "Fewer underwriting questions for eligible applicants this season.", badge: "Ends 31 Dec" },
      { id: "s3", title: "Higher limits, same budget", description: "Upgraded plans with higher annual & lifetime limits.", badge: "Limited time" },
    ],
  },
  {
    slug: "smart-savers-campaign",
    tag: "Savings",
    title: "Smart Savers Campaign",
    summary:
      "Goal-based savings plans that grow steadily while keeping your protection intact — start small, stay consistent.",
    promotions: [
      { id: "s4", title: "Free policy review", description: "Already saving elsewhere? I'll check if it's still the right fit.", badge: "Always free" },
      { id: "s5", title: "Flexible first-year premium", description: "Ease in with flexible premium options for new savers.", badge: "Limited time" },
    ],
  },
  {
    slug: "future-wealth-series",
    tag: "Investment",
    title: "Future Wealth Series",
    summary:
      "Investment-linked options for putting your money to work over the long term, with protection built in.",
    promotions: [
      { id: "s6", title: "Portfolio consultation", description: "A clear look at your goals, risk comfort and time horizon.", badge: "Always free" },
      { id: "s7", title: "Referral reward", description: "Introduce a friend who signs up and you both get a thank-you.", badge: "Ongoing" },
    ],
  },
];

export const samplePosts: PostView[] = [
  { slug: "do-you-need-a-medical-card", category: "Medical", readMinutes: 4, title: "Do you really need a medical card?", excerpt: "Hospital bills are the number-one reason Malaysians dip into savings or debt. Here's how to tell whether a medical card belongs in your plan." },
  { slug: "savings-vs-ilp", category: "Savings", readMinutes: 5, title: "Savings vs investment-linked, simplified", excerpt: "Two popular ways to grow your money — here's the plain-English difference and who each one suits." },
  { slug: "first-time-buyer-mistakes", category: "Tips", readMinutes: 6, title: "5 mistakes first-time policy buyers make", excerpt: "Avoid the common traps that cost first-time buyers money and peace of mind." },
  { slug: "how-much-to-retire", category: "Retirement", readMinutes: 7, title: "How much do you actually need to retire?", excerpt: "A simple way to estimate your number — without the scary jargon." },
  { slug: "term-vs-whole-life", category: "Life", readMinutes: 5, title: "Term vs whole life: which fits you?", excerpt: "When cheaper-but-temporary beats permanent cover, and when it doesn't." },
  { slug: "what-is-takaful", category: "Takaful", readMinutes: 4, title: "What makes takaful different?", excerpt: "How Shariah-compliant protection works and why it appeals to many Malaysians." },
];
