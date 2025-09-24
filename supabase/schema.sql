-- Enable UUID extension if not already
create extension if not exists "uuid-ossp";

-- profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles are updatable by owner" on public.profiles for update using (auth.uid() = id);

-- user_preferences table
create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  skin_tone text,
  undertone text,
  location text,
  updated_at timestamp with time zone default now()
);

alter table public.user_preferences enable row level security;
create policy "Preferences readable by owner" on public.user_preferences for select using (auth.uid() = user_id);
create policy "Preferences writable by owner" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "Preferences updatable by owner" on public.user_preferences for update using (auth.uid() = user_id);

-- recommendations table
create table if not exists public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null,
  product_id text not null,
  title text,
  price numeric,
  currency text,
  url text,
  image_url text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_recs_user on public.recommendations(user_id);
alter table public.recommendations enable row level security;
create policy "Recommendations readable by owner" on public.recommendations for select using (auth.uid() = user_id);
create policy "Recommendations insertable by owner" on public.recommendations for insert with check (auth.uid() = user_id);


