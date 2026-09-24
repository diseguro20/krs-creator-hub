export type UserRole = "ADMIN" | "INFLUENCER" | "CAPTADOR" | "MANAGER" | "MODERADOR" | "FINANCEIRO";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  phone?: string;
  city?: string;
  state?: string;
  role: UserRole;
  onboarding_completed: boolean;
  wallet_balance?: number;
  is_affiliate?: boolean;
  affiliate_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  platform: "instagram" | "tiktok" | "youtube" | "facebook" | "telegram" | "other";
  username: string;
  url: string;
  followers: number;
  avg_views: number;
  engagement_rate: number;
}

export interface CreatorProfile extends UserProfile {
  role: "INFLUENCER";
  niches: string[];
  social_accounts: SocialAccount[];
  campaign_preferences: string[];
  current_xp: number;
  current_level: number;
  streak_weeks: number;
  completed_campaigns_count: number;
  approved_submissions_count: number;
  referred_by_code?: string;
}

export interface CaptadorProfile extends UserProfile {
  role: "CAPTADOR";
  referral_code: string;
  current_xp: number;
  current_level: number;
  streak_weeks: number;
  total_referred: number;
  active_creators: number;
  campaigns_completed_by_referred: number;
}

export interface GameAffiliateStats {
  game_id: string;
  game_name: string;
  game_slug: string;
  category: string;
  primary_color: string;
  logo_url: string;
  thumbnail_url: string;
  referral_param: string; // e.g. 'ref' or 'r'
  referral_url: string;
  clicks: number;
  signups: number;
  deposits_count: number;
  total_deposited: number;
  commission_earned: number;
  available_balance: number;
  commission_rate: string;
}

export interface AffiliateConversionRecord {
  id: string;
  game_id: string;
  game_name: string;
  game_slug: string;
  lead_name: string;
  lead_username: string;
  type: "deposit" | "signup" | "tournament" | "slot_revenue";
  amount_deposited?: number;
  commission_amount: number;
  status: "paid" | "available" | "pending";
  created_at: string;
}

export type GameCategory = "Habilidade" | "Arcade" | "Puzzle" | "Reflexo" | "Casual" | "Cassino";
export type GameStatus = "active" | "maintenance" | "coming_soon";

export interface Game {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  thumbnail_url: string;
  banner_url: string;
  preview_video_url?: string;
  description: string;
  how_it_works: string;
  category: GameCategory;
  tags: string[];
  primary_color: string;
  play_url: string;
  status: GameStatus;
  campaigns_count: number;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 
  | "available" 
  | "joined" 
  | "active" 
  | "in_progress" 
  | "waiting_material" 
  | "in_review" 
  | "correction_required" 
  | "approved" 
  | "completed" 
  | "cancelled" 
  | "expired";

export type UploadType = "video" | "image" | "audio" | "link" | "document" | "mixed";

export interface Mission {
  id: string;
  campaign_id: string;
  step_order: number;
  title: string;
  description: string;
  requirements: string[];
  xp_reward: number;
  upload_type: UploadType;
  deadline_days: number;
  is_optional?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  game_id: string;
  game_name: string;
  game_slug: string;
  game_color: string;
  game_thumbnail: string;
  banner_url: string;
  description: string;
  benefits: string[];
  instructions: string;
  status: "active" | "draft" | "finished";
  min_level: number;
  max_creators?: number;
  active_creators_count: number;
  sequential_progression: boolean;
  xp_total: number;
  start_date: string;
  end_date: string;
  missions: Mission[];
  created_at: string;
}

export interface CreatorCampaignProgress {
  id: string;
  creator_id: string;
  campaign_id: string;
  status: CampaignStatus;
  current_step: number;
  total_steps: number;
  completed_missions: string[];
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = 
  | "draft" 
  | "submitted" 
  | "in_review" 
  | "approved" 
  | "changes_requested" 
  | "rejected";

export interface Submission {
  id: string;
  campaign_id: string;
  campaign_title: string;
  mission_id: string;
  mission_title: string;
  creator_id: string;
  creator_name: string;
  creator_username: string;
  creator_avatar?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  content_link?: string;
  comments?: string;
  status: SubmissionStatus;
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface LevelConfig {
  level: number;
  name: string;
  min_xp: number;
  color: string;
  icon_name: string;
  badge_title: string;
  unlocked_perks: string[];
}

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  rarity: BadgeRarity;
  xp_value: number;
  target_role: "ALL" | "INFLUENCER" | "CAPTADOR";
  criteria_description: string;
}

export interface UserBadge {
  badge_id: string;
  unlocked_at: string;
}

export interface CreatorPassReward {
  level: number;
  xp_required: number;
  title: string;
  description: string;
  type: "badge" | "priority_review" | "exclusive_material" | "multiplier" | "special_campaign";
  is_elite_tier: boolean;
  reward_icon: string;
}

export interface CreatorPassSeason {
  id: string;
  number: number;
  name: string;
  theme: string;
  banner_url: string;
  start_date: string;
  end_date: string;
  days_left: number;
  rewards: CreatorPassReward[];
}

export interface ReferralRecord {
  id: string;
  captador_id: string;
  referred_user_id: string;
  referred_name: string;
  referred_username: string;
  referred_avatar?: string;
  status: "registered" | "onboarding_done" | "active" | "completed_campaign";
  joined_at: string;
  campaigns_completed: number;
  xp_generated_for_captador: number;
}

export type NotificationType = 
  | "new_campaign" 
  | "mission_approved" 
  | "changes_requested" 
  | "level_up" 
  | "badge_unlocked" 
  | "creator_pass_milestone" 
  | "admin_announcement" 
  | "new_referral";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  details: string;
  target_id?: string;
  created_at: string;
}

export interface CreativeAsset {
  id: string;
  title: string;
  game_id?: string;
  game_name?: string;
  type: "logo" | "banner" | "story_template" | "reel_template" | "video_cut" | "audio_hook" | "guide_pdf";
  file_url: string;
  preview_url: string;
  file_size: string;
  tags: string[];
  created_at: string;
}

export interface ScriptTemplate {
  id: string;
  title: string;
  game_id?: string;
  game_name?: string;
  category: "story" | "reel_tiktok" | "short_hook" | "deep_review" | "caption_legend";
  content: string;
  call_to_action: string;
  tips: string[];
  duration_estimate: string;
  created_at?: string;
}

export interface PlatformSettings {
  platform_name: string;
  primary_color: string;
  support_whatsapp: string;
  support_email: string;
  terms_url: string;
  privacy_url: string;
  rules_version: string;
  maintenance_mode: boolean;
  allow_new_registrations: boolean;
}

export interface XPEventConfig {
  id: string;
  event_key: string;
  description: string;
  xp_amount: number;
  is_active: boolean;
}
