import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Radius } from '@/constants/spacing';

type BadgeProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
  style?: ViewStyle;
};

export function Badge({ label, backgroundColor, textColor, style }: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
