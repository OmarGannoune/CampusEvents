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
        <Icon name={icon} size={32} color={Colors.purple} />
      </View>
      <View style={styles.textContainer}>
        <Text variant="sectionTitle" color={Colors.textPrimary} align="center">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color={Colors.textSecondary} align="center" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action ? (
        <View style={styles.actionContainer}>
          <Button label={action.label} variant="ghost" onPress={action.onPress} />
        </View>
      ) : null}
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
    backgroundColor: Colors.purpleLight,
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
