import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

type FieldProps = {
  label?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <View style={styles.field}>
      {label ? (
        <Text variant="label" color={Colors.textPrimary}>
          {label}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text variant="caption" color={Colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.xs,
  },
});
