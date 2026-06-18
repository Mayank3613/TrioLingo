const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.0-flash';
const STORAGE_KEY = 'triolingo-ai-key';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AITutorConfig {
  topicId: string;
  topicTitle: string;
  jlptLevel: string;
  userName: string;
}

// ---------------------------------------------------------------------------
// API Key helpers
// ---------------------------------------------------------------------------

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return key !== null && key.trim().length > 0;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

export function buildSystemPrompt(config: AITutorConfig): string {
  return [
    `You are Sensei (先生), a friendly and encouraging Japanese language tutor.`,
    `The student's name is ${config.userName}.`,
    `The current topic is "${config.topicTitle}".`,
    `Adjust the difficulty to ${config.jlptLevel} level.`,
    `Always include Japanese text with readings in parentheses — for example: 食べる(たべる).`,
    `Provide English translations for all Japanese words and phrases.`,
    `Be encouraging and use emojis occasionally to keep the mood light 🌸.`,
    `Keep responses concise — 2-4 sentences max.`,
    `If the student makes a mistake, gently correct them and explain why.`,
    `Ask follow-up questions to keep the conversation going and encourage practice.`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Core messaging
// ---------------------------------------------------------------------------

export async function sendMessage(
  history: ChatMessage[],
  userMessage: string,
  config: AITutorConfig,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API key not set. Please add your Gemini API key in Settings.');
  }

  const systemPrompt = buildSystemPrompt(config);

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      ...history,
      { role: 'user' as const, parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 512,
    },
  };

  let response: Response;

  try {
    response = await fetch(
      `${BASE_URL}/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
  } catch {
    throw new Error('Network error. Please check your internet connection.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    throw new Error(`AI service error: ${response.status}`);
  }

  const data = await response.json();

  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('AI service error: received an empty response.');
  }

  return text;
}

// ---------------------------------------------------------------------------
// Key validation
// ---------------------------------------------------------------------------

export async function testApiKey(key: string): Promise<boolean> {
  const body = {
    contents: [{ role: 'user' as const, parts: [{ text: 'Say hello in Japanese' }] }],
  };

  try {
    const response = await fetch(
      `${BASE_URL}/models/${MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    return response.ok;
  } catch {
    return false;
  }
}
