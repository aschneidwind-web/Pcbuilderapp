create table public.saved_builds (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 80),
  components    jsonb not null default '{}'::jsonb,
  total_price   integer not null check (total_price >= 0),
  created_at    timestamptz not null default now()
);

create index saved_builds_user_id_created_at_idx
  on public.saved_builds (user_id, created_at desc);

alter table public.saved_builds enable row level security;

create policy "saved_builds_select_own"
  on public.saved_builds for select
  using (auth.uid() = user_id);

create policy "saved_builds_insert_own"
  on public.saved_builds for insert
  with check (auth.uid() = user_id);

create policy "saved_builds_delete_own"
  on public.saved_builds for delete
  using (auth.uid() = user_id);
