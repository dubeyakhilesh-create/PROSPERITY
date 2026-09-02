import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Attachment } from '../types';
import { CodeBlock } from './CodeBlock';
import { formatTimestamp, speakText, stopSpeaking, isSpeaking } from '../lib/utils';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCw,
  Volume2,
  VolumeX,
  Globe,
  ExternalLink,
  FileText,
  AlertCircle,
  Pencil,
  Eye,
  X,
} from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
  onRegenerate?: () => void;
  onEditPrompt?: (content: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLast,
  onRegenerate,
  onEditPrompt,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (speaking || isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      const started = speakText(
        message.content,
        () => setSpeaking(false),
        () => setSpeaking(false)
      );
      if (!started) {
        setSpeaking(false);
      }
    }
  };

  const webChunks = message.groundingMetadata?.groundingChunks?.filter(
    (chunk) => chunk.web && chunk.web.uri
  ) || [];

  return (
    <div
      id={`message-${message.id}`}
      className={`group relative flex w-full gap-4 px-4 py-6 transition-colors duration-200 md:px-8 ${
        isUser
          ? 'bg-transparent'
          : 'border-y border-neutral-900/60 bg-neutral-900/30'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
        {isUser ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 font-semibold text-white shadow-md shadow-indigo-500/20">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 font-semibold text-white shadow-md shadow-violet-500/20 ring-1 ring-violet-400/30">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className="min-w-0 flex-1 space-y-3">
        {/* Header (Role & Time) */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-neutral-200">
            {isUser ? 'You' : 'PROSPERITY'}
          </span>
          <span className="text-xs text-neutral-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {!isUser && message.groundingMetadata?.webSearchQueries && (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-medium text-cyan-400 ring-1 ring-cyan-800/40">
              <Globe className="h-2.5 w-2.5" />
              Web Grounded
            </span>
          )}
        </div>

        {/* Attachments Preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-2">
            {message.attachments.map((att: Attachment) => (
              <div
                key={att.id}
                className="group/att relative flex items-center gap-2 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5 transition-all hover:border-neutral-700"
              >
                {att.type === 'image' ? (
                  <div
                    onClick={() => setPreviewImage(att.data)}
                    className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md bg-neutral-950"
                  >
                    <img
                      src={att.data}
                      alt={att.name}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover/att:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/att:opacity-100">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-300">
                    <div className="rounded-md bg-neutral-800 p-1 text-indigo-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="max-w-[160px] truncate">
                      <p className="truncate font-medium text-neutral-200">{att.name}</p>
                      <p className="text-[10px] text-neutral-500">Document</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Body / Markdown */}
        <div className="prose prose-invert max-w-none text-neutral-200 text-[15px] leading-relaxed break-words">
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline && (match || codeString.includes('\n'))) {
                    return (
                      <CodeBlock
                        language={match ? match[1] : 'text'}
                        value={codeString}
                      />
                    );
                  }

                  return (
                    <code
                      className="rounded-md bg-neutral-800/90 px-1.5 py-0.5 font-mono text-[13px] text-indigo-300 ring-1 ring-neutral-700/50"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-medium text-indigo-400 underline decoration-indigo-400/40 underline-offset-4 transition-colors hover:text-indigo-300"
                    >
                      {children}
                      <ExternalLink className="inline h-3 w-3 ml-0.5 opacity-70" />
                    </a>
                  );
                },
                table({ children }) {
                  return (
                    <div className="my-4 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60 shadow-sm">
                      <table className="min-w-full divide-y divide-neutral-800 text-left text-sm text-neutral-300">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="bg-neutral-900/90 px-4 py-2.5 font-semibold text-neutral-200">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="px-4 py-2.5 text-neutral-300 border-t border-neutral-900">
                      {children}
                    </td>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="my-3 border-l-2 border-indigo-500/80 pl-4 italic text-neutral-400">
                      {children}
                    </blockquote>
                  );
                },
                ul({ children }) {
                  return <ul className="my-2 list-disc pl-6 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="my-2 list-decimal pl-6 space-y-1">{children}</ol>;
                },
                p({ children }) {
                  return <p className="mb-3 last:mb-0">{children}</p>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold text-neutral-100 mt-5 mb-2.5">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-semibold text-neutral-100 mt-4 mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-semibold text-neutral-200 mt-3 mb-1.5">{children}</h3>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : message.isStreaming ? (
            <div className="flex items-center gap-2 py-1 text-sm text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Thinking & formulating response...</span>
            </div>
          ) : null}

          {/* Pulsating cursor during active stream */}
          {message.isStreaming && message.content && (
            <span className="inline-block h-4 w-1.5 translate-y-0.5 ml-1 bg-indigo-400 animate-pulse rounded-sm" />
          )}
        </div>

        {/* Error Message Display */}
        {message.error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-900/60 bg-rose-950/40 p-3 text-sm text-rose-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
            <div className="flex-1">
              <p className="font-medium text-rose-200">Generation Error</p>
              <p className="text-xs text-rose-300/80 mt-0.5">{message.error}</p>
            </div>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-md bg-rose-900/70 px-2.5 py-1 text-xs font-medium text-rose-100 hover:bg-rose-800 transition-colors"
              >
                <RotateCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Grounding Web Sources citations */}
        {webChunks.length > 0 && (
          <div className="mt-3 border-t border-neutral-800/80 pt-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Sources & Citations
            </p>
            <div className="flex flex-wrap gap-2">
              {webChunks.slice(0, 6).map((chunk, idx) => (
                <a
                  key={idx}
                  href={chunk.web?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs text-neutral-300 transition-all hover:border-cyan-700/60 hover:bg-neutral-800 hover:text-cyan-300"
                >
                  <Globe className="h-3 w-3 text-cyan-400" />
                  <span className="max-w-[200px] truncate">{chunk.web?.title || 'Web Reference'}</span>
                  <ExternalLink className="h-2.5 w-2.5 text-neutral-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-1.5 pt-1 text-neutral-400 opacity-80 transition-opacity group-hover:opacity-100">
            <button
              id={`copy-msg-${message.id}`}
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {!isUser && (
              <>
                <button
                  id={`speak-msg-${message.id}`}
                  onClick={handleToggleSpeak}
                  className={`flex items-center gap-1 rounded-md p-1.5 text-xs transition-all ${
                    speaking
                      ? 'bg-indigo-950/80 text-indigo-400 ring-1 ring-indigo-700/50'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
                  title={speaking ? 'Stop speech' : 'Read aloud'}
                >
                  {speaking ? <VolumeX className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span className="text-[11px]">{speaking ? 'Speaking...' : 'Read'}</span>
                </button>

                {isLast && onRegenerate && (
                  <button
                    id={`regenerate-msg-${message.id}`}
                    onClick={onRegenerate}
                    className="flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all"
                    title="Regenerate response"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Regenerate</span>
                  </button>
                )}
              </>
            )}

            {isUser && onEditPrompt && (
              <button
                id={`edit-prompt-${message.id}`}
                onClick={() => onEditPrompt(message.content)}
                className="flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all"
                title="Edit and resend"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="text-[11px]">Edit</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-neutral-900 p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 rounded-full bg-neutral-800/90 p-1.5 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt="Attachment Full View"
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
