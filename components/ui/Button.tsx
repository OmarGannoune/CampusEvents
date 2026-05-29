import type { ReactNode } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'danger-ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PressableProps & {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  uppercase?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 36 },
  md: { paddingVertical: 12, paddingHorizontal: Spacing.lg, minHeight: 48 },
  lg: { paddingVertical: 16, paddingHorizontal: Spacing.xl, minHeight: 56 },
};

export function Button({
  label,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  uppercase = true,
  iconLeft,
  iconRight,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const content = children ?? label;
  const isDisabled = !!disabled;
  const iconSize = size === 'lg' ? 20 : size === 'sm' ? 16 : 18;

  const variantStyle = (() => {
    if (isDisabled) {
      return styles.disabled;
    }
    if (variant === 'ghost') {
      return styles.ghost;
    }
    if (variant === 'danger') {
      return styles.danger;
    }
    if (variant === 'danger-ghost') {
      return styles.dangerGhost;
    }
    return styles.primary;
  })();

  const textColor = (() => {
    if (isDisabled) {
      return Colors.textSecondary;
    }
    if (variant === 'ghost') {
      return Colors.purple;
    }
    if (variant === 'danger') {
      return Colors.textOnDark;
    }
    if (variant === 'danger-ghost') {
      return Colors.danger;
    }
    return Colors.textOnDark;
  })();

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        SIZE_STYLES[size],
        fullWidth && styles.fullWidth,
        variantStyle,
        state.pressed && !isDisabled && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}>
      <View style={styles.content}>
        {iconLeft ? <Icon name={iconLeft} size={iconSize} color={textColor} /> : null}
        {typeof content === 'string' ? (
          <Text
            variant="label"
            color={textColor}
            style={[styles.text, uppercase && styles.uppercase]}>
            {content}
          </Text>
        ) : (
          content
        )}
        {iconRight ? <Icon name={iconRight} size={iconSize} color={textColor} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // to keep border radius clean
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  danger: {
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  disabled: {
    backgroundColor: Colors.borderDefault,
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
