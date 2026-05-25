import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type AIResultCardProps = {
  title: string;
  description: string;
  accentColor: string;
  onPress?: () => void;
  badgeLabel?: string;
};

export function AIResultCard({
  title,
  description,
  accentColor,
  onPress,
  badgeLabel,
}: AIResultCardProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: accentColor }]}
      accessibilityRole={onPress ? 'button' : 'summary'}>
      <View style={styles.headerRow}>
        <Text style={[Typography.sectionTitle, styles.title]}>{title}</Text>
        {badgeLabel ? <Text style={styles.badge}>{badgeLabel}</Text> : null}
      </View>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    borderLeftWidth: 2,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    flex: 1,
  },
  badge: {
    fontSize: 10,
    color: Colors.textSecondary,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  description: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
