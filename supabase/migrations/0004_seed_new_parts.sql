insert into public.prices (part_name, slot, price_cents, source) values
  ('Ryzen 9 9950X3D',    'cpu', 69900, 'catalog_seed'),
  ('Ryzen 7 9800X3D',    'cpu', 47900, 'catalog_seed'),
  ('Core Ultra 9 285K',  'cpu', 58900, 'catalog_seed'),
  ('Core Ultra 7 265K',  'cpu', 39400, 'catalog_seed'),
  ('Core Ultra 5 245K',  'cpu', 30900, 'catalog_seed'),
  ('RTX 5070',           'gpu', 54900, 'catalog_seed'),
  ('RTX 5070 Ti',        'gpu', 74900, 'catalog_seed'),
  ('RTX 5080',           'gpu', 99900, 'catalog_seed'),
  ('RTX 5090',           'gpu', 199900, 'catalog_seed'),
  ('RX 9070 XT',         'gpu', 54900, 'catalog_seed'),
  ('MSI MEG Z890 ACE',   'motherboard', 44900, 'catalog_seed'),
  ('ASUS PRIME Z890-P',  'motherboard', 22900, 'catalog_seed'),
  ('Corsair RM1200x',    'psu', 22900, 'catalog_seed')
on conflict (part_name) do update set
  price_cents = excluded.price_cents,
  source      = excluded.source,
  fetched_at  = now();
