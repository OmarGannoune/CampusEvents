import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

type CardProps = ViewProps & {
  inset?: boolean;
};

export function Card({ inset = false, style, ...props }: CardProps) {
  return (
    <View
      {...props}
      style={[styles.card, inset && styles.inset, style]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    borderRadius: Radius.lg,
  },
  inset: {
    backgroundColor: Colors.surface,
  },
});
