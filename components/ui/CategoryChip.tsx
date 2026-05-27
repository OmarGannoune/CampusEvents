import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import type { EventCategory } from '@/types';

type ChipSize = 'sm' | 'md';

type CategoryColors = {
  bg: string;
  text: string;
  accent: string;
};

const CATEGORY_STYLES: Record<EventCategory, CategoryColors> = {
  Talk: Colors.categoryTalk,
  Workshop: Colors.categoryWorkshop,
  Club: Colors.categoryClub,
  Exam: Colors.categoryExam,
  Other: Colors.categoryOther,
};

type CategoryChipProps = {
  category: EventCategory;
  size?: ChipSize;
};

export function CategoryChip({ category, size = 'md' }: CategoryChipProps) {
  const colors = CATEGORY_STYLES[category];
  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.small : styles.medium,
        { backgroundColor: colors.bg, borderColor: colors.accent },
      ]}>
      <Text
        variant={size === 'sm' ? 'tiny' : 'caption'}
        color={colors.text}
        style={styles.text}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
});
