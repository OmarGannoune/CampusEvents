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

export function EventCard({ event, isFavorited, onPress, onToggleFavorite }: EventCardProps) {
  const isPast = new Date(event.startDateTime).getTime() < Date.now();
  const badge = (() => {
    if (!event.capacity) return null;
    if (isPast) {
      return (
        <Badge
          label="Passé"
          backgroundColor={Colors.surface}
          textColor={Colors.textSecondary}
        />
      );
    }
    if (event.registeredCount >= event.capacity) {
      return (
        <Badge
          label="Complet"
          backgroundColor={Colors.dangerLight}
          textColor={Colors.dangerDark}
        />
      );
    }
    return (
      <View style={styles.registrationCount}>
        <Text style={styles.registrationNumbers}>{event.registeredCount}/{event.capacity}</Text>
        <Text style={styles.registrationLabel}>inscrits</Text>
      </View>
    );
  })();

  const startDate = new Date(event.startDateTime);
  const month = startDate.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  const day = startDate.toLocaleDateString('fr-FR', { day: '2-digit' });

  const timeRange = (() => {
    const startTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (!event.endDateTime) return startTime;
    const endTime = new Date(event.endDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  })();

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button">
      <Card style={styles.card}>
        <View style={styles.topSection}>
          {/* Calendar Date Block */}
          <View style={[styles.dateBlock, isPast && styles.dateBlockPast]}>
            <Text style={[styles.monthText, isPast && styles.textPast]}>{month}</Text>
            <Text style={[styles.dayText, isPast && styles.textPast]}>{day}</Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentBlock}>
            <View style={styles.headerRow}>
              <CategoryChip category={event.category} size="sm" />
              <Pressable
                onPress={onToggleFavorite}
                accessibilityRole="button"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => pressed && styles.iconPressed}>
                <Icon
                  name="heart"
                  size={20}
                  color={isFavorited ? Colors.danger : Colors.textSecondary}
                  fill={isFavorited ? Colors.danger : 'none'}
                />
              </Pressable>
            </View>
            <Text variant="title" color={Colors.textPrimary} style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <Text variant="caption" color={Colors.textSecondary} style={styles.organizer} numberOfLines={1}>
              Par {event.organizerName}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <View style={styles.infoRow}>
              <Icon name="clock" size={14} color={Colors.textSecondary} />
              <Text variant="caption" color={Colors.textSecondary} style={styles.infoText} numberOfLines={1}>
                {timeRange}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="map-pin" size={14} color={Colors.textSecondary} />
              <Text variant="caption" color={Colors.textSecondary} style={styles.infoText} numberOfLines={1}>
                {event.locationName}
              </Text>
            </View>
          </View>
          {badge ? <View style={styles.badgeWrapper}>{badge}</View> : null}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Radius.xl,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  card: {
    padding: Spacing.md,
    gap: 0,
    borderWidth: 0,
  },
  topSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateBlock: {
    width: 54,
    height: 58,
    backgroundColor: Colors.purpleLight,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  dateBlockPast: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderDefault,
  },
  monthText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.purple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.dark,
    marginTop: -2,
  },
  textPast: {
    color: Colors.textSecondary,
  },
  contentBlock: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  title: {
    marginTop: Spacing.xs,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  organizer: {
    marginTop: 2,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
    marginVertical: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerInfo: {
    flex: 1,
    gap: 6,
    paddingRight: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  badgeWrapper: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  registrationCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  registrationNumbers: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  registrationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 3,
  },
});
