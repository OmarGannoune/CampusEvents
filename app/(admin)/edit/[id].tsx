import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventForm } from '@/components/admin/EventForm';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getEventById, updateEvent } from '@/database/events';
import type { Event } from '@/types';

export default function AdminEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { logout } = useAuth();
  const event = useMemo(() => (params.id ? getEventById(params.id) : null), [params.id]);

  if (!event) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Modifier l'événement"
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
      </View>
    );
  }

  const handleSubmit = (values: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>) => {
    updateEvent(event.id, values);
    Alert.alert('Succès', 'Modifications enregistrées.');
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Modifier l'événement"
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
      <EventForm
        submitLabel="Enregistrer les modifications"
        initialValues={event}
        onSubmit={handleSubmit}
      />
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
