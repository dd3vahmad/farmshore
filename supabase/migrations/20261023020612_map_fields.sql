-- Farm headquarters / map settings (edited from Admin > Settings)
alter table public.site_settings add column if not exists hq_title text;
alter table public.site_settings add column if not exists hq_address text;
alter table public.site_settings add column if not exists hq_lat double precision;
alter table public.site_settings add column if not exists hq_lng double precision;
alter table public.site_settings add column if not exists hq_hours text;