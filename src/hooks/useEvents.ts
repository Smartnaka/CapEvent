import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadEvents } from '@/src/storage/localDb';
import { EventRecord } from '@/src/types/event';

export function useEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadEvents();
      setEvents(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { events, isLoading, error, refresh };
}
