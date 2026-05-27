import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AIWarningBanner } from '@/components/ui/AIWarningBanner';
import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

const API_KEY_STORAGE = 'campusevents_apikey';

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
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then((value) => {
      if (value) {
        setApiKey(value);
      }
    });
  }, []);

  const handleSaveKey = async (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      await AsyncStorage.setItem(API_KEY_STORAGE, value.trim());
    } else {
      await AsyncStorage.removeItem(API_KEY_STORAGE);
    }
  };

  const hasKey = apiKey.trim().length > 0;

  return (
    <View style={styles.container}>
      <ScreenHeader title="✦ Assistant IA" subtitle="Propulsé par Claude · Ne soumettez pas de données sensibles." />
      <View style={styles.content}>
        <AIWarningBanner />

        <Pressable style={styles.settingsRow} onPress={() => setShowApiInput(!showApiInput)}>
          <Icon name="settings" size={14} color={Colors.textSecondary} />
          <Text style={styles.settingsText}>Clé API</Text>
        </Pressable>
        {showApiInput ? (
          <TextInput
            value={apiKey}
            onChangeText={handleSaveKey}
            placeholder="sk-ant-..."
            placeholderTextColor={Colors.textHint}
            style={styles.input}
          />
        ) : null}

        {!hasKey ? (
          <View style={styles.keyBanner}>
            <Text style={styles.keyBannerText}>Configurez votre clé API pour utiliser l'assistant.</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          {FEATURES.map((feature) => (
            <Pressable
              key={feature.title}
              onPress={() => router.push(feature.route)}
              disabled={!hasKey}
              style={[
                styles.card,
                { borderTopColor: feature.accent },
                !hasKey && styles.cardDisabled,
              ]}>
              <Icon name={feature.icon} size={18} color={feature.accent} />
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
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
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  keyBanner: {
    backgroundColor: Colors.amberLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  keyBannerText: {
    fontSize: 12,
    color: Colors.amberDark,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    borderTopWidth: 2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  cardDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
