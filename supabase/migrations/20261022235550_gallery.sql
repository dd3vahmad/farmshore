create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,                         -- e.g. 'Harvest', 'Event', 'Delivery'
  event_date date,
  image_url text,                   -- uploaded photo / banner (optional if link_url is set)
  link_url text,                    -- YouTube / Instagram / Facebook / TikTok / X / any link (optional if image_url is set)
  orientation text not null default 'landscape'
    check (orientation in ('landscape','portrait')),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_needs_media check (image_url is not null or link_url is not null)
);
create index gallery_pub_idx on public.gallery_items (is_published, sort_order, created_at desc);
create trigger gallery_items_updated_at before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;
create policy "public read published gallery" on public.gallery_items
  for select using (is_published);
create policy "admin all gallery" on public.gallery_items
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.site_settings add column if not exists facebook_url text;
alter table public.site_settings add column if not exists twitter_url text;
alter table public.site_settings add column if not exists tiktok_url text;
alter table public.site_settings add column if not exists youtube_url text;