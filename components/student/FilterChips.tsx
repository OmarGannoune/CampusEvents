import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CategoryChip } from '@/components/ui/CategoryChip';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import type { EventCategory } from '@/types';

type FilterChipsProps = {
  selected: EventCategory | 'all';
  onSelect: (value: EventCategory | 'all') => void;
};

const CATEGORIES: EventCategory[] = ['Talk', 'Workshop', 'Club', 'Exam', 'Other'];

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => onSelect('all')} style={styles.chipPressable}>
          <View
            style={[
              styles.allChipBase,
              selected === 'all' ? styles.allChipSelected : styles.allChipUnselected,
            ]}>
            <Text
              variant="caption"
              color={selected === 'all' ? Colors.textOnDark : Colors.textPrimary}
              style={styles.chipText}>
              Tous
            </Text>
          </View>
        </Pressable>
        {CATEGORIES.map((category) => {
          const isSelected = selected === category;
          return (
            <Pressable
              key={category}
              onPress={() => onSelect(category)}
              style={[styles.chipPressable, !isSelected && styles.chipUnselected]}>
              <View pointerEvents="none" style={isSelected ? styles.selectedShadow : null}>
                <CategoryChip category={category} size="md" />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1, // Ensures it doesn't push right-aligned elements off-screen
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm, // Little extra padding at the end of the scroll
  },
  chipPressable: {
    alignSelf: 'center',
  },
  chipUnselected: {
    opacity: 0.45,
  },
  selectedShadow: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  allChipBase: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  allChipSelected: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  allChipUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
  },
  chipText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
