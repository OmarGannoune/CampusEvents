import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type FeatureCard = {
  title: string;
  description: string;
  route: string;
  accent: string;
  icon: IconName;
};

const FEATURES: FeatureCard[] = [
  {
    title: 'Recherche sémantique',
    description: 'Trouvez sans connaître les mots-clés',
    route: '/(student)/assistant/search',
    accent: Colors.aiSearch,
    icon: 'search',
  },
  {
    title: 'Recommandations',
    description: 'Basé sur vos favoris et inscriptions',
    route: '/(student)/assistant/recommendations',
    accent: Colors.aiReco,
    icon: 'stars',
  },
  {
    title: 'Planification',
    description: 'Planning sans conflit sur mesure',
    route: '/(student)/assistant/planning',
    accent: Colors.aiPlan,
    icon: 'calendar-time',
  },
  {
    title: 'Q/R Catalogue',
    description: "Posez n'importe quelle question",
    route: '/(student)/assistant/qa',
    accent: Colors.aiQA,
    icon: 'message-question',
  },
];

export default function AssistantHubScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="✦ Assistant IA"
        subtitle="Propulsé par Groq · Ne soumettez pas de données sensibles."
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <View style={styles.content}>
        <AIWarningBanner />

        <View style={styles.grid}>
          {FEATURES.map((feature) => (
            <Pressable
              key={feature.title}
              onPress={() => router.push(feature.route as any)}
              style={[
                styles.card,
                { borderTopColor: feature.accent },
              ]}>
              <Icon name={feature.icon} size={18} color={feature.accent} />
              <Text variant="label" color={Colors.textPrimary}>
                {feature.title}
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                {feature.description}
              </Text>
            </Pressable>
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderTopWidth: 4,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
});
