import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailySummary, Moment } from '../types/moment';
import { isValidMoment, MAX_CONTENT_LENGTH, MAX_TAGS_PER_MOMENT } from '../utils/validation';
import { generateAiDailySummary } from '../services/aiSummary';

const MOMENTS_KEY = 'capevent_ai_moments';

/**
 * Generates a collision-resistant unique identifier.
 * Uses the Web Crypto API (available in React Native ≥ 0.73 / Hermes).
 * Falls back to a high-entropy composite when the API is unavailable.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // crypto.getRandomValues is available in more environments than randomUUID
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      // Format as a UUID v4 string
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return [...bytes]
        .map((b, i) =>
          [4, 6, 8, 10].includes(i) ? `-${b.toString(16).padStart(2, '0')}` : b.toString(16).padStart(2, '0'),
        )
        .join('');
    }
  }
  // Last-resort fallback: timestamp + two independent Math.random values
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2).padEnd(8, '0')}-${Math.random().toString(36).slice(2).padEnd(8, '0')}`;
}

export { generateId };

export async function loadMoments(): Promise<Moment[]> {
  const raw = await AsyncStorage.getItem(MOMENTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any entries that fail structural validation so corrupted
    // or tampered storage entries do not crash the application.
    return parsed.filter(isValidMoment);
  } catch {
    return [];
  }
}

export async function saveMoment(moment: Omit<Moment, 'id'>): Promise<void> {
  // Generate a secure ID and enforce content/tag limits as defence-in-depth.
  const sanitised: Moment = {
    ...moment,
    id: generateId(),
    content: moment.content.slice(0, MAX_CONTENT_LENGTH),
    tags: moment.tags.slice(0, MAX_TAGS_PER_MOMENT),
  };

  const moments = await loadMoments();
  const updated = [sanitised, ...moments].slice(0, 100);
  await AsyncStorage.setItem(MOMENTS_KEY, JSON.stringify(updated));
}

export async function buildDailySummary(): Promise<DailySummary> {
  const moments = await loadMoments();
  const today = new Date().toISOString().slice(0, 10);

  if (moments.length === 0) {
    return {
      date: today,
      summaryText:
        'No moments logged yet today. Capture text, voice, or photos to generate your AI recap.',
      keyMoments: ['No key moments yet'],
      actionableInsights: ['Capture your first event moment to unlock recommendations.'],
    };
  }

  // Attempt to generate a real AI summary; fall back to local if unavailable.
  const aiResult = await generateAiDailySummary(moments, today);
  if (aiResult) {
    return { date: today, ...aiResult };
  }

  const tagCounts = moments.reduce<Record<string, number>>((acc, moment) => {
    moment.tags.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  return {
    date: today,
    summaryText: `You logged ${moments.length} moments today. Themes: ${
      topTags.length > 0 ? topTags.join(', ') : 'general event notes'
    }.`,
    keyMoments: moments.slice(0, 3).map((moment) => moment.content),
    actionableInsights: [
      'Follow up with contacts mentioned in your latest moments.',
      'Review recurring tags to identify top sessions and speakers.',
    ],
  };
}
