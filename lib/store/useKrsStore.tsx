"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UserProfile,
  CreatorProfile,
  CaptadorProfile,
  Game,
  Campaign,
  Mission,
  Submission,
  LevelConfig,
  Badge,
  CreatorPassSeason,
  XPEventConfig,
  CreativeAsset,
  ScriptTemplate,
  PlatformSettings,
  AppNotification,
  ActivityLog,
  ReferralRecord,
  GameAffiliateStats,
  AffiliateConversionRecord,
} from "@/types";
import {
  DEMO_ADMIN,
  DEMO_CAPTADOR,
  DEMO_CREATOR,
  INITIAL_SETTINGS,
  SEED_BADGES,
  SEED_CAMPAIGNS,
  SEED_CREATIVE_ASSETS,
  SEED_CREATOR_PASS,
  SEED_GAMES,
  SEED_LEVELS,
  SEED_SCRIPTS,
  SEED_SUBMISSIONS,
  SEED_XP_EVENTS,
  SEED_AFFILIATE_STATS,
  SEED_AFFILIATE_CONVERSIONS,
} from "@/lib/seed-data";

interface KrsStoreContextType {
  // Current user & Auth
  currentUser: UserProfile | CreatorProfile | CaptadorProfile | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  loginUser: (email: string, role?: "INFLUENCER" | "CAPTADOR" | "ADMIN") => boolean;
  registerUser: (userData: {
    name: string;
    email: string;
    password?: string;
    role: "INFLUENCER" | "CAPTADOR";
    affiliate_code?: string;
  }) => void;
  logout: () => void;
  switchUserRole: (role: "ADMIN" | "INFLUENCER" | "CAPTADOR") => void;
  updateCurrentUser: (data: Partial<UserProfile | CreatorProfile | CaptadorProfile>) => void;
  
  // Games
  games: Game[];
  addGame: (game: Omit<Game, "id" | "created_at" | "updated_at">) => void;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  
  // Campaigns & Missions
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, "id" | "created_at">) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Creator Campaigns & Progress
  creatorCampaigns: Record<string, { currentStep: number; completedMissions: string[]; status: string }>;
  startCampaign: (campaignId: string) => void;
  
  // Submissions & Review Workflow
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, "id" | "submitted_at" | "status">) => void;
  approveSubmission: (submissionId: string) => void;
  requestChangesSubmission: (submissionId: string, feedback: string) => void;
  rejectSubmission: (submissionId: string, reason: string) => void;

  // Gamification: XP, Levels, Badges, Creator Pass
  levels: LevelConfig[];
  addLevel: (level: LevelConfig) => void;
  updateLevel: (levelNum: number, data: Partial<LevelConfig>) => void;
  deleteLevel: (levelNum: number) => void;
  
  badges: Badge[];
  userBadges: string[]; // Badge IDs
  addBadge: (badge: Badge) => void;
  
  xpEvents: XPEventConfig[];
  updateXPEvent: (id: string, xp: number, isActive: boolean) => void;
  awardXP: (amount: number, reason: string) => void;

  creatorPass: CreatorPassSeason;
  updateCreatorPassDuration: (daysLeft: number) => void;

  // Referrals
  referrals: ReferralRecord[];
  addReferral: (code: string, newUserName: string, newUserEmail: string) => void;

  // Assets & Scripts
  creativeAssets: CreativeAsset[];
  scripts: ScriptTemplate[];
  addCreativeAsset: (asset: Omit<CreativeAsset, "id" | "created_at">) => void;
  addScript: (script: Omit<ScriptTemplate, "id" | "created_at">) => void;

  // Notifications & Activity Logs
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activityLogs: ActivityLog[];
  logAction: (action: string, details: string, targetId?: string) => void;

  // Platform Settings
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;

  // Interactive Level Up Modal State
  levelUpNotification: { show: boolean; level: number; levelName: string; perks: string[] } | null;
  dismissLevelUp: () => void;

  // Wallet & Saldo (conforme design de referência)
  walletBalance: number;
  depositWallet: (amount: number) => void;
  withdrawWallet: (amount: number, pixKey: string) => void;
  walletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;

  // Unified Multi-Game Affiliate Hub
  affiliateStats: GameAffiliateStats[];
  affiliateConversions: AffiliateConversionRecord[];
  totalAffiliateBalance: number;
  withdrawAffiliate: (amount: number, pixKey: string, pixType: string, gameId?: string) => Promise<{ success: boolean; message: string; txId: string }>;
  updateAffiliateCode: (code: string) => void;
  recordClick: (gameSlug: string, affiliateCode?: string) => Promise<void>;
  isAffiliateUser: boolean;

  // In-App Game Player
  playingGame: Game | null;
  openGamePlayer: (game: Game) => void;
  closeGamePlayer: () => void;

  // Reset to seed data
  resetAllData: () => void;
}

