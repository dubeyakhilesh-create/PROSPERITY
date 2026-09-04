import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

interface ThinkingBlockProps {
  thought: string;
  isStreaming?: boolean;
  thinkingTimeMs?: number;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({
  thought,
  isStreaming = false,
  thinkingTimeMs,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thought && !isStreaming) return null;

  const formattedTime = thinkingTimeMs
    ? `${(thinkingTimeMs / 1000).toFixed(1)}s`
    : null;

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-purple-900/40 bg-purple-950/20 text-xs text-neutral-300 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3.5 py-2 text-left font-medium text-purple-300 hover:bg-purple-900/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-5 w-5 items-center justify-center rounded-md bg-purple-900/60 text-purple-300">
            <Brain className={`h-3 w-3 ${isStreaming ? 'animate-pulse text-purple-200' : ''}`} />
          </div>
          <span className="font-semibold tracking-wide">
            {isStreaming ? 'Reasoning & formulating thoughts...' : 'Thought Process'}
          </span>
          {formattedTime && (
            <span className="rounded-full bg-purple-950 px-2 py-0.5 text-[10px] text-purple-400 border border-purple-800/50">
              {formattedTime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-neutral-400">
          <span className="text-[11px]">{isOpen ? 'Hide reasoning' : 'Show reasoning'}</span>
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-purple-900/30 bg-purple-950/10 px-4 py-3 text-[13px] leading-relaxed text-neutral-300 font-mono whitespace-pre-wrap selection:bg-purple-900/50">
          {thought || (
            <span className="italic text-purple-400/80">Exploring approaches, validating constraints, and formulating answer...</span>
          )}
        </div>
      )}
    </div>
  );
};
