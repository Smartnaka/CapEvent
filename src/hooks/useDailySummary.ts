import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { buildDailySummary } from '@/src/storage/localDb';
import { DailySummary } from '@/src/types/moment';

export function useDailySummary() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await buildDailySummary();
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { summary, isLoading, error, refresh };
}
