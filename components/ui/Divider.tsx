import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

export function Divider({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
});
