-- Серпу: поддержка множественных опекунов (родственников) и множественных врачей
-- Миграция: 20261107030000_serpu_guardians.sql

-- 1. Таблица связей «опекун/родственник ↔ пациент»
create table if not exists public.guardian_links (
  id bigint generated always as identity primary key,
  guardian_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  relationship text not null default 'Опекун' check (char_length(relationship) <= 50),
  guardian_phone text check (char_length(guardian_phone) <= 30),
  created_at timestamptz not null default now(),
  unique (guardian_id, patient_id),
  check (guardian_id <> patient_id)
);

create index if not exists guardian_links_patient_idx on public.guardian_links(patient_id);
create index if not exists guardian_links_guardian_idx on public.guardian_links(guardian_id);

-- 2. Включаем RLS
alter table public.guardian_links enable row level security;

-- Стороны связки видят свои записи
drop policy if exists "guardian_select_party" on public.guardian_links;
create policy "guardian_select_party" on public.guardian_links for select to authenticated
  using ((select auth.uid()) in (guardian_id, patient_id));

drop policy if exists "guardian_insert_party" on public.guardian_links;
create policy "guardian_insert_party" on public.guardian_links for insert to authenticated
  with check ((select auth.uid()) in (guardian_id, patient_id));

drop policy if exists "guardian_delete_party" on public.guardian_links;
create policy "guardian_delete_party" on public.guardian_links for delete to authenticated
  using ((select auth.uid()) in (guardian_id, patient_id));

-- 3. Функция проверки, является ли пользователь опекуном пациента
create or replace function public.is_guardian_of(p_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.guardian_links g
    where g.guardian_id = (select auth.uid()) and g.patient_id = p_patient
  );
$$;

revoke all on function public.is_guardian_of(uuid) from public, anon;
grant execute on function public.is_guardian_of(uuid) to authenticated;

-- 4. Лечащий врач пациента может видеть контакты опекунов для экстренной связи
drop policy if exists "doctor_view_guardians" on public.guardian_links;
create policy "doctor_view_guardians" on public.guardian_links for select to authenticated
  using (public.is_doctor_of(patient_id));

-- 5. Опекун имеет доступ на просмотр назначений и статуса приёма подопечного
-- (но НЕ может удалять или модифицировать медицинские рецепты врача)
drop policy if exists "rx_guardian_select" on public.prescriptions;
create policy "rx_guardian_select" on public.prescriptions for select to authenticated
  using ((select auth.uid()) = patient_id or public.is_doctor_of(patient_id) or public.is_guardian_of(patient_id));

drop policy if exists "doses_guardian_select" on public.dose_logs;
create policy "doses_guardian_select" on public.dose_logs for select to authenticated
  using ((select auth.uid()) = patient_id or public.is_doctor_of(patient_id) or public.is_guardian_of(patient_id));

-- 6. Realtime для guardian_links
alter publication supabase_realtime add table public.guardian_links;
