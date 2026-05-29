import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EventCard } from '@/components/ui/EventCard';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useFavorites } from '@/hooks/useFavorites';
import { llmService } from '@/services/llm';

export default function AssistantSearchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events } = useEvents();
  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email || '');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ eventId: string; relevanceScore: number; justification: string }[] | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await llmService.search(query, events);
      const parsed = JSON.parse(res);
      setResults(parsed.results || []);
    } catch (e) {
      console.error('Search Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recherche sémantique"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiSearch}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AIWarningBanner />
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Décrivez ce que vous cherchez en langage libre…"
          multiline
          containerStyle={styles.textArea}
        />
        <Button 
          label="Chercher" 
          onPress={handleSearch} 
          disabled={loading || !query.trim()} 
          style={{ backgroundColor: Colors.aiSearch, shadowColor: Colors.aiSearch, borderColor: Colors.aiSearch }}
        />

        {loading && <ActivityIndicator size="large" color={Colors.aiSearch} style={{ marginTop: Spacing.xl }} />}

        {results && !loading && (
          <View style={styles.resultsContainer}>
            <Text variant="sectionTitle" color={Colors.textPrimary}>Résultats</Text>
            {results.length === 0 ? (
              <Text variant="body" color={Colors.textSecondary}>Aucun événement trouvé pour cette recherche.</Text>
            ) : (
              results.map((res, i) => {
                const event = events.find(e => e.id === res.eventId);
                if (!event) return null;
                return (
                  <View key={i} style={styles.resultItem}>
                    <EventCard 
                      event={event}
                      isFavorited={favoriteEventIds.includes(event.id)}
                      onPress={() => router.push(`/(student)/events/${event.id}`)}
                      onToggleFavorite={() => toggleFavorite(event.id)}
                    />
                    <View style={styles.aiInsight}>
                      <View style={styles.aiInsightHeader}>
                        <Icon name="search" size={14} color={Colors.aiSearch} />
                        <Text variant="label" color={Colors.aiSearch}>Pertinence: {res.relevanceScore}%</Text>
                      </View>
                      <Text variant="body" color={Colors.textSecondary}>{res.justification}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  textArea: {
    minHeight: 80,
  },
  resultsContainer: {
    marginTop: Spacing.md,
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  resultItem: {
    gap: Spacing.sm,
  },
  aiInsight: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftColor: Colors.aiSearch,
    borderLeftWidth: 4,
    gap: Spacing.xs,
    marginLeft: Spacing.lg,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
