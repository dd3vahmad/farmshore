insert into public.categories (name, slug, sort_order) values
  ('Smoked Cutlets', 'smoked-cutlets', 1),
  ('Family Packs', 'family-packs', 2),
  ('Bulk / Wholesale', 'bulk-wholesale', 3);

insert into public.products (name, slug, description, category_id, price, compare_at_price, pack_size, stock, is_featured)
select 'Smoked Fish Cutlets', 'smoked-fish-cutlets-500g', 'Rich, smoky fish cutlets.', id, 6500, 7500, '500g', 50, true
from public.categories where slug = 'smoked-cutlets';

insert into public.products (name, slug, description, category_id, price, pack_size, stock, is_featured)
select 'Smoked Fish Cutlets (Family Pack)', 'smoked-fish-cutlets-1kg', 'Great value for the whole family.', id, 12000, '1kg', 30, true
from public.categories where slug = 'family-packs';