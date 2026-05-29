import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, 16) + 16;

  return (
    <View style={styles.shadowWrapper}>
      <LinearGradient
        colors={[Colors.dark, '#3B0764']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          { paddingTop: topPadding },
          accentColor ? { borderTopColor: accentColor, borderTopWidth: 2 } : null,
        ]}>
        <View style={styles.row}>
          <View style={styles.leftSlot}>
            {showBack ? (
              <IconButton
                icon="arrow-left"
                size={40}
                iconSize={22}
                color={Colors.textOnDark}
                onPress={onBack}
              />
            ) : null}
          </View>
          <View style={styles.titleBlock}>
            {logo ? (
              <Text variant="logo" color={Colors.textOnDark} style={styles.logoText}>
                Campus<Text variant="logo" color={Colors.purpleMid}>Events</Text>
              </Text>
            ) : (
              <Text variant="title" color={Colors.textOnDark} style={styles.headerTitle} numberOfLines={1}>
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: Colors.dark,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSlot: {
    minWidth: 44,
    alignItems: 'flex-start',
  },
  rightSlot: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    letterSpacing: -0.5,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
