-- ─── PinDesi Database Schema ────────────────────────────────────────────────
-- Run this in: supabase.com → your project → SQL Editor → New Query

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  plan text not null default 'chai' check (plan in ('chai','biryani','thali')),
  pins_used_this_month int not null default 0,
  pinterest_access_token text,
  pinterest_refresh_token text,
  pinterest_username text,
  referral_code text unique not null,
  referred_by text,                     -- referral code of referrer
  referral_count int not null default 0,
  free_months_earned int not null default 0,
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, referral_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    upper(substring(replace(new.id::text, '-', ''), 1, 4) || substr(md5(random()::text), 1, 4))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reset monthly pin count on 1st of every month (run via Supabase cron)
-- select cron.schedule('reset-monthly-pins', '0 0 1 * *', 'update profiles set pins_used_this_month = 0');

-- Pins
create table public.pins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  hashtags text[] default '{}',
  board_id text not null,
  board_name text not null,
  image_url text,
  link_url text,
  status text not null default 'draft' check (status in ('draft','scheduled','posted','failed')),
  scheduled_at timestamptz,
  posted_at timestamptz,
  pinterest_pin_id text,
  niche text not null default 'General',
  created_at timestamptz default now()
);

-- Referral rewards
create table public.referral_rewards (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  referred_email text not null,
  status text not null default 'pending' check (status in ('pending','activated','rewarded')),
  reward_months int not null default 1,
  created_at timestamptz default now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.pins enable row level security;
alter table public.referral_rewards enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Pins: users can only see/manage their own
create policy "Users can manage own pins" on public.pins for all using (auth.uid() = user_id);

-- Referrals: referrers can see rewards they gave, referred users can see rewards they received
create policy "Users can view own referrals" on public.referral_rewards
  for select using (auth.uid() = referrer_id or auth.uid() = referred_id);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index pins_user_status on public.pins(user_id, status);
create index pins_scheduled on public.pins(scheduled_at) where status = 'scheduled';
create index referrals_referrer on public.referral_rewards(referrer_id);
create index profiles_referral_code on public.profiles(referral_code);


-- ─── pg_cron scheduler (run AFTER deploying the Edge Function) ───────────────
-- Replace YOUR_PROJECT_REF with your Supabase project ref (found in project URL)
-- Run this in SQL Editor once after: supabase functions deploy post-scheduled

/*
  -- Enable pg_net extension (needed to call HTTP from SQL)
  create extension if not exists pg_net;

  -- Enable pg_cron extension
  create extension if not exists pg_cron;

  -- Schedule the post-scheduled edge function every 15 minutes
  select cron.schedule(
    'post-scheduled-pins',
    '*/15 * * * *',
    $$
      select net.http_post(
        url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-scheduled',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
        ),
        body := '{}'::jsonb
      );
    $$
  );

  -- Reset monthly pin counters on 1st of every month at midnight IST (18:30 UTC)
  select cron.schedule(
    'reset-monthly-pins',
    '30 18 1 * *',
    'update public.profiles set pins_used_this_month = 0'
  );

  -- To check scheduled jobs:
  select * from cron.job;

  -- To remove a job:
  select cron.unschedule('post-scheduled-pins');
*/
