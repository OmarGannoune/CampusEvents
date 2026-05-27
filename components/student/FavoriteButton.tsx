import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

type FavoriteButtonProps = {
  isFavorited: boolean;
  onPress: () => void;
};

export function FavoriteButton({ isFavorited, onPress }: FavoriteButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Icon
        name="heart"
        size={16}
        color={isFavorited ? Colors.purple : Colors.purpleMid}
        fill={isFavorited ? Colors.purple : 'none'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
