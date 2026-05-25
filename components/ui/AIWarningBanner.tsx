import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

export function AIWarningBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        ⚠ Ne soumettez pas de données personnelles ou sensibles à cet assistant.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.amberLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  text: {
    color: Colors.amberDark,
    fontSize: 12,
  },
});
