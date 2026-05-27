import type { PressableProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

type IconButtonVariant = 'outline' | 'ghost';

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
  size = 32,
  iconSize = 18,
  color = Colors.textOnDark,
  variant = 'outline',
  style,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      {...props}
      style={[
        styles.base,
        { width: size, height: size },
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
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
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});
