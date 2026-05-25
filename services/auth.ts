import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACCOUNTS = [
  { email: 'admin@campus.ma', password: 'admin123', role: 'admin' },
  { email: 'etudiant@campus.ma', password: 'etudiant123', role: 'student' },
] as const;

export type UserRole = 'admin' | 'student';
export type User = { email: string; role: UserRole };

const SESSION_KEY = 'campusevents_session';

export async function readSession(): Promise<User | null> {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export async function writeSession(user: User): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const match = ACCOUNTS.find(
    (account) => account.email === email && account.password === password
  );
  if (!match) {
    return null;
  }
  return { email: match.email, role: match.role };
}
