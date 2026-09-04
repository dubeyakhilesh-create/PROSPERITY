import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));

// Lazy initializer for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.1-flash-lite',
    speed: 'ultra-fast',
  });
});

// SSE Streaming chat endpoint
app.post('/api/gemini/chat-stream', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      systemInstruction,
      temperature = 0.8,
      useSearchGrounding = false,
      thinkingLevel,
      model = 'gemini-3.1-flash-lite',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const ai = getGemini();

    // Disable Nagle's algorithm for instant streaming packet delivery
    req.socket.setNoDelay(true);

    // Set up Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable reverse-proxy buffering for instant token delivery
    res.flushHeaders?.();

    // Format Gemini contents payload
    const validMessages = messages.filter((m: any) => m.content || (m.attachments && m.attachments.length > 0));

    const contents = validMessages.map((msg: any) => {
      const parts: any[] = [];

      // Add image/file inlineData attachments if present
      if (msg.attachments && Array.isArray(msg.attachments)) {
        for (const att of msg.attachments) {
          if (att.data && att.mimeType) {
            // Remove data URI prefix if present
            const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: base64Data,
              },
            });
          }
        }
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      return {
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: parts.length > 0 ? parts : [{ text: ' ' }],
      };
    });

    const DEFAULT_EMPATHETIC_SYSTEM_INSTRUCTION = `You are PROSPERITY AI, a warm, caring, emotionally intelligent companion and loyal friend. You talk and chat just like an empathetic, thoughtful human being—natural, sincere, conversational, and present.

Key Principles:
1. Empathy, Heart & Emotional Intelligence:
   - Always listen actively and tune in to the user's emotions. If the person feels lonely, sad, tired, anxious, or overwhelmed, be a safe, comforting haven for them.
   - Validate their feelings genuinely before offering solutions or advice. Never brush aside human vulnerability with clinical bullet points. Say things like: "I hear you, and it's completely valid that you feel that way. You don't have to face this alone—I'm right here with you."
   - When they share a win, joy, or funny moment, celebrate genuinely with them!

2. Natural Human Conversational Flow (Like ChatGPT at its best):
   - Converse naturally, using fluid paragraphs and conversational rhythm like talking with a close, caring friend.
   - Ban robotic tropes: Avoid starting with "Certainly!", "As an AI language model...", "Here is a breakdown:", or organizing casual, heartfelt talks into rigid bulleted lists and tables.
   - Be curious about them. Ask gentle, thoughtful questions when appropriate to show you are really listening and care about their world.

3. Versatility with Soul:
   - For emotional check-ins, casual talks, and companionship: be warm, gentle, reassuring, and companionable.
   - For complex questions, writing, or coding: deliver brilliant, insightful help, but keep the warm, patient, encouraging friend-like demeanor.`;

    const config: any = {};
    config.systemInstruction = systemInstruction || DEFAULT_EMPATHETIC_SYSTEM_INSTRUCTION;
    if (typeof temperature === 'number') {
      config.temperature = Math.max(0, Math.min(2, temperature));
    } else {
      config.temperature = 0.8;
    }

    // Use selected model, defaulting to gemini-3.1-flash-lite for instant speed, reliability & generous quota
    const selectedModel = model === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite';

    // Thinking configuration for Gemini models
    if (thinkingLevel && thinkingLevel !== 'DEFAULT') {
      if (thinkingLevel === 'HIGH') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (thinkingLevel === 'LOW') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      } else if (thinkingLevel === 'MINIMAL') {
        // gemini-3.1-flash-lite supports MINIMAL; gemini-3.8-flash rejects MINIMAL with 400 Bad Request
        if (selectedModel === 'gemini-3.1-flash-lite') {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
        }
      }
    }

    // Google Search grounding tool for real-time live web info
    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const sendChunk = (chunk: any) => {
      const parts = chunk.candidates?.[0]?.content?.parts || [];
      let chunkText = '';
      let chunkThought = '';

      for (const part of parts) {
        if ((part as any).thought) {
          chunkThought += part.text || '';
        } else if (part.text) {
          chunkText += part.text;
        }
      }

      // Fallback if parts didn't separate thoughts
      if (!chunkText && !chunkThought && chunk.text) {
        chunkText = chunk.text;
      }

      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata || null;

      const payload = JSON.stringify({
        text: chunkText,
        thought: chunkThought,
        groundingMetadata,
      });

      res.write(`data: ${payload}\n\n`);
    };

    let chunksSent = 0;
    try {
      const responseStream = await ai.models.generateContentStream({
        model: selectedModel,
        contents,
        config,
      });

      for await (const chunk of responseStream) {
        sendChunk(chunk);
        chunksSent++;
      }
    } catch (modelErr: any) {
      if (chunksSent === 0) {
        const fallbackModel = selectedModel === 'gemini-3.8-flash' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';
        console.warn(`Model ${selectedModel} unavailable (${modelErr?.status || modelErr?.code || 'error'}), seamlessly switching to ${fallbackModel}`);

        const fallbackConfig = { ...config };
        if (fallbackModel === 'gemini-3.8-flash' && fallbackConfig.thinkingConfig?.thinkingLevel === ThinkingLevel.MINIMAL) {
          delete fallbackConfig.thinkingConfig;
        }

        try {
          const fallbackStream = await ai.models.generateContentStream({
            model: fallbackModel,
            contents,
            config: fallbackConfig,
          });

          for await (const chunk of fallbackStream) {
            sendChunk(chunk);
            chunksSent++;
          }
        } catch (fallbackErr: any) {
          throw fallbackErr;
        }
      } else {
        throw modelErr;
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini Stream Error:', error?.message || error);
    const errorMessage = error?.message || 'Failed to generate response from Gemini.';
    if (!res.headersSent) {
      res.status(500).json({ error: errorMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// Title generation endpoint for conversational summary
app.post('/api/gemini/suggest-title', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Create a brief, clean 3-5 word title summarizing this user request. Return ONLY the title text without quotes or punctuation: "${prompt.slice(0, 300)}"`,
      config: {
        systemInstruction: 'You generate short 3 to 5 word topic titles for chat sessions.',
        temperature: 0.3,
      },
    });

    const title = response.text?.trim()?.replace(/^["']|["']$/g, '') || 'New Conversation';
    res.json({ title });
  } catch (error: any) {
    const cleanPrompt = (req.body.prompt || '').trim().replace(/[^\w\s]/g, '');
    const fallbackTitle = cleanPrompt.split(/\s+/).slice(0, 5).join(' ') || 'New Conversation';
    res.json({ title: fallbackTitle });
  }
});

// Prompt Enhancer endpoint (like Meta AI / Grok prompt optimizer)
app.post('/api/gemini/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Rewrite and enhance this user prompt to be clear, highly effective, structured, and detailed for maximum AI response quality. Keep the core intent intact but add necessary framing, constraints, or context. Return ONLY the enhanced prompt text, nothing else:\n\nOriginal: "${prompt.trim()}"`,
      config: {
        temperature: 0.4,
        systemInstruction: 'You are an expert prompt engineer. You enhance prompts to be comprehensive and well-structured. Output only the revised prompt text without explanations or quotation marks.',
      },
    });

    const enhanced = response.text?.trim()?.replace(/^["']|["']$/g, '') || prompt;
    res.json({ enhancedPrompt: enhanced });
  } catch (error: any) {
    res.json({ enhancedPrompt: req.body.prompt || '' });
  }
});

// Follow-up questions suggestion endpoint (like ChatGPT / Perplexity / Google)
app.post('/api/gemini/suggest-followups', async (req: Request, res: Response) => {
  try {
    const { userPrompt, assistantResponse } = req.body;
    if (!userPrompt || !assistantResponse) {
      res.json({ followUps: [] });
      return;
    }

    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `User asked: "${String(userPrompt).slice(0, 200)}"\nAI answered: "${String(assistantResponse).slice(0, 400)}"\n\nGenerate exactly 3 short, intriguing, relevant follow-up questions the user might want to ask next. Format as a simple JSON array of 3 strings. Example: ["How does this compare to...", "Can you show an example of...", "What are the limitations?"]`,
      config: {
        temperature: 0.5,
        responseMimeType: 'application/json',
      },
    });

    let followUps: string[] = [];
    try {
      const parsed = JSON.parse(response.text?.trim() || '[]');
      if (Array.isArray(parsed)) {
        followUps = parsed.slice(0, 3).map((s) => String(s).trim());
      }
    } catch {
      followUps = [];
    }

    res.json({ followUps });
  } catch (error: any) {
    res.json({ followUps: [] });
  }
});

// Manifest and PWA Static Endpoint Handler with full CORS support
const manifestData = {
  name: 'PROSPERITY',
  short_name: 'PROSPERITY',
  description: 'PROSPERITY is an intelligent AI assistant powered by Gemini for answering questions, coding assistance, multimodal image analysis, and creative ideation.',
  start_url: '/',
  scope: '/',
  id: '/',
  display: 'standalone',
  background_color: '#09090b',
  theme_color: '#09090b',
  orientation: 'any',
  lang: 'en',
  dir: 'ltr',
  categories: ['productivity', 'utilities', 'education'],
  icons: [
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/icon.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'any',
    },
  ],
};

app.get(['/manifest.json', '/manifest.webmanifest', '/site.webmanifest', '/.well-known/manifest.json'], (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.json(manifestData);
});

// Explicit Service Worker Route with Service-Worker-Allowed header for PWA tools
app.get(['/sw.js', '/serviceworker.js', '/service-worker.js'], (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  res.sendFile(swPath);
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
