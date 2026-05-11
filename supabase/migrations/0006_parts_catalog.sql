-- Scraped parts catalog. Public read-only — no RLS.
-- Upserted by scripts/import-to-supabase.ts on each refresh.

create table if not exists public.parts (
  id           uuid        primary key default gen_random_uuid(),
  slot         text        not null,
  n            text        not null,
  s            text        not null,
  p            numeric,
  sk           text,
  pm           integer,
  mhz          integer,
  gb           integer,
  tb           numeric,
  read         integer,
  watts        integer,
  feat         text,
  vrs          integer,
  tdp          integer,
  cooler_type  text,
  sockets      text[],
  scraped_at   timestamptz not null default now(),
  constraint parts_slot_n_key unique (slot, n)
);

create index if not exists parts_slot_idx on public.parts (slot);
