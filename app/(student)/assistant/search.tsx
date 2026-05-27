import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

export default function AssistantSearchScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Recherche sémantique"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiSearch}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <View style={styles.content}>
        <AIWarningBanner />
        <Input
          placeholder="Décrivez ce que vous cherchez en langage libre…"
          multiline
          containerStyle={styles.textArea}
        />
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
    gap: Spacing.md,
  },
  textArea: {
    minHeight: 80,
  },
});
