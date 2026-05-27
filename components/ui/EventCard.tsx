import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
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
    <Pressable style={styles.pressable} onPress={onPress} accessibilityRole="button">
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <CategoryChip category={event.category} size="sm" />
          <Pressable onPress={onToggleFavorite} accessibilityRole="button">
            <Icon
              name="heart"
              size={16}
              color={isFavorited ? Colors.purple : Colors.purpleMid}
              fill={isFavorited ? Colors.purple : 'none'}
            />
          </Pressable>
        </View>
        <Text variant="sectionTitle" color={Colors.textPrimary}>
          {event.title}
        </Text>
        <Text variant="caption" color={Colors.textSecondary}>
          {formatDateRange(event)} · {event.locationName}
        </Text>
        {badge ? <View style={styles.badge}>{badge}</View> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Radius.lg,
  },
  card: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    marginTop: Spacing.sm,
  },
});
