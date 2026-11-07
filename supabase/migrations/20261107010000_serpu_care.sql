-- Серпу: связь «врач ↔ пациент», назначения, отметки о приёме, чат.
-- Применено к проекту jjxtvixlwpwwcznnzkes 7 ноября 2026 (миграция serpu_care_doctor_patient).

alter table public.profiles
  add column if not exists role text not null default 'patient' check (role in ('patient','doctor')),
  add column if not exists full_name text check (char_length(full_name) <= 80),
  add column if not exists specialty text check (char_length(specialty) <= 80),
  add column if not exists clinic text check (char_length(clinic) <= 120),
  add column if not exists link_code text unique check (link_code ~ '^[0-9]{6}$');

create table public.care_links (
  id bigint generated always as identity primary key,
  doctor_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (doctor_id, patient_id),
  check (doctor_id <> patient_id)
);
create index care_links_patient_idx on public.care_links(patient_id);

create table public.prescriptions (
  id bigint generated always as identity primary key,
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid references auth.users(id) on delete set null,
  drug_name text not null check (char_length(drug_name) between 1 and 300),
  drug_reg text check (char_length(drug_reg) <= 80),
  mnn text check (char_length(mnn) <= 200),
  times text[] not null default '{}' check (cardinality(times) <= 8),
  note text check (char_length(note) <= 300),
  start_date date not null default current_date,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index prescriptions_patient_idx on public.prescriptions(patient_id);
create index prescriptions_doctor_idx on public.prescriptions(doctor_id);

create table public.dose_logs (
  id bigint generated always as identity primary key,
  patient_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  prescription_id bigint not null references public.prescriptions(id) on delete cascade,
  due_at timestamptz not null,
  status text not null check (status in ('taken','missed','skipped')),
  logged_at timestamptz not null default now(),
  unique (prescription_id, due_at)
);
create index dose_logs_patient_due_idx on public.dose_logs(patient_id, due_at desc);

create table public.messages (
  id bigint generated always as identity primary key,
  link_id bigint not null references public.care_links(id) on delete cascade,
  sender_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index messages_link_idx on public.messages(link_id, created_at);

create or replace function public.is_doctor_of(p_patient uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.care_links l where l.doctor_id = (select auth.uid()) and l.patient_id = p_patient);
$$;
create or replace function public.is_linked_with(p_other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.care_links l
    where (l.doctor_id = (select auth.uid()) and l.patient_id = p_other)
       or (l.patient_id = (select auth.uid()) and l.doctor_id = p_other));
$$;
create or replace function public.is_link_party(p_link bigint) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.care_links l where l.id = p_link
    and (select auth.uid()) in (l.doctor_id, l.patient_id));
$$;
revoke all on function public.is_doctor_of(uuid), public.is_linked_with(uuid), public.is_link_party(bigint) from public, anon;
grant execute on function public.is_doctor_of(uuid), public.is_linked_with(uuid), public.is_link_party(bigint) to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own_or_linked" on public.profiles for select to authenticated
  using ((select auth.uid()) = id or public.is_linked_with(id));

alter table public.care_links enable row level security;
create policy "links_select_party" on public.care_links for select to authenticated
  using ((select auth.uid()) in (doctor_id, patient_id));
create policy "links_delete_party" on public.care_links for delete to authenticated
  using ((select auth.uid()) in (doctor_id, patient_id));

alter table public.prescriptions enable row level security;
create policy "rx_select" on public.prescriptions for select to authenticated
  using ((select auth.uid()) = patient_id or public.is_doctor_of(patient_id));
create policy "rx_insert" on public.prescriptions for insert to authenticated
  with check (((select auth.uid()) = patient_id and doctor_id is null)
           or ((select auth.uid()) = doctor_id and public.is_doctor_of(patient_id)));
create policy "rx_update" on public.prescriptions for update to authenticated
  using ((select auth.uid()) = patient_id or ((select auth.uid()) = doctor_id and public.is_doctor_of(patient_id)))
  with check ((select auth.uid()) = patient_id or ((select auth.uid()) = doctor_id and public.is_doctor_of(patient_id)));
create policy "rx_delete" on public.prescriptions for delete to authenticated
  using (((select auth.uid()) = patient_id and doctor_id is null) or ((select auth.uid()) = doctor_id and public.is_doctor_of(patient_id)));

alter table public.dose_logs enable row level security;
create policy "doses_select" on public.dose_logs for select to authenticated
  using ((select auth.uid()) = patient_id or public.is_doctor_of(patient_id));
create policy "doses_insert_own" on public.dose_logs for insert to authenticated
  with check ((select auth.uid()) = patient_id);
create policy "doses_update_own" on public.dose_logs for update to authenticated
  using ((select auth.uid()) = patient_id) with check ((select auth.uid()) = patient_id);

alter table public.messages enable row level security;
create policy "msg_select_party" on public.messages for select to authenticated using (public.is_link_party(link_id));
create policy "msg_insert_party" on public.messages for insert to authenticated
  with check ((select auth.uid()) = sender_id and public.is_link_party(link_id));

create or replace function public.become_doctor(p_full_name text, p_specialty text, p_clinic text) returns text
language plpgsql security definer set search_path = '' as $$
declare v_code text; v_uid uuid := (select auth.uid());
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select link_code into v_code from public.profiles where id = v_uid;
  while v_code is null loop
    v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
    if exists (select 1 from public.profiles where link_code = v_code) then v_code := null; end if;
  end loop;
  update public.profiles set role = 'doctor', full_name = left(p_full_name, 80),
    specialty = left(p_specialty, 80), clinic = left(p_clinic, 120), link_code = v_code
  where id = v_uid;
  return v_code;
end $$;

create or replace function public.link_doctor(p_code text) returns json
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid()); d record; v_link bigint;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select id, full_name, specialty, clinic into d from public.profiles where link_code = p_code and role = 'doctor';
  if d.id is null then return json_build_object('ok', false, 'error', 'not_found'); end if;
  if d.id = v_uid then return json_build_object('ok', false, 'error', 'self'); end if;
  insert into public.care_links(doctor_id, patient_id) values (d.id, v_uid)
    on conflict (doctor_id, patient_id) do update set created_at = public.care_links.created_at
    returning id into v_link;
  return json_build_object('ok', true, 'link_id', v_link, 'doctor_id', d.id,
    'full_name', d.full_name, 'specialty', d.specialty, 'clinic', d.clinic);
end $$;

revoke all on function public.become_doctor(text, text, text), public.link_doctor(text) from public, anon;
grant execute on function public.become_doctor(text, text, text), public.link_doctor(text) to authenticated;

alter publication supabase_realtime add table public.messages, public.dose_logs, public.prescriptions;
