# Backend setup (≈5 minutes, all free)

This connects your site to a database so you can manage real campaigns, promotions
and blog posts, log in to the admin dashboard, and save leads. Until you do this,
the site happily runs on sample content.

## 1. Create a free Supabase project
1. Go to **supabase.com** → sign up (free) → **New project**.
2. Pick a name (e.g. `chinyuehau`) and a strong database password (save it).
3. Choose the **Singapore** region (closest to Malaysia → faster).
4. Wait ~2 minutes for it to finish setting up.

## 2. Create the database tables
1. In your project, open **SQL Editor** → **New query**.
2. Open the file `web/supabase/schema.sql`, copy everything, paste it in, click **Run**.
3. You should see "Success". That builds all the tables, security rules, and the image store.

## 3. Make yourself an admin
1. Go to **Authentication → Users → Add user** → add your email (and your helper's).
2. Back in **SQL Editor**, run this (change the email):
   ```sql
   insert into public.admins (user_id, email, full_name)
   select id, email, 'Chin Yue Hau' from auth.users where email = 'you@email.com'
   on conflict (user_id) do nothing;
   ```
   Repeat for your helper's email.

## 4. Give me the keys
1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Create `web/.env.local` (copy from `web/.env.example`) and paste them into:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

That's it. Once those are in, the admin dashboard, real content, and saved leads come alive.

## Later (optional)
- **Resend** (resend.com) for "email me when a lead arrives" — add `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`.
- **Anthropic** key for Phase 2 AI translation — add `ANTHROPIC_API_KEY`.

> Security note: the `anon` key is meant to be public — the database is protected by
> row-level security (set up by `schema.sql`), so visitors can only read published
> content and submit a lead; only admins can edit anything or read leads.
