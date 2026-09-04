import React, { useState } from 'react';
import { ModelSettings, Persona, ThinkingLevelOption, ModelChoice } from '../types';
import { PERSONAS } from '../lib/constants';
import { ProsperityEmblem, ProsperityHorizontalLogo } from './ProsperityLogo';
import {
  X,
  Sliders,
  Sparkles,
  Globe,
  Brain,
  Trash2,
  Database,
  Check,
  RefreshCw,
  Cpu,
  Download,
  Layers,
  ExternalLink,
  Heart,
  HeartHandshake,
  Code2,
  Feather,
  BarChart3,
  GraduationCap,
  Zap,
} from 'lucide-react';

const PERSONA_ICONS: Record<string, React.ElementType> = {
  Heart,
  HeartHandshake,
  Sparkles,
  Code2,
  Feather,
  BarChart3,
  GraduationCap,
  Zap,
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ModelSettings;
  onSaveSettings: (newSettings: ModelSettings) => void;
  currentPersonaId: string;
  onSelectPersona: (personaId: string) => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  currentPersonaId,
  onSelectPersona,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'model' | 'personas' | 'brand' | 'storage'>('model');
  const [selectedModel, setSelectedModel] = useState<ModelChoice>(settings.model || 'gemini-3.1-flash-lite');
  const [temperature, setTemperature] = useState(settings.temperature);
  const [thinkingLevel, setThinkingLevel] = useState<ThinkingLevelOption>(settings.thinkingLevel);
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(settings.enableSearchGrounding);
  const [customSystemInstruction, setCustomSystemInstruction] = useState(
    settings.customSystemInstruction || ''
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      model: selectedModel,
      temperature,
      thinkingLevel,
      enableSearchGrounding,
      customSystemInstruction,
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setSelectedModel('gemini-3.1-flash-lite');
    setTemperature(0.8);
    setThinkingLevel('DEFAULT');
    setEnableSearchGrounding(false);
    setCustomSystemInstruction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <ProsperityEmblem size="sm" className="!h-9 !w-9" />
            <div>
              <h2 className="text-base font-bold text-neutral-100">PROSPERITY AI Settings</h2>
              <p className="text-xs text-neutral-400">Configure model behavior, personas, and memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6">
          <button
            onClick={() => setActiveTab('model')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'model'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            Model & Parameters
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'personas'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Personas & System Prompts
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'brand'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            Brand & App Icons
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'storage'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="h-4 w-4" />
            Data & Privacy
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-200">
          {activeTab === 'model' && (
            <div className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="font-medium text-neutral-200">Active Gemini Model</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                    className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                      selectedModel === 'gemini-3.1-flash-lite'
                        ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-semibold text-neutral-100">Gemini 3.1 Flash Lite</span>
                      <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-800/50">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      Instant response, fluent emotional companion conversations, and generous daily quota
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-3.8-flash')}
                    className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                      selectedModel === 'gemini-3.8-flash'
                        ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-semibold text-neutral-100">Gemini 3.8 Flash</span>
                      <span className="rounded-full bg-amber-950/80 px-2 py-0.5 text-[10px] font-semibold text-amber-400 ring-1 ring-amber-800/50">
                        20 req/day
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      Advanced reasoning & coding tasks (automatically falls back to Flash Lite if quota is met)
                    </p>
                  </button>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-neutral-200">
                    Creativity / Temperature ({temperature.toFixed(2)})
                  </label>
                  <span className="text-xs text-neutral-500">
                    {temperature < 0.3 ? 'Deterministic / Precise' : temperature > 0.8 ? 'Highly Creative' : 'Balanced'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-indigo-500 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>0.0 (Precise / Code)</span>
                  <span>0.7 (Default)</span>
                  <span>1.5 (Creative / Fiction)</span>
                </div>
              </div>

              {/* Thinking Level */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <label className="font-medium text-neutral-200">Reasoning & Thinking Level</label>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(['DEFAULT', 'HIGH', 'LOW', 'MINIMAL'] as ThinkingLevelOption[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setThinkingLevel(level)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                        thinkingLevel === level
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-500">
                  Controls internal multi-step reasoning depth before generating the final answer.
                </p>
              </div>

              {/* Web Search Grounding Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-200">Google Search Grounding</p>
                    <p className="text-xs text-neutral-400">
                      Enables the model to search the live web for up-to-date facts, citations, and breaking news.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableSearchGrounding(!enableSearchGrounding)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enableSearchGrounding ? 'bg-cyan-600' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enableSearchGrounding ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Custom System Instruction Override */}
              <div className="space-y-2">
                <label className="font-medium text-neutral-200">
                  Custom System Instructions (Optional)
                </label>
                <textarea
                  value={customSystemInstruction}
                  onChange={(e) => setCustomSystemInstruction(e.target.value)}
                  placeholder="e.g., Always format mathematical formulas in LaTeX, answer in Spanish, or prioritize brevity."
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 p-3 text-xs leading-relaxed text-neutral-200 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 mb-2">
                Choose a pre-tuned personality and system role for your assistant:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {PERSONAS.map((persona) => {
                  const isSelected = persona.id === currentPersonaId;
                  const IconComp = PERSONA_ICONS[persona.iconName] || Sparkles;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => onSelectPersona(persona.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/40'
                          : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`rounded-lg p-1.5 ${isSelected ? 'bg-indigo-600/30 text-indigo-300' : 'bg-neutral-800 text-sky-400'}`}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-100">{persona.name}</h3>
                            <p className="text-xs font-medium text-sky-400">{persona.roleTitle}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                            <Check className="h-3 w-3" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <h3 className="font-semibold text-neutral-200">Local Privacy & Storage</h3>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  All chat logs and settings are stored privately in your browser’s local storage.
                  API calls are securely routed to the server-side Gemini API without storing telemetry.
                </p>
              </div>

              <div className="rounded-xl border border-rose-950/60 bg-rose-950/20 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-rose-300">Clear All Chat History</h3>
                    <p className="text-xs text-rose-300/70 mt-0.5">
                      Permanently delete all saved conversations and messages from local storage.
                    </p>
                  </div>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClearAllData();
                          setShowClearConfirm(false);
                          onClose();
                        }}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-900/60 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear Data
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <ProsperityEmblem size="xl" className="!h-20 !w-20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-neutral-100 text-lg tracking-wider">PROSPERITY AI</h3>
                        <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400 border border-sky-500/20">
                          Official Letterforms
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 max-w-md leading-relaxed">
                        Pure minimalist typography in demanded ratios: 1:1 Square Emblem for icons &amp; avatars, and 4:1 Horizontal Logo for wordmarks &amp; headers.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="/icon-512.png"
                      download="prosperity-icon-512.png"
                      className="flex items-center gap-2 rounded-xl bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-all shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      1:1 Emblem
                    </a>
                    <a
                      href="/logo.png"
                      download="prosperity-ai-logo.png"
                      className="flex items-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 transition-all shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      4:1 Logo
                    </a>
                  </div>
                </div>

                {/* 4:1 Demanded Ratio Live Preview */}
                <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 rounded-xl p-3 px-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    4:1 Horizontal Ratio:
                  </span>
                  <div className="h-8 max-w-[240px] flex items-center">
                    <ProsperityHorizontalLogo className="h-8" />
                  </div>
                  <a
                    href="/logo.svg"
                    download="prosperity-logo.svg"
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    SVG Vector
                  </a>
                </div>
              </div>

              {/* Asset Grid with Demanded Ratios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Google Play Store 512x512 Icon */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 flex items-center justify-center">
                      <ProsperityEmblem size="lg" className="!h-16 !w-16" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-neutral-200 text-sm">Play Store Icon</h4>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">1:1 Ratio · 512×512</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        High-contrast letterform emblem with precise 1:1 ratio. Ready for Google Play Console and store listing.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/80">
                    <a
                      href="/icon-512.png"
                      download="prosperity-icon-512.png"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download 512×512 PNG
                    </a>
                  </div>
                </div>

                {/* 2. Android Maskable / Adaptive Icon */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border border-sky-500/40 bg-neutral-950 p-1 flex items-center justify-center">
                      <img
                        src="/icon-maskable.png"
                        alt="Android Maskable Icon"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-neutral-200 text-sm">Android Adaptive</h4>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">1:1 Ratio · Safe Zone</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Safe-zone margin engineered for Android round, squircle, and teardrop dynamic launchers.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/80">
                    <a
                      href="/icon-maskable.png"
                      download="prosperity-icon-maskable.png"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Maskable PNG
                    </a>
                  </div>
                </div>

                {/* 3. Mobile PWA 192x192 Icon */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0 flex items-center justify-center">
                      <ProsperityEmblem size="lg" className="!h-16 !w-16" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-neutral-200 text-sm">PWA Mobile Icon</h4>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">1:1 Ratio · 192×192</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Optimal size for Chrome, Edge, and iOS Safari home-screen shortcuts and PWABuilder bundling.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/80">
                    <a
                      href="/icon-192.png"
                      download="prosperity-icon-192.png"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download 192×192 PNG
                    </a>
                  </div>
                </div>

                {/* 4. Horizontal Logo & Vector SVGs */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-24 shrink-0 rounded-xl border border-neutral-700 bg-neutral-950 p-1.5 flex items-center justify-center">
                      <ProsperityHorizontalLogo className="h-4 max-w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-neutral-200 text-sm">Vector Sources</h4>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">4:1 Ratio · SVG</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Lossless vector sources for web headers, marketing, banners, and store graphics.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-neutral-800/80">
                    <a
                      href="/icon.svg"
                      download="prosperity-icon.svg"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      1:1 SVG
                    </a>
                    <span className="text-neutral-600">|</span>
                    <a
                      href="/logo.svg"
                      download="prosperity-logo.svg"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      4:1 SVG
                    </a>
                  </div>
                </div>
              </div>

              {/* PWABuilder & Play Store instructions reminder */}
              <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Google Play Store Deployment Quick Guide
                </h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Your Web App Manifest (<code className="text-blue-300 font-mono">/manifest.json</code>) is already fully wired to these assets. When converting through <strong className="text-white">PWABuilder</strong>, these icons will automatically be bundled into your Android <code className="text-blue-300 font-mono">.aab</code> package.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/60 px-6 py-3.5">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset to Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-settings-btn"
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
            >
              <Check className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
