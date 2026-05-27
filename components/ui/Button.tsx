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
  sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  md: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
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
  const iconSize = size === 'lg' ? 18 : size === 'sm' ? 14 : 16;

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
      style={[styles.button, SIZE_STYLES[size], fullWidth && styles.fullWidth, variantStyle, style]}>
      <View style={styles.content}>
        {iconLeft ? <Icon name={iconLeft} size={iconSize} color={textColor} /> : null}
        {typeof content === 'string' ? (
          <Text
            variant="label"
            color={textColor}
            style={uppercase && styles.uppercase}>
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
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: Colors.purple,
  },
  ghost: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  dangerGhost: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  disabled: {
    backgroundColor: Colors.borderDefault,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
