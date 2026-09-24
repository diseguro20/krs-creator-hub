"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Palette } from "lucide-react";
import { useKrsStore } from "@/lib/store/useKrsStore";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useKrsStore();

  const [platformName, setPlatformName] = useState(settings.platform_name);
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
  const [whatsapp, setWhatsapp] = useState(settings.support_whatsapp);
  const [email, setEmail] = useState(settings.support_email);
  const [rulesVersion, setRulesVersion] = useState(settings.rules_version);
  const [allowRegistrations, setAllowRegistrations] = useState(settings.allow_new_registrations);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platform_name: platformName,
      primary_color: primaryColor,
      support_whatsapp: whatsapp,
      support_email: email,
      rules_version: rulesVersion,
      allow_new_registrations: allowRegistrations,
    });

    // Apply color dynamically to CSS variable
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand-primary", primaryColor);
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Settings className="w-4 h-4" />
            Parâmetros Globais
          </div>
          <h1 className="text-3xl font-black text-white">Configurações da Plataforma</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Personalize a identidade da marca, contatos oficiais, regras e controle operacional sem alterar código.
          </p>
        </div>

        {saveToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-brand-primary/15 border border-brand-primary/30 text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configurações salvas e aplicadas!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding Card */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            Identidade Visual & Cores
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Plataforma</label>
              <input
                type="text"
                required
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor Primária da Marca</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-10 rounded bg-dark-850 border border-white/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white">Canais de Suporte Oficial</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp de Suporte</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail Institucional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="rounded-3xl border border-white/5 bg-dark-900 p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white">Controle de Cadastros & Versão</h3>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <div className="text-xs font-bold text-white">Permitir Novos Cadastros Públicos</div>
              <div className="text-[11px] text-zinc-400">Quando desativado, apenas cadastros por convite são aceitos</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allowRegistrations}
                onChange={(e) => setAllowRegistrations(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Versão das Diretrizes & Regras</label>
            <input
              type="text"
              value={rulesVersion}
              onChange={(e) => setRulesVersion(e.target.value)}
              className="w-48 px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
