import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

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
      style={styles.pressable}
      accessibilityRole={onPress ? 'button' : 'summary'}>
      <Card style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={styles.headerRow}>
          <Text variant="sectionTitle" color={Colors.textPrimary} style={styles.title}>
            {title}
          </Text>
          {badgeLabel ? (
            <Text variant="tiny" color={Colors.textSecondary} style={styles.badge}>
              {badgeLabel}
            </Text>
          ) : null}
        </View>
        <Text variant="caption" color={Colors.textSecondary} style={styles.description}>
          {description}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Radius.lg,
  },
  card: {
    borderLeftWidth: 2,
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  badge: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  description: {
    marginTop: Spacing.sm,
  },
});
