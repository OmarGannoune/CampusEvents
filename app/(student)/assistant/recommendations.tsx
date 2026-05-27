import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
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
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <View style={styles.content}>
        <AIWarningBanner />
        <Text variant="caption" color={Colors.textSecondary}>
          Intégration LLM en cours.
        </Text>
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
});
