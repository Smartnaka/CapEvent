import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadMoments, saveMoment } from '@/src/storage/localDb';
import { Moment } from '@/src/types/moment';

interface UseMomentsOptions {
  filterToday?: boolean;
  limit?: number;
}

export function useMoments({ filterToday = false, limit }: UseMomentsOptions = {}) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result = await loadMoments();
      if (filterToday) {
        const today = new Date().toISOString().slice(0, 10);
        result = result.filter((m) => m.createdAt.slice(0, 10) === today);
      }
      if (limit !== undefined) {
        result = result.slice(0, limit);
      }
      setMoments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load moments.');
    } finally {
      setIsLoading(false);
    }
  }, [filterToday, limit]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const addMoment = useCallback(
    async (moment: Omit<Moment, 'id'>) => {
      await saveMoment(moment);
      await refresh();
    },
    [refresh],
  );

  return { moments, isLoading, error, refresh, addMoment };
}
