import React, { useState } from 'react';
import { Conversation, Persona } from '../types';
import { PERSONAS } from '../lib/constants';
import { ProsperityEmblem, ProsperityHorizontalLogo } from './ProsperityLogo';
import {
  Menu,
  PanelLeftOpen,
  Sparkles,
  Settings,
  Download,
  Trash2,
  Globe,
  ChevronDown,
  Share2,
  FileText,
  FileJson,
} from 'lucide-react';

interface HeaderProps {
  conversation: Conversation | null;
  currentPersona: Persona;
  onSelectPersona: (personaId: string) => void;
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  onExportMarkdown: () => void;
  onExportJSON: () => void;
  onClearMessages: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  conversation,
  currentPersona,
  onSelectPersona,
  onOpenSettings,
  onToggleMobileSidebar,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  onExportMarkdown,
  onExportJSON,
  onClearMessages,
}) => {
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-neutral-800/80 bg-neutral-950/90 px-4 backdrop-blur-md">
      {/* Left: Sidebar toggles & Conversation Info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="flex lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {isCollapsedDesktop && (
          <button
            onClick={onToggleCollapseDesktop}
            className="hidden lg:flex rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}

        {/* App Emblem & Letterform in Header */}
        <div className="flex items-center gap-2.5">
          <ProsperityEmblem size="sm" className="!h-9 !w-9" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black tracking-wider text-neutral-100 leading-tight">
              PROSPERITY
            </span>
            <span className="text-[10px] font-black tracking-widest text-sky-400 leading-none">
              AI
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 pl-1">
          <h2 className="truncate text-sm font-semibold text-neutral-200">
            {conversation ? conversation.title : 'New Chat'}
          </h2>
        </div>
      </div>

      {/* Right: Persona Selector & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Persona Dropdown */}
        <div className="relative">
          <button
            id="persona-selector-btn"
            onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 shadow-sm transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
          >
            <ProsperityEmblem size="xs" className="!h-5 !w-5" hasBorder={false} />
            <span className="hidden sm:inline max-w-[120px] truncate">{currentPersona.name}</span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </button>

          {personaMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setPersonaMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-40 mt-1.5 w-64 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-1.5 shadow-2xl ring-1 ring-white/10">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Select AI Persona
                </div>
                <div className="space-y-0.5">
                  {PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        onSelectPersona(persona.id);
                        setPersonaMenuOpen(false);
                      }}
                      className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        persona.id === currentPersona.id
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <ProsperityEmblem size="xs" className="!h-6 !w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-neutral-200">{persona.name}</p>
                        <p className="line-clamp-1 text-[11px] text-neutral-400">
                          {persona.roleTitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Model Engine Status Badge */}
        <span className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-200">Gemini 3.8 Flash</span>
        </span>

        {/* Web Search Grounding Status Badge */}
        {conversation?.settings?.enableSearchGrounding && (
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-cyan-950/80 px-2.5 py-1 text-[11px] font-medium text-cyan-300 ring-1 ring-cyan-800/40">
            <Globe className="h-3 w-3 text-cyan-400" />
            Search Active
          </span>
        )}

        {/* Export Dropdown */}
        {conversation && conversation.messages.length > 0 && (
          <div className="relative">
            <button
              id="export-chat-btn"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
              title="Export conversation"
            >
              <Download className="h-4 w-4" />
            </button>

            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-40 mt-1.5 w-44 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-1 shadow-2xl ring-1 ring-white/10">
                  <button
                    onClick={() => {
                      onExportMarkdown();
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Export as Markdown</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportJSON();
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    <FileJson className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Export as JSON</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Clear Messages */}
        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={onClearMessages}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-rose-400 transition-colors"
            title="Clear chat messages"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        {/* Settings Modal Toggle */}
        <button
          id="header-settings-btn"
          onClick={onOpenSettings}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          title="Settings & Model Parameters"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
