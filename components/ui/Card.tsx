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
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: Radius.xl, // Softer corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inset: {
    backgroundColor: Colors.surface,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
  },
});
