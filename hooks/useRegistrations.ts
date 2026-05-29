import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Registration } from '@/types';

import {
    cancelRegistration,
    getRegisteredEventIds,
    getRegistrationsForUser,
    register,
} from '@/database/registrations';

type UseRegistrationsResult = {
  registrations: Registration[];
  registeredEventIds: string[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  registerEvent: (eventId: string) => void;
  cancelEventRegistration: (eventId: string) => void;
};

export function useRegistrations(userId: string): UseRegistrationsResult {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      setRegistrations(getRegistrationsForUser(userId));
      setRegisteredEventIds(getRegisteredEventIds(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const registerEvent = (eventId: string) => {
    register(eventId, userId);
    load();
  };

  const cancelEventRegistration = (eventId: string) => {
    cancelRegistration(eventId, userId);
    load();
  };

  return {
    registrations,
    registeredEventIds,
    isLoading,
    error,
    refresh: load,
    registerEvent,
    cancelEventRegistration,
  };
}
