-- vault/migrations/001_initial_schema.sql
-- Run this in Supabase Dashboard > SQL Editor

-- ── Profiles (1:1 with auth.users) ───────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  email       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Experiences ───────────────────────────────────────────────────
create table public.experiences (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  role        text not null,
  company     text not null,
  start_date  text not null,  -- MM/YYYY — enforced by app, not DB
  end_date    text not null,  -- MM/YYYY or 'Present'
  bullets     text[] default '{}',
  tech_stack  text[] default '{}',
  metrics     text[] default '{}',
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Projects ──────────────────────────────────────────────────────
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  description text default '',
  tech_stack  text[] default '{}',
  metrics     text[] default '{}',
  url         text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ── Skills ────────────────────────────────────────────────────────
create table public.skills (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  category    text default 'general',
  created_at  timestamptz default now(),
  unique (profile_id, name)
);

-- ── Row Level Security (users can only touch their own rows) ──────
alter table public.profiles   enable row level security;
alter table public.experiences enable row level security;
alter table public.projects   enable row level security;
alter table public.skills     enable row level security;

create policy "profiles_own"    on public.profiles    for all using (auth.uid() = id);
create policy "experiences_own" on public.experiences for all using (profile_id = auth.uid());
create policy "projects_own"    on public.projects    for all using (profile_id = auth.uid());
create policy "skills_own"      on public.skills      for all using (profile_id = auth.uid());

-- ── Auto-create profile row on first sign-up ─────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
