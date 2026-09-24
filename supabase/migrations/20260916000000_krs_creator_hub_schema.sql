-- ==============================================================================
-- KRS CREATOR HUB - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('ADMIN', 'INFLUENCER', 'CAPTADOR', 'MANAGER', 'MODERADOR', 'FINANCEIRO');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  role user_role NOT NULL DEFAULT 'INFLUENCER',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Creator Extension Table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  niches TEXT[] DEFAULT '{}',
  social_accounts JSONB DEFAULT '[]'::jsonb,
  campaign_preferences TEXT[] DEFAULT '{}',
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_weeks INTEGER NOT NULL DEFAULT 0,
  completed_campaigns_count INTEGER NOT NULL DEFAULT 0,
  approved_submissions_count INTEGER NOT NULL DEFAULT 0,
  referred_by_code TEXT
);

-- Captador Extension Table
CREATE TABLE IF NOT EXISTS public.captador_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_weeks INTEGER NOT NULL DEFAULT 0,
  total_referred INTEGER NOT NULL DEFAULT 0,
  active_creators INTEGER NOT NULL DEFAULT 0,
  campaigns_completed_by_referred INTEGER NOT NULL DEFAULT 0
);

-- 2. GAMES
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  thumbnail_url TEXT,
  banner_url TEXT,
  preview_video_url TEXT,
  description TEXT NOT NULL,
  how_it_works TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Habilidade',
  tags TEXT[] DEFAULT '{}',
  primary_color TEXT NOT NULL DEFAULT '#00F59B',
  play_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CAMPAIGNS & MISSIONS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  banner_url TEXT,
  description TEXT NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  instructions TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  min_level INTEGER NOT NULL DEFAULT 1,
  max_creators INTEGER,
  active_creators_count INTEGER NOT NULL DEFAULT 0,
  sequential_progression BOOLEAN NOT NULL DEFAULT true,
  xp_total INTEGER NOT NULL DEFAULT 500,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 100,
  upload_type TEXT NOT NULL DEFAULT 'video',
  deadline_days INTEGER NOT NULL DEFAULT 3,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CREATOR PARTICIPATION & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.creator_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  current_step INTEGER NOT NULL DEFAULT 1,
  completed_missions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(creator_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  content_link TEXT,
  comments TEXT,
  status TEXT NOT NULL DEFAULT 'in_review',
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- 5. GAMIFICATION (XP, LEVELS, BADGES, SEASONS)
CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_key TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  xp_amount INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.levels (
  level INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT '#00F59B',
  icon_name TEXT NOT NULL DEFAULT 'Zap',
  badge_title TEXT NOT NULL,
  unlocked_perks TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  xp_value INTEGER NOT NULL DEFAULT 100,
  target_role TEXT NOT NULL DEFAULT 'ALL',
  criteria_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.creator_pass_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  banner_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.creator_pass_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.creator_pass_seasons(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  xp_required INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  is_elite_tier BOOLEAN NOT NULL DEFAULT false,
  reward_icon TEXT NOT NULL DEFAULT 'Gift'
);

-- 6. REFERRALS, NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  captador_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  campaigns_completed INTEGER NOT NULL DEFAULT 0,
  xp_generated_for_captador INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  target_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.creative_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  preview_url TEXT,
  file_size TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  call_to_action TEXT NOT NULL,
  tips TEXT[] DEFAULT '{}',
  duration_estimate TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  platform_name TEXT NOT NULL DEFAULT 'KRS CREATOR HUB',
  primary_color TEXT NOT NULL DEFAULT '#00F59B',
  support_whatsapp TEXT NOT NULL DEFAULT '+5511999999999',
  support_email TEXT NOT NULL DEFAULT 'contato@krscreatorhub.com',
  terms_url TEXT DEFAULT '/termos',
  privacy_url TEXT DEFAULT '/privacidade',
  rules_version TEXT DEFAULT '1.0.0',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  allow_new_registrations BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captador_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users read their own, admin reads all
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Games & Campaigns: viewable by authenticated users, modifiable by admin
CREATE POLICY "Public read games"
  ON public.games FOR SELECT
  USING (true);

CREATE POLICY "Admin write games"
  ON public.games FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read campaigns"
  ON public.campaigns FOR SELECT
  USING (true);

CREATE POLICY "Admin write campaigns"
  ON public.campaigns FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read missions"
  ON public.missions FOR SELECT
  USING (true);

-- Submissions: Creator can view/create own; Admin can view/update all
CREATE POLICY "Creators manage own submissions"
  ON public.submissions FOR ALL
  USING (auth.uid() = creator_id OR public.is_admin());

-- Notifications: users read their own
CREATE POLICY "Users manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- Referrals: captadores view their own referrals
CREATE POLICY "Captadores view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = captador_id OR public.is_admin());
