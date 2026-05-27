import { StyleSheet } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder="Rechercher un événement..."
      leftElement={<Icon name="search" size={16} color={Colors.textSecondary} />}
      containerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
