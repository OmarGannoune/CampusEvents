import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

const TAB_CONFIG: Record<string, { label: string; icon: IconName }> = {
  events: { label: 'Événements', icon: 'calendar-event' },
  favorites: { label: 'Favoris', icon: 'heart' },
  registrations: { label: 'Inscrip.', icon: 'ticket' },
  assistant: { label: 'Assistant', icon: 'sparkles' },
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Spacing.md);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];
          if (!config) {
            return null;
          }
          const color = isFocused ? Colors.purple : Colors.textSecondary;
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}>
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <Icon 
                  name={config.icon} 
                  size={22} 
                  color={color} 
                  strokeWidth={isFocused ? 2.5 : 2} 
                />
              </View>
              <Text variant="tiny" color={color} style={[styles.label, isFocused && styles.activeLabel]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  activeIconContainer: {
    backgroundColor: Colors.purpleLight,
  },
  label: {
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  activeLabel: {
    fontWeight: '700',
  },
});
