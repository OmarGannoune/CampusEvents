import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventForm } from '@/components/admin/EventForm';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { createEvent } from '@/database/events';
import type { Event } from '@/types';

export default function AdminCreateScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSubmit = (values: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>) => {
    createEvent(values);
    Alert.alert('Succès', "L'événement a été créé.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Créer un événement"
        showBack
        onBack={() => router.back()}
        rightElement={
          <Pressable
            onPress={async () => {
              await logout();
              router.replace('/auth/login');
            }}>
            <Text style={styles.logoutIcon}>logout</Text>
          </Pressable>
        }
      />
      <EventForm submitLabel="Créer l'événement" onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  logoutIcon: {
    color: Colors.textOnDarkMuted,
    fontSize: 11,
  },
});
