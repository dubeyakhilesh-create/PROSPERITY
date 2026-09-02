import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Attachment } from '../types';
import { fileToBase64, generateId, readTextFile } from '../lib/utils';
import {
  ArrowUp,
  Square,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Globe,
  X,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  enableSearchGrounding: boolean;
  onToggleSearchGrounding: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  enableSearchGrounding,
  onToggleSearchGrounding,
  initialPrompt = '',
  onClearInitialPrompt,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync initialPrompt if provided (e.g. from starter card or edit prompt)
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      onClearInitialPrompt?.();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 220)}px`;
    }
  }, [input]);

  // Voice speech-to-text setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Could not start speech recognition:', err);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    const trimmed = input.trim();
    if (!trimmed && attachments.length === 0) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    onSendMessage(trimmed, attachments);
    setInput('');
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const base64Data = await fileToBase64(file);
          newAttachments.push({
            id: generateId(),
            name: file.name,
            type: 'image',
            mimeType: file.type || 'image/jpeg',
            data: base64Data,
            size: file.size,
          });
        } catch (err) {
          console.error('Failed to read image:', err);
        }
      } else {
        // Text / code / markdown file
        try {
          const textContent = await readTextFile(file);
          // Attach as document with text preview
          newAttachments.push({
            id: generateId(),
            name: file.name,
            type: 'file',
            mimeType: file.type || 'text/plain',
            data: textContent,
            size: file.size,
          });
          // Also append context preview to input prompt for easier reference
          setInput((prev) =>
            prev
              ? `${prev}\n\n[File: ${file.name}]\n\`\`\`\n${textContent.slice(0, 4000)}\n\`\`\``
              : `Please inspect the following file: ${file.name}\n\`\`\`\n${textContent.slice(0, 4000)}\n\`\`\``
          );
        } catch (err) {
          console.error('Failed to read text file:', err);
        }
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const characterCount = input.length;

  return (
    <div
      className="relative mx-auto w-full max-w-4xl px-4 pb-6 pt-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-x-4 inset-y-2 z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-500 bg-neutral-900/90 backdrop-blur-sm">
          <ImageIcon className="h-10 w-10 text-indigo-400 animate-bounce" />
          <p className="mt-2 text-sm font-semibold text-neutral-200">
            Drop images or documents here
          </p>
        </div>
      )}

      {/* Main Container */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl shadow-black/40 ring-1 ring-white/5 transition-all focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20">
        {/* Attachments Bar */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-neutral-800/80 p-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800/90 pl-2 pr-1.5 py-1 text-xs text-neutral-200"
              >
                {att.type === 'image' ? (
                  <img
                    src={att.data}
                    alt={att.name}
                    className="h-6 w-6 rounded object-cover"
                  />
                ) : (
                  <FileCode className="h-4 w-4 text-indigo-400" />
                )}
                <span className="max-w-[120px] truncate font-medium">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="rounded p-0.5 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-3">
          <textarea
            id="chat-textarea"
            ref={textareaRef}
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask PROSPERITY anything, paste code, or drop an image..."
            rows={1}
            className="max-h-[220px] min-h-[44px] w-full resize-none bg-transparent px-2 text-[15px] leading-relaxed text-neutral-100 placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between border-t border-neutral-800/50 px-3 py-2">
          {/* Left Tools */}
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
              accept="image/*,.txt,.md,.js,.ts,.tsx,.py,.json,.csv,.sql,.html,.css"
              className="hidden"
            />

            {/* Attach File Button */}
            <button
              id="attach-file-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
              title="Attach image or text document"
            >
              <Paperclip className="h-4 w-4" />
              <span className="hidden sm:inline">Attach</span>
            </button>

            {/* Web Search Grounding Toggle */}
            <button
              id="search-grounding-btn"
              type="button"
              onClick={onToggleSearchGrounding}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                enableSearchGrounding
                  ? 'bg-cyan-950/80 text-cyan-300 ring-1 ring-cyan-700/50'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
              title="Toggle Google Search grounding for real-time live info"
            >
              <Globe className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Web Search</span>
            </button>

            {/* Voice Input Button */}
            <button
              id="voice-record-btn"
              type="button"
              onClick={toggleVoiceRecording}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                isRecording
                  ? 'bg-rose-950/80 text-rose-300 ring-1 ring-rose-700/60 animate-pulse'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Dictate with voice'}
            >
              {isRecording ? <MicOff className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4" />}
              <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {characterCount > 0 && (
              <span className="hidden text-[11px] text-neutral-500 sm:inline">
                {characterCount} chars
              </span>
            )}

            {isStreaming ? (
              <button
                id="stop-stream-btn"
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-500 active:scale-95"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                id="send-message-btn"
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                className={`flex h-8 w-8 items-center justify-center rounded-xl font-medium transition-all active:scale-95 ${
                  input.trim() || attachments.length > 0
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>PROSPERITY · Gemini 3.7 Flash</span>
        </span>
        <span className="hidden sm:inline">
          Use <kbd className="rounded bg-neutral-800 px-1 py-0.5 text-neutral-400">Shift + Enter</kbd> for new line
        </span>
      </div>
    </div>
  );
};
