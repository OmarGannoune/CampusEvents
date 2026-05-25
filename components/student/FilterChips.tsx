import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import type { EventCategory } from '@/types';

import { CategoryChip } from '@/components/ui/CategoryChip';

type FilterChipsProps = {
  selected: EventCategory | 'all';
  onSelect: (value: EventCategory | 'all') => void;
};

const CATEGORIES: EventCategory[] = ['Talk', 'Workshop', 'Club', 'Exam', 'Other'];

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable onPress={() => onSelect('all')}>
        <View style={[styles.allChip, selected === 'all' && styles.allChipActive]}>
          <Text style={[styles.allText, selected === 'all' && styles.allTextActive]}>Tous</Text>
        </View>
      </Pressable>
      {CATEGORIES.map((category) => (
        <Pressable key={category} onPress={() => onSelect(category)}>
          <View
            style={[
              styles.categoryWrapper,
              selected === category && { borderColor: Colors.borderStrong, borderWidth: 1 },
            ]}>
            <CategoryChip category={category} size="sm" />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  allChip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  allChipActive: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  allText: {
    fontSize: 11,
    color: Colors.purple,
    fontWeight: '500',
  },
  allTextActive: {
    color: Colors.textOnDark,
  },
  categoryWrapper: {
    borderRadius: Radius.full,
  },
});
