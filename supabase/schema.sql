-- Run this in Supabase SQL Editor before deploying the migrated app.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  normalized_username text not null unique,
  role text not null check (role in ('ADMIN', 'SUPER_ADMIN')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'FROZEN')),
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  primary_phone text not null,
  secondary_phone text,
  course_interest text,
  consent boolean not null default false,
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','INTERESTED','ENROLLED','NOT_INTERESTED')),
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null default 'public'
);

create table if not exists public.lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  old_status text not null,
  new_status text not null,
  changed_by text not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_uid uuid,
  actor_role text not null,
  actor_username text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  timestamp timestamptz not null default now(),
  relevant_metadata jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_created_at_idx on public.leads (status, created_at desc);
create index if not exists audit_logs_timestamp_idx on public.audit_logs (timestamp desc);
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_status_history enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "admins can read their own profile" on public.profiles;
create policy "admins can read their own profile"
  on public.profiles for select to authenticated using (auth.uid() = uid);

-- No direct client policies for leads, audit logs, or history. Those are only
-- accessed by protected Next.js route handlers using the server secret key.
grant select on public.profiles to authenticated;
grant all on public.profiles, public.leads, public.lead_status_history, public.audit_logs to service_role;

create or replace function public.update_lead_status(
  p_lead_id uuid,
  p_new_status text,
  p_changed_by text,
  p_actor_uid uuid,
  p_actor_role text,
  p_actor_username text
)
returns table(old_status text, new_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_now timestamptz := now();
begin
  select status into v_old_status
    from public.leads
    where id = p_lead_id
    for update;

  if not found then
    raise exception 'LEAD_NOT_FOUND';
  end if;

  update public.leads
    set status = p_new_status, updated_at = v_now
    where id = p_lead_id;

  insert into public.lead_status_history
    (lead_id, old_status, new_status, changed_by, changed_at)
    values (p_lead_id, v_old_status, p_new_status, p_changed_by, v_now);

  insert into public.audit_logs
    (actor_uid, actor_role, actor_username, action, target_type, target_id, timestamp, relevant_metadata)
    values (p_actor_uid, p_actor_role, p_actor_username, 'UPDATE_LEAD_STATUS', 'LEAD', p_lead_id::text, v_now,
      jsonb_build_object('oldStatus', v_old_status, 'newStatus', p_new_status));

  return query select v_old_status, p_new_status;
end;
$$;

revoke all on function public.update_lead_status(uuid, text, text, uuid, text, text) from public, anon, authenticated;
grant execute on function public.update_lead_status(uuid, text, text, uuid, text, text) to service_role;
