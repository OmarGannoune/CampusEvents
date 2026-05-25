import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Event } from '@/types';

import { Badge } from './Badge';
import { CategoryChip } from './CategoryChip';

type EventCardProps = {
  event: Event;
  isFavorited: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

function formatDateRange(event: Event): string {
  const start = new Date(event.startDateTime);
  const end = event.endDateTime ? new Date(event.endDateTime) : null;
  const date = start.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
  const startTime = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (!end) {
    return `${date} · ${startTime}`;
  }
  const endTime = end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${startTime}-${endTime}`;
}

export function EventCard({ event, isFavorited, onPress, onToggleFavorite }: EventCardProps) {
  const isPast = new Date(event.startDateTime).getTime() < Date.now();
  const badge = (() => {
    if (!event.capacity) {
      return null;
    }
    if (isPast) {
      return (
        <Badge
          label="Passé"
          backgroundColor={Colors.dangerLight}
          textColor={Colors.dangerDark}
        />
      );
    }
    if (event.registeredCount >= event.capacity) {
      return (
        <Badge
          label="Complet"
          backgroundColor={Colors.amberLight}
          textColor={Colors.amberDark}
        />
      );
    }
    return (
      <Badge
        label={`${event.registeredCount} / ${event.capacity} places`}
        backgroundColor={Colors.successLight}
        textColor={Colors.successDark}
      />
    );
  })();

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.topRow}>
        <CategoryChip category={event.category} size="sm" />
        <Pressable onPress={onToggleFavorite} accessibilityRole="button">
          <Text style={[styles.heart, isFavorited ? styles.heartActive : styles.heartInactive]}>
            {isFavorited ? '<3' : 'fav'}
          </Text>
        </Pressable>
      </View>
      <Text style={[Typography.sectionTitle, styles.title]}>{event.title}</Text>
      <Text style={styles.meta}>
        {formatDateRange(event)} · {event.locationName}
      </Text>
      {badge ? <View style={styles.badge}>{badge}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    marginTop: Spacing.sm,
  },
  heart: {
    fontSize: 11,
    fontWeight: '600',
  },
  heartActive: {
    color: Colors.purple,
  },
  heartInactive: {
    color: Colors.purpleMid,
  },
});
