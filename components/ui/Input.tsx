import type { ReactNode } from 'react';
import { useState } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type InputSize = 'sm' | 'md' | 'lg';

type InputProps = TextInputProps & {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  size?: InputSize;
};

const SIZE_STYLES: Record<InputSize, ViewStyle> = {
  sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  md: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
};

export function Input({
  leftElement,
  rightElement,
  containerStyle,
  inputStyle,
  size = 'md',
  placeholderTextColor,
  multiline,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? Colors.borderStrong : Colors.borderDefault;

  return (
    <View
      style={[
        styles.container,
        SIZE_STYLES[size],
        { borderColor },
        multiline && styles.multiline,
        containerStyle,
      ]}>
      {leftElement}
      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        placeholderTextColor={placeholderTextColor ?? Colors.textHint}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
      />
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  multiline: {
    alignItems: 'flex-start',
  },
  inputMultiline: {
    minHeight: 90,
  },
});
