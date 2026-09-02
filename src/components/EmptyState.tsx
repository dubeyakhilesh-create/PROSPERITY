import React from 'react';
import { Persona } from '../types';
import {
  Sparkles,
  Code2,
  Feather,
  BarChart3,
  GraduationCap,
  Zap,
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
      {/* AI Aura Badge */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-2xl ring-1 ring-white/10">
          <IconComponent className="h-8 w-8 text-indigo-400" />
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
        {currentPersona.name}
      </h1>
      <p className="mt-1 text-sm font-medium text-indigo-400">
        {currentPersona.roleTitle}
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-400 leading-relaxed">
        {currentPersona.description}
      </p>

      {/* Feature Capabilities Pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <Cpu className="h-3 w-3 text-indigo-400" />
          Gemini 3.7 Flash
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <ImageIcon className="h-3 w-3 text-purple-400" />
          Vision & Multimodal
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
          <Globe className="h-3 w-3 text-cyan-400" />
          Live Google Search
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
