# The Diner Restobar — thediner.in

Website, table booking, CMS-style admin and Instagram/YouTube auto-sync for **The Diner Restobar**, Pattandur Agrahara, Whitefield, Bengaluru.

| Part | Tech | Hosted on |
| --- | --- | --- |
| `apps/web` | Next.js 16 (App Router, React 19), Tailwind CSS 4, Motion, Lenis | **Vercel** |
| `apps/api` | Node 22, Express 5, Zod, node-cron, Resend | **Render** |
| `supabase/` | Postgres + Auth + Storage, row-level security | **Supabase** |
| `packages/shared` | Zod schemas, types, booking-slot logic shared by web + API | — |

```
Browser ──► Vercel (Next.js, ISR pages) ──reads published content──► Supabase (anon key + RLS)
   │                                   ▲
   │ bookings / enquiries / admin      │ on-demand revalidation (tags)
   ▼                                   │
Render API (Express, service-role key) ──► Supabase
   └─ cron every 30 min: Instagram + YouTube → social_posts → revalidate "social"
```

## What's included

**Public site**: home, menu (search, veg filter, food/drinks), online booking with live slot availability, events and event pages, private parties and corporate enquiries, gallery with lightbox, Instagram and YouTube feeds, journal/blog with RSS, contact page with a lazy-loaded map, and editable policy, privacy and terms pages.

**Admin (`/admin`)**: dashboard, an event poster template with a live preview (heading, day/time, offer sticker, highlights, colour, photo upload, or your own poster artwork), bookings (confirm, cancel, seat, add phone or walk-in bookings, CSV export, guests emailed on confirm or cancel), enquiries, menu (dishes, prices, photos, sold-out toggle, categories, ordering), events, blog (markdown editor, image upload, SEO fields, scheduling), gallery, reviews, FAQs, pages, Instagram & YouTube (connect, sync now, hide or pin posts), site settings (business info, opening hours, home page text and images, booking rules, notification emails, SEO, social links, announcement bar), team logins with owner/admin/staff roles, and an activity log.

**SEO**:
- Structured data: Restaurant/BarOrPub JSON-LD (address, geo, hours, cuisine, menu, reservations), plus Menu, Event, BlogPosting, FAQPage and BreadcrumbList markup.
- A canonical URL, Open Graph and Twitter tags on every page.
- A dynamic `sitemap.xml`, `robots.txt` that blocks preview deployments and `/admin`, and an RSS feed.
- Local geo meta tags and fields for Google Search Console verification and GA4.
- Old URLs such as `/book` and `/blogs` redirect with 301s.
- Static pages with ISR. Admin edits go live within seconds through tag revalidation.

**Performance**:
- Server components by default. AVIF/WebP images through `next/image` with long cache lifetimes.
- Fonts self-hosted with `next/font`.
- The map, YouTube players and analytics load only when needed.
- Animations respect `prefers-reduced-motion`.

**Security**:
- RLS on every table. The anon key can only read published content.
- All writes go through the API with the service-role key, which stays server-side.
- Supabase Auth JWT plus a role check on every admin route.
- Zod validation, rate limits and a honeypot on public forms, Helmet, a CORS allow-list, and timing-safe secrets for cron and revalidation.
- CSV export guards against formula injection, and admin markdown is sanitised before rendering.

---

## 1. Local development

```bash
npm install
cp apps/api/.env.example apps/api/.env      # fill in Supabase keys + secrets
cp apps/web/.env.example apps/web/.env.local
npm run dev:api     # http://localhost:4000
npm run dev:web     # http://localhost:3000
```

Without Supabase keys the website still runs on built-in sample content (`apps/web/src/lib/fallback.ts`), which is handy for design work. Booking and admin need the API and Supabase.

## 2. Supabase

1. Create a project (region **Mumbai / ap-south-1**).
2. **SQL Editor** → run `supabase/migrations/20261022000000_init.sql`, then `supabase/seed.sql`.
   (Or with the CLI: `supabase link` → `supabase db push` → `psql < supabase/seed.sql`.)
3. **Authentication → URL configuration**: set Site URL to `https://thediner.in` and add `https://thediner.in/admin/reset` (and `http://localhost:3000/admin/reset`) to redirect URLs.
4. Create the first owner login:
   ```bash
   npm run create-owner --workspace @diner/api -- you@example.com "a-long-password" "Your Name"
   ```
5. Copy **Project URL**, **anon key** (web) and **service_role key** (API only).

## 3. Render (API)

1. Render → **New → Blueprint** → select this repo. `render.yaml` creates `the-diner-api` in Singapore.
2. Fill the secret env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `REVALIDATE_SECRET` (same value as on Vercel), and optionally `RESEND_API_KEY`, `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`.
3. Optional: add the custom domain `api.thediner.in`.
4. The **starter** plan is recommended. Free instances sleep, which makes the first booking of the day slow and pauses the 30-minute social sync. If you stay on free, add a Render **Cron Job** (or any uptime pinger) that runs:
   `curl -X POST https://api.thediner.in/v1/cron/sync-social -H "Authorization: Bearer $CRON_SECRET"`

## 4. Vercel (website)

