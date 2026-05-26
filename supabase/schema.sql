-- ¿ vice versa ? — database-schema (fase 2)
-- Voer dit in één keer uit in de Supabase SQL Editor.

-- ============== TABELLEN ==============

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  native_language text not null check (native_language in ('NL', 'FR')),
  translates_to text not null check (translates_to in ('NL', 'FR')),
  bio text default '',
  joined_at timestamptz not null default now(),
  email_notifications boolean not null default true
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  author text not null,
  year integer,
  source_language text not null check (source_language in ('NL', 'FR')),
  target_language text not null check (target_language in ('NL', 'FR')),
  translator_id uuid references public.profiles(id) on delete set null,
  cover_bg text,
  cover_accent text,
  cover_pattern text,
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  asker_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  passage text default '',
  page text default '',
  body text not null,
  tags text[] not null default '{}'::text[],
  target_audience text[] not null default '{NL,FR}'::text[],
  created_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notification_reads (
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table public.vademecum (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('subsidies', 'workshops', 'uitgeverijen')),
  name text not null,
  for_whom text default '',
  deadline text default '',
  link text default '',
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============== ROW-LEVEL SECURITY ==============

alter table public.profiles  enable row level security;
alter table public.books     enable row level security;
alter table public.questions enable row level security;
alter table public.answers   enable row level security;
alter table public.notification_reads enable row level security;
alter table public.vademecum enable row level security;

-- Leden mogen alles lezen
create policy "Members read profiles"  on public.profiles  for select using (auth.role() = 'authenticated');
create policy "Members read books"     on public.books     for select using (auth.role() = 'authenticated');
create policy "Members read questions" on public.questions for select using (auth.role() = 'authenticated');
create policy "Members read answers"   on public.answers   for select using (auth.role() = 'authenticated');
create policy "Members read vademecum" on public.vademecum for select using (auth.role() = 'authenticated');
create policy "Read own reads"   on public.notification_reads for select using (auth.uid() = user_id);
create policy "Insert own reads" on public.notification_reads for insert with check (auth.uid() = user_id);

-- Eigen profiel aanmaken/aanpassen
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Update own profile" on public.profiles for update using (auth.uid() = id);

-- Inhoud toevoegen
create policy "Insert own questions" on public.questions for insert with check (auth.uid() = asker_id);
create policy "Insert own answers"   on public.answers   for insert with check (auth.uid() = author_id);
create policy "Insert books"         on public.books     for insert with check (auth.role() = 'authenticated');
create policy "Insert vademecum"     on public.vademecum for insert with check (auth.role() = 'authenticated');
