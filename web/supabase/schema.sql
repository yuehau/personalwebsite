-- ============================================================================
-- Chin Yue Hau — Allianz advisor site · Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE where possible).
--
-- Model:
--   campaigns (theme)  1 ──< many  promotions (offers)
--   posts (blog)       standalone
--   leads              public can insert; only admins can read
--
-- Trilingual text is stored as JSONB: {"en": "...", "zh": "...", "ms": "..."}
-- The app falls back to "en" when a language is missing.
-- ============================================================================

-- ---------- Enums -------------------------------------------------------------
do $$ begin
  create type content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'won', 'lost');
exception when duplicate_object then null; end $$;

-- ---------- Admin allowlist ---------------------------------------------------
-- Only emails listed here (and linked to an auth user) can manage content.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text unique not null,
  full_name  text,
  created_at timestamptz not null default now()
);

-- Helper: is the current request from an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------- updated_at trigger ------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Campaigns ---------------------------------------------------------
create table if not exists public.campaigns (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  tag           text,                                   -- e.g. "Medical", "Savings"
  title         jsonb not null default '{}'::jsonb,     -- {en, zh, ms}
  summary       jsonb not null default '{}'::jsonb,
  body          jsonb not null default '{}'::jsonb,     -- rich HTML per language
  hero_image_url text,
  status        content_status not null default 'draft',
  starts_at     timestamptz,
  ends_at       timestamptz,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists campaigns_status_idx on public.campaigns (status, sort_order);
drop trigger if exists campaigns_touch on public.campaigns;
create trigger campaigns_touch before update on public.campaigns
  for each row execute function public.touch_updated_at();

-- ---------- Promotions (live inside a campaign) -------------------------------
create table if not exists public.promotions (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.campaigns (id) on delete cascade,
  title         jsonb not null default '{}'::jsonb,
  description   jsonb not null default '{}'::jsonb,
  terms         jsonb not null default '{}'::jsonb,     -- fine print / disclaimers
  cta_label     jsonb not null default '{}'::jsonb,
  image_url     text,
  is_urgent     boolean not null default false,
  starts_at     timestamptz,
  ends_at       timestamptz,                            -- limited-time offers
  status        content_status not null default 'draft',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists promotions_campaign_idx on public.promotions (campaign_id, sort_order);
create index if not exists promotions_status_idx on public.promotions (status);
drop trigger if exists promotions_touch on public.promotions;
create trigger promotions_touch before update on public.promotions
  for each row execute function public.touch_updated_at();

-- ---------- Blog posts --------------------------------------------------------
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category        text,                                 -- Medical, Life, Savings...
  title           jsonb not null default '{}'::jsonb,
  excerpt         jsonb not null default '{}'::jsonb,
  body            jsonb not null default '{}'::jsonb,    -- rich HTML per language
  cover_image_url text,
  seo             jsonb not null default '{}'::jsonb,    -- {en:{title,description}, ...}
  reading_minutes int,
  status          content_status not null default 'draft',
  published_at    timestamptz,                           -- drives scheduled publishing
  author_id       uuid references public.admins (user_id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists posts_status_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category);
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------- Leads -------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  phone       text,
  email       text,
  interest    text,
  message     text,
  source      text,                                      -- 'contact_form' | 'promo:slug' | ...
  lang        text default 'en',
  page_url    text,
  status      lead_status not null default 'new',
  notes       text,
  created_at  timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.campaigns  enable row level security;
alter table public.promotions enable row level security;
alter table public.posts      enable row level security;
alter table public.leads      enable row level security;
alter table public.admins     enable row level security;

-- Public can read PUBLISHED campaigns / promotions / posts only.
drop policy if exists "public read published campaigns" on public.campaigns;
create policy "public read published campaigns" on public.campaigns
  for select using (status = 'published');

drop policy if exists "public read published promotions" on public.promotions;
create policy "public read published promotions" on public.promotions
  for select using (status = 'published');

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (status = 'published' and (published_at is null or published_at <= now()));

-- Admins can do everything on content.
drop policy if exists "admins manage campaigns" on public.campaigns;
create policy "admins manage campaigns" on public.campaigns
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage promotions" on public.promotions;
create policy "admins manage promotions" on public.promotions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage posts" on public.posts;
create policy "admins manage posts" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Leads: anyone may submit (insert); only admins may read / update.
drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead" on public.leads
  for insert with check (true);

drop policy if exists "admins read leads" on public.leads;
create policy "admins read leads" on public.leads
  for select using (public.is_admin());

drop policy if exists "admins update leads" on public.leads;
create policy "admins update leads" on public.leads
  for update using (public.is_admin()) with check (public.is_admin());

-- Admins table: an admin can see the allowlist.
drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select using (public.is_admin());

-- ============================================================================
-- Storage bucket for images (campaign heroes, post covers, promo art)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admins write media" on storage.objects;
create policy "admins write media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ============================================================================
-- AFTER RUNNING: add yourself (and your helper) as admins.
-- 1) Create the user(s) in Authentication → Users (or have them log in once).
-- 2) Then run, replacing the email:
--    insert into public.admins (user_id, email, full_name)
--    select id, email, 'Chin Yue Hau' from auth.users where email = 'you@email.com'
--    on conflict (user_id) do nothing;
-- ============================================================================
