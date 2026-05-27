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
import { Spacing } from '@/constants/spacing';
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
    return (
      <Card style={[styles.row, isPast && styles.rowPast]}>
        <Pressable
          style={styles.rowLeft}
          onPress={() => router.push(`/(admin)/${item.id}`)}
          accessibilityRole="button">
          <CategoryChip category={item.category} size="sm" />
          <Text variant="sectionTitle" color={Colors.textPrimary}>
            {item.title}
          </Text>
          <Text variant="caption" color={Colors.textSecondary}>
            {new Date(item.startDateTime).toLocaleDateString('fr-FR')} · {item.locationName}
          </Text>
        </Pressable>
        <View style={styles.rowActions}>
          <Button
            label="Modifier"
            size="sm"
            variant="ghost"
            fullWidth={false}
            onPress={() => router.push(`/(admin)/edit/${item.id}`)}
          />
          <Button
            label="Supprimer"
            size="sm"
            variant="danger-ghost"
            fullWidth={false}
            onPress={() => {
              setSelected(item);
              setShowDelete(true);
            }}
          />
        </View>
      </Card>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  rowPast: {
    opacity: 0.5,
  },
  rowLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  rowActions: {
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  skeletonList: {
    gap: Spacing.md,
  },
});
