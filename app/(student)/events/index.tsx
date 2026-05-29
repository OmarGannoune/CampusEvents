import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { FilterChips } from '@/components/student/FilterChips';
import { ProfileButton } from '@/components/student/ProfileButton';
import { SearchBar } from '@/components/student/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EventCard } from '@/components/ui/EventCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useFavorites } from '@/hooks/useFavorites';
import type { Event, EventCategory } from '@/types';

export default function EventsCatalogueScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events, isLoading, error, refresh } = useEvents();
  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email ?? '');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [period, setPeriod] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 800);
  }, [refresh]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const base = events.filter((event) => {
      const isPast = new Date(event.startDateTime).getTime() < now;
      return period === 'past' ? isPast : !isPast;
    });

    return base
      .filter((event) => {
        if (selectedCategory === 'all') {
          return true;
        }
        return event.category === selectedCategory;
      })
      .filter((event) => {
        if (!debouncedQuery) {
          return true;
        }
        return event.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      })
      .sort((a, b) => {
        const diff = new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
        return period === 'past' ? -diff : diff;
      });
  }, [events, selectedCategory, debouncedQuery, period]);

  const subtitle =
    period === 'past'
      ? `${filteredEvents.length} événements passés`
      : `${filteredEvents.length} événements à venir`;

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
      <ScreenHeader
        title="CampusEvents"
        logo
        subtitle={subtitle}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <View style={styles.content}>
        <SearchBar value={query} onChangeText={setQuery} />
        <View style={styles.filterRow}>
          <FilterChips selected={selectedCategory} onSelect={setSelectedCategory} />
          <View style={styles.periodToggle}>
            <Pressable onPress={() => setPeriod('upcoming')}>
              <Text
                variant="caption"
                color={period === 'upcoming' ? Colors.purple : Colors.textSecondary}
                style={[styles.periodText, period === 'upcoming' && styles.periodActive]}>
                À venir
              </Text>
            </Pressable>
            <Pressable onPress={() => setPeriod('past')}>
              <Text
                variant="caption"
                color={period === 'past' ? Colors.purple : Colors.textSecondary}
                style={[styles.periodText, period === 'past' && styles.periodActive]}>
                Passés
              </Text>
            </Pressable>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((key) => (
              <SkeletonCard key={key} />
            ))}
          </View>
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon="calendar"
            title={
              debouncedQuery
                ? `Aucun résultat pour « ${debouncedQuery} »`
                : 'Aucun événement pour le moment'
            }
          />
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.purple]}
                tintColor={Colors.purple}
              />
            }
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
    gap: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  periodToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  periodText: {
  },
  periodActive: {
    fontWeight: '500',
  },
  list: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  skeletonList: {
    gap: Spacing.md,
  },
});
