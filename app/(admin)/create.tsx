import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { EventForm } from '@/components/admin/EventForm';
import { Icon } from '@/components/ui/Icon';
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
            <Icon name="logout" size={16} color={Colors.textOnDarkMuted} />
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
});
