import React, { useState } from 'react';
import { Check, Copy, Terminal, Download, Eye, Code } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const cleanLang = (language || 'text').toLowerCase();
  const isPreviewable = cleanLang === 'html' || cleanLang === 'svg' || cleanLang === 'xml';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      bash: 'sh',
      shell: 'sh',
      sql: 'sql',
      rust: 'rs',
      cpp: 'cpp',
      c: 'c',
      java: 'java',
      svg: 'svg',
    };
    const ext = extMap[cleanLang] || 'txt';
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippet.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = value.trim().split('\n').length;

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-sm shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-neutral-300 uppercase tracking-wider">{cleanLang}</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-500">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {isPreviewable && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                showPreview
                  ? 'bg-indigo-600/30 text-indigo-300 ring-1 ring-indigo-500/50'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
              title={showPreview ? 'Show code' : 'Preview HTML/SVG'}
            >
              {showPreview ? <Code className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{showPreview ? 'Code' : 'Preview'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white active:scale-95"
            title="Download file"
          >
            <Download className="h-3 w-3 text-neutral-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
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
      </div>

      {/* Code Body or Live Preview */}
      {showPreview && isPreviewable ? (
        <div className="bg-white p-4 text-neutral-900 rounded-b-xl overflow-auto min-h-[140px]">
          <iframe
            title="Code Preview"
            srcDoc={value}
            sandbox="allow-scripts"
            className="w-full min-h-[160px] border-0"
          />
        </div>
      ) : (
        <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-200 selection:bg-indigo-500/40">
          <pre className="font-mono">
            <code>{value}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
