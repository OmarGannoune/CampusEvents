import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function AssistantRecommendationsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recommandations"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiReco}
      />
      <View style={styles.content}>
        <AIWarningBanner />
        <Text style={styles.helper}>Intégration LLM en cours.</Text>
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
    padding: Spacing.lg,
  },
  helper: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
