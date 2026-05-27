import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="wifi-off" size={32} color={Colors.dangerDark} />
      </View>
      <View style={styles.textContainer}>
        <Text variant="sectionTitle" color={Colors.textPrimary} align="center">
          Erreur
        </Text>
        <Text variant="caption" color={Colors.textSecondary} align="center" style={styles.subtitle}>
          {message}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <Button label="Réessayer" variant="danger-ghost" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 1.5,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  subtitle: {
    lineHeight: 20,
    marginTop: 4,
  },
  actionContainer: {
    marginTop: Spacing.md,
    width: '100%',
    maxWidth: 240,
  },
});
