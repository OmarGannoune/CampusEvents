import { StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Radius } from '@/constants/spacing';

type BadgeProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
  style?: ViewStyle;
};

export function Badge({ label, backgroundColor, textColor, style }: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor, borderColor: textColor }, style]}>
      <Text variant="tiny" color={textColor} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
