import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/student/FavoriteButton';
import { RegistrationButton } from '@/components/student/RegistrationButton';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
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

  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email ?? '');
  const { registeredEventIds, registerEvent, cancelEventRegistration } = useRegistrations(
    user?.email ?? ''
  );

  useEffect(() => {
    if (!params.id) {
      return;
    }
    setEvent(getEventById(params.id));
  }, [params.id]);

  const refreshEvent = () => {
    if (!params.id) {
      return;
    }
    setEvent(getEventById(params.id));
  };

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
        <LinearGradient colors={[Colors.dark, '#4C1D95']} style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Icon name="arrow-left" size={16} color={Colors.textOnDark} />
          </Pressable>
        </LinearGradient>
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.dark, '#4C1D95']} style={styles.banner}>
        <View style={styles.bannerTop}>
          <Pressable onPress={() => router.back()}>
            <Icon name="arrow-left" size={16} color={Colors.textOnDark} />
          </Pressable>
          <FavoriteButton
            isFavorited={favoriteEventIds.includes(event.id)}
            onPress={() => toggleFavorite(event.id)}
          />
        </View>
        <View style={styles.bannerBottom}>
          <CategoryChip category={event.category} size="sm" />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[Typography.sectionTitle, styles.title]}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Icon name="calendar" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="map-pin" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            {event.locationName}
            {event.locationAddress ? ` · ${event.locationAddress}` : ''}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="user" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{event.organizerName}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="users" size={16} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            {event.capacity
              ? `${event.registeredCount} / ${event.capacity} inscrits`
              : 'Illimité'}
          </Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.tagsRow}>
          {event.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
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
  banner: {
    height: 90,
    paddingTop: 36,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBottom: {
    paddingBottom: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  description: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagPill: {
    backgroundColor: Colors.purpleLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: Colors.purple,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderDefault,
    padding: Spacing.lg,
  },
});
