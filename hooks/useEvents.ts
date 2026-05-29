import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Event } from '@/types';

import { getAllEvents } from '@/database/events';

type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      setEvents(getAllEvents());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { events, isLoading, error, refresh: load };
}
