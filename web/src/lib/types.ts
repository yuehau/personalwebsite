import type { I18nText } from "./i18n";

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";
export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface Campaign {
  id: string;
  slug: string;
  tag: string | null;
  title: I18nText;
  summary: I18nText;
  body: I18nText;
  hero_image_url: string | null;
  status: ContentStatus;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
}

export interface Promotion {
  id: string;
  campaign_id: string;
  title: I18nText;
  description: I18nText;
  terms: I18nText;
  cta_label: I18nText;
  image_url: string | null;
  is_urgent: boolean;
  starts_at: string | null;
  ends_at: string | null;
  status: ContentStatus;
  sort_order: number;
}

export interface CampaignWithPromotions extends Campaign {
  promotions: Promotion[];
}

export interface Post {
  id: string;
  slug: string;
  category: string | null;
  title: I18nText;
  excerpt: I18nText;
  body: I18nText;
  cover_image_url: string | null;
  seo: Record<string, { title?: string; description?: string }> | null;
  reading_minutes: number | null;
  status: ContentStatus;
  published_at: string | null;
}

export interface Lead {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  lang: string | null;
  page_url: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}
