import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

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
            <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button">
              <Icon name="arrow-left" size={14} color={Colors.textOnDark} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.titleBlock}>
          {logo ? (
            <Text style={[Typography.logo, styles.logoText]}>
              <Text style={styles.logoPrimary}>Campus</Text>
              <Text style={styles.logoAccent}>Events</Text>
            </Text>
          ) : (
            <Text style={[Typography.title, styles.titleText]}>{title}</Text>
          )}
        </View>
        <View style={styles.rightSlot}>{rightElement}</View>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
  titleText: {
    color: Colors.textOnDark,
  },
  subtitle: {
    marginTop: 6,
    color: Colors.textOnDarkMuted,
    fontSize: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  logoText: {
    color: Colors.textOnDark,
  },
  logoPrimary: {
    color: Colors.textOnDark,
  },
  logoAccent: {
    color: Colors.purpleMid,
  },
});
