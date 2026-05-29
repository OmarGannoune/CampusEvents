import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FavoriteButton } from '@/components/student/FavoriteButton';
import { RegistrationButton } from '@/components/student/RegistrationButton';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Divider } from '@/components/ui/Divider';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TagPill } from '@/components/ui/TagPill';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { getEventById } from '@/database/events';
import { useFavorites } from '@/hooks/useFavorites';
import { useRegistrations } from '@/hooks/useRegistrations';
import type { Event } from '@/types';

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const insets = useSafeAreaInsets();

  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email ?? '');
  const { registeredEventIds, registerEvent, cancelEventRegistration } = useRegistrations(
    user?.email ?? ''
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setEvent(getEventById(params.id));
  }, [params.id]);

  const refreshEvent = useCallback(() => {
    if (!params.id) {
      return;
    }
    setEvent(getEventById(params.id));
  }, [params.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshEvent();
    setTimeout(() => setRefreshing(false), 800);
  }, [refreshEvent]);

  const isRegistered = event ? registeredEventIds.includes(event.id) : false;

  const registrationStatus = useMemo(() => {
    if (!event) {
      return 'default' as const;
    }
    const isPast = new Date(event.startDateTime).getTime() < Date.now();
    if (isPast) {
      return 'past' as const;
    }
    if (event.capacity && event.registeredCount >= event.capacity && !isRegistered) {
      return 'full' as const;
    }
    if (isRegistered) {
      return 'registered' as const;
    }
    return 'default' as const;
  }, [event, isRegistered]);

  if (!event) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Événement" showBack onBack={() => router.back()} />
      </View>
    );
  }

  const formattedDate = (() => {
    const start = new Date(event.startDateTime);
    const end = event.endDateTime ? new Date(event.endDateTime) : null;
    const date = start.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const startTime = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (!end) {
      return `${date} · ${startTime}`;
    }
    const endTime = end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${startTime} - ${endTime}`;
  })();

  const bottomBarOffset = Math.max(insets.bottom, Spacing.md) + 70; // 70px to clear the floating tab bar

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Détails"
        showBack
        onBack={() => router.back()}
        rightElement={
          <FavoriteButton
            isFavorited={favoriteEventIds.includes(event.id)}
            onPress={() => toggleFavorite(event.id)}
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.purple]}
            tintColor={Colors.purple}
          />
        }>
        <View style={styles.categoryWrapper}>
          <CategoryChip category={event.category} size="sm" />
        </View>
        <Text variant="sectionTitle" color={Colors.textPrimary}>
          {event.title}
        </Text>
        <View style={styles.metaRow}>
          <Icon name="calendar" size={16} color={Colors.textSecondary} />
          <Text variant="caption" color={Colors.textSecondary}>
            {formattedDate}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="map-pin" size={16} color={Colors.textSecondary} />
          <Text variant="caption" color={Colors.textSecondary}>
            {event.locationName}
            {event.locationAddress ? ` · ${event.locationAddress}` : ''}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="user" size={16} color={Colors.textSecondary} />
          <Text variant="caption" color={Colors.textSecondary}>
            {event.organizerName}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="users" size={16} color={Colors.textSecondary} />
          <Text variant="caption" color={Colors.textSecondary}>
            {event.capacity
              ? `${event.registeredCount} / ${event.capacity} inscrits`
              : 'Illimité'}
          </Text>
        </View>
        <Divider />
        <Text variant="body" color={Colors.textPrimary} style={styles.description}>
          {event.description}
        </Text>
        <View style={styles.tagsRow}>
          {event.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { bottom: bottomBarOffset }]}>
        <RegistrationButton
          status={registrationStatus}
          onRegister={() => {
            registerEvent(event.id);
            refreshEvent();
          }}
          onCancel={() => {
            cancelEventRegistration(event.id);
            refreshEvent();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  categoryWrapper: {
    alignSelf: 'flex-start',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 220, // Increased to clear both floating action bars
    gap: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  description: {
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
});
