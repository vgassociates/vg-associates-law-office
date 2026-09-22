-- Run this in Supabase SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number text unique not null,
  client_name text not null,
  case_title text not null,
  status text not null default 'active',
  assigned_to text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  phone text not null,
  email text,
  appointment_date timestamptz not null,
  purpose text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Private document metadata. Actual files should live in a PRIVATE Supabase Storage bucket.
create table if not exists public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.cases enable row level security;
alter table public.appointments enable row level security;
alter table public.case_files enable row level security;

-- Basic admin-only policy: authenticated users can read/write.
-- For multiple staff members, replace this with a staff_roles table and role-based policies.
create policy "authenticated cases access" on public.cases for all to authenticated using (true) with check (true);
create policy "authenticated appointments access" on public.appointments for all to authenticated using (true) with check (true);
create policy "authenticated files access" on public.case_files for all to authenticated using (true) with check (true);

-- Create a PRIVATE storage bucket named case-files from the Supabase dashboard.
