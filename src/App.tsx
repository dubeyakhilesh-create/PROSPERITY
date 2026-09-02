import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Conversation, Message, Attachment, ModelSettings, Persona } from './types';
import { PERSONAS, DEFAULT_MODEL_SETTINGS } from './lib/constants';
import { generateId, exportConversationAsMarkdown, exportConversationAsJSON, stopSpeaking } from './lib/utils';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEY = 'ai_assistant_conversations_v1';
const SETTINGS_KEY = 'ai_assistant_global_settings_v1';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load chats from localStorage:', e);
    }
    return [];
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {}
    return null;
  });

  const [globalSettings, setGlobalSettings] = useState<ModelSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_MODEL_SETTINGS;
  });

  const [currentPersonaId, setCurrentPersonaId] = useState<string>('general');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Active conversation object
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Active persona object
  const currentPersona = PERSONAS.find((p) => p.id === (activeConversation?.personaId || currentPersonaId)) || PERSONAS[0];

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save chats:', e);
    }
  }, [conversations]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(globalSettings));
    } catch (e) {}
  }, [globalSettings]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeId]);

  useEffect(() => {
    if (isStreaming) {
      scrollToBottom('smooth');
    }
  }, [activeConversation?.messages, isStreaming, scrollToBottom]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleNewConversation();
      }
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen]);

  // Create New Conversation
  const handleNewConversation = (personaId?: string) => {
    stopSpeaking();
    if (isStreaming) {
      abortControllerRef.current?.abort();
      setIsStreaming(false);
    }

    const selectedPersona = personaId || currentPersonaId;
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      personaId: selectedPersona,
      messages: [],
      settings: { ...globalSettings },
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  // Delete Conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // Rename Conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  };

  // Toggle Pin Conversation
  const handleTogglePinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  // Change Persona
  const handleSelectPersona = (personaId: string) => {
    setCurrentPersonaId(personaId);
    if (activeConversation) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConversation.id ? { ...c, personaId } : c))
      );
    }
  };

  // Clear messages in current conversation
  const handleClearMessages = () => {
    if (!activeConversation) return;
    stopSpeaking();
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: [] } : c))
    );
  };

  // Clear all data
  const handleClearAllData = () => {
    stopSpeaking();
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Toggle Search Grounding for current conversation
  const handleToggleSearchGrounding = () => {
    if (!activeConversation) {
      setGlobalSettings((prev) => ({
        ...prev,
        enableSearchGrounding: !prev.enableSearchGrounding,
      }));
      return;
    }

    const currentVal = activeConversation.settings.enableSearchGrounding;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              settings: {
                ...c.settings,
                enableSearchGrounding: !currentVal,
              },
            }
          : c
      )
    );
  };

  // Stop Streaming
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Set streaming false on last message
    if (activeConversation) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          const updatedMessages = c.messages.map((m, idx) =>
            idx === c.messages.length - 1 ? { ...m, isStreaming: false } : m
          );
          return { ...c, messages: updatedMessages };
        })
      );
    }
  };

  // Send Message Logic
  const handleSendMessage = async (content: string, attachments: Attachment[] = []) => {
    stopSpeaking();

    let targetConvId = activeId;
    let currentConv = activeConversation;

    // Create a new conversation if none exists
    if (!targetConvId || !currentConv) {
      const newConv: Conversation = {
        id: generateId(),
        title: content.slice(0, 32) || 'New Chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        personaId: currentPersonaId,
        messages: [],
        settings: { ...globalSettings },
      };
      setConversations((prev) => [newConv, ...prev]);
      targetConvId = newConv.id;
      currentConv = newConv;
      setActiveId(newConv.id);
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments,
    };

    const assistantPlaceholderId = generateId();
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      modelUsed: 'gemini-3.7-flash',
    };

    const isFirstMessage = currentConv.messages.length === 0;

    // Append user message and placeholder assistant message
    const updatedMessages = [...currentConv.messages, userMessage, assistantMessage];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Auto generate title if first message
    if (isFirstMessage && content) {
      fetch('/api/gemini/suggest-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.title) {
            handleRenameConversation(targetConvId!, data.title);
          }
        })
        .catch((e) => console.error('Title generation failed:', e));
    }

    try {
      const persona = PERSONAS.find((p) => p.id === currentConv!.personaId) || PERSONAS[0];
      const settings = currentConv!.settings || globalSettings;

      const systemInstruction = settings.customSystemInstruction
        ? `${persona.systemInstruction}\n\nAdditional Instructions:\n${settings.customSystemInstruction}`
        : persona.systemInstruction;

      const response = await fetch('/api/gemini/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...currentConv.messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          systemInstruction,
          temperature: settings.temperature ?? persona.temperature,
          useSearchGrounding: settings.enableSearchGrounding,
          thinkingLevel: settings.thinkingLevel !== 'DEFAULT' ? settings.thinkingLevel : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported by server response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let latestGroundingMetadata: any = null;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const dataStr = trimmedLine.replace('data: ', '');
            if (dataStr === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                accumulatedText += parsed.text;
              }
              if (parsed.groundingMetadata) {
                latestGroundingMetadata = parsed.groundingMetadata;
              }

              // Update state in real-time
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== targetConvId) return c;
                  const msgs = c.messages.map((m) => {
                    if (m.id === assistantPlaceholderId) {
                      return {
                        ...m,
                        content: accumulatedText,
                        groundingMetadata: latestGroundingMetadata || m.groundingMetadata,
                        isStreaming: true,
                      };
                    }
                    return m;
                  });
                  return { ...c, messages: msgs };
                })
              );
            } catch (jsonErr) {
              console.warn('Could not parse SSE JSON chunk:', dataStr, jsonErr);
            }
          }
        }
      }

      // Finalize assistant message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConvId) return c;
          const msgs = c.messages.map((m) => {
            if (m.id === assistantPlaceholderId) {
              return {
                ...m,
                content: accumulatedText,
                groundingMetadata: latestGroundingMetadata || m.groundingMetadata,
                isStreaming: false,
              };
            }
            return m;
          });
          return { ...c, messages: msgs };
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream generation was aborted by user.');
      } else {
        console.error('Chat error:', err);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== targetConvId) return c;
            const msgs = c.messages.map((m) => {
              if (m.id === assistantPlaceholderId) {
                return {
                  ...m,
                  isStreaming: false,
                  error: err.message || 'Failed to generate response.',
                };
              }
              return m;
            });
            return { ...c, messages: msgs };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate Response
  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    const messages = activeConversation.messages;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;

    const actualIdx = messages.length - 1 - lastUserIdx;
    const lastUserMsg = messages[actualIdx];

    // Remove any trailing assistant messages after the last user message
    const trimmedMessages = messages.slice(0, actualIdx);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, messages: trimmedMessages } : c
      )
    );

    handleSendMessage(lastUserMsg.content, lastUserMsg.attachments || []);
  };

  // Edit prompt
  const handleEditPrompt = (content: string) => {
    setInitialPrompt(content);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={(id) => setActiveId(id)}
        onNewConversation={() => handleNewConversation()}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onTogglePinConversation={handleTogglePinConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        isCollapsedDesktop={isCollapsedDesktop}
        onToggleCollapseDesktop={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
        onExportAll={() => exportConversationAsJSON(conversations, 'all-conversations-backup')}
        onClearAll={handleClearAllData}
      />

      {/* Main Chat Pane */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-neutral-950">
        {/* Top Header */}
        <Header
          conversation={activeConversation}
          currentPersona={currentPersona}
          onSelectPersona={handleSelectPersona}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)}
          isCollapsedDesktop={isCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsCollapsedDesktop(false)}
          onExportMarkdown={() => {
            if (activeConversation) {
              exportConversationAsMarkdown(
                activeConversation.title,
                activeConversation.messages.map((m) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: m.timestamp,
                }))
              );
            }
          }}
          onExportJSON={() => {
            if (activeConversation) {
              exportConversationAsJSON(
                activeConversation,
                `${activeConversation.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-chat`
              );
            }
          }}
          onClearMessages={handleClearMessages}
        />

        {/* Scrollable Messages Area */}
        <div
          ref={chatScrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <EmptyState
              currentPersona={currentPersona}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col py-4">
              {activeConversation.messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={index === activeConversation.messages.length - 1}
                  onRegenerate={
                    index === activeConversation.messages.length - 1 && message.role === 'assistant'
                      ? handleRegenerate
                      : undefined
                  }
                  onEditPrompt={message.role === 'user' ? handleEditPrompt : undefined}
                />
              ))}
              <div ref={messagesEndRef} className="h-6" />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
          <ChatInput
            onSendMessage={handleSendMessage}
            onStopStreaming={handleStopStreaming}
            isStreaming={isStreaming}
            enableSearchGrounding={
              activeConversation
                ? activeConversation.settings.enableSearchGrounding
                : globalSettings.enableSearchGrounding
            }
            onToggleSearchGrounding={handleToggleSearchGrounding}
            initialPrompt={initialPrompt}
            onClearInitialPrompt={() => setInitialPrompt('')}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={activeConversation?.settings || globalSettings}
        onSaveSettings={(newSettings) => {
          setGlobalSettings(newSettings);
          if (activeConversation) {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeConversation.id ? { ...c, settings: newSettings } : c
              )
            );
          }
        }}
        currentPersonaId={activeConversation?.personaId || currentPersonaId}
        onSelectPersona={handleSelectPersona}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}
