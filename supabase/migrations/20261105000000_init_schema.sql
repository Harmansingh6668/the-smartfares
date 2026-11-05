-- TheSmartFares clone: initial schema
-- Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- stores
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  website_url text,
  description text,
  is_featured boolean default false,
  is_popular boolean default false,
  coupon_count int default 0,
  offer_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  description text,
  code text,
  discount_value text,
  coupon_type text check (coupon_type in ('code','deal','offer')),
  affiliate_url text not null,
  usage_count int default 0,
  is_verified boolean default false,
  is_exclusive boolean default false,
  is_featured boolean default false,
  is_trending boolean default false,
  is_active boolean default true,
  expires_at timestamptz,
  starts_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- blog_posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  author text default 'Editorial Team',
  category text,
  tags text[],
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- coupon_clicks
create table if not exists public.coupon_clicks (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references public.coupons(id) on delete cascade,
  ip_hash text,
  user_agent_hash text,
  clicked_at timestamptz default now()
);

-- contact_messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- profiles (admin/editor roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin','editor')) default 'editor',
  created_at timestamptz default now()
);

-- indexes
create index if not exists idx_coupons_store on public.coupons(store_id);
create index if not exists idx_coupons_category on public.coupons(category_id);
create index if not exists idx_coupons_active on public.coupons(is_active);
create index if not exists idx_coupons_trending on public.coupons(is_trending);
create index if not exists idx_coupons_featured on public.coupons(is_featured);
create index if not exists idx_coupons_expires on public.coupons(expires_at);
create index if not exists idx_blog_posts_published on public.blog_posts(is_published, published_at desc);
create index if not exists idx_stores_featured on public.stores(is_featured);
create index if not exists idx_stores_popular on public.stores(is_popular);
create index if not exists idx_coupon_clicks_coupon on public.coupon_clicks(coupon_id);

-- full text search
alter table public.coupons add column if not exists search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) stored;
create index if not exists idx_coupons_search on public.coupons using gin(search_vector);

alter table public.stores add column if not exists search_vector tsvector
  generated always as (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))) stored;
create index if not exists idx_stores_search on public.stores using gin(search_vector);

-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_stores_updated_at on public.stores;
create trigger trg_stores_updated_at before update on public.stores
  for each row execute function public.set_updated_at();

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at before update on public.coupons
  for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- auto profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- scheduled expiry helper (called by pg_cron or an edge function)
create or replace function public.expire_old_coupons()
returns void as $$
begin
  update public.coupons
  set is_verified = false
  where expires_at is not null and expires_at < now() and is_verified = true;
end;
$$ language plpgsql security definer set search_path = public;

-- admin check helper (security definer avoids RLS recursion on profiles)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- RLS
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.coupons enable row level security;
alter table public.blog_posts enable row level security;
alter table public.coupon_clicks enable row level security;
alter table public.contact_messages enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "public read stores" on public.stores;
create policy "public read stores" on public.stores for select using (true);
drop policy if exists "admin write stores" on public.stores;
create policy "admin write stores" on public.stores for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active coupons" on public.coupons;
create policy "public read active coupons" on public.coupons for select using (is_active = true);
drop policy if exists "admin write coupons" on public.coupons;
create policy "admin write coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts for select using (is_published = true);
drop policy if exists "admin write posts" on public.blog_posts;
create policy "admin write posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public insert clicks" on public.coupon_clicks;
create policy "public insert clicks" on public.coupon_clicks for insert with check (true);
drop policy if exists "admin read clicks" on public.coupon_clicks;
create policy "admin read clicks" on public.coupon_clicks for select using (public.is_admin());

drop policy if exists "public insert messages" on public.contact_messages;
create policy "public insert messages" on public.contact_messages for insert with check (true);
drop policy if exists "admin read messages" on public.contact_messages;
create policy "admin read messages" on public.contact_messages for select using (public.is_admin());
drop policy if exists "admin update messages" on public.contact_messages;
create policy "admin update messages" on public.contact_messages for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
