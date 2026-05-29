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
import { useProfile } from '@/hooks/useProfile';
import { llmService } from '@/services/llm';

export default function AssistantPlanningScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events } = useEvents();
  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email || '');
  const { profile } = useProfile();
  
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ planning: any[]; summary: string } | null>(null);

  const handlePlan = async () => {
    if (!constraints.trim()) return;
    try {
      setLoading(true);
      const res = await llmService.plan(user?.email || '', constraints, events, profile);
      const parsed = JSON.parse(res);
      setResult(parsed);
    } catch (e) {
      console.error('Plan Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Planification IA"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiPlan}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AIWarningBanner />
        <Input
          value={constraints}
          onChangeText={setConstraints}
          placeholder="Ex: J'ai cours lundi et mercredi matin, un exam jeudi…"
          multiline
          containerStyle={styles.textArea}
        />
        <Button 
          label="Générer mon planning" 
          onPress={handlePlan} 
          disabled={loading || !constraints.trim()} 
          style={{ backgroundColor: Colors.aiPlan, shadowColor: Colors.aiPlan, borderColor: Colors.aiPlan }}
        />

        {loading && <ActivityIndicator size="large" color={Colors.aiPlan} style={{ marginTop: Spacing.xl }} />}

        {result && !loading && (
          <View style={styles.resultsContainer}>
            <Card style={styles.summaryCard}>
              <Text variant="sectionTitle" color={Colors.textPrimary}>Résumé</Text>
              <Text variant="body" color={Colors.textSecondary}>{result.summary}</Text>
            </Card>
            
            <Text variant="sectionTitle" color={Colors.textPrimary} style={{ marginTop: Spacing.md }}>Planning Suggéré</Text>
            {(result.planning || []).map((p, i) => {
              const event = events.find(e => e.id === p.eventId);
              const isConflict = p.status === 'conflict';
              if (!event && !isConflict) return null;
              
              return (
                <View key={i} style={styles.planItem}>
                  <View style={styles.timeHeader}>
                    <Text variant="label" color={isConflict ? Colors.danger : Colors.aiPlan}>
                      {p.dayLabel} à {p.startTime}
                    </Text>
                    {isConflict && (
                      <View style={styles.conflictBadge}>
                        <Icon name="alert-triangle" size={12} color={Colors.danger} />
                        <Text variant="caption" color={Colors.danger}>Conflit!</Text>
                      </View>
                    )}
                  </View>
                  {event ? (
                    <EventCard 
                      event={event} 
                      isFavorited={favoriteEventIds.includes(event.id)}
                      onPress={() => router.push(`/(student)/events/${event.id}`)}
                      onToggleFavorite={() => toggleFavorite(event.id)}
                    />
                  ) : (
                    <Card style={[styles.resultCard, isConflict && styles.conflictCard]}>
                      <Text variant="sectionTitle" color={Colors.textPrimary}>Événement Inconnu</Text>
                    </Card>
                  )}
                  {p.note ? (
                    <View style={[styles.aiInsight, isConflict && styles.conflictInsight]}>
                      <View style={styles.aiInsightHeader}>
                        <Icon name="sparkles" size={14} color={isConflict ? Colors.danger : Colors.aiPlan} />
                        <Text variant="label" color={isConflict ? Colors.danger : Colors.aiPlan}>Note</Text>
                      </View>
                      <Text variant="body" color={Colors.textSecondary}>{p.note}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
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
    minHeight: 100,
  },
  resultsContainer: {
    marginTop: Spacing.md,
    gap: Spacing.xl,
    paddingBottom: 40,
  },
  summaryCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.purpleLight,
    borderWidth: 1,
    borderColor: Colors.purple + '40',
  },
  planItem: {
    gap: Spacing.sm,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  conflictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  resultCard: {
    padding: Spacing.lg,
    borderLeftColor: Colors.aiPlan,
    borderLeftWidth: 4,
  },
  conflictCard: {
    borderLeftColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  aiInsight: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderLeftColor: Colors.aiPlan,
    borderLeftWidth: 4,
    gap: Spacing.xs,
    marginLeft: Spacing.lg,
  },
  conflictInsight: {
    borderLeftColor: Colors.danger,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
