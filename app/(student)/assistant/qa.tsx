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

export default function AssistantQAScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { events } = useEvents();
  const { favoriteEventIds, toggleFavorite } = useFavorites(user?.email || '');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; relatedEventIds: string[] } | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      const res = await llmService.answerQuestion(question, events);
      setResult(JSON.parse(res));
    } catch (e) {
      console.error('QA Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Q/R Catalogue"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiQA}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <AIWarningBanner />
        <Input
          value={question}
          onChangeText={setQuestion}
          placeholder="Posez n'importe quelle question sur les événements…"
          onSubmitEditing={handleSubmit}
        />
        <Button 
          label="Poser la question" 
          onPress={handleSubmit} 
          disabled={loading || !question.trim()} 
          style={{ backgroundColor: Colors.aiQA, shadowColor: Colors.aiQA, borderColor: Colors.aiQA }}
        />

        {loading && <ActivityIndicator size="large" color={Colors.aiQA} style={{ marginTop: Spacing.xl }} />}

        {result && !loading && (
          <View style={styles.resultsContainer}>
            <View style={styles.aiInsight}>
              <View style={styles.aiInsightHeader}>
                <Icon name="message-question" size={16} color={Colors.aiQA} />
                <Text variant="label" color={Colors.aiQA}>Réponse de l'Assistant</Text>
              </View>
              <Text variant="body" color={Colors.textPrimary} style={styles.answerText}>{result.answer}</Text>
            </View>

            {result.relatedEventIds && result.relatedEventIds.length > 0 && (
              <View style={styles.relatedContainer}>
                <Text variant="sectionTitle" color={Colors.textPrimary} style={{ marginBottom: Spacing.sm }}>Événements mentionnés</Text>
                {result.relatedEventIds.map(id => {
                  const event = events.find(e => e.id === id);
                  if (!event) return null;
                  return (
                    <EventCard 
                      key={id}
                      event={event}
                      isFavorited={favoriteEventIds.includes(event.id)}
                      onPress={() => router.push(`/(student)/events/${event.id}`)}
                      onToggleFavorite={() => toggleFavorite(event.id)}
                    />
                  );
                })}
              </View>
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
  aiInsight: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderTopColor: Colors.aiQA,
    borderTopWidth: 4,
    shadowColor: Colors.aiQA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  answerText: {
    lineHeight: 22,
  },
  relatedContainer: {
    gap: Spacing.sm,
  },
});
