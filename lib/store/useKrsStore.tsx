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
} from "@/lib/seed-data";

interface KrsStoreContextType {
  // Current user & Auth
  currentUser: UserProfile | CreatorProfile | CaptadorProfile;
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

  // In-App Game Player
  playingGame: Game | null;
  openGamePlayer: (game: Game) => void;
  closeGamePlayer: () => void;

  // Reset to seed data
  resetAllData: () => void;
}

const KrsStoreContext = createContext<KrsStoreContextType | null>(null);

const STORAGE_KEY = "krs_creator_hub_v3_store";

export function KrsStoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize state
  const [currentUser, setCurrentUser] = useState<UserProfile | CreatorProfile | CaptadorProfile>(DEMO_CREATOR);
  const [games, setGames] = useState<Game[]>(SEED_GAMES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [creatorCampaigns, setCreatorCampaigns] = useState<Record<string, { currentStep: number; completedMissions: string[]; status: string }>>({
    "camp-fruit-cash-fatia-pix": {
      currentStep: 2,
      completedMissions: ["m-fc-1"],
      status: "in_progress",
    },
  });
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [levels, setLevels] = useState<LevelConfig[]>(SEED_LEVELS);
  const [badges, setBadges] = useState<Badge[]>(SEED_BADGES);
  const [userBadges, setUserBadges] = useState<string[]>([
    "badge-primeira-campanha",
    "badge-entrega-perfeita",
    "badge-creator-consistente",
  ]);
  const [xpEvents, setXpEvents] = useState<XPEventConfig[]>(SEED_XP_EVENTS);
  const [creatorPass, setCreatorPass] = useState<CreatorPassSeason>(SEED_CREATOR_PASS);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([
    {
      id: "ref-1",
      captador_id: "user-captador-1",
      referred_user_id: "user-creator-1",
      referred_name: "Lucas Alencar",
      referred_username: "lucas_gaming",
      referred_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      status: "completed_campaign",
      joined_at: "2026-08-01T10:00:00Z",
      campaigns_completed: 7,
      xp_generated_for_captador: 700,
    },
    {
      id: "ref-2",
      captador_id: "user-captador-1",
      referred_user_id: "user-creator-2",
      referred_name: "Beatriz Lima",
      referred_username: "biagames",
      referred_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      status: "active",
      joined_at: "2026-09-02T14:00:00Z",
      campaigns_completed: 2,
      xp_generated_for_captador: 200,
    },
    {
      id: "ref-3",
      captador_id: "user-captador-1",
      referred_user_id: "user-creator-3",
      referred_name: "Gabriel Santos",
      referred_username: "gabriel_play",
      referred_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      status: "registered",
      joined_at: "2026-09-14T11:00:00Z",
      campaigns_completed: 0,
      xp_generated_for_captador: 0,
    },
  ]);
  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>(SEED_CREATIVE_ASSETS);
  const [scripts, setScripts] = useState<ScriptTemplate[]>(SEED_SCRIPTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      user_id: "user-creator-1",
      type: "mission_approved",
      title: "Missão Aprovada!",
      message: "Sua entrega para a missão 'Confirmação & Download do Jogo' foi aprovada. +50 XP adicionados!",
      action_url: "/campanhas/bubbles-cash-setembro",
      read: false,
      created_at: "2026-09-12T16:00:00Z",
    },
    {
      id: "notif-2",
      user_id: "user-creator-1",
      type: "level_up",
      title: "Você subiu para o Nível 5!",
      message: "Parabéns, você agora é Creator Elite e desbloqueou multiplicador 1.25x!",
      read: true,
      created_at: "2026-09-10T12:00:00Z",
    },
    {
      id: "notif-3",
      user_id: "user-creator-1",
      type: "new_campaign",
      title: "Nova Campanha Disponível",
      message: "Blockerino: Mestre dos Blocos abriu novas vagas para criadores com bônus de XP.",
      action_url: "/campanhas/blockerino-mestre-dos-blocos",
      read: true,
      created_at: "2026-09-05T14:00:00Z",
    },
  ]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      user_id: "user-creator-1",
      user_name: "Lucas Alencar",
      user_role: "INFLUENCER",
      action: "submission_created",
      details: "Enviou material em vídeo para a missão 'Gravar Gameplay com Alta Habilidade'",
      created_at: "2026-09-15T21:30:00Z",
    },
    {
      id: "log-2",
      user_id: "user-admin-1",
      user_name: "KRS Operations Master",
      user_role: "ADMIN",
      action: "submission_approved",
      details: "Aprovou a missão 'Confirmação & Download' de Lucas Alencar",
      created_at: "2026-09-12T16:00:00Z",
    },
    {
      id: "log-3",
      user_id: "user-captador-1",
      user_name: "Marcos Vinicius",
      user_role: "CAPTADOR",
      action: "referral_registered",
      details: "Convidou Gabriel Santos (@gabriel_play) via link de indicação MARCOS10",
      created_at: "2026-09-14T11:00:00Z",
    },
  ]);
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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
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
      }
    } catch (e) {
      console.warn("Could not load stored data:", e);
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

  const switchUserRole = (role: "ADMIN" | "INFLUENCER" | "CAPTADOR") => {
    let newUser: UserProfile | CreatorProfile | CaptadorProfile = DEMO_CREATOR;
    if (role === "ADMIN") newUser = DEMO_ADMIN;
    if (role === "CAPTADOR") newUser = DEMO_CAPTADOR;
    if (role === "INFLUENCER") newUser = DEMO_CREATOR;

    setCurrentUser(newUser);
    persist({ currentUser: newUser });
  };

  const updateCurrentUser = (data: Partial<UserProfile | CreatorProfile | CaptadorProfile>) => {
    setCurrentUser((prev) => {
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
    if (currentUser.role !== "INFLUENCER" && currentUser.role !== "CAPTADOR") return;

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
      captador_id: currentUser.id,
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
    setCurrentUser(DEMO_CREATOR);
    setGames(SEED_GAMES);
    setCampaigns(SEED_CAMPAIGNS);
    setSubmissions(SEED_SUBMISSIONS);
    setLevels(SEED_LEVELS);
    setBadges(SEED_BADGES);
    setXpEvents(SEED_XP_EVENTS);
    setCreatorPass(SEED_CREATOR_PASS);
    setSettings(INITIAL_SETTINGS);
    window.location.reload();
  };

  const walletBalance = currentUser.wallet_balance ?? 380.00;

  const depositWallet = (amount: number) => {
    const current = currentUser.wallet_balance ?? 380.00;
    const newBal = current + amount;
    const updated = { ...currentUser, wallet_balance: newBal };
    setCurrentUser(updated);
    persist({ currentUser: updated });
    logAction("wallet_deposit", `Depósito PIX instantâneo de R$ ${amount.toFixed(2)} confirmado.`);
  };

  const withdrawWallet = (amount: number, pixKey: string) => {
    const current = currentUser.wallet_balance ?? 380.00;
    if (amount > current) return;
    const newBal = current - amount;
    const updated = { ...currentUser, wallet_balance: newBal };
    setCurrentUser(updated);
    persist({ currentUser: updated });
    logAction("wallet_withdraw", `Saque PIX de R$ ${amount.toFixed(2)} solicitado para chave ${pixKey}.`);
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
