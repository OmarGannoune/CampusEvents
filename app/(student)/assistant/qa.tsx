import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

export default function AssistantQAScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Q/R Catalogue"
        showBack
        onBack={() => router.back()}
        accentColor={Colors.aiQA}
      />
      <View style={styles.content}>
        <AIWarningBanner />
        <TextInput
          style={styles.input}
          placeholder="Posez n'importe quelle question sur les événements…"
          placeholderTextColor={Colors.textHint}
        />
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
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
  },
  helper: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
