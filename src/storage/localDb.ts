import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailySummary, Moment } from '../types/moment';

const MOMENTS_KEY = 'capevent_ai_moments';

export async function loadMoments(): Promise<Moment[]> {
  const raw = await AsyncStorage.getItem(MOMENTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Moment[];
  } catch {
    return [];
  }
}

export async function saveMoment(moment: Moment): Promise<void> {
  const moments = await loadMoments();
  const updated = [moment, ...moments].slice(0, 100);
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
