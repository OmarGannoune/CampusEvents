import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type EmptyStateAction = {
  label: string;
  onPress: () => void;
};

type EmptyStateProps = {
  icon: string;
  title: string;
  subtitle?: string;
  action?: EmptyStateAction;
};

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={[Typography.sectionTitle, styles.title]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {action ? (
        <Pressable style={styles.actionButton} onPress={action.onPress}>
          <Text style={styles.actionText}>{action.label}</Text>
        </Pressable>
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
  iconText: {
    color: Colors.purple,
    fontSize: 12,
  },
  title: {
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  actionText: {
    color: Colors.purple,
    fontSize: 12,
    fontWeight: '500',
  },
});
