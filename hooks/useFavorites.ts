import { useCallback, useEffect, useState } from 'react';

import type { Event } from '@/types';

import {
    addFavorite,
    getFavoriteEvents,
    getFavoritesForUser,
    removeFavorite,
} from '@/database/favorites';

type UseFavoritesResult = {
  favoriteEventIds: string[];
  favoriteEvents: Event[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  toggleFavorite: (eventId: string) => void;
};

export function useFavorites(userId: string): UseFavoritesResult {
  const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      setFavoriteEventIds(getFavoritesForUser(userId));
      setFavoriteEvents(getFavoriteEvents(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = (eventId: string) => {
    if (favoriteEventIds.includes(eventId)) {
      removeFavorite(eventId, userId);
    } else {
      addFavorite(eventId, userId);
    }
    load();
  };

  return {
    favoriteEventIds,
    favoriteEvents,
    isLoading,
    error,
    refresh: load,
    toggleFavorite,
  };
}