const KrsStoreContext = createContext<KrsStoreContextType | null>(null);

const STORAGE_KEY = "krs_creator_hub_v6_clean";

export function KrsStoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize state (null by default so new visitors are not automatically logged in)
  const [currentUser, setCurrentUser] = useState<UserProfile | CreatorProfile | CaptadorProfile | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [games, setGames] = useState<Game[]>(SEED_GAMES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [affiliateStats, setAffiliateStats] = useState<GameAffiliateStats[]>(SEED_AFFILIATE_STATS);
  const [affiliateConversions, setAffiliateConversions] = useState<AffiliateConversionRecord[]>(SEED_AFFILIATE_CONVERSIONS);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [creatorCampaigns, setCreatorCampaigns] = useState<Record<string, { currentStep: number; completedMissions: string[]; status: string }>>({});
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [levels, setLevels] = useState<LevelConfig[]>(SEED_LEVELS);
  const [badges, setBadges] = useState<Badge[]>(SEED_BADGES);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [xpEvents, setXpEvents] = useState<XPEventConfig[]>(SEED_XP_EVENTS);
  const [creatorPass, setCreatorPass] = useState<CreatorPassSeason>(SEED_CREATOR_PASS);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>(SEED_CREATIVE_ASSETS);
  const [scripts, setScripts] = useState<ScriptTemplate[]>(SEED_SCRIPTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [levelUpNotification, setLevelUpNotification] = useState<{
    show: boolean;
    level: number;
    levelName: string;
    perks: string[];
  } | null>(null);

  // Load from LocalStorage if available (Client-side only)
  useEffect(() => {
    try {
      // 1. Force purge any legacy demo storage keys
      if (typeof window !== "undefined") {
        const legacyKeys = [
          "krs_creator_hub_v4_prod",
          "krs_creator_hub_v5_auth",
          "krs_creator_hub_v3",
          "krs_creator_hub_v2",
          "krs_creator_hub_data",
          "krs_creator_hub_state",
          "krs_user_profile",
        ];
        legacyKeys.forEach((key) => {
          try {
            localStorage.removeItem(key);
          } catch (_) {}
        });
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Strict verification: Reject ANY demo user preset
        const user = parsed.currentUser;
        const isDemoPreset =
          !user ||
          !user.email ||
          user.id === "usr_creator_01" ||
          user.email === "lucas@creatorhub.gg" ||
          user.name === "Lucas Alencar" ||
          user.username === "lucas_alencar" ||
          (user.email && user.email.includes("@creatorhub.gg"));

        if (!isDemoPreset) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          delete parsed.currentUser;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (_) {}
        }

        if (parsed.games) setGames(parsed.games);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.creatorCampaigns) setCreatorCampaigns(parsed.creatorCampaigns);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.levels) setLevels(parsed.levels);
        if (parsed.badges) setBadges(parsed.badges);
        if (parsed.userBadges) setUserBadges(parsed.userBadges);
        if (parsed.xpEvents) setXpEvents(parsed.xpEvents);
        if (parsed.referrals) setReferrals(parsed.referrals);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.affiliateStats) setAffiliateStats(parsed.affiliateStats);
        if (parsed.affiliateConversions) setAffiliateConversions(parsed.affiliateConversions);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn("Could not load stored data:", e);
      setCurrentUser(null);
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  // Save to LocalStorage on changes
  const persist = (data: Partial<Record<string, unknown>>) => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const prev = current ? JSON.parse(current) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...data }));
    } catch (e) {
      console.warn("Could not persist data:", e);
    }
  };

  const logAction = (action: string, details: string, targetId?: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      action,
      details,
      target_id: targetId,
      created_at: new Date().toISOString(),
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      persist({ activityLogs: updated });
      return updated;
    });
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    password?: string;
    role: "INFLUENCER" | "CAPTADOR";
    affiliate_code?: string;
  }) => {
    const rawTag = userData.affiliate_code || userData.name;
    const cleanCode = rawTag.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || `creator_${Date.now().toString().slice(-4)}`;

    const newUser: CreatorProfile | CaptadorProfile = userData.role === "CAPTADOR" ? {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      username: cleanCode,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      phone: "",
      city: "São Paulo",
      state: "SP",
      role: "CAPTADOR",
      onboarding_completed: true,
      referral_code: cleanCode,
      current_xp: 100,
      current_level: 1,
      streak_weeks: 1,
      total_referred: 0,
      active_creators: 0,
      campaigns_completed_by_referred: 0,
      wallet_balance: 0.00,
      is_affiliate: true,
      affiliate_code: cleanCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } : {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      username: cleanCode,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      phone: "",
      city: "São Paulo",
      state: "SP",
      role: "INFLUENCER",
      onboarding_completed: true,
      niches: ["Gaming", "Jogos por Habilidade"],
      social_accounts: [],
      campaign_preferences: ["Jogos de Habilidade", "Puzzle", "Cassino"],
      current_xp: 100,
      current_level: 1,
      streak_weeks: 1,
      completed_campaigns_count: 0,
      approved_submissions_count: 0,
      wallet_balance: 0.00,
      is_affiliate: true,
      affiliate_code: cleanCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentUser(newUser);

    const updatedStats = affiliateStats.map((stat) => {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://krs-creator-hub.vercel.app";
      const url = `${origin}/r/${stat.game_slug}?ref=${cleanCode}`;
      return {
        ...stat,
        referral_url: url,
        available_balance: 0,
        total_earned: 0,
        clicks: 0,
        signups: 0,
        deposits_count: 0,
      };
    });

    setAffiliateStats(updatedStats);
    setAffiliateConversions([]);
    persist({ currentUser: newUser, affiliateStats: updatedStats, affiliateConversions: [] });
  };

  const loginUser = (email: string, role: "INFLUENCER" | "CAPTADOR" | "ADMIN" = "INFLUENCER") => {
    let userToSet: UserProfile | CreatorProfile | CaptadorProfile;
    if (role === "ADMIN" || email.toLowerCase().includes("admin")) {
      userToSet = DEMO_ADMIN;
    } else if (role === "CAPTADOR" || email.toLowerCase().includes("captador")) {
      userToSet = { ...DEMO_CAPTADOR, email };
    } else {
      userToSet = {
        ...DEMO_CREATOR,
        email,
        name: email.split("@")[0],
        username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, ""),
        affiliate_code: email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      };
    }
    setCurrentUser(userToSet);
    persist({ currentUser: userToSet });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        const prev = JSON.parse(current);
        delete prev.currentUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
      }
    } catch (e) {
      console.warn("Error on logout:", e);
    }
  };

  const switchUserRole = (role: "ADMIN" | "INFLUENCER" | "CAPTADOR") => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated as any);
    persist({ currentUser: updated });
  };

  const updateCurrentUser = (data: Partial<UserProfile | CreatorProfile | CaptadorProfile>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data } as any;
      persist({ currentUser: updated });
      return updated;
    });
  };

  const addGame = (gameData: Omit<Game, "id" | "created_at" | "updated_at">) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
      campaigns_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGames((prev) => {
      const updated = [newGame, ...prev];
      persist({ games: updated });
      return updated;
    });
    logAction("game_created", `Novo jogo adicionado: ${gameData.name}`);
  };

  const updateGame = (id: string, gameData: Partial<Game>) => {
    setGames((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...gameData, updated_at: new Date().toISOString() } : g));
      persist({ games: updated });
      return updated;
    });
    logAction("game_updated", `Jogo atualizado ID: ${id}`);
  };

  const deleteGame = (id: string) => {
    setGames((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      persist({ games: updated });
      return updated;
    });
    logAction("game_deleted", `Jogo excluído ID: ${id}`);
  };

  const addCampaign = (campaignData: Omit<Campaign, "id" | "created_at">) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCampaigns((prev) => {
      const updated = [newCampaign, ...prev];
      persist({ campaigns: updated });
      return updated;
    });
    logAction("campaign_created", `Nova campanha criada: ${campaignData.title}`);
  };

  const updateCampaign = (id: string, campaignData: Partial<Campaign>) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...campaignData } : c));
      persist({ campaigns: updated });
      return updated;
    });
    logAction("campaign_updated", `Campanha atualizada: ${id}`);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      persist({ campaigns: updated });
      return updated;
    });
    logAction("campaign_deleted", `Campanha excluída: ${id}`);
  };

  const startCampaign = (campaignId: string) => {
    setCreatorCampaigns((prev) => {
      const updated = {
        ...prev,
        [campaignId]: {
          currentStep: 1,
          completedMissions: [],
          status: "in_progress",
        },
      };
      persist({ creatorCampaigns: updated });
      return updated;
    });
    awardXP(25, "Iniciou uma nova campanha");
    logAction("campaign_started", `Iniciou campanha ID: ${campaignId}`);
  };

  const awardXP = (amount: number, reason: string) => {
    if (!currentUser || (currentUser.role !== "INFLUENCER" && currentUser.role !== "CAPTADOR")) return;

    const prevXP = (currentUser as CreatorProfile).current_xp || 0;
    const newXP = prevXP + amount;
    
    // Check level thresholds
    let newLevel = 1;
    for (const lvl of levels) {
      if (newXP >= lvl.min_xp) {
        newLevel = lvl.level;
      }
    }

    const prevLevel = (currentUser as CreatorProfile).current_level || 1;
    const leveledUp = newLevel > prevLevel;

    updateCurrentUser({
      current_xp: newXP,
      current_level: newLevel,
    });

    // If leveled up, trigger celebration modal
    if (leveledUp) {
      const reachedLevel = levels.find((l) => l.level === newLevel);
      if (reachedLevel) {
        setLevelUpNotification({
          show: true,
          level: newLevel,
          levelName: reachedLevel.name,
          perks: reachedLevel.unlocked_perks,
        });
      }

      // Add notification
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        user_id: currentUser.id,
        type: "level_up",
        title: `Parabéns! Você alcançou o Nível ${newLevel}!`,
        message: `Você agora é ${reachedLevel?.name || "Creator"}. Novos benefícios foram desbloqueados!`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const addSubmission = (submissionData: Omit<Submission, "id" | "submitted_at" | "status">) => {
    const newSub: Submission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      status: "in_review",
      submitted_at: new Date().toISOString(),
    };
    setSubmissions((prev) => {
      const updated = [newSub, ...prev];
      persist({ submissions: updated });
      return updated;
    });

    logAction("submission_created", `Enviou entrega para missão: ${submissionData.mission_title}`);
    awardXP(50, "Envio de material para análise");
  };

  const approveSubmission = (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "approved" as const,
              reviewed_at: new Date().toISOString(),
              reviewed_by: "Admin KRS",
            }
          : s
      );
      persist({ submissions: updated });
      return updated;
    });

    // Advance campaign progress for the creator
    setCreatorCampaigns((prev) => {
      const campProgress = prev[sub.campaign_id] || { currentStep: 1, completedMissions: [], status: "in_progress" };
      const newCompleted = [...campProgress.completedMissions, sub.mission_id];
      const nextStep = campProgress.currentStep + 1;
      
      const updated = {
        ...prev,
        [sub.campaign_id]: {
          ...campProgress,
          currentStep: nextStep,
          completedMissions: newCompleted,
        },
      };
      persist({ creatorCampaigns: updated });
      return updated;
    });

    // Award XP to creator
    awardXP(150, "Material aprovado pelo administrador");

    // Add notification to creator
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      user_id: sub.creator_id,
      type: "mission_approved",
      title: "Entrega Aprovada! 🎯",
      message: `Sua entrega para a missão '${sub.mission_title}' na campanha '${sub.campaign_title}' foi aprovada com sucesso! +150 XP`,
      action_url: `/campanhas`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAction("submission_approved", `Aprovou entrega de ${sub.creator_name} na missão ${sub.mission_title}`, submissionId);
  };

  const requestChangesSubmission = (submissionId: string, feedback: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "changes_requested" as const,
              feedback,
              reviewed_at: new Date().toISOString(),
              reviewed_by: "Admin KRS",
            }
          : s
      );
      persist({ submissions: updated });
      return updated;
    });

    // Notify creator
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      user_id: sub.creator_id,
      type: "changes_requested",
      title: "Ajuste Solicitado na sua Entrega",
      message: `O admin solicitou alterações na missão '${sub.mission_title}': "${feedback}"`,
      action_url: `/campanhas`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    logAction("submission_changes_requested", `Solicitou alteração para ${sub.creator_name}: ${feedback}`, submissionId);
  };

  const rejectSubmission = (submissionId: string, reason: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    setSubmissions((prev) => {
      const updated = prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "rejected" as const,
              feedback: reason,
              reviewed_at: new Date().toISOString(),
              reviewed_by: "Admin KRS",
            }
          : s
      );
      persist({ submissions: updated });
      return updated;
    });

    logAction("submission_rejected", `Recusou entrega de ${sub.creator_name}: ${reason}`, submissionId);
  };

  const addLevel = (newLevel: LevelConfig) => {
    setLevels((prev) => {
      const updated = [...prev, newLevel].sort((a, b) => a.level - b.level);
      persist({ levels: updated });
      return updated;
    });
  };

  const updateLevel = (levelNum: number, data: Partial<LevelConfig>) => {
    setLevels((prev) => {
      const updated = prev.map((l) => (l.level === levelNum ? { ...l, ...data } : l));
      persist({ levels: updated });
      return updated;
    });
  };

  const deleteLevel = (levelNum: number) => {
    setLevels((prev) => {
      const updated = prev.filter((l) => l.level !== levelNum);
      persist({ levels: updated });
      return updated;
    });
  };

  const addBadge = (badge: Badge) => {
    setBadges((prev) => {
      const updated = [badge, ...prev];
      persist({ badges: updated });
      return updated;
    });
  };

  const updateXPEvent = (id: string, xp: number, isActive: boolean) => {
    setXpEvents((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, xp_amount: xp, is_active: isActive } : item));
      persist({ xpEvents: updated });
      return updated;
    });
  };

  const updateCreatorPassDuration = (daysLeft: number) => {
    setCreatorPass((prev) => {
      const updated = { ...prev, days_left: daysLeft };
      persist({ creatorPass: updated });
      return updated;
    });
  };

  const addReferral = (code: string, newUserName: string, newUserEmail: string) => {
    const newRef: ReferralRecord = {
      id: `ref-${Date.now()}`,
      captador_id: currentUser ? currentUser.id : "system",
      referred_user_id: `user-${Date.now()}`,
      referred_name: newUserName,
      referred_username: newUserName.toLowerCase().replace(/\s+/g, "_"),
      status: "registered",
      joined_at: new Date().toISOString(),
      campaigns_completed: 0,
      xp_generated_for_captador: 50,
    };
    setReferrals((prev) => {
      const updated = [newRef, ...prev];
      persist({ referrals: updated });
      return updated;
    });
    awardXP(100, "Novo creator indicado");
  };

  const addCreativeAsset = (assetData: Omit<CreativeAsset, "id" | "created_at">) => {
    const newAsset: CreativeAsset = {
      ...assetData,
      id: `asset-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCreativeAssets((prev) => {
      const updated = [newAsset, ...prev];
      persist({ creativeAssets: updated });
      return updated;
    });
  };

  const addScript = (scriptData: Omit<ScriptTemplate, "id" | "created_at">) => {
    const newScript: ScriptTemplate = {
      ...scriptData,
      id: `script-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setScripts((prev) => {
      const updated = [newScript, ...prev];
      persist({ scripts: updated });
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist({ notifications: updated });
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persist({ notifications: updated });
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      persist({ settings: updated });
      return updated;
    });
  };

  const dismissLevelUp = () => {
    setLevelUpNotification(null);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    setGames(SEED_GAMES);
    setCampaigns(SEED_CAMPAIGNS);
    setSubmissions(SEED_SUBMISSIONS);
    setLevels(SEED_LEVELS);
    setBadges(SEED_BADGES);
    setXpEvents(SEED_XP_EVENTS);
    setCreatorPass(SEED_CREATOR_PASS);
    setSettings(INITIAL_SETTINGS);
    setAffiliateStats(SEED_AFFILIATE_STATS);
    setAffiliateConversions(SEED_AFFILIATE_CONVERSIONS);
    window.location.reload();
  };

  const totalAffiliateBalance = affiliateStats.reduce((acc, curr) => acc + (curr.available_balance || 0), 0);
  const walletBalance = currentUser ? (currentUser.wallet_balance ?? totalAffiliateBalance) : 0;
  const isAffiliateUser = currentUser ? (currentUser.role === "INFLUENCER" || (currentUser as any).is_affiliate === true) : false;

  const depositWallet = (amount: number) => {
    if (!currentUser) return;
    const current = currentUser.wallet_balance ?? totalAffiliateBalance;
    const newBal = current + amount;
    const updated = { ...currentUser, wallet_balance: newBal };
    setCurrentUser(updated);
    persist({ currentUser: updated });
    logAction("wallet_deposit", `Depósito PIX instantâneo de R$ ${amount.toFixed(2)} confirmado.`);
  };

  const withdrawWallet = (amount: number, pixKey: string) => {
    if (!currentUser) return;
    const current = currentUser.wallet_balance ?? totalAffiliateBalance;
    if (amount > current) return;
    const newBal = current - amount;
    const updated = { ...currentUser, wallet_balance: newBal };
    setCurrentUser(updated);
    persist({ currentUser: updated });
    logAction("wallet_withdraw", `Saque PIX de R$ ${amount.toFixed(2)} solicitado para chave ${pixKey}.`);
  };

  const withdrawAffiliate = async (amount: number, pixKey: string, pixType: string, gameId?: string) => {
    const txId = `PIX-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    if (gameId && gameId !== "all") {
      const targetGame = affiliateStats.find((g) => g.game_id === gameId);
      if (!targetGame || targetGame.available_balance < amount) {
        return { success: false, message: "Saldo insuficiente para o jogo selecionado.", txId: "" };
      }

      const updatedStats = affiliateStats.map((g) => {
        if (g.game_id === gameId) {
          return { ...g, available_balance: Math.max(0, g.available_balance - amount) };
        }
        return g;
      });
      setAffiliateStats(updatedStats);

      if (currentUser) {
        const newBal = Math.max(0, (currentUser.wallet_balance ?? totalAffiliateBalance) - amount);
        const updatedUser = { ...currentUser, wallet_balance: newBal };
        setCurrentUser(updatedUser);
        persist({ currentUser: updatedUser, affiliateStats: updatedStats });
      } else {
        persist({ affiliateStats: updatedStats });
      }

      logAction(
        "affiliate_pix_withdrawal",
        `Saque PIX de R$ ${amount.toFixed(2)} (${targetGame.game_name}) enviado para ${pixKey} (${pixType}). TxID: ${txId}`,
        targetGame.game_id
      );

      const newNotif: AppNotification = {
        id: `notif-pix-${Date.now()}`,
        user_id: currentUser ? currentUser.id : "guest",
        type: "admin_announcement",
        title: "PIX Transferido com Sucesso! 💸",
        message: `R$ ${amount.toFixed(2)} transferidos via PIX para ${pixKey}. Origem: ${targetGame.game_name}. TxID: ${txId}`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return {
        success: true,
        message: `Saque de R$ ${amount.toFixed(2)} efetuado com sucesso via PIX!`,
        txId,
      };
    } else {
      const currentTotal = affiliateStats.reduce((acc, curr) => acc + (curr.available_balance || 0), 0);
      if (amount > currentTotal) {
        return { success: false, message: "Saldo total insuficiente para este saque consolidado.", txId: "" };
      }

      let remainingToDeduct = amount;
      const updatedStats = affiliateStats.map((g) => {
        if (remainingToDeduct <= 0) return g;
        const deductFromThis = Math.min(g.available_balance, remainingToDeduct);
        remainingToDeduct -= deductFromThis;
        return { ...g, available_balance: Math.max(0, g.available_balance - deductFromThis) };
      });
      setAffiliateStats(updatedStats);

      if (currentUser) {
        const newBal = Math.max(0, (currentUser.wallet_balance ?? totalAffiliateBalance) - amount);
        const updatedUser = { ...currentUser, wallet_balance: newBal };
        setCurrentUser(updatedUser);
        persist({ currentUser: updatedUser, affiliateStats: updatedStats });
      } else {
        persist({ affiliateStats: updatedStats });
      }

      logAction(
        "affiliate_pix_withdrawal_total",
        `Saque consolidado PIX de R$ ${amount.toFixed(2)} enviado para ${pixKey} (${pixType}). TxID: ${txId}`
      );

      const newNotif: AppNotification = {
        id: `notif-pix-${Date.now()}`,
        user_id: currentUser ? currentUser.id : "guest",
        type: "admin_announcement",
        title: "Saque Consolidado PIX Realizado! 💸",
        message: `R$ ${amount.toFixed(2)} transferidos para a chave PIX ${pixKey}. TxID: ${txId}`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return {
        success: true,
        message: `Saque consolidado de R$ ${amount.toFixed(2)} efetuado com sucesso via PIX!`,
        txId,
      };
    }
  };

  const updateAffiliateCode = (newCode: string) => {
    const cleanCode = newCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanCode) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "https://krs-creator-hub.vercel.app";
    const updatedStats = affiliateStats.map((stat) => {
      const url = `${origin}/r/${stat.game_slug}?ref=${cleanCode}`;
      return { ...stat, referral_url: url };
    });
    setAffiliateStats(updatedStats);

    if (currentUser) {
      const updatedUser = { ...currentUser, affiliate_code: cleanCode };
      setCurrentUser(updatedUser);
      persist({ currentUser: updatedUser, affiliateStats: updatedStats });
    } else {
      persist({ affiliateStats: updatedStats });
    }

    logAction("affiliate_code_updated", `Código de afiliado configurado para '${cleanCode}'`);
  };

  const recordClick = async (gameSlug: string, affiliateCode?: string) => {
    const code = affiliateCode || (currentUser as any)?.affiliate_code || currentUser?.username || "afiliado";
    try {
      await fetch(`/api/affiliates/clicks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliate_code: code, game_slug: gameSlug }),
      });
    } catch (_) {}
  };

  const openGamePlayer = (game: Game) => {
    setPlayingGame(game);
  };

  const closeGamePlayer = () => {
    setPlayingGame(null);
  };

  return (
    <KrsStoreContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser && !!currentUser.id,
        isAuthLoaded,
        loginUser,
        registerUser,
        logout,
        switchUserRole,
        updateCurrentUser,
        games,
        addGame,
        updateGame,
        deleteGame,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        creatorCampaigns,
        startCampaign,
        submissions,
        addSubmission,
        approveSubmission,
        requestChangesSubmission,
        rejectSubmission,
        levels,
        addLevel,
        updateLevel,
        deleteLevel,
        badges,
        userBadges,
        addBadge,
        xpEvents,
        updateXPEvent,
        awardXP,
        creatorPass,
        updateCreatorPassDuration,
        referrals,
        addReferral,
        creativeAssets,
        scripts,
        addCreativeAsset,
        addScript,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activityLogs,
        logAction,
        settings,
        updateSettings,
        levelUpNotification,
        dismissLevelUp,
        walletBalance,
        depositWallet,
        withdrawWallet,
        walletModalOpen,
        setWalletModalOpen,
        affiliateStats,
        affiliateConversions,
        totalAffiliateBalance,
        withdrawAffiliate,
        updateAffiliateCode,
        recordClick,
        isAffiliateUser,
        playingGame,
        openGamePlayer,
        closeGamePlayer,
        resetAllData,
      }}
    >
      {children}
    </KrsStoreContext.Provider>
  );
}

export function useKrsStore() {
  const context = useContext(KrsStoreContext);
  if (!context) {
    throw new Error("useKrsStore must be used within a KrsStoreProvider");
  }
  return context;
}
