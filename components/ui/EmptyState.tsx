import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type EmptyStateAction = {
  label: string;
  onPress: () => void;
};

type EmptyStateProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: EmptyStateAction;
};

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={20} color={Colors.purple} />
      </View>
      <Text variant="sectionTitle" color={Colors.textPrimary}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" color={Colors.textSecondary} align="center">
          {subtitle}
        </Text>
      ) : null}
      {action ? (
        <Button label={action.label} variant="ghost" onPress={action.onPress} />
      ) : null}
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
    backgroundColor: Colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
