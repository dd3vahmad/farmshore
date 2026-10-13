-- ============ helpers ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- admin = user whose app_metadata.role is 'admin' (set via SQL below, not editable by users)
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

-- ============ categories ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============ products ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price > price),
  pack_size text,                 -- e.g. '500g', '1kg', '5 pieces'
  weight_grams integer,
  shelf_life text,                -- e.g. '3 months frozen'
  storage_instructions text,      -- e.g. 'Keep frozen. Refrigerate after opening.'
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_id);
create index products_active_idx on public.products (is_active, is_featured);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ============ orders ============
create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('SF-' || nextval('public.order_number_seq')),
  customer_name text not null,
  email text,
  phone text not null,
  address text,
  city text,
  state text,
  notes text,
  items jsonb not null,           -- snapshot: [{product_id, name, price, qty, image}]
  subtotal numeric(12,2) not null,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  currency text not null default 'NGN',
  status text not null default 'pending'
    check (status in ('pending','paid','processing','out_for_delivery','delivered','cancelled')),
  payment_provider text not null default 'paystack',
  payment_reference text unique,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_idx on public.orders (status, created_at desc);
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ============ site_settings (single row, editable from admin) ============
create table public.site_settings (
  id integer primary key default 1,
  brand_name text default 'Your Brand Name',
  tagline text default 'Premium smoked fish, delivered fresh to your door.',
  logo_url text,
  color_primary text default '#166534',   -- deep green
  color_accent  text default '#16a34a',   -- bright green
  color_dark    text default '#0b1f14',
  color_light   text default '#ffffff',
  hero_title text default 'Rich, smoky flavour. Ready when you are.',
  hero_subtitle text default 'Carefully smoked fish cutlets, packed hygienically and delivered to you.',
  hero_image_url text,
  announcement_text text,
  delivery_fee numeric(12,2) not null default 0,
  free_delivery_above numeric(12,2),
  whatsapp_number text default '234XXXXXXXXXX',
  instagram_handle text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.site_settings (id) values (1);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============ Row Level Security ============
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;

-- public can read the storefront data
create policy "public read categories" on public.categories for select using (true);
create policy "public read active products" on public.products for select using (is_active);
create policy "public read settings" on public.site_settings for select using (true);

-- admins can do everything
create policy "admin all categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
-- orders: NO public policies. Customers never touch this table directly;
-- your server route creates orders with the service-role key.

-- ============ image storage ============
insert into storage.buckets (id, name, public) values ('store-assets', 'store-assets', true)
on conflict (id) do nothing;

create policy "public read store-assets" on storage.objects
  for select using (bucket_id = 'store-assets');
create policy "admin write store-assets" on storage.objects
  for all using (bucket_id = 'store-assets' and public.is_admin())
  with check (bucket_id = 'store-assets' and public.is_admin());