import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const lineCount = value.trim().split('\n').length;

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-sm shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-neutral-300 uppercase tracking-wider">{language}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-500">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
        </div>
        <button
          id={`copy-code-btn-${Math.random().toString(36).substr(2, 6)}`}
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white active:scale-95"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-neutral-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-200 selection:bg-indigo-500/40">
        <pre className="font-mono">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};
