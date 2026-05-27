import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

export function AIWarningBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <Icon name="alert-triangle" size={16} color={Colors.amberDark} />
        <Text variant="caption" color={Colors.amberDark} style={styles.text}>
          Ne soumettez pas de données personnelles ou sensibles à cet assistant.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.amberLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(146, 64, 14, 0.2)', // amberDark with opacity
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
    fontWeight: '500',
  },
});
