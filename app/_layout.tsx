import { Slot } from 'expo-router';

import { AIProvider } from '@/context/AIContext';
import { AuthProvider } from '@/context/AuthContext';
import { DatabaseProvider } from '@/context/DatabaseContext';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <AIProvider>
          <Slot />
        </AIProvider>
      </AuthProvider>
    </DatabaseProvider>
  );
}
