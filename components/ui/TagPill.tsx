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
    <View style={[styles.pill, { backgroundColor }]}>
      <Text variant="tiny" color={textColor}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
});