1. Import the repo, set **Root Directory = `apps/web`** (framework auto-detected).
2. Env vars: `NEXT_PUBLIC_SITE_URL=https://thediner.in`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL=https://api.thediner.in` (or the Render URL), `REVALIDATE_SECRET`.
3. Domains: add `thediner.in` and `www.thediner.in` (redirect www → apex). Point DNS as Vercel instructs.
4. Enable **Web Analytics** and **Speed Insights** in the Vercel project (already wired in code).

## 5. Instagram auto-sync

Uses the official *Instagram API with Instagram Login*. The account must be a **Business or Creator** account.

1. In the Instagram app, switch @thedinerrestobar to a Professional account if it isn't one already.
2. Go to developers.facebook.com, choose **Create app**, pick **Other**, then **Business**, and add the **Instagram** product.
3. Under **API setup with Instagram login**, add the Instagram account as a tester and accept the invite in the Instagram app (Settings → Website permissions → Apps and websites).
4. Click **Generate token** for the account. This gives a long-lived token valid for 60 days.
5. In `/admin/social`, paste the token and click **Connect**. The API refreshes the token automatically before it expires.

New posts and reels show on the home and gallery pages within 30 minutes, or straight away with **Sync now**. Images are copied to Supabase Storage because Instagram's own image links expire. Reels show their cover image and open on Instagram.

## 6. YouTube auto-sync

1. Find the channel ID (starts with `UC`) at youtube.com/account_advanced.
2. In `/admin/settings`, open **Social links** and fill in the YouTube URL and channel ID.
3. In `/admin/social`, click **Sync YouTube**.

This works without an API key using the channel's public feed (latest 15 videos). If you set `YOUTUBE_API_KEY` on Render (Google Cloud → YouTube Data API v3), it fetches the latest 30 videos instead.

## 7. Emails (optional but recommended)

Create a Resend account, verify the `thediner.in` domain, and set `RESEND_API_KEY` on Render. Then set the recipient addresses in `/admin/settings` → **Notifications**. Without a key, the API logs emails instead of sending them.

## 8. Launch checklist (SEO)

- [ ] **Check sample content**: menu dishes and prices (most are placeholders, so verify every one against the printed menu), the home page story and stats, party packages and group discounts.
- [ ] **Check the recurring offers.** Acoustic Colours, Ladies Night, Pitcher Night, Social Hours and Andhra Lunch Combos were taken from older Google Business posts. Update or unpublish any that have changed under **Events**.
- [ ] **Add more photos.** The site uses the restaurant's own photos from its Google Business Profile (owner uploads and posts, enhanced and cropped, in `apps/web/public/images/diner`). Upload fresh dish and interior shots in the admin. Instagram sync adds new posts automatically.
- [ ] **Replace stand-in dish photos.** 36 menu items use free-licence stock photos (Unsplash License, in `apps/web/public/images/menu`) until you upload your own in **Admin → Menu**. Guntur Chicken, wings, momos, tacos, prawns and Andhra chicken curry use the restaurant's real photos (`apps/web/public/images/diner`).
- [ ] **Check the deals.** The "Best prices" section (₹99 social hours, ₹179 lunch combos, ₹499 pitchers, ₹1,000 for two) is edited in **Admin → Settings → Home page → Deals**.
- [ ] **Check the new dishes.** Chilli Chicken Wings, Chicken Momos, Crispy Chicken Tacos and Crispy Prawns were added from the restaurant's own food photos. Confirm their names and prices.
- [ ] **Run both migrations.** After `20261022000000_init.sql`, run `20261023000000_event_poster_template.sql`, then `seed.sql`.
- [ ] Add real guest reviews under **Reviews** (only genuine ones, with names as shown on Google).
- [ ] Google Search Console: add the `thediner.in` property and paste the verification code into **Settings → SEO**. Then submit `https://thediner.in/sitemap.xml`.
- [ ] Google Business Profile: set the website to `https://thediner.in`, the booking link to `https://thediner.in/reserve` and the menu link to `https://thediner.in/menu`. Keep the hours identical to the site.
- [ ] Ask the old sites to be removed, or 301-redirect them to thediner.in. Update links on Zomato, Swiggy, Instagram bio, Tripadvisor and Justdial.
- [ ] Publish one useful local blog post a week, for example "best rooftop bars in Whitefield", match-night guides, new dishes or party tips.
- [ ] Run a PageSpeed Insights check after launch. The target is 90+ on mobile.

## Project scripts

| Command | What it does |
| --- | --- |
| `npm run dev:web` / `dev:api` | Run locally |
| `npm run build` | Build everything |
| `npm run typecheck` | Type-check all workspaces |
| `npm run create-owner -w @diner/api -- <email> <password> [name]` | Create the first admin owner |

## Folder map

```
apps/web/src/app/(site)      public pages        apps/api/src/routes/public.ts   booking + enquiry endpoints
apps/web/src/app/admin       admin panel         apps/api/src/routes/admin/*      admin endpoints
apps/web/src/lib/data.ts     cached reads        apps/api/src/services/*          Instagram, YouTube, sync
apps/web/src/lib/seo.ts      JSON-LD + metadata  supabase/migrations              schema + RLS
```
