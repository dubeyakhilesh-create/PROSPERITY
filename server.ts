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
    model: 'gemini-3.7-flash',
  });
});

// SSE Streaming chat endpoint
app.post('/api/gemini/chat-stream', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      systemInstruction,
      temperature = 0.7,
      useSearchGrounding = false,
      thinkingLevel,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const ai = getGemini();

    // Set up Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Format Gemini contents payload
    // Filter out messages that are purely error messages or streaming stubs
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

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (typeof temperature === 'number') {
      config.temperature = Math.max(0, Math.min(2, temperature));
    }

    // Thinking configuration for Gemini 3 series
    if (thinkingLevel && (thinkingLevel === 'HIGH' || thinkingLevel === 'LOW' || thinkingLevel === 'MINIMAL')) {
      config.thinkingConfig = {
        thinkingLevel: thinkingLevel === 'HIGH' ? ThinkingLevel.HIGH : thinkingLevel === 'LOW' ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL,
      };
    }

    // Search grounding tools if enabled
    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.7-flash',
      contents,
      config,
    });

    for await (const chunk of responseStream) {
      const chunkText = chunk.text || '';
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata || null;

      const payload = JSON.stringify({
        text: chunkText,
        groundingMetadata,
      });

      res.write(`data: ${payload}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini Stream Error:', error);
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
      model: 'gemini-3.7-flash',
      contents: `Create a brief, clean 3-5 word title summarizing this user request. Return ONLY the title text without quotes or punctuation: "${prompt.slice(0, 300)}"`,
      config: {
        systemInstruction: 'You generate short 3 to 5 word topic titles for chat sessions.',
        temperature: 0.3,
      },
    });

    const title = response.text?.trim()?.replace(/^["']|["']$/g, '') || 'New Conversation';
    res.json({ title });
  } catch (error: any) {
    console.error('Title suggestion error:', error);
    res.json({ title: 'New Conversation' });
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
