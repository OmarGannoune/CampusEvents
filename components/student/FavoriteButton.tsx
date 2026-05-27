import { IconButton } from '@/components/ui/IconButton';
import { Colors } from '@/constants/colors';

type FavoriteButtonProps = {
  isFavorited: boolean;
  onPress: () => void;
};

export function FavoriteButton({ isFavorited, onPress }: FavoriteButtonProps) {
  return (
    <IconButton
      icon="heart"
      onPress={onPress}
      size={28}
      iconSize={16}
      color={isFavorited ? Colors.purple : Colors.purpleMid}
      variant="ghost"
    />
  );
}
