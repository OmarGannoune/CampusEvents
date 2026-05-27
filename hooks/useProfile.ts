import { useCallback, useEffect, useState } from 'react';

import { readProfile, writeProfile } from '@/services/profile';
import type { StudentProfile } from '@/types';

type UseProfileResult = {
  profile: StudentProfile | null;
  isLoading: boolean;
  error: string | null;
  saveProfile: (next: StudentProfile) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stored = await readProfile();
      setProfile(stored);
    } catch {
      setError('Impossible de charger le profil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (next: StudentProfile) => {
    try {
      await writeProfile(next);
      setProfile(next);
    } catch {
      setError('Impossible de sauvegarder le profil.');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, isLoading, error, saveProfile, refresh };
}
