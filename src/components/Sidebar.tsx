import React, { useState, useMemo } from 'react';
import { Conversation } from '../types';
import { PERSONAS } from '../lib/constants';
import {
  Plus,
  MessageSquare,
  Search,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePinConversation: (id: string) => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  onExportAll: () => void;
  onClearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onTogglePinConversation,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  onExportAll,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.messages.some((m) => m.content.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);

  // Grouping logic
  const grouped = useMemo(() => {
    const pinned: Conversation[] = [];
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const lastWeek: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 6 * 86400000;

    filteredConversations.forEach((conv) => {
      if (conv.pinned) {
        pinned.push(conv);
        return;
      }
      const time = conv.updatedAt || conv.createdAt;
      if (time >= todayStart) {
        today.push(conv);
      } else if (time >= yesterdayStart) {
        yesterday.push(conv);
      } else if (time >= weekStart) {
        lastWeek.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { pinned, today, yesterday, lastWeek, older };
  }, [filteredConversations]);

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const renderConversationItem = (conv: Conversation) => {
    const isActive = conv.id === activeConversationId;
    const isEditing = conv.id === editingId;
    const persona = PERSONAS.find((p) => p.id === conv.personaId);

    return (
      <div
        key={conv.id}
        onClick={() => {
          onSelectConversation(conv.id);
          onCloseMobile();
        }}
        className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all ${
          isActive
            ? 'bg-neutral-800/90 text-white font-medium shadow-sm ring-1 ring-neutral-700'
            : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MessageSquare
            className={`h-3.5 w-3.5 flex-shrink-0 ${
              isActive ? 'text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-400'
            }`}
          />

          {isEditing ? (
            <form
              onSubmit={(e) => saveEditing(conv.id, e)}
              className="flex flex-1 items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="w-full rounded bg-neutral-900 px-1.5 py-0.5 text-xs text-neutral-100 outline-none ring-1 ring-indigo-500"
              />
              <button
                type="submit"
                className="rounded p-0.5 text-emerald-400 hover:bg-neutral-700"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="rounded p-0.5 text-neutral-400 hover:bg-neutral-700"
              >
                <X className="h-3 w-3" />
              </button>
            </form>
          ) : (
            <div className="min-w-0 flex-1">
              <p className="truncate">{conv.title}</p>
            </div>
          )}
        </div>

        {/* Action icons on hover */}
        {!isEditing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePinConversation(conv.id);
              }}
              className={`rounded p-1 transition-colors hover:bg-neutral-700 ${
                conv.pinned ? 'text-amber-400 opacity-100' : 'text-neutral-400 hover:text-amber-400'
              }`}
              title={conv.pinned ? 'Unpin' : 'Pin conversation'}
            >
              <Pin className="h-3 w-3" />
            </button>

            <button
              onClick={(e) => startEditing(conv, e)}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
              title="Rename"
            >
              <Edit2 className="h-3 w-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-700 hover:text-rose-400"
              title="Delete conversation"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, list: Conversation[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </h3>
        <div className="space-y-0.5">{list.map(renderConversationItem)}</div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-neutral-950 border-r border-neutral-800/80 text-neutral-200">
      {/* Top Header */}
      <div className="p-3">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-wider text-neutral-100 text-sm">
              PROSPERITY
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapseDesktop}
              className="hidden lg:flex rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
            <button
              onClick={onCloseMobile}
              className="flex lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          id="new-chat-btn"
          onClick={() => {
            onNewConversation();
            onCloseMobile();
          }}
          className="flex w-full items-center justify-between rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-98"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </div>
          <span className="rounded bg-indigo-700/60 px-1.5 py-0.5 text-[10px] font-mono text-indigo-200">
            Ctrl+K
          </span>
        </button>

        {/* Search Bar */}
        {conversations.length > 2 && (
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Conversation List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filteredConversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-neutral-500">
            {searchQuery ? 'No chats found' : 'No conversation history'}
          </div>
        ) : (
          <>
            {renderSection('Pinned', grouped.pinned)}
            {renderSection('Today', grouped.today)}
            {renderSection('Yesterday', grouped.yesterday)}
            {renderSection('Previous 7 Days', grouped.lastWeek)}
            {renderSection('Older', grouped.older)}
          </>
        )}
      </div>

      {/* Bottom Settings & Options */}
      <div className="border-t border-neutral-800/80 p-3 space-y-1">
        <button
          id="sidebar-settings-btn"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800/70 hover:text-neutral-100"
        >
          <Settings className="h-4 w-4 text-neutral-400" />
          <span>Model Settings & Personas</span>
        </button>

        <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 px-2">
          <span>{conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}</span>
          <button
            onClick={onExportAll}
            className="hover:text-indigo-400 transition-colors"
            title="Export all chat logs"
          >
            Export All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      {!isCollapsedDesktop && (
        <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col h-screen">
          {sidebarContent}
        </aside>
      )}
    </>
  );
};
