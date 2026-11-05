# SmartFares Hub

A full-stack coupon and deals aggregator — Next.js 14 (App Router) + TypeScript + Tailwind CSS,
backed by Supabase (Postgres, Auth, Storage). Modeled on the structure and UX of
[thesmartfares.online](https://www.thesmartfares.online/), extended with the security and admin
hardening described below.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript, Server Components + Server Actions
- **Styling:** Tailwind CSS (+ `tailwindcss-animate`, `@tailwindcss/typography`)
- **Backend:** Supabase — Postgres with Row Level Security, Supabase Auth, Supabase client/service-role SDKs
- **Rich text:** TipTap (blog post editor in `/admin/blog`)
- **Validation:** Zod on every API route and Server Action
- **Icons:** lucide-react

## Project structure

```
app/
  page.tsx                     Homepage (hero, categories, trending coupons, stores, blog)
  coupons/                     All coupons, paginated
  store/[slug]/                Store detail + filter/sort coupon list
  categories/, category/[slug]/
  blog/, blog/[slug]/
  about-us/, how-it-works/, contact/, privacy-policy/, terms-of-use/
  search/                      Store + coupon search results
  sitemap.ts, robots.ts        Dynamic SEO routes
  api/reveal-code/[id]/        Rate-limited code reveal + click logging
  api/contact/                 Validated, honeypot-protected contact form submit
  admin/
    login/                     Admin sign-in (outside the protected route group)
    (protected)/               Role-gated dashboard: overview, coupons, stores, blog, messages
    actions.ts                 Server Actions for all CRUD operations
components/                    Navbar, Footer, CouponCard, StoreCard, CategoryCard, BlogCard,
                                RevealCodeModal, SearchBar, Pagination, admin/* (DeleteButton, TipTapEditor)
lib/
  supabase/client.ts           Browser Supabase client (anon key)
  supabase/server.ts           Server Component/Action Supabase client (cookie-based session)
  supabase/admin.ts            Service-role client — server-only, bypasses RLS
  types.ts, utils.ts, rate-limit.ts
middleware.ts                  Admin route protection + security headers (CSP, X-Frame-Options, etc.)
supabase/migrations/           SQL schema, RLS policies, triggers
```

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** — copy `.env.example` to `.env.local` and fill in your
   Supabase project's values (Project Settings → API Keys):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_or_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_or_secret_key   # server-only, never exposed to the client
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=SmartFares Hub
   ```

3. **Run the database migration** — open your Supabase project's SQL Editor and run
   `supabase/migrations/20261105000000_init_schema.sql`. It creates all 7 tables, enables RLS on
   each, adds the public/admin policies, full-text-search columns, `updated_at` triggers, the
   `handle_new_user` trigger (auto-creates a `profiles` row on signup), and the `is_admin()` /
   `expire_old_coupons()` helper functions.

4. **Seed sample data (optional)** — 10 categories, 10 stores, 20 coupons and 3 blog posts. See
   the `INSERT` statements used during development in this repo's git history, or write your own
   against the schema above.

5. **Create an admin user** — in Supabase Dashboard → Authentication → Users → Add User, create
   an account with "Auto confirm user" checked. Then promote it to admin:

   ```sql
   update public.profiles set role = 'admin' where id = '<the new user's UID>';
   ```

   (A `profiles` row with `role = 'editor'` is created automatically by the `handle_new_user`
   trigger when the auth user is created — this just upgrades the role.)

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site and
   [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

## Security features

- **RLS everywhere** — every table has Row Level Security enabled. Public reads are scoped to
  published/active rows; writes require `profiles.role = 'admin'` (checked via a
  `SECURITY DEFINER` `is_admin()` function to avoid policy recursion).
- **Server-only service role** — `lib/supabase/admin.ts` is marked `server-only` and is used
  exclusively by the `/api/reveal-code` route to increment usage counts and log clicks; it is
  never bundled into client code.
- **Rate limiting** — `/api/reveal-code/[id]` and `/api/contact` are capped at 20 requests/hour
  and limited per IP via an in-memory sliding window (`lib/rate-limit.ts`). Swap in
  `@upstash/ratelimit` + Redis for a multi-instance production deployment.
- **Hashed click logging** — IP addresses and user agents are SHA-256 hashed
  (`lib/utils.ts#hashValue`) before being stored in `coupon_clicks`; raw IPs are never persisted.
- **Contact form protection** — Zod schema validation, a hidden honeypot field, and the same
  rate limiter. Wire up `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` to add
  reCAPTCHA v3 if needed.
- **Security headers** — `middleware.ts` sets CSP, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a locked-down `Permissions-Policy` on
  every response.
- **Admin auth hardening** — `/admin/*` is gated by middleware (session check) and the
  `(protected)` layout (role check against `profiles.role`), so both missing sessions and
  non-admin accounts are redirected. Supabase Auth's own brute-force protection covers failed
  login attempts; adjust thresholds under Authentication → Rate Limits in the dashboard.
- **Affiliate link safety** — `affiliate_url` and `code` are only returned by the server-side
  `/api/reveal-code` route after a click is logged, never embedded in the page's initial HTML.
  External links use `rel="noopener noreferrer sponsored"`.

## Known limitations / next steps

- Automated coupon expiry (`expire_old_coupons()`) is defined as a SQL function but not yet
  scheduled — enable `pg_cron` on the Supabase project and schedule a daily call, or invoke it
  from a Vercel Cron Job hitting a small API route.
- The in-memory rate limiter resets on server restart and isn't shared across serverless
  instances — fine for a single Node server or local dev, but swap for Upstash Redis before a
  multi-region production deploy.
- No automated test suite is included.

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel and add the environment variables from `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy — ISR (`revalidate = 3600`) is already configured on the homepage, store, category,
   and blog pages.
