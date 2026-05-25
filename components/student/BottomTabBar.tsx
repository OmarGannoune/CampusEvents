import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

const TAB_CONFIG: Record<string, { label: string; icon: string }> = {
  events: { label: 'Événements', icon: 'ti-calendar-event' },
  favorites: { label: 'Favoris', icon: 'ti-heart' },
  registrations: { label: 'Inscrip.', icon: 'ti-ticket' },
  assistant: { label: 'Assistant', icon: 'ti-sparkles' },
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
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
            <Text style={[styles.icon, { color }]}>{config.icon}</Text>
            <Text style={[styles.label, { color }]}>{config.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderDefault,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  icon: {
    fontSize: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
