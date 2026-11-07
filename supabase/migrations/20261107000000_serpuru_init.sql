-- Serpuru: профили, «Моя аптечка», лимиты и кэш ИИ.
-- Уже применено к проекту jjxtvixlwpwwcznnzkes (7 ноября 2026). Файл лежит здесь для истории и для supabase db push в новом проекте.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1)), 60))
  on conflict (id) do nothing;
  return new;
end $$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.user_meds (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reg text not null check (char_length(reg) <= 80),
  name text not null check (char_length(name) <= 300),
  mnn text check (char_length(mnn) <= 200),
  expires_on date,
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, reg)
);
create index user_meds_user_idx on public.user_meds(user_id);
alter table public.user_meds enable row level security;
create policy "meds_select_own" on public.user_meds for select to authenticated using ((select auth.uid()) = user_id);
create policy "meds_insert_own" on public.user_meds for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "meds_update_own" on public.user_meds for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "meds_delete_own" on public.user_meds for delete to authenticated using ((select auth.uid()) = user_id);

-- служебные таблицы: доступ только у серверной функции (secret key), поэтому политик нет
create table public.ai_usage (
  day date not null, subject text not null, kind text not null, n int not null default 0,
  primary key (day, subject, kind)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;

create table public.ai_cache (
  key text primary key, kind text not null, response jsonb not null, created_at timestamptz not null default now()
);
alter table public.ai_cache enable row level security;
revoke all on public.ai_cache from anon, authenticated;

create or replace function public.ai_take(p_subject text, p_kind text, p_limit int) returns boolean
language plpgsql security definer set search_path = '' as $$
declare v int;
begin
  insert into public.ai_usage(day, subject, kind, n) values (current_date, p_subject, p_kind, 1)
  on conflict (day, subject, kind) do update set n = public.ai_usage.n + 1
  returning n into v;
  return v <= p_limit;
end $$;
revoke all on function public.ai_take(text, text, int) from public, anon, authenticated;
grant execute on function public.ai_take(text, text, int) to service_role;
