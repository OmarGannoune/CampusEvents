import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EventCard } from '@/components/ui/EventCard';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useFavorites } from '@/hooks/useFavorites';
import { useProfile } from '@/hooks/useProfile';
import { useRegistrations } from '@/hooks/useRegistrations';
import { llmService } from '@/services/llm';

export default function AssistantRecommendationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events } = useEvents();
  const { favoriteEvents, favoriteEventIds, toggleFavorite } = useFavorites(user?.email || '');
  const { registrations } = useRegistrations(user?.email || '');
  const { profile } = useProfile();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ eventId: string; rank: number; justification: string }[] | null>(null);

  const registeredEvents = registrations.map(r => events.find(e => e.id === r.eventId)).filter(Boolean) as typeof events;

  const handleRecommend = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const history = {
        favorited: favoriteEvents.map(e => ({ title: e.title, category: e.category, tags: e.tags })),
        registered: registeredEvents.map(e => ({ title: e.title, category: e.category, tags: e.tags }))
      };
      
      const res = await llmService.recommend(user?.email || '', history, events, profile);
      const parsed = JSON.parse(res);
      setResults(parsed.recommendations || []);
    } catch (e) {
      console.error('Recommend Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recommandations"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiReco}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AIWarningBanner />
        <Text variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
          Obtenez des suggestions d'événements basées sur vos favoris, vos inscriptions et votre profil.
        </Text>
        <Button 
          label="Générer des recommandations" 
          onPress={handleRecommend} 
          disabled={loading} 
          style={{ backgroundColor: Colors.aiReco, shadowColor: Colors.aiReco, borderColor: Colors.aiReco }}
        />

        {loading && <ActivityIndicator size="large" color={Colors.aiReco} style={{ marginTop: Spacing.xl }} />}

        {results && !loading && (
          <View style={styles.resultsContainer}>
            <Text variant="sectionTitle" color={Colors.textPrimary}>Suggestions ({results.length})</Text>
            {results.length === 0 ? (
              <Text variant="body" color={Colors.textSecondary}>Aucune suggestion trouvée pour le moment.</Text>
            ) : (
              results.sort((a, b) => a.rank - b.rank).map((res, i) => {
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
                        <Icon name="stars" size={16} color={Colors.aiReco} />
                        <Text variant="label" color={Colors.aiReco}>Choix #{res.rank}</Text>
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
    borderLeftColor: Colors.aiReco,
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
