import type { PressableProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

type IconButtonVariant = 'outline' | 'ghost' | 'filled';

type IconButtonProps = PressableProps & {
  icon: IconName;
  size?: number;
  iconSize?: number;
  color?: string;
  variant?: IconButtonVariant;
  style?: ViewStyle;
};

export function IconButton({
  icon,
  size = 40,
  iconSize = 20,
  color = Colors.textOnDark,
  variant = 'outline',
  style,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size },
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        variant === 'filled' && styles.filled,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button">
      <Icon name={icon} size={iconSize} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
});
