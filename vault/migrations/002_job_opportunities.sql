-- vault/migrations/002_job_opportunities.sql
-- Run this in Supabase Dashboard > SQL Editor

create table public.job_opportunities (
  id                       uuid primary key default gen_random_uuid(),
  profile_id               uuid not null references public.profiles on delete cascade,
  url                      text not null,
  title                    text not null,
  company                  text default '',
  signals                  text[] default '{}',
  required_years_experience integer default 0,
  prioritized_acronyms     text[] default '{}',
  raw_text                 text default '',
  status                   text default 'new',  -- new | translated | applied | rejected
  extracted_at             timestamptz,
  created_at               timestamptz default now()
);

alter table public.job_opportunities enable row level security;

create policy "job_opportunities_own"
  on public.job_opportunities for all
  using (profile_id = auth.uid());
