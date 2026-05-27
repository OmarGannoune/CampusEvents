import type { TextProps, TextStyle } from 'react-native';
import { Text as RNText } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type TextVariant = keyof typeof Typography;

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function Text({ variant = 'body', color, align, style, ...props }: AppTextProps) {
  const variantStyle = Typography[variant];
  const defaultColor =
    typeof variantStyle === 'object' && 'color' in variantStyle
      ? (variantStyle as TextStyle).color
      : Colors.textPrimary;

  return (
    <RNText
      {...props}
      style={[variantStyle, { color: color ?? defaultColor, textAlign: align }, style]}
    />
  );
}
