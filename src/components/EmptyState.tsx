import React from 'react';
import { Persona } from '../types';
import { ProsperityEmblem, ProsperityHorizontalLogo } from './ProsperityLogo';
import {
  Sparkles,
  Code2,
  Feather,
  BarChart3,
  GraduationCap,
  Zap,
  Heart,
  HeartHandshake,
  ArrowRight,
  Globe,
  Image as ImageIcon,
  Cpu,
} from 'lucide-react';

interface EmptyStateProps {
  currentPersona: Persona;
  onSelectPrompt: (prompt: string) => void;
  onOpenSettings: () => void;
}

const PERSONA_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Heart,
  HeartHandshake,
  Code2,
  Feather,
  BarChart3,
  GraduationCap,
  Zap,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentPersona,
  onSelectPrompt,
  onOpenSettings,
}) => {
  const IconComponent = PERSONA_ICONS[currentPersona.iconName] || Sparkles;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
      {/* AI Aura Emblem Badge (Demanded 1:1 Ratio) */}
      <div className="relative mb-5">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-500/25 via-blue-500/25 to-indigo-500/25 blur-2xl animate-pulse" />
        <div className="relative">
          <ProsperityEmblem
            size="2xl"
            className="!h-28 !w-28 sm:!h-32 sm:!w-32 shadow-2xl drop-shadow-[0_8px_32px_rgba(56,189,248,0.35)]"
          />
        </div>
      </div>

      {/* Horizontal Wordmark in Demanded 4:1 Ratio */}
      <div className="mb-4">
        <ProsperityHorizontalLogo className="h-10 sm:h-12 w-auto max-w-[280px] sm:max-w-[340px]" />
      </div>

      {/* Title & Description */}
      <h1 className="text-xl font-bold tracking-tight text-neutral-200 sm:text-2xl">
        {currentPersona.name}
      </h1>
      <p className="mt-1 text-sm font-medium text-sky-400">
        {currentPersona.roleTitle}
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-400 leading-relaxed">
        {currentPersona.description}
      </p>

      {/* Feature Capabilities Pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <Cpu className="h-3 w-3 text-emerald-400" />
          Gemini 3.8 Flash (Ultra-Fast)
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <ImageIcon className="h-3 w-3 text-purple-400" />
          Vision & Multimodal
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <Globe className="h-3 w-3 text-cyan-400" />
          Live Google Search Grounding
        </span>
      </div>

      {/* Starter Prompts Grid */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
          <span className="font-medium uppercase tracking-wider text-neutral-500">
            Suggested Prompts
          </span>
          <button
            onClick={onOpenSettings}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Change Persona
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {currentPersona.starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`starter-prompt-${idx}`}
              onClick={() => onSelectPrompt(prompt)}
              className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 text-left text-xs text-neutral-300 shadow-sm transition-all hover:border-indigo-500/50 hover:bg-neutral-800/80 hover:text-white"
            >
              <span className="line-clamp-2 leading-relaxed">{prompt}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
