import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { deleteEvent } from '@/database/events';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/types';

export default function AdminEventListScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { events, isLoading, error, refresh } = useEvents();
  const [selected, setSelected] = useState<Event | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  const subtitle = useMemo(() => `${events.length} événements`, [events.length]);

  const handleConfirmDelete = () => {
    if (!selected) {
      return;
    }
    deleteEvent(selected.id);
    setShowDelete(false);
    setSelected(null);
    refresh();
  };

  const renderItem = ({ item }: { item: Event }) => {
    const isPast = new Date(item.startDateTime).getTime() < Date.now();
    const startDate = new Date(item.startDateTime);
    const month = startDate.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
    const day = startDate.toLocaleDateString('fr-FR', { day: '2-digit' });

    const timeRange = (() => {
      const startTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      if (!item.endDateTime) return startTime;
      const endTime = new Date(item.endDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return `${startTime} - ${endTime}`;
    })();

    return (
      <Pressable
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed, isPast && styles.pressablePast]}
        onPress={() => router.push(`/(admin)/${item.id}`)}
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
                <CategoryChip category={item.category} size="sm" />
              </View>
              <Text variant="title" color={Colors.textPrimary} style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text variant="caption" color={Colors.textSecondary} style={styles.location} numberOfLines={1}>
                {item.locationName}
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
                <Icon name="users" size={14} color={Colors.textSecondary} />
                <Text variant="caption" color={Colors.textSecondary} style={styles.infoText} numberOfLines={1}>
                  {item.registeredCount}/{item.capacity} inscrits
                </Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              <Button
                label="Modifier"
                size="sm"
                variant="ghost"
                fullWidth={false}
                onPress={() => router.push(`/(admin)/edit/${item.id}`)}
              />
              <Pressable
                onPress={() => {
                  setSelected(item);
                  setShowDelete(true);
                }}
                style={styles.deleteBtn}>
                <Icon name="trash" size={18} color={Colors.danger} />
              </Pressable>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="CampusEvents"
        logo
        subtitle={subtitle}
        rightElement={
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push('/(admin)/create')}>
              <Icon name="plus" size={18} color={Colors.textOnDark} />
            </Pressable>
            <Pressable
              onPress={async () => {
                await logout();
                router.replace('/auth/login');
              }}>
              <Icon name="logout" size={16} color={Colors.textOnDarkMuted} />
            </Pressable>
          </View>
        }
      />
      <View style={styles.content}>
        <Button
          label="Creer un evenement"
          size="lg"
          iconLeft="plus"
          onPress={() => router.push('/(admin)/create')}
        />
        {isLoading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((key) => (
              <SkeletonCard key={key} />
            ))}
          </View>
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : events.length === 0 ? (
          <EmptyState icon="calendar" title="Aucun événement. Créez-en un." />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      <DeleteConfirmModal
        visible={showDelete}
        title={selected?.title ?? ''}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  skeletonList: {
    gap: Spacing.md,
  },
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
  pressablePast: {
    opacity: 0.6,
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
  title: {
    marginTop: Spacing.xs,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  location: {
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  deleteBtn: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerLight,
  },
});
