import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';

type FavoriteButtonProps = {
  isFavorited: boolean;
  onPress: () => void;
};

export function FavoriteButton({ isFavorited, onPress }: FavoriteButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={[styles.text, isFavorited ? styles.active : styles.inactive]}>
        {isFavorited ? '<3' : 'fav'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  active: {
    color: Colors.purple,
  },
  inactive: {
    color: Colors.purpleMid,
  },
});
