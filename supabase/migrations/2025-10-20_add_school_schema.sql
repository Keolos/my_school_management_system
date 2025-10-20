-- supabase/migrations/2025-10-20_add_school_schema.sql

-- Roles lookup
create table if not exists roles (
  id serial primary key,
  name text not null unique -- e.g. admin, registrar, teacher, student, new_user, old_user
);

insert into roles (name) values
('admin'), ('registrar'), ('teacher'), ('student'), ('new_user'), ('old_user')
on conflict (name) do nothing;

-- Users (profiles) - link to auth.users via uuid
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  role_id integer references roles(id) not null default (select id from roles where name='new_user'),
  school_id uuid, -- if multi-school later
  created_at timestamptz default now()
);

-- Terms / Academic Year and term number
create table if not exists terms (
  id serial primary key,
  academic_year text not null, -- e.g. "2025/2026"
  term integer not null, -- 1,2,3
  start_date date,
  end_date date,
  is_active boolean default false
);

-- Class levels (GES standard)
create table if not exists classes (
  id serial primary key,
  name text not null, -- e.g. "KG", "Primary 1", "Primary 2", "JHS 1", "SHS 3"
  level_code text, -- e.g. "P1", "JHS2"
  description text
);

-- Subjects master list
create table if not exists subjects (
  id serial primary key,
  code text unique,
  name text not null,
  level_target text -- e.g. "Primary,JHS,SHS" or jsonb with levels
);

-- Which subjects are offered to a class in a term
create table if not exists class_subjects (
  id serial primary key,
  class_id integer references classes(id) on delete cascade,
  subject_id integer references subjects(id) on delete cascade,
  term_id integer references terms(id),
  assigned_by uuid references auth.users,
  created_at timestamptz default now(),
  unique (class_id, subject_id, term_id)
);

-- Student registration for subjects per term
create table if not exists registrations (
  id serial primary key,
  student_id uuid references profiles(id) on delete cascade,
  class_id integer references classes(id),
  term_id integer references terms(id),
  subject_id integer references subjects(id),
  registered_at timestamptz default now(),
  status text default 'active'
);

-- Teacher assignments (which teacher teaches which subject/class/term)
create table if not exists teacher_assignments (
  id serial primary key,
  teacher_id uuid references profiles(id),
  class_id integer references classes(id),
  subject_id integer references subjects(id),
  term_id integer references terms(id),
  assigned_at timestamptz default now()
);



alter table profiles enable row level security;

create policy "profiles_self_select" on profiles for select using (
  auth.uid() = id
);

create policy "profiles_admin_update" on profiles for update using (
  exists (select 1 from roles r join profiles p2 on p2.role_id = r.id where p2.id = auth.uid() and r.name = 'admin')
);



alter table class_subjects enable row level security;

create policy "class_subjects_insert_by_registrar_admin" on class_subjects for insert using (
  exists (
    select 1 from profiles p join roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name in ('admin','registrar')
  )
);
