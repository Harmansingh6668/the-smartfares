-- Rich per-store content for the store detail page (About, Tips, FAQ, Support, Refund policy)
alter table public.stores add column if not exists about_content text[] default '{}';
alter table public.stores add column if not exists saving_tips text[] default '{}';
alter table public.stores add column if not exists support_tips text[] default '{}';
alter table public.stores add column if not exists refund_policy text;
alter table public.stores add column if not exists faq jsonb default '[]';
alter table public.stores add column if not exists primary_category_id uuid references public.categories(id);
create index if not exists idx_stores_primary_category on public.stores(primary_category_id);
