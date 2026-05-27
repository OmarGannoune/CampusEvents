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
              size={36}
              iconSize={20}
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
    paddingTop: 56, // More breathing room at top
    paddingHorizontal: Spacing.lg,
    paddingBottom: 20,
    borderBottomLeftRadius: Radius.xl, // Softer curves
    borderBottomRightRadius: Radius.xl,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSlot: {
    width: 40,
  },
  rightSlot: {
    width: 40,
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: 8,
  },
});
