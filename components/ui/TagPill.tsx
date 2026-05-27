import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type TagPillProps = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
};

export function TagPill({
  label,
  backgroundColor = Colors.purpleLight,
  textColor = Colors.purple,
}: TagPillProps) {
  return (
    <View style={[styles.pill, { backgroundColor, borderColor: textColor }]}>
      <Text variant="tiny" color={textColor} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    opacity: 0.9,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
