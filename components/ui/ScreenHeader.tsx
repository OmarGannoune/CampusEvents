import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: ReactNode;
  accentColor?: string;
  logo?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  accentColor,
  logo = false,
}: ScreenHeaderProps) {
  return (
    <View
      style={[
        styles.container,
        accentColor ? { borderTopColor: accentColor, borderTopWidth: 2 } : null,
      ]}>
      <View style={styles.row}>
        <View style={styles.leftSlot}>
          {showBack ? (
            <IconButton
              icon="arrow-left"
              size={28}
              iconSize={16}
              color={Colors.textOnDark}
              onPress={onBack}
            />
          ) : null}
        </View>
        <View style={styles.titleBlock}>
          {logo ? (
            <Text variant="logo" color={Colors.textOnDark}>
              <Text variant="logo" color={Colors.textOnDark}>
                Campus
              </Text>
              <Text variant="logo" color={Colors.purpleMid}>
                Events
              </Text>
            </Text>
          ) : (
            <Text variant="title" color={Colors.textOnDark}>
              {title}
            </Text>
          )}
        </View>
        <View style={styles.rightSlot}>{rightElement}</View>
      </View>
      {subtitle ? (
        <Text variant="caption" color={Colors.textOnDarkMuted} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    paddingTop: 48,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 14,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSlot: {
    width: 32,
  },
  rightSlot: {
    width: 32,
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: 6,
  },
});
