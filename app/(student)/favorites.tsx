import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EventCard } from '@/components/ui/EventCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import type { Event } from '@/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { favoriteEvents, favoriteEventIds, isLoading, error, refresh, toggleFavorite } =
    useFavorites(user?.email ?? '');

  const renderItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      isFavorited={favoriteEventIds.includes(item.id)}
      onPress={() => router.push(`/(student)/events/${item.id}`)}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mes favoris" subtitle={`${favoriteEvents.length} favoris`} />
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((key) => (
              <SkeletonCard key={key} />
            ))}
          </View>
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : favoriteEvents.length === 0 ? (
          <EmptyState
            icon="heart"
            title="Pas encore de favoris. Explorez le catalogue !"
          />
        ) : (
          <FlatList
            data={favoriteEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
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
  skeletonList: {
    gap: Spacing.md,
  },
});
