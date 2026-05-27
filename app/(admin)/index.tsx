import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
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
      <View style={[styles.row, isPast && styles.rowPast]}>
        <View style={styles.rowLeft}>
          <CategoryChip category={item.category} size="sm" />
          <Text style={[Typography.sectionTitle, styles.rowTitle]}>{item.title}</Text>
          <Text style={styles.rowMeta}>
            {new Date(item.startDateTime).toLocaleDateString('fr-FR')} · {item.locationName}
          </Text>
        </View>
        <View style={styles.rowActions}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/(admin)/edit/${item.id}`)}>
            <Text style={styles.editText}>Modifier</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              setSelected(item);
              setShowDelete(true);
            }}>
            <Text style={styles.deleteText}>Supprimer</Text>
          </Pressable>
        </View>
      </View>
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
  },
  list: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    padding: Spacing.lg,
  },
  rowPast: {
    opacity: 0.5,
  },
  rowLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  rowTitle: {
    color: Colors.textPrimary,
  },
  rowMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowActions: {
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  actionButton: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  editButton: {
    backgroundColor: Colors.purpleLight,
  },
  editText: {
    color: Colors.purple,
    fontSize: 11,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: Colors.dangerLight,
  },
  deleteText: {
    color: Colors.dangerDark,
    fontSize: 11,
    fontWeight: '500',
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
