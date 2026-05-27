import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

export function AIWarningBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.row}>
        <Icon name="alert-triangle" size={14} color={Colors.amberDark} />
        <Text style={styles.text}>
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
    color: Colors.amberDark,
    fontSize: 12,
    flex: 1,
  },
});
