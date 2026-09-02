import React, { useState } from 'react';
import { ModelSettings, Persona, ThinkingLevelOption } from '../types';
import { PERSONAS } from '../lib/constants';
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
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'model' | 'personas' | 'storage'>('model');
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
      temperature,
      thinkingLevel,
      enableSearchGrounding,
      customSystemInstruction,
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setTemperature(0.7);
    setThinkingLevel('DEFAULT');
    setEnableSearchGrounding(false);
    setCustomSystemInstruction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl ring-1 ring-white/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">PROSPERITY Settings</h2>
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
              {/* Active Model Indicator */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="font-semibold text-neutral-100">Gemini 3.7 Flash</p>
                      <p className="text-xs text-neutral-400">Next-gen multimodal reasoning, coding, and fast streaming</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-950/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-800/50">
                    Active
                  </span>
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
                          <div className="rounded-lg bg-neutral-800 p-1.5 text-indigo-400">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-100">{persona.name}</h3>
                            <p className="text-xs font-medium text-indigo-400">{persona.roleTitle}</p>
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
