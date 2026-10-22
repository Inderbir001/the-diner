-- The Diner Restobar: initial schema
-- Public site reads published content with the anon key (RLS below).
-- Every write goes through the Render API using the service-role key, which bypasses RLS.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- admin users (linked to Supabase Auth)
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'admin' check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- site settings: one row per section (general, social, seo, home, booking, announcement)
-- ---------------------------------------------------------------------------
create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- menu
-- ---------------------------------------------------------------------------
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  kind text not null default 'food' check (kind in ('food', 'drinks')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger menu_categories_updated before update on public.menu_categories
  for each row execute function public.set_updated_at();

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2),
  price_note text,
  image_url text,
  is_veg boolean not null default false,
  is_spicy boolean not null default false,
  is_signature boolean not null default false,
  is_available boolean not null default true,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_items_category_idx on public.menu_items (category_id, sort_order);
create trigger menu_items_updated before update on public.menu_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create type public.booking_status as enum
  ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  phone text not null,
  email text,
  party_size int not null check (party_size between 1 and 500),
  booking_date date not null,
  booking_time text not null check (booking_time ~ '^\d{2}:\d{2}$'),
  area text,
  occasion text,
  notes text,
  status public.booking_status not null default 'pending',
  source text not null default 'website',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_date_idx on public.bookings (booking_date, booking_time);
create index bookings_status_idx on public.bookings (status);
create trigger bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- enquiries (contact form, private parties, corporate events)
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'general' check (type in ('general', 'party', 'corporate', 'feedback')),
  name text not null,
  phone text,
  email text,
  event_date date,
  guests int,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger enquiries_updated before update on public.enquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  body text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_recurring boolean not null default false,
  recurrence_label text,
  price_label text,
  cta_label text,
  cta_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_starts_idx on public.events (starts_at);
create trigger events_updated before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  cover_alt text,
  tags text[] not null default '{}',
  author text not null default 'The Diner Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (status, published_at desc);
create trigger posts_updated before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery, testimonials, faqs, editable pages
-- ---------------------------------------------------------------------------
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  caption text,
  category text not null default 'ambience',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger gallery_updated before update on public.gallery_images
  for each row execute function public.set_updated_at();

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  source text default 'Google',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger testimonials_updated before update on public.testimonials
  for each row execute function public.set_updated_at();

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger faqs_updated before update on public.faqs
  for each row execute function public.set_updated_at();

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  seo_description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger pages_updated before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- social (Instagram + YouTube) — synced automatically by the API
-- ---------------------------------------------------------------------------
create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram', 'youtube')),
  external_id text not null,
  media_type text not null,
  caption text,
  permalink text not null,
  media_url text,
  thumbnail_url text,
  published_at timestamptz not null,
  is_hidden boolean not null default false,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_id)
);
create index social_posts_feed_idx on public.social_posts (platform, is_hidden, published_at desc);
create trigger social_posts_updated before update on public.social_posts
  for each row execute function public.set_updated_at();

-- secrets for integrations: never readable by anon/authenticated
create table public.integrations (
  platform text primary key check (platform in ('instagram', 'youtube')),
  access_token text,
  token_expires_at timestamptz,
  account_id text,
  account_name text,
  last_synced_at timestamptz,
  last_error text,
  updated_at timestamptz not null default now()
);
create trigger integrations_updated before update on public.integrations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- audit log
-- ---------------------------------------------------------------------------
create table public.activity_log (
  id bigint generated always as identity primary key,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
create index activity_log_created_idx on public.activity_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.settings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.bookings enable row level security;
alter table public.enquiries enable row level security;
alter table public.events enable row level security;
alter table public.posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.pages enable row level security;
alter table public.social_posts enable row level security;
alter table public.integrations enable row level security;
alter table public.activity_log enable row level security;

-- Public read access for published content only.
create policy "public read settings" on public.settings
  for select using (key in ('general', 'social', 'seo', 'home', 'booking', 'announcement'));
create policy "public read categories" on public.menu_categories
  for select using (is_active);
create policy "public read items" on public.menu_items
  for select using (
    exists (select 1 from public.menu_categories c where c.id = category_id and c.is_active)
  );
create policy "public read events" on public.events for select using (is_published);
create policy "public read posts" on public.posts
  for select using (status = 'published' and published_at <= now());
create policy "public read gallery" on public.gallery_images for select using (is_published);
create policy "public read testimonials" on public.testimonials for select using (is_published);
create policy "public read faqs" on public.faqs for select using (is_published);
create policy "public read pages" on public.pages for select using (is_published);
create policy "public read social" on public.social_posts for select using (not is_hidden);
-- bookings, enquiries, integrations, admin_users, activity_log: no policies => no anon access.

-- ---------------------------------------------------------------------------
-- Storage bucket for uploaded media (public read; writes via service role)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4']
)
on conflict (id) do nothing;
