export type Role = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  data: string; // Base64 data URL or text
  size: number;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  isStreaming?: boolean;
  error?: string;
  groundingMetadata?: GroundingMetadata;
  modelUsed?: string;
  thought?: string; // Reasoning trace from Gemini 3
  thinkingTimeMs?: number;
  generationDurationMs?: number;
  suggestedFollowUps?: string[];
}

export interface Persona {
  id: string;
  name: string;
  roleTitle: string;
  iconName: string;
  description: string;
  systemInstruction: string;
  temperature: number;
  starterPrompts: string[];
}

export type ThinkingLevelOption = 'DEFAULT' | 'HIGH' | 'LOW' | 'MINIMAL';
export type CapabilityMode = 'turbo' | 'reasoning' | 'web' | 'code';
export type ModelChoice = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite';

export interface ModelSettings {
  model?: ModelChoice;
  capabilityMode?: CapabilityMode;
  temperature: number;
  thinkingLevel: ThinkingLevelOption;
  enableSearchGrounding: boolean;
  customSystemInstruction?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  personaId: string;
  messages: Message[];
  settings: ModelSettings;
}
