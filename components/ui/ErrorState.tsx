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
        <Icon name="wifi-off" size={18} color={Colors.dangerDark} />
      </View>
      <Text variant="sectionTitle" color={Colors.textPrimary}>
        Erreur
      </Text>
      <Text variant="caption" color={Colors.textSecondary} align="center">
        {message}
      </Text>
      <Button label="Réessayer" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
