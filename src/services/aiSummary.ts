import Constants from 'expo-constants';
import { Moment, DailySummary } from '../types/moment';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function getApiKey(): string {
  // Support both Expo public env vars (EXPO_PUBLIC_OPENAI_API_KEY) and
  // app.json extra config (expo.extra.openaiApiKey).
  const fromEnv = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  const fromExtra = Constants.expoConfig?.extra?.openaiApiKey as string | undefined;
  if (fromExtra && fromExtra.trim().length > 0) {
    return fromExtra.trim();
  }
  return '';
}

function buildPrompt(moments: Moment[], date: string): string {
  const momentLines = moments
    .map((m, i) => {
      const tagStr = m.tags.length > 0 ? ` [${m.tags.join(', ')}]` : '';
      const typeStr = m.type !== 'text' ? ` (${m.type})` : '';
      return `${i + 1}.${typeStr}${tagStr} ${m.content}`;
    })
    .join('\n');

  return (
    `You are an intelligent event-notes assistant. The user captured the following moments at an event on ${date}:\n\n` +
    `${momentLines}\n\n` +
    `Based on these moments, produce a concise JSON response with exactly three keys:\n` +
    `- "summaryText": a 2-3 sentence narrative summary of the day\n` +
    `- "keyMoments": an array of up to 3 strings, each a punchy highlight\n` +
    `- "actionableInsights": an array of up to 3 concrete follow-up actions\n\n` +
    `Reply with raw JSON only — no markdown fences, no extra text.`
  );
}

export async function generateAiDailySummary(
  moments: Moment[],
  date: string,
): Promise<Omit<DailySummary, 'date'> | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const prompt = buildPrompt(moments, date);

  let response: Response;
  try {
    response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });
  } catch {
    // Network error — fall back to local summary
    return null;
  }

  if (!response.ok) {
    return null;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return null;
  }

  try {
    const content = (data as { choices: { message: { content: string } }[] })
      .choices[0].message.content;
    const parsed = JSON.parse(content) as Partial<Omit<DailySummary, 'date'>>;

    const summaryText =
      typeof parsed.summaryText === 'string' && parsed.summaryText.trim().length > 0
        ? parsed.summaryText.trim()
        : null;

    if (!summaryText) {
      return null;
    }

    const keyMoments = Array.isArray(parsed.keyMoments)
      ? parsed.keyMoments.filter((k) => typeof k === 'string').slice(0, 3)
      : [];

    const actionableInsights = Array.isArray(parsed.actionableInsights)
      ? parsed.actionableInsights.filter((a) => typeof a === 'string').slice(0, 3)
      : [];

    return { summaryText, keyMoments, actionableInsights };
  } catch {
    return null;
  }
}
