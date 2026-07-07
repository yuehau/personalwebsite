-- ============================================================================
-- Optional starter content. Run once in Supabase → SQL Editor (like schema.sql).
-- Gives you real, published campaigns/promotions/posts to see the site live.
-- Safe to re-run (on conflict do nothing). Edit or delete any of it later in the
-- admin dashboard. Text is JSONB {"en": "..."} — Chinese/BM get added in Phase 2.
-- ============================================================================

-- ---------- Campaigns ----------
insert into public.campaigns (slug, tag, title, summary, status, sort_order) values
('year-end-protection-drive', 'Medical',
  '{"en":"Year-End Protection Drive"}',
  '{"en":"Enhanced medical card coverage with a simplified sign-up window — get properly covered before the year closes."}',
  'published', 1),
('smart-savers-campaign', 'Savings',
  '{"en":"Smart Savers Campaign"}',
  '{"en":"Goal-based savings plans that grow steadily while keeping your protection intact — start small, stay consistent."}',
  'published', 2),
('future-wealth-series', 'Investment',
  '{"en":"Future Wealth Series"}',
  '{"en":"Investment-linked options for putting your money to work over the long term, with protection built in."}',
  'published', 3)
on conflict (slug) do nothing;

-- ---------- Promotions (linked to campaigns by slug) ----------
insert into public.promotions (campaign_id, title, description, is_urgent, ends_at, status, sort_order)
select c.id, p.title, p.description, p.is_urgent, p.ends_at, 'published', p.sort_order
from public.campaigns c
join (values
  ('year-end-protection-drive', '{"en":"Free needs analysis"}'::jsonb, '{"en":"A 30-minute review of your current cover and any gaps. No obligation."}'::jsonb, false, null::timestamptz, 1),
  ('year-end-protection-drive', '{"en":"Simplified sign-up"}'::jsonb, '{"en":"Fewer underwriting questions for eligible applicants this season."}'::jsonb, true, '2026-12-31'::timestamptz, 2),
  ('year-end-protection-drive', '{"en":"Higher limits, same budget"}'::jsonb, '{"en":"Upgraded plans with higher annual & lifetime limits."}'::jsonb, true, null, 3),
  ('smart-savers-campaign', '{"en":"Free policy review"}'::jsonb, '{"en":"Already saving elsewhere? I''ll check if it''s still the right fit."}'::jsonb, false, null, 1),
  ('smart-savers-campaign', '{"en":"Flexible first-year premium"}'::jsonb, '{"en":"Ease in with flexible premium options for new savers."}'::jsonb, true, null, 2),
  ('future-wealth-series', '{"en":"Portfolio consultation"}'::jsonb, '{"en":"A clear look at your goals, risk comfort and time horizon."}'::jsonb, false, null, 1),
  ('future-wealth-series', '{"en":"Referral reward"}'::jsonb, '{"en":"Introduce a friend who signs up and you both get a thank-you."}'::jsonb, false, null, 2)
) as p(slug, title, description, is_urgent, ends_at, sort_order)
on c.slug = p.slug
where not exists (
  select 1 from public.promotions x where x.campaign_id = c.id and x.title = p.title
);

-- ---------- Blog posts ----------
insert into public.posts (slug, category, title, excerpt, body, reading_minutes, status, published_at) values
('do-you-need-a-medical-card', 'Medical',
  '{"en":"Do you really need a medical card?"}',
  '{"en":"Hospital bills are the number-one reason Malaysians dip into savings or debt. Here''s how to tell whether a medical card belongs in your plan."}',
  '{"en":"<p>A single hospital stay in a private ward can run into tens of thousands of ringgit. A medical card (hospitalisation &amp; surgical cover) pays those bills so you don''t have to empty your savings.</p><h2>Who needs one most</h2><ul><li>Anyone without strong employer coverage</li><li>Self-employed and gig workers</li><li>Families with young children</li></ul><h2>What to look for</h2><p>Check the <strong>annual and lifetime limits</strong>, the room-and-board rate, and whether it''s a reimbursement or cashless card. Happy to walk through the options with you.</p>"}',
  4, 'published', now()),
('savings-vs-ilp', 'Savings',
  '{"en":"Savings vs investment-linked, simplified"}',
  '{"en":"Two popular ways to grow your money — here''s the plain-English difference and who each one suits."}',
  '{"en":"<p>Both help you build money over time, but they work differently.</p><h2>Savings plans</h2><p>Lower risk, more predictable. Good for goals with a fixed date — a child''s education, a deposit.</p><h2>Investment-linked (ILP)</h2><p>Your premiums buy units in funds, so returns vary with the market. Higher potential growth, with protection bundled in.</p><blockquote>Rule of thumb: the longer your time horizon and risk comfort, the more an ILP can make sense.</blockquote>"}',
  5, 'published', now()),
('first-time-buyer-mistakes', 'Tips',
  '{"en":"5 mistakes first-time policy buyers make"}',
  '{"en":"Avoid the common traps that cost first-time buyers money and peace of mind."}',
  '{"en":"<p>After helping hundreds of families, the same five mistakes come up again and again.</p><ul><li>Buying on price alone</li><li>Skipping a proper needs analysis</li><li>Under-insuring income</li><li>Ignoring the fine print on exclusions</li><li>Never reviewing the policy again</li></ul><p>A quick review now can save you a lot later.</p>"}',
  6, 'published', now())
on conflict (slug) do nothing;
