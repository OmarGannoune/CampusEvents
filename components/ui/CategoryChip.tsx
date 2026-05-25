import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';
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
        { backgroundColor: colors.bg },
      ]}>
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSmall : styles.textMedium,
          { color: colors.text },
        ]}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
});
