import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

export function AIWarningBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <Icon name="alert-triangle" size={14} color={Colors.amberDark} />
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
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
  },
});
