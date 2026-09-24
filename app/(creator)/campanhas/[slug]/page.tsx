"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  UploadCloud,
  FileVideo,
  FileImage,
  FileText,
  Sparkles,
  AlertCircle,
  X,
  Play,
  Share2,
  Layers,
  ChevronRight,
  FolderDown,
} from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";
import { CreatorProfile } from "@/types";

export default function CampaignJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const {
    campaigns,
    creatorCampaigns,
    startCampaign,
    submissions,
    addSubmission,
    currentUser,
    scripts,
  } = useKrsStore();

  const creator = currentUser as CreatorProfile;
  const campaign = campaigns.find((c) => c.slug === resolvedParams.slug);

  if (!campaign) {
    return notFound();
  }

  const userProgress = creatorCampaigns[campaign.id];
  const isJoined = !!userProgress;
  const currentStep = userProgress?.currentStep || 1;
  const completedMissions = userProgress?.completedMissions || [];

  // Active mission to work on
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    campaign.missions.find((m) => m.step_order === currentStep)?.id || campaign.missions[0]?.id
  );

  // Uploader State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contentLink, setContentLink] = useState("");
  const [comments, setComments] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedMission = campaign.missions.find((m) => m.id === selectedMissionId) || campaign.missions[0];
  const existingSubmission = submissions.find(
    (s) => s.campaign_id === campaign.id && s.mission_id === selectedMission.id && s.creator_id === creator.id
  );

  const campaignScripts = scripts.filter((s) => s.game_id === campaign.game_id);

  // File drop handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleStartCampaign = () => {
    startCampaign(campaign.id);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(15);

    // Simulate smooth progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setSubmitSuccess(true);

      // Add to store
      addSubmission({
        campaign_id: campaign.id,
        campaign_title: campaign.title,
        mission_id: selectedMission.id,
        mission_title: selectedMission.title,
        creator_id: creator.id,
        creator_name: creator.name,
        creator_username: creator.username,
        creator_avatar: creator.avatar_url,
        file_url: filePreview || "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-playing-video-game-41484-large.mp4",
        file_type: file?.type || "video/mp4",
        file_size: file?.size || 12000000,
        content_link: contentLink,
        comments: comments || "Entrega realizada conforme as diretrizes da missão.",
      });

      // Clear form
      setFile(null);
      setFilePreview(null);
      setContentLink("");
      setComments("");

      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <Link
        href="/campanhas"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar pras Campanhas</span>
      </Link>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-dark-900 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-dark-850 border border-white/10 shrink-0">
              <img src={campaign.game_thumbnail} alt={campaign.title} className="h-full w-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-extrabold uppercase border border-brand-primary/30">
                  {campaign.game_name}
                </span>
                <span className="text-xs text-zinc-400">+{campaign.xp_total} XP ao zerar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{campaign.title}</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{campaign.description}</p>
            </div>
          </div>

          {!isJoined ? (
            <button
              onClick={handleStartCampaign}
              className="px-8 py-3.5 rounded-xl bg-brand-primary text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-xl shadow-brand-primary/25 shrink-0"
            >
              Bora Começar
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-brand-primary/30 text-right shrink-0">
              <div className="text-[10px] font-bold uppercase text-brand-primary">Sua Trilha</div>
              <div className="text-xs font-bold text-white mt-0.5">
                Missão {currentStep} de {campaign.missions.length}
              </div>
              <div className="text-[10px] text-zinc-400">
                {completedMissions.length} missões zeradas ⚡
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE SEQUENTIAL JOURNEY TRACK (STEP 1 -> STEP N)                        */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            Trilha de Desafios
          </div>
          <h3 className="text-xl font-black text-white">Sua Jornada na Campanha</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Passo a passo rumo ao topo! Manda o conteúdo da etapa atual pra liberar a próxima e faturar mais XP.
          </p>
        </div>

        {/* Horizontal / Grid Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {campaign.missions.map((m) => {
            const isCompleted = completedMissions.includes(m.id);
            const isCurrent = m.step_order === currentStep;
            const isLocked = campaign.sequential_progression && m.step_order > currentStep;
            const isSelected = selectedMission.id === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  if (!isLocked) setSelectedMissionId(m.id);
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10"
                    : isCompleted
                    ? "border-white/10 bg-dark-850 hover:bg-dark-800"
                    : isCurrent
                    ? "border-white/20 bg-dark-850 hover:bg-dark-800"
                    : "border-white/5 bg-dark-950/60 opacity-50 cursor-not-allowed"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400">
                      ETAPA {m.step_order}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-brand-primary text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovada! 🔥
                      </span>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-[9px] font-bold">
                        Vez
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">{m.title}</h4>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>+{m.xp_reward} XP</span>
                  <span className="capitalize">{m.upload_type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE MISSION DETAILS & SUBMISSION UPLOADER                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mission Instructions & Requirements */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-dark-800 text-[10px] font-extrabold uppercase tracking-wider text-brand-primary">
                Etapa {selectedMission.step_order} de {campaign.missions.length}
              </span>
              <span className="text-xs font-bold text-brand-primary">+{selectedMission.xp_reward} XP</span>
            </div>

            <h2 className="text-2xl font-black text-white">{selectedMission.title}</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">{selectedMission.description}</p>

            {/* Requirements list */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                O que precisa ter no seu conteúdo:
              </h4>
              <ul className="space-y-1.5">
                {selectedMission.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campaign script helper */}
            {campaignScripts.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-dark-850 border border-white/5 space-y-2">
                <div className="text-[10px] font-bold uppercase text-amber-400">Ideia de Roteiro pra Destravar</div>
                <p className="text-xs text-zinc-400 italic">
                  &quot;{campaignScripts[0].content.slice(0, 140)}...&quot;
                </p>
                <Link
                  href="/materiais"
                  className="inline-block text-xs font-bold text-brand-primary hover:underline"
                >
                  Ver Roteiro Completo na Central de Roteiros
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Submission Status & Uploader */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-brand-primary" />
              Solta Seu Conteúdo Aqui 🚀
            </h3>

            {/* If there's an existing submission for this mission */}
            {existingSubmission ? (
              <div className="rounded-2xl bg-dark-850 border border-white/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Como tá a sua entrega</span>
                  {existingSubmission.status === "in_review" && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Equipe avaliando ⚡
                    </span>
                  )}
                  {existingSubmission.status === "approved" && (
                    <span className="px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprovadíssimo! 🔥
                    </span>
                  )}
                  {existingSubmission.status === "changes_requested" && (
                    <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Pequeno ajuste pedido
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-300">
                  <strong>O que você mandou:</strong> {existingSubmission.comments}
                </div>

                {existingSubmission.feedback && (
                  <div className="p-3 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-amber-300">
                    <strong>Recado do nosso time:</strong> {existingSubmission.feedback}
                  </div>
                )}
              </div>
            ) : null}

            {/* Success toast message */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-xs text-brand-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Boaaa! Conteúdo enviado! Nossa equipe já tá de olho e logo seu XP cai na conta.</span>
              </div>
            )}

            {/* Uploader Form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div className="relative border-2 border-dashed border-white/10 hover:border-brand-primary/40 rounded-2xl p-6 text-center transition bg-dark-850/50">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="video/*,image/*,audio/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-white">
                  {file ? file.name : "Arrasta seu vídeo ou print pra cá, ou clica pra escolher"}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  MP4, MOV, PNG, JPG (vídeos, prints ou comprovantes até 100MB)
                </div>

                {file && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-800 text-xs text-zinc-200">
                    <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress bar during simulated upload */}
              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Subindo arquivo com segurança...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Content Link (Instagram, TikTok, YouTube) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Link da Publicação (se já publicou)
                </label>
                <input
                  type="url"
                  value={contentLink}
                  onChange={(e) => setContentLink(e.target.value)}
                  placeholder="https://instagram.com/p/... ou https://tiktok.com/@..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Notes / Proof commentary */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Comentários ou Observações
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Conta pra gente como foi a resposta da galera, primeiras métricas ou detalhes do vídeo..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-brand-primary text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-brand-primaryHover transition shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                {isUploading ? "Subindo arquivo..." : "Mandar pra Avaliação (+XP)"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
