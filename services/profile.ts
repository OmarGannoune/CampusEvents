import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StudentProfile } from '@/types';

const PROFILE_KEY = 'campusevents_profile';

export async function readProfile(): Promise<StudentProfile | null> {
  const stored = await AsyncStorage.getItem(PROFILE_KEY);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored) as StudentProfile;
  } catch {
    return null;
  }
}

export async function writeProfile(profile: StudentProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
